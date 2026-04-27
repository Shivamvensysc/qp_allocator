import { db } from "../../db/db";
import { iterations } from "../../db/schema/iteration";
import { shiftSubjects } from "../../db/schema/shiftSubject";
import { subjects } from "../../db/schema/subject";
import { shifts } from "../../db/schema/shift";
import { exams } from "../../db/schema/exam";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import crypto from "crypto";


export async function getExamAllocationData(examId: number, subjectId?: number, shiftId?: number) {
  // Get exam details
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
  });
  if (!exam) return { error: "Exam not found" };

  // Get all shifts for the exam
  const examShifts = await db.query.shifts.findMany({
    where: eq(shifts.examId, examId),
  });

  // Get all subjects for the exam
  const examSubjects = await db.query.subjects.findMany({
    where: and(eq(subjects.isDeleted, false), eq(subjects.examId, examId)),
  });

  // Fetch used sets for all these subjects to show availability in UI
  const subjectIds = examSubjects.map(s => s.id);
  let usedSetsMappings: any[] = [];
  if (subjectIds.length > 0) {
    const whereConditions = [
      inArray(shiftSubjects.subjectId, subjectIds),
      sql`${shiftSubjects.finalSelectedSet} IS NOT NULL`
    ];

    // ✅ ENHANCEMENT: If reusable, don't show locks from other shifts
    if (exam && exam.reUsableSet === 'yes' && shiftId) {
      whereConditions.push(eq(shiftSubjects.ssId, shiftId));
    }

    usedSetsMappings = await db.select({
      subjectId: shiftSubjects.subjectId,
      finalSelectedSet: shiftSubjects.finalSelectedSet
    })
      .from(shiftSubjects)
      .where(and(...whereConditions));
  }

  const subjectsWithUsedSets = examSubjects.map(sub => ({
    ...sub,
    usedSets: usedSetsMappings
      .filter(m => m.subjectId === sub.id)
      .map(m => m.finalSelectedSet)
  }));

  // FETCH EXISTING ITERATIONS IF SUBJECT AND SHIFT ARE PROVIDED
  let currentIterations: any[] = [];
  let ssData: any = null;
  let votingMetrics: Record<number, number> = {};
  let isTie = false;
  let candidates: number[] = [];
  let finalWinner: number | null = null;

  if (subjectId && shiftId) {
    const ss = await db.query.shiftSubjects.findFirst({
      where: and(
        eq(shiftSubjects.ssId, shiftId),
        eq(shiftSubjects.subjectId, subjectId)
      )
    });

    if (ss) {
      ssData = ss;
      currentIterations = await db.query.iterations.findMany({
        where: eq(iterations.ssId, ss.id),
        orderBy: [iterations.iterationCount]
      });

      // CALCULATE VOTING METRICS FOR RESUMPTION
      if (currentIterations.length > 0) {
        currentIterations.forEach(it => {
          if (it.selectedSet !== null) {
            votingMetrics[it.selectedSet] = (votingMetrics[it.selectedSet] || 0) + 1;
          }
        });

        const iterationsCount = exam.noOfIteration || 5;
        if (currentIterations.length >= iterationsCount) {
          let maxVotes = 0;
          Object.entries(votingMetrics).forEach(([set, count]) => {
            const setNum = parseInt(set);
            if (count > maxVotes) {
              maxVotes = count;
              candidates = [setNum];
            } else if (count === maxVotes) {
              candidates.push(setNum);
            }
          });

          isTie = candidates.length > 1;
          finalWinner = ss.finalSelectedSet || (isTie ? null : candidates[0]);
        } else {
          // Check if finalWinner already exists (e.g. from a past session)
          finalWinner = ss.finalSelectedSet;
        }
      }
    }
  }

  return {
    exam,
    shifts: examShifts,
    subjects: subjectsWithUsedSets,
    currentIterations,
    ssData,
    votingResults: {
      metrics: votingMetrics,
      isTie,
      candidates,
      finalWinner
    }
  };
}

export async function executeFullRandomization(data: {
  subjectId: number;
  shiftId: number;
  userId: number;
  examId: number;
  iterationIndex?: number; // Optional: if provided, only run this specific iteration
}) {
  // 1. Fetch Exam Configuration for noOfIteration
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, data.examId),
  });
  if (!exam) throw new Error("Exam context missing");
  const iterationsCount = exam.noOfIteration || 5;

  // 2. Get subject details
  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, data.subjectId),
  });
  if (!subject) throw new Error("Subject not found");
  const totalSets = subject.setCount;

  // 3. Get all used sets for this subject across shifts (IF EXAM SETS ARE NOT REUSABLE)
  const usedSetNumbers: number[] = [];
  if (exam && exam.reUsableSet === 'no') {
    const usedSets = await db.select({ finalSelectedSet: shiftSubjects.finalSelectedSet })
      .from(shiftSubjects)
      .where(and(
        eq(shiftSubjects.subjectId, data.subjectId),
        sql`${shiftSubjects.finalSelectedSet} IS NOT NULL`
      ));

    usedSets.forEach(row => {
      if (row.finalSelectedSet !== null) usedSetNumbers.push(row.finalSelectedSet);
    });
  }

  // 4. Find or Create ShiftSubject entry (moved up to fetch its iterations)
  let ss = await db.query.shiftSubjects.findFirst({
    where: and(
      eq(shiftSubjects.ssId, data.shiftId),
      eq(shiftSubjects.subjectId, data.subjectId)
    ),
  });

  if (!ss) {
    throw new Error("This subject is not registered for this shift");
  }



  // 5. Calculate available sets
  const availableSets = [];
  for (let i = 1; i <= totalSets; i++) {
    if (!usedSetNumbers.includes(i)) {
      availableSets.push(i);
    }
  }

  if (availableSets.length === 0) {
    throw new Error("No available sets left for this subject");
  }

  // 6. RANDOMIZATION LOGIC (Single or Full)
  const results: any[] = [];
  const setCounts: Record<number, number> = {};

  // Decide which iterations to run
  const startIter = data.iterationIndex ?? 1;
  const endIter = data.iterationIndex ?? iterationsCount;

  for (let i = startIter; i <= endIter; i++) {
    // Check if this iteration already exists manually
    if (data.iterationIndex) {
      const existing = await db.query.iterations.findFirst({
        where: and(eq(iterations.ssId, ss.id), eq(iterations.iterationCount, i))
      });
      if (existing) {
        throw new Error(`Iteration ${i} has already been completed for this subject.`);
      }
    }

    if (exam && exam.reUsableSet === 'no' && availableSets.length === 0) {
      throw new Error("No available sets left for unique allocation across iterations.");
    }

    // Simulate complex computation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // ALGORITHM: Select from available sets using CS-PRNG
    const randomIndex = crypto.randomInt(0, availableSets.length);
    const secureRandomSet = availableSets[randomIndex];

    const [dbResult] = await db.insert(iterations).values({
      ssId: ss!.id,
      iterationCount: i,
      selectedSet: secureRandomSet,
      createdBy: data.userId,
    });

    results.push({
      iterationNum: i,
      selectedSet: secureRandomSet,
      ts: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }),
      dbId: dbResult.insertId
    });
  }

  // 7. MAJORITY VOTING & COMPLETION CHECK
  // If we just finished the last iteration (either via full loop or single manual click), calculate results
  const allIterations = await db.query.iterations.findMany({
    where: eq(iterations.ssId, ss.id),
    orderBy: [iterations.iterationCount]
  });

  const isComplete = allIterations.length >= iterationsCount;
  let majorityWinner: number | null = null;
  let maxVotes = 0;
  const candidates: number[] = [];
  let isTie = false;
  let winner: number | null = null;

  if (isComplete) {
    // Tracking for Majority Voting from ALL iterations
    allIterations.forEach(it => {
      if (it.selectedSet !== null) {
        setCounts[it.selectedSet] = (setCounts[it.selectedSet] || 0) + 1;
      }
    });

    for (const [set, count] of Object.entries(setCounts)) {
      const setNum = parseInt(set);
      if (count > maxVotes) {
        maxVotes = count;
        majorityWinner = setNum;
        candidates.length = 0;
        candidates.push(setNum);
      } else if (count === maxVotes) {
        candidates.push(setNum);
      }
    }

    isTie = candidates.length > 1;

    // 9. If no tie, update final selected set
    if (!isTie) {
      winner = candidates[0];
      await db.update(shiftSubjects)
        .set({ finalSelectedSet: winner })
        .where(eq(shiftSubjects.id, ss.id));
    }
  }

  return {
    ssId: ss!.id,
    isComplete,
    isTie,
    candidates: isTie ? candidates : [],
    winner: winner,
    iterations: results, // Return the iterations performed in this specific call
    metadata: {
      totalIterations: iterationsCount,
      completedCount: allIterations.length,
      majorityWinner: isComplete ? (isTie ? null : majorityWinner) : null,
      votingMetrics: setCounts,
      availableSets,
      usedSets: usedSetNumbers
    }
  };
}

export async function resolveTie(data: {
  subjectId: number;
  shiftId: number;
  candidates: number[];
  userId: number;
}) {
  // 1. Find the ShiftSubject
  const ss = await db.query.shiftSubjects.findFirst({
    where: and(
      eq(shiftSubjects.ssId, data.shiftId),
      eq(shiftSubjects.subjectId, data.subjectId)
    ),
  });
  if (!ss) throw new Error("Shift-subject mapping not found for resolution");

  // 2. Get subject details
  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, data.subjectId),
  });
  if (!subject) throw new Error("Subject not found");

  // 3. Get all used sets for this subject across all shifts
  const usedSets = await db.select({ finalSelectedSet: shiftSubjects.finalSelectedSet })
    .from(shiftSubjects)
    .where(and(
      eq(shiftSubjects.subjectId, data.subjectId),
      sql`${shiftSubjects.finalSelectedSet} IS NOT NULL`
    ));

  const usedSetNumbers = usedSets
    .map(row => row.finalSelectedSet)
    .filter(set => set !== null) as number[];

  // 4. Filter candidates to only available sets
  const availableCandidates = data.candidates.filter(candidate => !usedSetNumbers.includes(candidate));

  if (availableCandidates.length === 0) {
    throw new Error("No available sets left for this subject among the candidates");
  }

  // 5. Perform SECURE TIE-BREAKER
  // ALGORITHM: Tie-Breaker Random Selector (Final Phase)
  // Simulate processing delay for progress bar
  await new Promise(resolve => setTimeout(resolve, 2000));
  const secureRandomIndex = crypto.randomInt(0, availableCandidates.length);
  const finalSet = availableCandidates[secureRandomIndex];

  // 6. Update final selected set in shift_subjects
  await db.update(shiftSubjects)
    .set({ finalSelectedSet: finalSet })
    .where(eq(shiftSubjects.id, ss.id));

  // 7. SECURE AUDIT: Save final selection
  // We mark it as iteration count 999 to distinguish as the Final Selection
  const [dbResult] = await db.insert(iterations).values({
    ssId: ss.id,
    iterationCount: 999,
    selectedSet: finalSet,
    createdBy: data.userId,
  });

  return {
    finalSet,
    auditId: dbResult.insertId,
    timestamp: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' }),
    resolutionAlgorithm: "Secure Tie-Breaker Random Selector"
  };
}

export async function getAllocationHistory(examId?: number) {
  // Fetch recent iterations with subject and shift info
  let q = db.select({
    id: iterations.id,
    iterationCount: iterations.iterationCount,
    selectedSet: iterations.selectedSet,
    ts: iterations.ts,
    subjectName: subjects.subjectName,
    shiftStartTime: shifts.startTime,
  })
    .from(iterations)
    .innerJoin(shiftSubjects, eq(iterations.ssId, shiftSubjects.id))
    .innerJoin(subjects, eq(shiftSubjects.subjectId, subjects.id))
    .innerJoin(shifts, eq(shiftSubjects.ssId, shifts.id));

  if (examId) {
    q = q.where(eq(subjects.examId, examId)) as any;
  }

  const history = await q.orderBy(desc(iterations.ts)).limit(10);

  return history;
}

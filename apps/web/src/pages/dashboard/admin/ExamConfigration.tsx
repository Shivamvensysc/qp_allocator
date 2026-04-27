// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { ChromePicker } from "react-color";
// import {
//   CalendarDays,
//   ChevronRight,
//   Plus,
//   Clock,
//   Trash2,
//   CheckCircle2,
//   RotateCcw,
//   HelpCircle,
//   ShieldCheck,
//   ChevronDown,
//   Link2Off,
//   Palette,
//   Eraser,
//   Dices,
// } from "lucide-react";
// import { fetchExamById, saveExam } from "../../../services/exam.service";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../../../components/ui/popover";

// const PRESET_COLORS = [
//   "#ef4444",
//   "#3b82f6",
//   "#10b981",
//   "#f59e0b",
//   "#8b5cf6",
//   "#06b6d4",
//   "#ec4899",
//   "#f97316",
//   "#64748b",
//   "#14b8a6",
//   "#eab308",
//   "#6366f1",
//   "#d946ef",
//   "#f43f5e",
//   "#84cc16",
//   "#22c55e",
//   "#0ea5e9",
//   "#3f6212",
//   "#7e22ce",
//   "#9f1239",
// ];

// interface Shift {
//   id?: number;
//   date: string;
//   startTime: string;
//   endTime: string;
//   type: string;
// }

// interface Subject {
//   subjectName: string;
//   category: string;
//   shiftIndex: number | null;
// }

// interface ExamData {
//   exam: {
//     examName: string;
//     examBodyName: string;
//     examCode: string;
//     academicYear: string;
//     startDate: string;
//     endDate: string;
//     noOfIteration: number;
//     configurationType: string;
//     defaultConfiguration: any;
//     rotationType: string;
//     reUsableSet: string;
//   };
//   shifts: any[];
//   subjects: any[];
// }

// export default function ExamConfiguration() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const examId = searchParams.get("id");

//   const [examName, setExamName] = useState("");
//   const [regulatoryBody, setRegulatoryBody] = useState("");
//   const [examCode, setExamCode] = useState("");
//   const [academicYear, setAcademicYear] = useState("2025-26");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [totalSets, setTotalSets] = useState<number>(10);
//   const [codingType, setCodingType] = useState<string>("Alpha-Numeric");
//   const [setColors, setSetColors] = useState<Record<number, string>>({});
//   const [setCodes, setSetCodes] = useState<Record<number, string>>({});
//   const [noOfIteration, setNoOfIteration] = useState<number>(5);
//   const [rotationType, setRotationType] = useState<string>("manual_roll");
//   const [reUsableSet, setReUsableSet] = useState<string>("no");

//   const [shifts, setShifts] = useState<Shift[]>([]);
//   const [subjects, setSubjects] = useState<Subject[]>([]);

//   const [newShift, setNewShift] = useState<Shift>({
//     date: "",
//     startTime: "",
//     endTime: "",
//     type: "Morning",
//   });
//   const [newSubject, setNewSubject] = useState({
//     name: "",
//     category: "General",
//   });
//   const [isShiftBoxOpen, setIsShiftBoxOpen] = useState(false);
//   const [isSubjectBoxOpen, setIsSubjectBoxOpen] = useState(false);

//   // useEffect(() => {
//   //   if (examId) {
//   //     const token = localStorage.getItem("token");
//   //     fetch(`${API_BASE_URL}/api/exams/${examId}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     })
//   //       .then((res) => res.json())
//   //       .then((data: ExamData) => {
//   //         if (data.exam) {
//   //           setExamName(data.exam.examName || "");
//   //           setRegulatoryBody(data.exam.examBodyName || "");
//   //           setExamCode(data.exam.examCode || "");
//   //           setAcademicYear(data.exam.academicYear || "2025-26");
//   //           setStartDate(data.exam.startDate ? data.exam.startDate.split("T")[0] : "");
//   //           setEndDate(data.exam.endDate ? data.exam.endDate.split("T")[0] : "");
//   //           setNoOfIteration(data.exam.noOfIteration || 5);
//   //           setCodingType(data.exam.configurationType || "Alpha-Numeric");
//   //           setRotationType(data.exam.rotationType || "manual_roll");
//   //           setReUsableSet(data.exam.reUsableSet || "no");

//   //           let parsedConfig = data.exam.defaultConfiguration || {};
//   //           if (typeof parsedConfig === "string") {
//   //             try {
//   //               parsedConfig = JSON.parse(parsedConfig);
//   //             } catch (e) {
//   //               parsedConfig = {};
//   //             }
//   //           }

//   //           if (data.exam.configurationType === "Colour") {
//   //             setSetColors(parsedConfig);
//   //           } else {
//   //             setSetCodes(parsedConfig);
//   //           }

//   //           // Populate shifts
//   //           const fetchedShifts = (data.shifts || []).map((s: any) => ({
//   //             id: s.id,
//   //             date: s.date ? s.date.split("T")[0] : "",
//   //             startTime: s.startTime ? s.startTime.substring(0, 5) : "",
//   //             endTime: s.endTime ? s.endTime.substring(0, 5) : "",
//   //             type: s.type || "Morning",
//   //           }));
//   //           setShifts(fetchedShifts);

//   //           // Populate subjects
//   //           const fetchedSubjects = (data.subjects || []).map((sub: any) => {
//   //             const mapping = sub.mappings && sub.mappings[0];
//   //             const shiftIdx = mapping
//   //               ? fetchedShifts.findIndex((fs: any) => fs.id === mapping.ssId)
//   //               : null;
//   //             return {
//   //               subjectName: sub.subjectName,
//   //               category: sub.category || "General",
//   //               shiftIndex: shiftIdx === -1 ? null : shiftIdx,
//   //             };
//   //           });
//   //           setSubjects(fetchedSubjects);

//   //           // Set total sets from the first subject
//   //           if (data.subjects.length > 0) {
//   //             setTotalSets(data.subjects[0].setCount);
//   //           }
//   //         }
//   //       })
//   //       .catch((err) => console.error("Error fetching exam details:", err));
//   //   }
//   // }, [examId]);

//   useEffect(() => {
//     if (examId) {
//       fetchExamById(examId)
//         .then((data: ExamData) => {
//           if (data.exam) {
//             setExamName(data.exam.examName || "");
//             setRegulatoryBody(data.exam.examBodyName || "");
//             setExamCode(data.exam.examCode || "");
//             setAcademicYear(data.exam.academicYear || "2025-26");

//             setStartDate(
//               data.exam.startDate ? data.exam.startDate.split("T")[0] : "",
//             );

//             setEndDate(
//               data.exam.endDate ? data.exam.endDate.split("T")[0] : "",
//             );

//             setNoOfIteration(data.exam.noOfIteration || 5);

//             setCodingType(data.exam.configurationType || "Alpha-Numeric");

//             setRotationType(data.exam.rotationType || "manual_roll");

//             setReUsableSet(data.exam.reUsableSet || "no");

//             let parsedConfig = data.exam.defaultConfiguration || {};

//             if (typeof parsedConfig === "string") {
//               try {
//                 parsedConfig = JSON.parse(parsedConfig);
//               } catch {
//                 parsedConfig = {};
//               }
//             }

//             if (data.exam.configurationType === "Colour") {
//               setSetColors(parsedConfig);
//             } else {
//               setSetCodes(parsedConfig);
//             }

//             // Populate shifts
//             const fetchedShifts = (data.shifts || []).map((s: any) => ({
//               id: s.id,
//               date: s.date ? s.date.split("T")[0] : "",
//               startTime: s.startTime ? s.startTime.substring(0, 5) : "",
//               endTime: s.endTime ? s.endTime.substring(0, 5) : "",
//               type: s.type || "Morning",
//             }));

//             setShifts(fetchedShifts);

//             // Populate subjects
//             const fetchedSubjects = (data.subjects || []).map((sub: any) => {
//               const mapping = sub.mappings && sub.mappings[0];

//               const shiftIdx = mapping
//                 ? fetchedShifts.findIndex((fs: any) => fs.id === mapping.ssId)
//                 : null;

//               return {
//                 subjectName: sub.subjectName,
//                 category: sub.category || "General",
//                 shiftIndex: shiftIdx === -1 ? null : shiftIdx,
//               };
//             });

//             setSubjects(fetchedSubjects);

//             if (data.subjects.length > 0) {
//               setTotalSets(data.subjects[0].setCount);
//             }
//           }
//         })
//         .catch((err) => console.error("Error fetching exam:", err));
//     }
//   }, [examId]);

//   const handleAddShift = () => {
//     if (newShift.date && newShift.startTime && newShift.endTime) {
//       setShifts([...shifts, { ...newShift }]);
//       setNewShift({ date: "", startTime: "", endTime: "", type: "Morning" });
//       setIsShiftBoxOpen(false);
//     }
//   };

//   const handleDeleteShift = (index: number) => {
//     setShifts(shifts.filter((_, i) => i !== index));
//     setSubjects(
//       subjects.map((sub) =>
//         sub.shiftIndex === index ? { ...sub, shiftIndex: null } : sub,
//       ),
//     );
//   };

//   const handleAddSubject = () => {
//     if (newSubject.name) {
//       setSubjects([
//         ...subjects,
//         {
//           subjectName: newSubject.name,
//           category: newSubject.category,
//           shiftIndex: null,
//         },
//       ]);
//       setNewSubject({ name: "", category: "General" });
//       setIsSubjectBoxOpen(false);
//     }
//   };

//   const handleLinkSubject = (subIndex: number, shiftIndex: string) => {
//     const updated = [...subjects];
//     updated[subIndex].shiftIndex =
//       shiftIndex === "none" ? null : parseInt(shiftIndex);
//     setSubjects(updated);
//   };

//   const handleRandomizeColors = () => {
//     const newColors: Record<number, string> = {};
//     const shuffled = [...PRESET_COLORS].sort(() => 0.5 - Math.random());
//     for (let i = 0; i < totalSets; i++) {
//       newColors[i] = shuffled[i % shuffled.length];
//     }
//     setSetColors(newColors);
//   };

//   const handleClearColors = () => {
//     setSetColors({});
//   };

//   const validateForm = (status: "draft" | "publish") => {
//     const errors: string[] = [];

//     // Basic Info
//     if (!examName.trim()) errors.push("Exam Name is required.");
//     if (!regulatoryBody.trim()) errors.push("Regulatory Body is required.");
//     if (!examCode.trim()) errors.push("Exam Code is required.");
//     if (!startDate) errors.push("Start Date is required.");
//     if (!endDate) errors.push("End Date is required.");

//     // Configuration
//     if (codingType === "1") {
//       errors.push("Please select a Set Coding Type (Alpha-Numeric or Colour).");
//     } else {
//       if (totalSets <= 0) {
//         errors.push("Total Paper Sets must be greater than 0.");
//       } else {
//         // Validate set values
//         for (let i = 0; i < totalSets; i++) {
//           if (codingType === "Colour") {
//             if (!setColors[i])
//               errors.push(`Color for Set ${i + 1} is not assigned.`);
//           } else {
//             if (!setCodes[i] || !setCodes[i].trim())
//               errors.push(`Code for Set ${i + 1} is not assigned.`);
//           }
//         }
//       }
//     }

//     if (noOfIteration <= 0)
//       errors.push("Randomization Cycles must be at least 1.");

//     // Shifts
//     if (shifts.length === 0) {
//       errors.push("At least one shift must be created.");
//     }

//     // Subjects
//     if (subjects.length === 0) {
//       errors.push("At least one subject must be registered.");
//     } else {
//       // Mapping
//       const unlinkedSubjects = subjects.filter(
//         (sub) => sub.shiftIndex === null,
//       );
//       if (unlinkedSubjects.length > 0) {
//         errors.push(
//           `${unlinkedSubjects.length} subject(s) are not linked to any shift.`,
//         );
//       }
//     }

//     if (errors.length > 0) {
//       alert("Please fill all required fields:\n\n• " + errors.join("\n• "));
//       return false;
//     }

//     return true;
//   };

//   // const handleSave = async (status: "draft" | "publish") => {
//   //   if (!validateForm(status)) return;

//   //   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   //   const payload = {
//   //     exam: {
//   //       examName,
//   //       examCode,
//   //       examBodyName: regulatoryBody,
//   //       academicYear,
//   //       startDate,
//   //       endDate,
//   //       noOfIteration,
//   //       configurationType: codingType,
//   //       defaultConfiguration: codingType === "Colour" ? setColors : setCodes,
//   //       rotationType,
//   //       reUsableSet,
//   //       status,
//   //     },
//   //     shifts: shifts.map((s) => ({
//   //       ...s,
//   //       startTime: s.startTime + ":00",
//   //       endTime: s.endTime + ":00",
//   //     })),
//   //     subjects: subjects.map((s) => ({
//   //       subjectName: s.subjectName,
//   //       setCount: totalSets,
//   //       shiftIndex: s.shiftIndex,
//   //     })),
//   //   };

//   //   try {
//   //     const url = examId
//   //       ? `${API_BASE_URL}/api/exams/${examId}`
//   //       : `${API_BASE_URL}/api/exams`;
//   //     const method = examId ? "PUT" : "POST";

//   //     const res = await fetch(url, {
//   //       method,
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     if (res.ok) {
//   //       const data = await res.json();
//   //       alert(
//   //         `Exam ${status === "publish" ? "published" : "saved as draft"} successfully!`
//   //       );
//   //       navigate(
//   //         status === "publish"
//   //           ? `/admin/review_publish?id=${data.id}`
//   //           : `/admin/review_publish?id=${data.id}`
//   //       );
//   //     } else {
//   //       const data = await res.json();
//   //       alert(`Error: ${data.error || "Failed to save exam"}`);
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Failed to connect to server");
//   //   }
//   // };

//   const handleSave = async (status: "draft" | "publish") => {
//     if (!validateForm(status)) return;

//     const payload = {
//       exam: {
//         examName,
//         examCode,
//         examBodyName: regulatoryBody,
//         academicYear,
//         startDate,
//         endDate,
//         noOfIteration,
//         configurationType: codingType,
//         defaultConfiguration: codingType === "Colour" ? setColors : setCodes,
//         rotationType,
//         reUsableSet,
//         status,
//       },

//       shifts: shifts.map((s) => ({
//         ...s,
//         startTime: s.startTime + ":00",
//         endTime: s.endTime + ":00",
//       })),

//       subjects: subjects.map((s) => ({
//         subjectName: s.subjectName,
//         setCount: totalSets,
//         shiftIndex: s.shiftIndex,
//       })),
//     };

//     try {
//       const data = await saveExam(payload, examId || undefined);

//       alert(
//         `Exam ${
//           status === "publish" ? "published" : "saved as draft"
//         } successfully!`,
//       );

//       navigate(`/admin/review_publish?id=${data.id}`);
//     } catch (err: any) {
//       console.error(err);

//       alert(err?.response?.data?.error || "Failed to save exam");
//     }
//   };

//   return (
//     <div className="w-full mx-auto p-4   h-screen bg-[#F9FAFB] text-slate-900 font-sans">
//       {/* Header Section */}
//       <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
//         <div className="max-w-2xl">
//           <h1 className="text-[34px] font-bold text-[#14223E] tracking-tight leading-tight mb-3">
//             Exam Configuration
//           </h1>
//           <p className="text-[15px] text-slate-600 leading-relaxed">
//             Define the structural parameters for your high-stakes evaluation
//             events. Your inputs here will govern the entire allocation logic.
//           </p>
//         </div>

//         {/* Stepper */}
//         <div className="flex bg-[#F5F5FA] rounded-xl px-6 py-4 gap-8 shrink-0">
//           <div className="flex flex-col">
//             <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
//               Current Step
//             </span>
//             <div className="flex flex-col text-[16px] font-bold text-[#14223E] leading-[1.2]">
//               <span>Event</span>
//               <span>Core</span>
//             </div>
//           </div>
//           <div className="w-16 flex items-center">
//             <div className="h-[2px] w-full bg-[#D6DFE8]"></div>
//           </div>
//           <div className="flex flex-col opacity-40">
//             <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
//               Next
//             </span>
//             <div className="flex flex-col text-[16px] font-bold text-[#8B9BB4] leading-[1.2]">
//               <span>Final</span>
//               <span>Review</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Grid Layout */}
//       <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
//         {/* Left Column */}
//         <div className="space-y-6">
//           {/* Create Exam Event Block */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
//             {/* Faded Calendar Icon */}
//             <div className="absolute top-6 right-8 opacity-5">
//               <CalendarDays className="w-32 h-32" />
//             </div>

//             <div className="flex items-center gap-4 mb-8">
//               <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
//               <h2 className="text-xl font-bold text-slate-800">
//                 Create Exam Event
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 mb-10 relative z-10">
//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Exam Name
//                 </label>
//                 <input
//                   className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full"
//                   placeholder="e.g., Annual Board Exams 2026"
//                   value={examName}
//                   onChange={(e) => setExamName(e.target.value)}
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Exam Code
//                 </label>
//                 <input
//                   className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full"
//                   placeholder="e.g., EXAM-2026"
//                   value={examCode}
//                   onChange={(e) => setExamCode(e.target.value)}
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Regulatory Body
//                 </label>
//                 <div className="relative">
//                   <input
//                     className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full"
//                     placeholder="e.g., Regulatory Body"
//                     value={regulatoryBody}
//                     onChange={(e) => setRegulatoryBody(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Randomization Cycles
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="50"
//                   className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full"
//                   value={noOfIteration}
//                   onChange={(e) =>
//                     setNoOfIteration(parseInt(e.target.value) || 4)
//                   }
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Start Date
//                 </label>
//                 <div
//                   className="relative cursor-pointer"
//                   onClick={(e) => {
//                     const input = e.currentTarget.querySelector("input");
//                     if (input) (input as any).showPicker?.();
//                   }}
//                 >
//                   <input
//                     type="date"
//                     className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                   <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   End Date
//                 </label>
//                 <div
//                   className="relative cursor-pointer"
//                   onClick={(e) => {
//                     const input = e.currentTarget.querySelector("input");
//                     if (input) (input as any).showPicker?.();
//                   }}
//                 >
//                   <input
//                     type="date"
//                     className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                   <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Academic Year
//                 </label>
//                 <select
//                   className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none"
//                   value={academicYear}
//                   onChange={(e) => setAcademicYear(e.target.value)}
//                 >
//                   <option value="2024-25">2024-25</option>
//                   <option value="2025-26">2025-26</option>
//                   <option value="2026-27">2026-27</option>
//                 </select>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Total Paper Sets
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="20"
//                   value={totalSets}
//                   onChange={(e) => setTotalSets(parseInt(e.target.value) || 0)}
//                   className="bg-[#F4F5F9] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full"
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Rotation Mode
//                 </label>
//                 <div
//                   className="relative cursor-pointer group"
//                   onClick={(e) => {
//                     const select = e.currentTarget.querySelector("select");
//                     if (select) select.focus();
//                   }}
//                 >
//                   <select
//                     className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none cursor-pointer group-hover:border-slate-300 transition-colors"
//                     value={rotationType}
//                     onChange={(e) => setRotationType(e.target.value)}
//                   >
//                     <option value="manual_roll">Manual Roll</option>
//                     <option value="automated_roll">Automated Roll</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Reusable Paper Sets
//                 </label>
//                 <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full border border-slate-200/50 shadow-inner">
//                   <button
//                     type="button"
//                     onClick={() => setReUsableSet("no")}
//                     className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
//                       reUsableSet === "no"
//                         ? "bg-white text-[#0b1628] shadow-[0_2px_8px_rgba(0,0,0,0.08)] opacity-100"
//                         : "text-slate-400 hover:text-slate-500 opacity-60"
//                     }`}
//                   >
//                     No (Strict)
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setReUsableSet("yes")}
//                     className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
//                       reUsableSet === "yes"
//                         ? "bg-white text-emerald-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] opacity-100"
//                         : "text-slate-400 hover:text-slate-500 opacity-60"
//                     }`}
//                   >
//                     Yes (Reuse)
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
//                   Set Coding Type
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={codingType}
//                     onChange={(e) => setCodingType(e.target.value)}
//                     className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none"
//                   >
//                     <option value="1">Select...</option>
//                     <option value="Alpha-Numeric">Alpha-Numeric</option>
//                     <option value="Colour">Colour</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               {(codingType === "Colour" || codingType === "Alpha-Numeric") &&
//                 totalSets > 0 && (
//                   <div className="col-span-1 md:col-span-2 mt-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
//                     {/* Subtle Background Accent */}
//                     <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-blue-50/50 transition-colors duration-700"></div>

//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
//                       <div>
//                         <div className="flex items-center gap-2.5 mb-2">
//                           <div className="p-2 bg-blue-50 rounded-lg">
//                             <Palette className="w-4 h-4 text-blue-600" />
//                           </div>
//                           <h3 className="text-lg font-black text-[#14223E] tracking-tight">
//                             Paper Set Sandbox
//                           </h3>
//                         </div>
//                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-10">
//                           Assign{" "}
//                           {codingType === "Colour"
//                             ? "Visual Signatures"
//                             : "Alpha Codes"}{" "}
//                           to {totalSets} Sets
//                         </p>
//                       </div>

//                       {codingType === "Colour" && (
//                         <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
//                           <button
//                             onClick={handleRandomizeColors}
//                             className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
//                           >
//                             <Dices className="w-3.5 h-3.5" />
//                             RANDOMIZE
//                           </button>
//                           <div className="w-px h-4 bg-slate-200"></div>
//                           <button
//                             onClick={handleClearColors}
//                             className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-600 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
//                           >
//                             <Eraser className="w-3.5 h-3.5" />
//                             CLEAR ALL
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 relative z-10">
//                       {Array.from({ length: Math.min(totalSets, 20) }).map(
//                         (_, idx) => (
//                           <div key={idx} className="group/set relative">
//                             {codingType === "Colour" ? (
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <button className="w-full text-left focus:outline-none">
//                                     <div className="bg-slate-50/50 border border-slate-100 rounded-[24px] p-4 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 active:scale-[0.98]">
//                                       <div className="flex items-center justify-between mb-4">
//                                         <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">
//                                           Set {String(idx + 1).padStart(2, "0")}
//                                         </span>
//                                         <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover/set:text-blue-500 transition-colors">
//                                           <Plus className="w-3 h-3" />
//                                         </div>
//                                       </div>

//                                       <div className="relative">
//                                         <div
//                                           className="w-full h-12 rounded-2xl shadow-inner border border-white transition-transform duration-500 group-hover/set:scale-[1.02]"
//                                           style={{
//                                             backgroundColor:
//                                               setColors[idx] || "#f1f5f9",
//                                             boxShadow: setColors[idx]
//                                               ? `0 8px 20px -6px ${setColors[idx]}44`
//                                               : "none",
//                                           }}
//                                         >
//                                           {!setColors[idx] && (
//                                             <div className="h-full flex items-center justify-center opacity-30">
//                                               <Palette className="w-4 h-4 text-slate-400" />
//                                             </div>
//                                           )}
//                                         </div>
//                                         {setColors[idx] && (
//                                           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </button>
//                                 </PopoverTrigger>
//                                 <PopoverContent
//                                   className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white"
//                                   side="top"
//                                   align="center"
//                                 >
//                                   <ChromePicker
//                                     color={setColors[idx] || "#ffffff"}
//                                     onChangeComplete={(color) => {
//                                       setSetColors((prev) => ({
//                                         ...prev,
//                                         [idx]: color.hex,
//                                       }));
//                                     }}
//                                     disableAlpha
//                                   />
//                                   <div className="p-3 border-t border-slate-50 bg-slate-50/50 flex justify-center">
//                                     <div className="grid grid-cols-6 gap-2">
//                                       {PRESET_COLORS.slice(0, 12).map((c) => (
//                                         <button
//                                           key={c}
//                                           onClick={() =>
//                                             setSetColors((prev) => ({
//                                               ...prev,
//                                               [idx]: c,
//                                             }))
//                                           }
//                                           className="w-5 h-5 rounded-full border border-white shadow-sm hover:scale-125 transition-transform"
//                                           style={{ backgroundColor: c }}
//                                         />
//                                       ))}
//                                     </div>
//                                   </div>
//                                 </PopoverContent>
//                               </Popover>
//                             ) : (
//                               <div className="bg-slate-50/50 border border-slate-100 rounded-[24px] p-4 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
//                                 <div className="flex items-center justify-between mb-4">
//                                   <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">
//                                     Set {String(idx + 1).padStart(2, "0")}
//                                   </span>
//                                 </div>
//                                 <input
//                                   type="text"
//                                   placeholder="CODE"
//                                   value={setCodes[idx] || ""}
//                                   onChange={(e) =>
//                                     setSetCodes({
//                                       ...setCodes,
//                                       [idx]: e.target.value,
//                                     })
//                                   }
//                                   className="bg-white border border-slate-200 rounded-xl px-2 py-3 text-[14px] font-black text-[#14223E] outline-none w-full text-center focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-200 uppercase tracking-widest"
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </div>

//             <div className="bg-[#F8F9FA] p-6 rounded-2xl">
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="font-bold text-[#14223E] text-[15px]">
//                   Global Shift Configuration
//                 </h3>
//                 {!isShiftBoxOpen && (
//                   <button
//                     onClick={() => setIsShiftBoxOpen(true)}
//                     className="bg-[#1D324F] hover:bg-[#14253B] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     Create New Shift
//                   </button>
//                 )}
//               </div>

//               {isShiftBoxOpen && (
//                 <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
//                       <Clock className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <h4 className="font-bold text-slate-800 text-sm">
//                       Configure New Shift
//                     </h4>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         Date
//                       </label>
//                       <div
//                         className="relative cursor-pointer"
//                         onClick={(e) => {
//                           const input = e.currentTarget.querySelector("input");
//                           if (input) (input as any).showPicker?.();
//                         }}
//                       >
//                         <input
//                           type="date"
//                           className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full cursor-pointer"
//                           value={newShift.date}
//                           onChange={(e) =>
//                             setNewShift({ ...newShift, date: e.target.value })
//                           }
//                         />
//                       </div>
//                     </div>
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         Start Time
//                       </label>
//                       <input
//                         type="time"
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full"
//                         value={newShift.startTime}
//                         onChange={(e) =>
//                           setNewShift({
//                             ...newShift,
//                             startTime: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         End Time
//                       </label>
//                       <input
//                         type="time"
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full"
//                         value={newShift.endTime}
//                         onChange={(e) =>
//                           setNewShift({ ...newShift, endTime: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         Shift Type
//                       </label>
//                       <select
//                         className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full appearance-none"
//                         value={newShift.type}
//                         onChange={(e) =>
//                           setNewShift({ ...newShift, type: e.target.value })
//                         }
//                       >
//                         <option>Morning</option>
//                         <option>Afternoon</option>
//                         <option>Evening</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
//                     <button
//                       onClick={() => setIsShiftBoxOpen(false)}
//                       className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 mt-1"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleAddShift}
//                       className="bg-[#1D324F] hover:bg-[#14253B] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
//                     >
//                       <Plus className="w-3.5 h-3.5" />
//                       Add to Configuration
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="grid grid-cols-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4 border-b border-slate-100">
//                   <div>Date</div>
//                   <div>Start Time</div>
//                   <div>End Time</div>
//                   <div>Duration</div>
//                   <div>Shift Type</div>
//                 </div>
//                 {shifts.map((shift, idx) => (
//                   <div
//                     key={idx}
//                     className="grid grid-cols-5 items-center text-[13px] text-slate-800 py-3 px-4 font-medium relative border-b border-slate-50 last:border-0"
//                   >
//                     <div className="flex items-center gap-2">
//                       {shift.date}{" "}
//                       <CalendarDays className="w-3.5 h-3.5 text-slate-400 inline" />
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {shift.startTime}{" "}
//                       <Clock className="w-3.5 h-3.5 text-slate-400 inline" />
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {shift.endTime}{" "}
//                       <Clock className="w-3.5 h-3.5 text-slate-400 inline" />
//                     </div>
//                     <div className="bg-[#F8F9FB] rounded px-3 py-1 font-semibold text-slate-600 inline-block w-max">
//                       Calculated
//                     </div>
//                     <div className="flex justify-between items-center text-slate-600">
//                       <span>{shift.type}</span>
//                       <button
//                         onClick={() => handleDeleteShift(idx)}
//                         className="text-slate-400 hover:text-red-500 transition mr-2"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 {shifts.length === 0 && (
//                   <div className="p-8 text-center text-slate-400 text-sm">
//                     No shifts added yet.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Subject & Shift Matrix Block */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-4">
//                 <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
//                 <h2 className="text-xl font-bold text-slate-800">
//                   Subject & Shift Matrix
//                 </h2>
//               </div>
//               {!isSubjectBoxOpen && (
//                 <button
//                   onClick={() => setIsSubjectBoxOpen(true)}
//                   className="text-slate-600 text-sm font-semibold hover:text-slate-900 transition flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" /> Add New Subject
//                 </button>
//               )}
//             </div>

//             {isSubjectBoxOpen && (
//               <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
//                     <Plus className="w-4 h-4 text-emerald-600" />
//                   </div>
//                   <h4 className="font-bold text-slate-800 text-sm">
//                     Add New Subject
//                   </h4>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                       Subject Name
//                     </label>
//                     <input
//                       className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
//                       placeholder="e.g. add new subject"
//                       value={newSubject.name}
//                       onChange={(e) =>
//                         setNewSubject({ ...newSubject, name: e.target.value })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
//                   <button
//                     onClick={() => setIsSubjectBoxOpen(false)}
//                     className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAddSubject}
//                     className="bg-[#0B1727] hover:bg-[#11213D] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     Register Subject
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-4">
//               {subjects.map((sub, sIdx) => (
//                 <div key={sIdx} className="bg-[#F8F9FA] rounded-2xl p-6">
//                   <div className="flex items-start justify-between gap-4 mb-4">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-xl font-bold text-slate-800">
//                         {sub.subjectName[0]}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-[16px] text-[#14223E]">
//                           {sub.subjectName}
//                         </h3>
//                         <p className="text-[13px] text-slate-500">
//                           {sub.category}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="flex flex-col items-end mr-2">
//                         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
//                           Assign Global Shift
//                         </span>
//                         <div className="relative w-48">
//                           <select
//                             className="bg-white border text-sm border-slate-200 rounded-lg px-3 py-2 text-slate-600 w-full appearance-none"
//                             value={
//                               sub.shiftIndex === null ? "none" : sub.shiftIndex
//                             }
//                             onChange={(e) =>
//                               handleLinkSubject(sIdx, e.target.value)
//                             }
//                           >
//                             <option value="none">
//                               Select predefined shift...
//                             </option>
//                             {shifts.map((shift, shIdx) => (
//                               <option key={shIdx} value={shIdx}>
//                                 {shift.date} | {shift.startTime} -{" "}
//                                 {shift.endTime} ({shift.type})
//                               </option>
//                             ))}
//                           </select>
//                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
//                         </div>
//                       </div>
//                       <button className="bg-[#0B1727] text-white text-xs font-semibold px-4 py-2 rounded-lg">
//                         LINKED
//                       </button>
//                     </div>
//                   </div>

//                   {sub.shiftIndex !== null ? (
//                     <div className="bg-white rounded-xl p-4 mt-2 flex items-center justify-between border border-slate-100 shadow-sm">
//                       <div className="flex items-center gap-12">
//                         <div className="flex flex-col">
//                           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
//                             Active Assignment
//                           </span>
//                           <span className="text-[14px] font-bold text-[#14223E]">
//                             {sub.subjectName}
//                           </span>
//                         </div>

//                         <div className="flex flex-col">
//                           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
//                             Shift Details
//                           </span>
//                           <span className="text-[13px] font-bold text-[#14223E]">
//                             {shifts[sub.shiftIndex].date} •
//                           </span>
//                           <span className="text-[13px] font-semibold text-slate-600">
//                             {shifts[sub.shiftIndex].startTime} -{" "}
//                             {shifts[sub.shiftIndex].endTime}
//                           </span>
//                         </div>
//                         <div className="flex flex-col">
//                           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
//                             Type
//                           </span>
//                           <div className="flex items-center gap-2 text-[13px] font-bold text-[#14223E]">
//                             {shifts[sub.shiftIndex].type}{" "}
//                             <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
//                           </div>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => handleLinkSubject(sIdx, "none")}
//                         className="text-slate-400 hover:text-slate-600 p-2"
//                       >
//                         <Link2Off className="w-5 h-5" />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-8 flex items-center justify-center bg-white/50">
//                       <p className="text-[13px] text-slate-500 text-center max-w-sm">
//                         No shifts assigned to this subject yet. Select and Link
//                         a pre-defined shift above.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Curator's Pro-Tip Block */}
//           <div className="bg-[#11213D] rounded-2xl p-6 text-white relative overflow-hidden">
//             <div className="absolute -bottom-4 right-2 opacity-10">
//               <HelpCircle className="w-32 h-32" />
//             </div>

//             <h3 className="text-[15px] font-bold tracking-tight mb-6 relative z-10">
//               Curator&apos;s Pro-Tip
//             </h3>

//             <ul className="space-y-5 relative z-10">
//               <li className="flex items-start gap-4 text-[13px] text-slate-300 leading-relaxed">
//                 <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
//                   <CheckCircle2 className="w-3.5 h-3.5" />
//                 </div>
//                 <span>
//                   Define all global shifts first. You can then map them to{" "}
//                   <span className="text-white">multiple subjects</span> in the
//                   matrix below.
//                 </span>
//               </li>
//               <li className="flex items-start gap-4 text-[13px] text-slate-300 leading-relaxed">
//                 <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
//                   <RotateCcw className="w-3.5 h-3.5" />
//                 </div>
//                 <span>
//                   Sessions are automatically locked 24 hours before the first
//                   scheduled shift.
//                 </span>
//               </li>
//             </ul>
//           </div>

//           {/* Live Configuration Summary Block */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
//               Live Configuration Summary
//             </h3>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
//                 <span className="text-[14px] text-slate-600">
//                   Total Subjects
//                 </span>
//                 <span className="text-2xl font-bold text-[#14223E] leading-none">
//                   {subjects.length.toString().padStart(2, "0")}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between pb-4 border-b border-slate-50">
//                 <span className="text-[14px] text-slate-600">
//                   Scheduled Shifts
//                 </span>
//                 <span className="text-2xl font-bold text-[#14223E] leading-none">
//                   {shifts.length.toString().padStart(2, "0")}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-[14px] text-slate-600">
//                   Unique Paper Sets
//                 </span>
//                 <span className="text-2xl font-bold text-[#14223E] leading-none">
//                   {totalSets.toString().padStart(2, "0")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Action Bar */}
//       <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
//             <ShieldCheck className="w-6 h-6 text-emerald-600" />
//           </div>
//           <div>
//             <h4 className="font-bold text-[#14223E] text-[15px]">
//               Ready to proceed?
//             </h4>
//             <p className="text-[13px] text-slate-500">
//               Ensure all subjects the shifts are correctly mapped before
//               publishing.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
//           <button
//             onClick={() => handleSave("draft")}
//             className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 transition-all text-slate-800 font-bold text-sm rounded-xl cursor-pointer"
//           >
//             Save as Draft
//           </button>
//           <button
//             onClick={() => handleSave("publish")}
//             className="w-full sm:w-auto px-10 py-3.5 bg-[#14223E] hover:bg-[#1D324F] transition-all text-white font-bold text-sm rounded-xl shadow-lg shadow-[#14223E]/10 flex items-center justify-center gap-2 cursor-pointer"
//           >
//             Save & Continue
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChromePicker } from "react-color";
import {
  CalendarDays,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Link2Off,
  Palette,
  Eraser,
  Dices,
} from "lucide-react";
import { fetchExamById, saveExam } from "../../../services/exam.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

const PRESET_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#64748b",
  "#14b8a6",
  "#eab308",
  "#6366f1",
  "#d946ef",
  "#f43f5e",
  "#84cc16",
  "#22c55e",
  "#0ea5e9",
  "#3f6212",
  "#7e22ce",
  "#9f1239",
];

interface Shift {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
}

interface Subject {
  subjectName: string;
  category: string;
  shiftIndex: number | null;
}

interface ExamData {
  exam: {
    examName: string;
    examBodyName: string;
    examCode: string;
    academicYear: string;
    startDate: string;
    endDate: string;
    noOfIteration: number;
    configurationType: string;
    defaultConfiguration: any;
    rotationType: string;
    reUsableSet: string;
  };
  shifts: any[];
  subjects: any[];
}

export default function ExamConfiguration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("id");

  const [examName, setExamName] = useState("");
  const [regulatoryBody, setRegulatoryBody] = useState("");
  const [examCode, setExamCode] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSets, setTotalSets] = useState<number>(10);
  const [codingType, setCodingType] = useState<string>("Alpha-Numeric");
  const [setColors, setSetColors] = useState<Record<number, string>>({});
  const [setCodes, setSetCodes] = useState<Record<number, string>>({});
  const [noOfIteration, setNoOfIteration] = useState<number>(5);
  const [rotationType, setRotationType] = useState<string>("manual_roll");
  const [reUsableSet, setReUsableSet] = useState<string>("no");

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [newShift, setNewShift] = useState<Shift>({
    date: "",
    startTime: "",
    endTime: "",
    type: "Morning",
  });
  const [newSubject, setNewSubject] = useState({
    name: "",
    category: "General",
  });
  const [isShiftBoxOpen, setIsShiftBoxOpen] = useState(false);
  const [isSubjectBoxOpen, setIsSubjectBoxOpen] = useState(false);

  useEffect(() => {
  if (examId) {
    fetchExamById(examId)
      .then((data: ExamData) => {
        if (data.exam) {
          setExamName(data.exam.examName || "");
          setRegulatoryBody(data.exam.examBodyName || "");
          setExamCode(data.exam.examCode || "");
          setAcademicYear(data.exam.academicYear || "2025-26");

          setStartDate(
            data.exam.startDate
              ? data.exam.startDate.split("T")[0]
              : ""
          );

          setEndDate(
            data.exam.endDate
              ? data.exam.endDate.split("T")[0]
              : ""
          );

          setNoOfIteration(data.exam.noOfIteration || 5);

          setCodingType(
            data.exam.configurationType || "Alpha-Numeric"
          );

          setRotationType(
            data.exam.rotationType || "manual_roll"
          );

          setReUsableSet(
            data.exam.reUsableSet || "no"
          );

          let parsedConfig =
            data.exam.defaultConfiguration || {};

          if (typeof parsedConfig === "string") {
            try {
              parsedConfig = JSON.parse(parsedConfig);
            } catch {
              parsedConfig = {};
            }
          }

          if (
            data.exam.configurationType === "Colour"
          ) {
            setSetColors(parsedConfig);
          } else {
            setSetCodes(parsedConfig);
          }

          // Populate shifts
          const fetchedShifts =
            (data.shifts || []).map((s: any) => ({
              id: s.id,
              date: s.date
                ? s.date.split("T")[0]
                : "",
              startTime: s.startTime
                ? s.startTime.substring(0, 5)
                : "",
              endTime: s.endTime
                ? s.endTime.substring(0, 5)
                : "",
              type: s.type || "Morning",
            }));

          setShifts(fetchedShifts);

          // Populate subjects
          const fetchedSubjects =
            (data.subjects || []).map(
              (sub: any) => {
                const mapping =
                  sub.mappings &&
                  sub.mappings[0];

                const shiftIdx = mapping
                  ? fetchedShifts.findIndex(
                      (fs: any) =>
                        fs.id === mapping.ssId
                    )
                  : null;

                return {
                  subjectName:
                    sub.subjectName,
                  category:
                    sub.category || "General",
                  shiftIndex:
                    shiftIdx === -1
                      ? null
                      : shiftIdx,
                };
              }
            );

          setSubjects(fetchedSubjects);

          if (data.subjects.length > 0) {
            setTotalSets(
              data.subjects[0].setCount
            );
          }
        }
      })
      .catch((err) =>
        console.error(
          "Error fetching exam:",
          err
        )
      );
  }
}, [examId]);

  const handleAddShift = () => {
    if (newShift.date && newShift.startTime && newShift.endTime) {
      setShifts([...shifts, { ...newShift }]);
      setNewShift({ date: "", startTime: "", endTime: "", type: "Morning" });
      setIsShiftBoxOpen(false);
    }
  };

  const handleDeleteShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
    setSubjects(
      subjects.map((sub) =>
        sub.shiftIndex === index ? { ...sub, shiftIndex: null } : sub,
      ),
    );
  };

  const handleAddSubject = () => {
    if (newSubject.name) {
      setSubjects([
        ...subjects,
        {
          subjectName: newSubject.name,
          category: newSubject.category,
          shiftIndex: null,
        },
      ]);
      setNewSubject({ name: "", category: "General" });
      setIsSubjectBoxOpen(false);
    }
  };

  const handleLinkSubject = (subIndex: number, shiftIndex: string) => {
    const updated = [...subjects];
    updated[subIndex].shiftIndex =
      shiftIndex === "none" ? null : parseInt(shiftIndex);
    setSubjects(updated);
  };

  const handleRandomizeColors = () => {
    const newColors: Record<number, string> = {};
    const shuffled = [...PRESET_COLORS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < totalSets; i++) {
      newColors[i] = shuffled[i % shuffled.length];
    }
    setSetColors(newColors);
  };

  const handleClearColors = () => {
    setSetColors({});
  };

  const validateForm = (status: "draft" | "publish") => {
    const errors: string[] = [];

    // Basic Info
    if (!examName.trim()) errors.push("Exam Name is required.");
    if (!regulatoryBody.trim()) errors.push("Regulatory Body is required.");
    if (!examCode.trim()) errors.push("Exam Code is required.");
    if (!startDate) errors.push("Start Date is required.");
    if (!endDate) errors.push("End Date is required.");

    // Configuration
    if (codingType === "1") {
      errors.push("Please select a Set Coding Type (Alpha-Numeric or Colour).");
    } else {
      if (totalSets <= 0) {
        errors.push("Total Paper Sets must be greater than 0.");
      } else {
        // Validate set values
        for (let i = 0; i < totalSets; i++) {
          if (codingType === "Colour") {
            if (!setColors[i])
              errors.push(`Color for Set ${i + 1} is not assigned.`);
          } else {
            if (!setCodes[i] || !setCodes[i].trim())
              errors.push(`Code for Set ${i + 1} is not assigned.`);
          }
        }
      }
    }

    if (noOfIteration <= 0)
      errors.push("Randomization Cycles must be at least 1.");

    // Shifts
    if (shifts.length === 0) {
      errors.push("At least one shift must be created.");
    }

    // Subjects
    if (subjects.length === 0) {
      errors.push("At least one subject must be registered.");
    } else {
      // Mapping
      const unlinkedSubjects = subjects.filter(
        (sub) => sub.shiftIndex === null,
      );
      if (unlinkedSubjects.length > 0) {
        errors.push(
          `${unlinkedSubjects.length} subject(s) are not linked to any shift.`,
        );
      }
    }

    if (errors.length > 0) {
      alert("Please fill all required fields:\n\n• " + errors.join("\n• "));
      return false;
    }

    return true;
  };

  const handleSave = async (
  status: "draft" | "publish"
) => {
  if (!validateForm(status)) return;

  const payload = {
    exam: {
      examName,
      examCode,
      examBodyName: regulatoryBody,
      academicYear,
      startDate,
      endDate,
      noOfIteration,
      configurationType: codingType,
      defaultConfiguration:
        codingType === "Colour"
          ? setColors
          : setCodes,
      rotationType,
      reUsableSet,
      status,
    },

    shifts: shifts.map((s) => ({
      ...s,
      startTime: s.startTime + ":00",
      endTime: s.endTime + ":00",
    })),

    subjects: subjects.map((s) => ({
      subjectName: s.subjectName,
      setCount: totalSets,
      shiftIndex: s.shiftIndex,
    })),
  };

  try {
    const data = await saveExam(
      payload,
      examId || undefined
    );

    alert(
      `Exam ${
        status === "publish"
          ? "published"
          : "saved as draft"
      } successfully!`
    );

    navigate(
      `/admin/review_publish?id=${data.id}`
    );
  } catch (err: any) {
    console.error(err);

    alert(
      err?.response?.data?.error ||
        "Failed to save exam"
    );
  }
};
  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-[28px] md:text-[34px] font-bold text-[#14223E] tracking-tight leading-tight mb-3">
              Exam Configuration
            </h1>
            <p className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed">
              Define the structural parameters for your high-stakes evaluation
              events. Your inputs here will govern the entire allocation logic.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex bg-[#F5F5FA] rounded-xl px-4 md:px-6 py-4 gap-4 md:gap-8 shrink-0 self-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
                Current Step
              </span>
              <div className="flex flex-col text-[14px] md:text-[16px] font-bold text-[#14223E] leading-[1.2]">
                <span>Event</span>
                <span>Core</span>
              </div>
            </div>
            <div className="w-12 md:w-16 flex items-center">
              <div className="h-[2px] w-full bg-[#D6DFE8]"></div>
            </div>
            <div className="flex flex-col opacity-40">
              <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-1.5">
                Next
              </span>
              <div className="flex flex-col text-[14px] md:text-[16px] font-bold text-[#8B9BB4] leading-[1.2]">
                <span>Final</span>
                <span>Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] ">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Create Exam Event Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-4 md:p-6 lg:p-6 relative overflow-hidden">
              {/* Faded Calendar Icon */}
              <div className="absolute top-6 right-6 md:right-8 opacity-5 hidden sm:block">
                <CalendarDays className="w-24 h-24 md:w-32 md:h-32" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800">
                  Create Exam Event
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 md:gap-y-7 mb-8 md:mb-10 relative z-10">
                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Exam Name
                  </label>
                  <input
                    className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all"
                    placeholder="e.g., Annual Board Exams 2026"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Exam Code
                  </label>
                  <input
                    className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all"
                    placeholder="e.g., EXAM-2026"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Regulatory Body
                  </label>
                  <input
                    className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all"
                    placeholder="e.g., Regulatory Body"
                    value={regulatoryBody}
                    onChange={(e) => setRegulatoryBody(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Randomization Cycles
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all"
                    value={noOfIteration}
                    onChange={(e) =>
                      setNoOfIteration(parseInt(e.target.value) || 4)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Start Date
                  </label>
                  <div
                    className="relative cursor-pointer"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector("input");
                      if (input) (input as any).showPicker?.();
                    }}
                  >
                    <input
                      type="date"
                      className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer transition-all"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    End Date
                  </label>
                  <div
                    className="relative cursor-pointer"
                    onClick={(e) => {
                      const input = e.currentTarget.querySelector("input");
                      if (input) (input as any).showPicker?.();
                    }}
                  >
                    <input
                      type="date"
                      className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer transition-all"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Academic Year
                  </label>
                  <select
                    className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none transition-all"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Total Paper Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={totalSets}
                    onChange={(e) => setTotalSets(parseInt(e.target.value) || 0)}
                    className="bg-[#F4F5F9] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Rotation Mode
                  </label>
                  <div
                    className="relative cursor-pointer group"
                    onClick={(e) => {
                      const select = e.currentTarget.querySelector("select");
                      if (select) select.focus();
                    }}
                  >
                    <select
                      className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none cursor-pointer transition-all"
                      value={rotationType}
                      onChange={(e) => setRotationType(e.target.value)}
                    >
                      <option value="manual_roll">Manual Roll</option>
                      <option value="automated_roll">Automated Roll</option>
                    </select>
                    <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Reusable Paper Sets
                  </label>
                  <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full border border-slate-400/50 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setReUsableSet("no")}
                      className={`flex-1 py-2 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                        reUsableSet === "no"
                          ? "bg-white text-[#0b1628] shadow-[0_2px_8px_rgba(0,0,0,0.08)] opacity-100"
                          : "text-slate-400 hover:text-slate-500 opacity-60"
                      }`}
                    >
                      No (Strict)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReUsableSet("yes")}
                      className={`flex-1 py-2 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                        reUsableSet === "yes"
                          ? "bg-white text-emerald-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] opacity-100"
                          : "text-slate-400 hover:text-slate-500 opacity-60"
                      }`}
                    >
                      Yes (Reuse)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Set Coding Type
                  </label>
                  <div className="relative">
                    <select
                      value={codingType}
                      onChange={(e) => setCodingType(e.target.value)}
                      className="bg-[#F8F9FA] border border-slate-400 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none transition-all"
                    >
                      <option value="1">Select...</option>
                      <option value="Alpha-Numeric">Alpha-Numeric</option>
                      <option value="Colour">Colour</option>
                    </select>
                    <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {(codingType === "Colour" || codingType === "Alpha-Numeric") &&
                  totalSets > 0 && (
                    <div className="col-span-1 md:col-span-2 mt-2 bg-white p-4 md:p-6 lg:p-6 rounded-xl md:rounded-xl border border-slate-300 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-slate-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50"></div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 relative z-10">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Palette className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="text-base md:text-lg font-black text-[#14223E] tracking-tight">
                              Paper Set Sandbox
                            </h3>
                          </div>
                          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-10">
                            Assign{" "}
                            {codingType === "Colour"
                              ? "Visual Signatures"
                              : "Alpha Codes"}{" "}
                            to {totalSets} Sets
                          </p>
                        </div>

                        {codingType === "Colour" && (
                          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            <button
                              onClick={handleRandomizeColors}
                              className="flex items-center gap-2 px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            >
                              <Dices className="w-3.5 h-3.5" />
                              RANDOMIZE
                            </button>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <button
                              onClick={handleClearColors}
                              className="flex items-center gap-2 px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black text-slate-600 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            >
                              <Eraser className="w-3.5 h-3.5" />
                              CLEAR ALL
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5 relative z-10">
                        {Array.from({ length: Math.min(totalSets, 20) }).map(
                          (_, idx) => (
                            <div key={idx} className="group/set relative">
                              {codingType === "Colour" ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="w-full text-left focus:outline-none">
                                      <div className="bg-slate-50/50 border border-slate-300 rounded-xl p-3 md:p-4 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
                                        <div className="flex items-center justify-between mb-3 md:mb-4">
                                          <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-tighter uppercase">
                                            Set {String(idx + 1).padStart(2, "0")}
                                          </span>
                                          <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200">
                                            <Plus className="w-3 h-3" />
                                          </div>
                                        </div>

                                        <div className="relative">
                                          <div
                                            className="w-full h-10 md:h-12 rounded-lg  shadow-inner border border-white transition-transform duration-500 group-hover/set:scale-[1.02]"
                                            style={{
                                              backgroundColor:
                                                setColors[idx] || "#f1f5f9",
                                              boxShadow: setColors[idx]
                                                ? `0 8px 20px -6px ${setColors[idx]}44`
                                                : "none",
                                            }}
                                          >
                                            {!setColors[idx] && (
                                              <div className="h-full flex items-center justify-center opacity-30">
                                                <Palette className="w-3.5 h-4 text-slate-400" />
                                              </div>
                                            )}
                                          </div>
                                          {setColors[idx] && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white"
                                    side="top"
                                    align="center"
                                  >
                                    <ChromePicker
                                      color={setColors[idx] || "#ffffff"}
                                      onChangeComplete={(color) => {
                                        setSetColors((prev) => ({
                                          ...prev,
                                          [idx]: color.hex,
                                        }));
                                      }}
                                      disableAlpha
                                    />
                                    <div className="p-3 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                                      <div className="grid grid-cols-6 gap-2">
                                        {PRESET_COLORS.slice(0, 12).map((c) => (
                                          <button
                                            key={c}
                                            onClick={() =>
                                              setSetColors((prev) => ({
                                                ...prev,
                                                [idx]: c,
                                              }))
                                            }
                                            className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white shadow-sm hover:scale-125 transition-transform"
                                            style={{ backgroundColor: c }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] md:rounded-[24px] p-3 md:p-4 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
                                  <div className="flex items-center justify-between mb-3 md:mb-4">
                                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-tighter uppercase">
                                      Set {String(idx + 1).padStart(2, "0")}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="CODE"
                                    value={setCodes[idx] || ""}
                                    onChange={(e) =>
                                      setSetCodes({
                                        ...setCodes,
                                        [idx]: e.target.value,
                                      })
                                    }
                                    className="bg-white border border-slate-200 rounded-xl px-2 py-2 md:py-3 text-[12px] md:text-[14px] font-black text-[#14223E] outline-none w-full text-center focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-200 uppercase tracking-widest"
                                  />
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="bg-[#F8F9FA] rounded-2xl p-4 ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <h3 className="font-bold text-[#14223E] text-[14px] md:text-[15px]">
                    Global Shift Configuration
                  </h3>
                  {!isShiftBoxOpen && (
                    <button
                      onClick={() => setIsShiftBoxOpen(true)}
                      className="bg-[#1D324F] hover:bg-[#14253B] text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center gap-2 transition w-full sm:w-auto justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Shift
                    </button>
                  )}
                </div>

                {isShiftBoxOpen && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 mb-6 shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Configure New Shift
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Date
                        </label>
                        <div
                          className="relative cursor-pointer"
                          onClick={(e) => {
                            const input = e.currentTarget.querySelector("input");
                            if (input) (input as any).showPicker?.();
                          }}
                        >
                          <input
                            type="date"
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full cursor-pointer"
                            value={newShift.date}
                            onChange={(e) =>
                              setNewShift({ ...newShift, date: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                          value={newShift.startTime}
                          onChange={(e) =>
                            setNewShift({
                              ...newShift,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                          value={newShift.endTime}
                          onChange={(e) =>
                            setNewShift({ ...newShift, endTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Shift Type
                        </label>
                        <select
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full appearance-none"
                          value={newShift.type}
                          onChange={(e) =>
                            setNewShift({ ...newShift, type: e.target.value })
                          }
                        >
                          <option>Morning</option>
                          <option>Afternoon</option>
                          <option>Evening</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setIsShiftBoxOpen(false)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddShift}
                        className="bg-[#1D324F] hover:bg-[#14253B] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition w-full sm:w-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Configuration
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="grid grid-cols-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 px-4 border-b border-slate-100">
                      <div>Date</div>
                      <div>Start Time</div>
                      <div>End Time</div>
                      <div>Duration</div>
                      <div>Shift Type</div>
                    </div>
                    {shifts.map((shift, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-5 items-center text-[12px] md:text-[13px] text-slate-800 py-3 px-4 font-medium border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {shift.date}
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2">
                          {shift.startTime}
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2">
                          {shift.endTime}
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                        <div>
                          <span className="bg-[#F8F9FB] rounded px-2 md:px-3 py-1 font-semibold text-slate-600 text-[11px] md:text-xs whitespace-nowrap">
                            Calculated
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="truncate">{shift.type}</span>
                          <button
                            onClick={() => handleDeleteShift(idx)}
                            className="text-slate-400 hover:text-red-500 transition ml-2 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {shifts.length === 0 && (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        No shifts added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject & Shift Matrix Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Subject & Shift Matrix
                  </h2>
                </div>
                {!isSubjectBoxOpen && (
                  <button
                    onClick={() => setIsSubjectBoxOpen(true)}
                    className="text-slate-600 text-sm font-semibold hover:text-slate-900 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" /> Add New Subject
                  </button>
                )}
              </div>

              {isSubjectBoxOpen && (
                <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Add New Subject
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Subject Name
                      </label>
                      <input
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                        placeholder="e.g. add new subject"
                        value={newSubject.name}
                        onChange={(e) =>
                          setNewSubject({ ...newSubject, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setIsSubjectBoxOpen(false)}
                      className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSubject}
                      className="bg-[#0B1727] hover:bg-[#11213D] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition w-full sm:w-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Register Subject
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {subjects.map((sub, sIdx) => (
                  <div key={sIdx} className="bg-[#F8F9FA] rounded-2xl p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-xl font-bold text-slate-800 shrink-0">
                          {sub.subjectName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-[15px] md:text-[16px] text-[#14223E]">
                            {sub.subjectName}
                          </h3>
                          <p className="text-[12px] md:text-[13px] text-slate-500">
                            {sub.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex flex-col w-full sm:w-auto">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Assign Global Shift
                          </span>
                          <div className="relative w-full sm:w-56">
                            <select
                              className="bg-white border text-sm border-slate-200 rounded-lg px-3 py-2 text-slate-600 w-full appearance-none"
                              value={
                                sub.shiftIndex === null ? "none" : sub.shiftIndex
                              }
                              onChange={(e) =>
                                handleLinkSubject(sIdx, e.target.value)
                              }
                            >
                              <option value="none">
                                Select predefined shift...
                              </option>
                              {shifts.map((shift, shIdx) => (
                                <option key={shIdx} value={shIdx}>
                                  {shift.date} | {shift.startTime} -{" "}
                                  {shift.endTime} ({shift.type})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <button className="bg-[#0B1727] text-white text-xs font-semibold px-4 py-2 rounded-lg w-full sm:w-auto">
                          LINKED
                        </button>
                      </div>
                    </div>

                    {sub.shiftIndex !== null ? (
                      <div className="bg-white rounded-xl p-4 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100 shadow-sm">
                        <div className="flex flex-wrap items-center gap-6 md:gap-12">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Active Assignment
                            </span>
                            <span className="text-[13px] md:text-[14px] font-bold text-[#14223E]">
                              {sub.subjectName}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Shift Details
                            </span>
                            <span className="text-[12px] md:text-[13px] font-bold text-[#14223E]">
                              {shifts[sub.shiftIndex].date}
                            </span>
                            <span className="text-[12px] md:text-[13px] font-semibold text-slate-600">
                              {shifts[sub.shiftIndex].startTime} -{" "}
                              {shifts[sub.shiftIndex].endTime}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                              Type
                            </span>
                            <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-[#14223E]">
                              {shifts[sub.shiftIndex].type}
                              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleLinkSubject(sIdx, "none")}
                          className="text-slate-400 hover:text-slate-600 p-2 shrink-0"
                        >
                          <Link2Off className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-6 md:p-8 flex items-center justify-center bg-white/50">
                        <p className="text-[12px] md:text-[13px] text-slate-500 text-center max-w-sm">
                          No shifts assigned to this subject yet. Select and Link
                          a pre-defined shift above.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Curator's Pro-Tip Block */}
            <div className="bg-[#11213D] rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
              <div className="absolute -bottom-4 right-2 opacity-10">
                <HelpCircle className="w-24 h-24 md:w-32 md:h-32" />
              </div>

              <h3 className="text-[14px] md:text-[15px] font-bold tracking-tight mb-6 relative z-10">
                Curator&apos;s Pro-Tip
              </h3>

              <ul className="space-y-5 relative z-10">
                <li className="flex items-start gap-4 text-[12px] md:text-[13px] text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    Define all global shifts first. You can then map them to{" "}
                    <span className="text-white">multiple subjects</span> in the
                    matrix below.
                  </span>
                </li>
                <li className="flex items-start gap-4 text-[12px] md:text-[13px] text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    Sessions are automatically locked 24 hours before the first
                    scheduled shift.
                  </span>
                </li>
              </ul>
            </div>

            {/* Live Configuration Summary Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                Live Configuration Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Total Subjects
                  </span>
                  <span className="text-2xl font-bold text-[#14223E] leading-none">
                    {subjects.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Scheduled Shifts
                  </span>
                  <span className="text-2xl font-bold text-[#14223E] leading-none">
                    {shifts.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Unique Paper Sets
                  </span>
                  <span className="text-2xl font-bold text-[#14223E] leading-none">
                    {totalSets.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-6 p-5 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-[#14223E] text-[14px] md:text-[15px]">
                Ready to proceed?
              </h4>
              <p className="text-[12px] md:text-[13px] text-slate-500">
                Ensure all subjects the shifts are correctly mapped before
                publishing.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => handleSave("draft")}
              className="w-full sm:w-auto px-6 md:px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 transition-all text-slate-800 font-bold text-sm rounded-xl cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSave("publish")}
              className="w-full sm:w-auto px-8 md:px-10 py-3 bg-[#14223E] hover:bg-[#1D324F] transition-all text-white font-bold text-sm rounded-xl shadow-lg shadow-[#14223E]/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              Save & Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// import  { useState, useEffect, useRef, useCallback } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import {
//   Shield,
//   Clock,
//   BarChart3,
//   BookOpen,
//   Clock1,
//   Fingerprint,
//   CheckCircle2,
//   AlertCircle,
//   Radio,
//   Zap,
// } from "lucide-react";
// import {
//   fetchAllocationData,
//   performRandomization,
//   resolveTie,
// } from "../../../services/randomization.service";
// import { useAuth } from "../../../hooks/useAuth";
// import Header from "../../../layouts/SelectorLayout/Header";

// interface Iteration {
//   id: string;
//   time: string;
//   set: string;
//   setNum: number;
//   descriptor: string | null;
//   raw: any;
// }

// interface VotingMetrics {
//   [key: number]: number;
// }

// interface DetailsState {
//   subjectName: string;
//   shiftName: string;
//   examName: string;
//   examBodyName: string;
//   noOfIteration: number;
//   rotationType: "manual_roll" | "automated_roll";
//   configurationType: string;
//   defaultConfiguration: any;
// }

// export default function RandomizationProgress() {
//   const navigate = useNavigate();
//   const { loading: authLoading, } = useAuth();
//   const [searchParams] = useSearchParams();
  
//   const subjectId = searchParams.get("subjectId");
//   const shiftId = searchParams.get("shiftId");
//   const examId = searchParams.get("examId");

//   const [details, setDetails] = useState<DetailsState>({
//     subjectName: "Loading Subject...",
//     shiftName: "Loading Shift...",
//     examName: "Loading Exam Data...",
//     examBodyName: "National Certification Board",
//     noOfIteration: 5,
//     rotationType: "automated_roll",
//     configurationType: "colour",
//     defaultConfiguration: null,
//   });

//   const [loading, setLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [completedIterations, setCompletedIterations] = useState<Iteration[]>([]);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isTie, setIsTie] = useState(false);
//   const [candidates, setCandidates] = useState<number[]>([]);
//   const [votingMetrics, setVotingMetrics] = useState<VotingMetrics>({});
//   const [isResolvingTie, setIsResolvingTie] = useState(false);
//   const [tieBreakerProgress, setTieBreakerProgress] = useState(0);
//   const [finalWinner, setFinalWinner] = useState<number | null>(null);
//   const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

//   const abortControllerRef = useRef<AbortController | null>(null);
//   const stopRequestedRef = useRef(false);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       abortControllerRef.current?.abort();
//       stopRequestedRef.current = true;
//     };
//   }, []);

//   const getDescriptor = useCallback(
//     (setNum: number, config: any, type: string): string | null => {
//       if (!config) return null;
//       const idx = setNum - 1;
//       let val: any = null;

//       if (Array.isArray(config)) val = config[idx];
//       else if (config[idx] !== undefined) val = config[idx];
//       else if (config[setNum] !== undefined) val = config[setNum];
//       else {
//         const values = Object.values(config);
//         val = values[idx] || null;
//       }

//       if (!val) return null;
//       return val;
//     },
//     []
//   );

//   const fetchDetails = useCallback(async () => {
//     if (!examId || !subjectId || !shiftId) return;

//     try {
//       const data = await fetchAllocationData(
//         examId,
//         subjectId,
//         shiftId,
//         navigate
//       );

//       const subject = data.subjects?.find(
//         (s: any) => s.id.toString() === subjectId
//       );
//       const shift = data.shifts?.find((s: any) => s.id.toString() === shiftId);

//       const examConfig = data.exam;
//       let parsedConfig = examConfig?.defaultConfiguration;
//       if (typeof parsedConfig === "string") {
//         try {
//           parsedConfig = JSON.parse(parsedConfig);
//         } catch (e) {
//           console.error("Failed to parse config", e);
//         }
//       }

//       setDetails({
//         subjectName: subject?.subjectName || "Unknown Subject",
//         shiftName: shift
//           ? `${shift.startTime} - ${shift.endTime}`
//           : "Unknown Shift",
//         examName: examConfig?.examName || "National Medical Entrance",
//         examBodyName: examConfig?.examBodyName || "National Certification Board",
//         noOfIteration: examConfig?.noOfIteration || 5,
//         rotationType: examConfig?.rotationType || "automated_roll",
//         configurationType: (examConfig?.configurationType || "colour").toLowerCase(),
//         defaultConfiguration: parsedConfig,
//       });

//       setIsRegistered(!!data.ssData);

//       // Resume existing iterations
//       if (data.currentIterations?.length > 0) {
//         const formatted = data.currentIterations.map((it: any) => {
//           const descriptor = getDescriptor(
//             it.selectedSet,
//             parsedConfig,
//             (examConfig?.configurationType || "colour").toLowerCase()
//           );
//           return {
//             id: it.iterationCount.toString().padStart(2, "0"),
//             time: new Date(it.ts).toLocaleTimeString("en-US", {
//               timeZone: "Asia/Kolkata",
//             }),
//             set: descriptor
//               ? `Set ${it.selectedSet.toString().padStart(2, "0")} (${descriptor})`
//               : `Set ${it.selectedSet.toString().padStart(2, "0")}`,
//             setNum: it.selectedSet,
//             descriptor: descriptor,
//             raw: it,
//           };
//         });
//         setCompletedIterations(formatted);
//         setCurrentStep(data.currentIterations.length + 1);

//         // Resume voting results if available
//         if (data.votingResults) {
//           setVotingMetrics(data.votingResults.metrics || {});
//           setIsTie(data.votingResults.isTie || false);
//           setCandidates(data.votingResults.candidates || []);
//           setFinalWinner(data.votingResults.finalWinner || null);
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch details", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [examId, subjectId, shiftId, navigate, getDescriptor]);

//   const startRandomization = useCallback(
//     async (targetIteration?: number) => {
//       if (isProcessing || !examId || !subjectId || !shiftId) return;
      
//       setIsProcessing(true);

//       if (!targetIteration && completedIterations.length === 0) {
//         setCompletedIterations([]);
//         setIsTie(false);
//         setCandidates([]);
//         setFinalWinner(null);
//       }

//       stopRequestedRef.current = false;
//       abortControllerRef.current = new AbortController();

//       try {
//         const result = await performRandomization(
//           {
//             subjectId,
//             shiftId,
//             examId,
//             iterationIndex: targetIteration,
//           },
//           abortControllerRef.current.signal,
//           navigate
//         );

//         if (result.error) throw new Error(result.error);

//         // Staggered UI simulation
//         for (let i = 0; i < result.iterations.length; i++) {
//           if (stopRequestedRef.current) break;

//           const iter = result.iterations[i];
//           if (!targetIteration) setCurrentStep(iter.iterationNum);

//           await new Promise((resolve) => setTimeout(resolve, 800));

//           const descriptor = getDescriptor(
//             iter.selectedSet,
//             details.defaultConfiguration,
//             details.configurationType
//           );

//           setCompletedIterations((prev) => [
//             ...prev,
//             {
//               id: iter.iterationNum.toString().padStart(2, "0"),
//               time: iter.ts,
//               set: descriptor
//                 ? `Set ${iter.selectedSet.toString().padStart(2, "0")} (${descriptor})`
//                 : `Set ${iter.selectedSet.toString().padStart(2, "0")}`,
//               setNum: iter.selectedSet,
//               descriptor: descriptor,
//               raw: iter,
//             },
//           ]);
//         }

//         if (result.isComplete) {
//           setIsTie(result.isTie);
//           setCandidates(result.candidates);
//           setVotingMetrics(result.metadata.votingMetrics);
//           if (!result.isTie) {
//             setFinalWinner(result.winner);
//           }
//         } else if (targetIteration) {
//           setCurrentStep(targetIteration + 1);
//         }
//       } catch (err: any) {
//         if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
//           console.log("Randomization process aborted by user");
//         } else {
//           alert(err.message || "Randomization failed");
//           console.error("Backend randomization failed", err);
//         }
//       } finally {
//         setIsProcessing(false);
//         if (!targetIteration && !stopRequestedRef.current) {
//           setCurrentStep(details.noOfIteration + 1);
//         }
//       }
//     },
//     [isProcessing, examId, subjectId, shiftId, completedIterations.length, details, getDescriptor, navigate]
//   );

//   const handleStopProcess = useCallback(() => {
//     stopRequestedRef.current = true;
//     abortControllerRef.current?.abort();
//     setIsProcessing(false);
//   }, []);

//   const handleResolveTie = useCallback(async () => {
//     if (isResolvingTie || !subjectId || !shiftId) return;
    
//     setIsResolvingTie(true);
//     setTieBreakerProgress(0);

//     const duration = 2000;
//     const interval = 50;
//     const steps = duration / interval;
//     let currentStepCount = 0;

//     const progressInterval = setInterval(() => {
//       currentStepCount++;
//       setTieBreakerProgress(Math.min((currentStepCount / steps) * 100, 100));
//       if (currentStepCount >= steps) clearInterval(progressInterval);
//     }, interval);

//     try {
//       const result = await resolveTie(
//         {
//           subjectId,
//           shiftId,
//           candidates,
//         },
//         navigate
//       );
      
//       console.log("Tie Resolve Result:", result);
//       await new Promise((resolve) => setTimeout(resolve, duration));

//       setFinalWinner(result.finalSet);
//     //   setFinalWinner(result.finalWinner);
//     } catch (err) {
//       console.error("Tie resolution failed", err);
//     } finally {
//       setIsResolvingTie(false);
//     }
//   }, [isResolvingTie, subjectId, shiftId, candidates, navigate]);

//   // Auto-start randomization
//   useEffect(() => {
//     if (
//       !loading &&
//       isRegistered === true &&
//       examId &&
//       subjectId &&
//       shiftId &&
//       !isProcessing &&
//       completedIterations.length === 0 &&
//       details.rotationType === "automated_roll"
//     ) {
//       startRandomization();
//     }
//   }, [
//     loading,
//     isRegistered,
//     examId,
//     subjectId,
//     shiftId,
//     isProcessing,
//     completedIterations.length,
//     details.rotationType,
//     startRandomization,
//   ]);

//   useEffect(() => {
//     if (examId && subjectId && shiftId) {
//       fetchDetails();
//     }
//   }, [examId, subjectId, shiftId, fetchDetails]);

//   // Render loading state
//   if (loading || authLoading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f3ff]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#002045] border-t-[#68dba9] rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#43474e] font-inter">Loading randomization data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className=" h-screen w-full bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f3ff] text-[#43474e] font-inter selection:bg-[#68dba9]/20 selection:text-[#002045]">
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;800&display=swap'); .font-manrope { font-family: 'Manrope', sans-serif !important; } .font-inter { font-family: 'Inter', sans-serif !important; }`,
//         }}
//       />
//       <Header />

//       <main className="pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {/* Page Title Section */}
//         <div className="mb-12 px-4">
//           <div className="max-w-full">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#68dba9]/20 to-transparent flex items-center justify-center">
//                 <div className="w-1.5 h-1.5 bg-[#68dba9] rounded-full"></div>
//               </div>
//               <span className="text-[10px] font-manrope font-extrabold text-[#68dba9] uppercase tracking-widest">
//                 Secure Randomization Protocol
//               </span>
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent leading-[1.1] tracking-tight mb-4">
//               <span className="block">{details.examName}</span>
//               <span className="text-[#43474e] font-manrope block text-xl sm:text-2xl font-medium mt-1">
//                 {details.examBodyName?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
//               </span>
//             </h1>

//             {/* Info Cards Row */}
//             <div className="flex flex-wrap items-center gap-4">
//               {/* Subject Domain Card */}
//               <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm">
//                 <div className="p-2.5 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
//                   <BookOpen size={18} className="text-[#002045]" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-[12px] font-manrope font-extrabold uppercase tracking-widest text-[#43474e]">
//                     Subject Domain
//                   </span>
//                   <span className="text-sm font-inter font-bold text-[#002045]">
//                     {details.subjectName}
//                   </span>
//                 </div>
//               </div>

//               {/* Examination Shift Card */}
//               <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm">
//                 <div className="p-2.5 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
//                   <Clock1 size={18} className="text-[#002045]" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-[12px] font-manrope font-extrabold uppercase tracking-widest text-[#43474e]">
//                     Examination Shift
//                   </span>
//                   <span className="text-sm font-inter font-bold text-[#002045]">
//                     Shift: {details.shiftName}
//                   </span>
//                 </div>
//               </div>

//               {/* Selected Winner Badge */}
//               {finalWinner !== null && !isProcessing && (
//                 <div className="px-5 py-3 bg-gradient-to-r from-[#f2f3ff] to-white rounded-xl flex items-center gap-3 text-[#002045] font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px] shadow-sm">
//                   <div className="relative">
//                     <div className="w-2 h-2 bg-[#68dba9] rounded-full blur-[2px] absolute inset-0"></div>
//                     <div className="w-2 h-2 bg-[#68dba9] rounded-full relative"></div>
//                   </div>
//                   {details.configurationType?.toLowerCase() === "colour" &&
//                     getDescriptor(
//                       finalWinner,
//                       details.defaultConfiguration,
//                       details.configurationType
//                     ) && (
//                       <div
//                         className="w-4 h-4 rounded-full shadow-md"
//                         style={(() => {
//                           const d = getDescriptor(
//                             finalWinner,
//                             details.defaultConfiguration,
//                             details.configurationType
//                           );
//                           return d?.startsWith("#") ? { backgroundColor: d } : {};
//                         })()}
//                       />
//                     )}
//                   <span className="whitespace-nowrap">
//                     Selected: Set {finalWinner.toString().padStart(2, "0")}
//                     {getDescriptor(
//                       finalWinner,
//                       details.defaultConfiguration,
//                       details.configurationType
//                     ) && details.configurationType !== "colour"
//                       ? ` (${getDescriptor(
//                           finalWinner,
//                           details.defaultConfiguration,
//                           details.configurationType
//                         )})`
//                       : ""}
//                   </span>
//                 </div>
//               )}

//               {/* Publish Button */}
//               <button
//                 disabled={
//                   isProcessing ||
//                   completedIterations.length < details.noOfIteration ||
//                   (isTie && finalWinner === null)
//                 }
//                 className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#002045] to-[#1a365d] hover:from-[#1a365d] hover:to-[#002045] disabled:from-[#f2f3ff] disabled:to-[#f2f3ff] rounded-xl flex items-center gap-3 text-white disabled:text-[#43474e] font-manrope font-extrabold uppercase tracking-widest text-[11px] sm:text-[12px] shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300"
//               >
//                 <Zap size={16} className="text-[#68dba9]" />
//                 Publish Final Document
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-8">
//           {/* Main Content Area */}
//           <div className="col-span-1">
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-8 shadow-2xl shadow-black/5 min-h-[600px] relative border border-slate-200">
//               {isRegistered === false ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
//                   <div className="w-24 h-24 bg-gradient-to-br from-[#f2f3ff] to-white rounded-full flex items-center justify-center shadow-xl">
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-red-400/20 rounded-full blur-xl absolute inset-0"></div>
//                       <AlertCircle className="w-12 h-12 text-[#002045] relative z-10" />
//                     </div>
//                   </div>
//                   <h3 className="text-2xl sm:text-3xl font-manrope font-extrabold text-[#002045] tracking-tight">
//                     Data Origin Unverified
//                   </h3>
//                   <p className="text-sm sm:text-base font-inter font-medium text-[#43474e] max-w-lg mx-auto leading-relaxed">
//                     This subject object is isolated from the current shift
//                     environment. Secure randomization routines cannot engage
//                     until the global administrator maps this entity to the
//                     active registry.
//                   </p>
//                   <div className="flex items-center gap-3 bg-[#f2f3ff] px-5 py-3 rounded-xl">
//                     <Shield size={14} className="text-[#002045]" />
//                     <p className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-[#002045]">
//                       Administrator action pending
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
//                     <h3 className="text-2xl sm:text-3xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent tracking-tight">
//                       Entropy Sequences
//                     </h3>

//                     <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
//                       {details.rotationType === "manual_roll" &&
//                         currentStep <= details.noOfIteration &&
//                         !finalWinner &&
//                         !isTie && (
//                           <button
//                             onClick={() => startRandomization(currentStep)}
//                             disabled={isProcessing}
//                             className="px-6 py-3 bg-gradient-to-r from-[#1a365d] to-[#002045] hover:from-[#002045] hover:to-[#1a365d] text-white rounded-xl font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px] flex items-center gap-3 transition-all duration-300 shadow-md"
//                           >
//                             <Zap
//                               size={14}
//                               className={isProcessing ? "animate-pulse text-[#68dba9]" : ""}
//                             />
//                             {isProcessing
//                               ? `Running Block ${currentStep}...`
//                               : `Engage Block ${currentStep}`}
//                           </button>
//                         )}

//                       <div className="flex items-center gap-2 bg-[#f2f3ff] px-4 py-2 rounded-xl">
//                         <Shield size={12} className="text-[#002045]" />
//                         <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
//                           TLS Encrypted
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Iterations Timeline */}
//                   <div className="max-w-7xl space-y-5">
//                     {Array.from({ length: details.noOfIteration }).map((_, idx) => {
//                       const stepNum = idx + 1;
//                       const iteration = completedIterations.find(
//                         (it) => parseInt(it.id) === stepNum
//                       );
//                       const isProcessingThis = isProcessing && currentStep === stepNum;

//                       return (
//                         <div
//                           key={stepNum}
//                           className={`group relative flex items-center gap-6 p-5 rounded-xl transition-all duration-500 ${
//                             iteration
//                               ? "bg-gradient-to-r from-[#f2f3ff] to-white shadow-md"
//                               : isProcessingThis
//                               ? "bg-gradient-to-r from-[#002045] to-[#1a365d] text-white shadow-xl shadow-[#002045]/20 scale-[1.01]"
//                               : "bg-white/40 backdrop-blur-sm opacity-60 hover:opacity-80"
//                           }`}
//                         >
//                           {iteration && (
//                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#68dba9] to-[#68dba9]/40 rounded-l-xl"></div>
//                           )}

//                           <div
//                             className={`w-12 h-12 rounded-xl flex items-center justify-center font-manrope font-extrabold text-lg transition-all ${
//                               iteration
//                                 ? "bg-white text-[#002045] shadow-sm"
//                                 : isProcessingThis
//                                 ? "bg-[#1a365d] text-[#68dba9] shadow-lg"
//                                 : "bg-[#f2f3ff] text-[#43474e]"
//                             }`}
//                           >
//                             {isProcessingThis ? (
//                               <Radio size={18} className="animate-spin duration-[3000ms] text-[#68dba9]" />
//                             ) : (
//                               stepNum.toString().padStart(2, "0")
//                             )}
//                           </div>

//                           <div className="flex-1 flex flex-wrap justify-between items-center gap-4">
//                             {iteration ? (
//                               <>
//                                 <div>
//                                   <p className="text-[12px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest mb-2">
//                                     Block Processed
//                                   </p>
//                                   <div className="flex flex-wrap items-center gap-3 text-xs font-inter font-medium text-[#002045]">
//                                     <span className="flex items-center gap-1.5">
//                                       <Clock size={12} className="text-[#43474e]" />{" "}
//                                       {iteration.time}
//                                     </span>
//                                     <span className="text-[#43474e] hidden sm:inline">
//                                       &bull;
//                                     </span>
//                                     <span className="flex items-center gap-1.5">
//                                       <Fingerprint size={12} className="text-[#68dba9]" />{" "}
//                                       SHA-256 Auth
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div className="px-4 py-2 rounded-xl bg-white flex items-center gap-3 shadow-sm">
//                                   {details.configurationType === "colour" &&
//                                     iteration.descriptor && (
//                                       <div
//                                         className="w-4 h-4 rounded-full shadow-sm"
//                                         style={
//                                           iteration.descriptor.startsWith("#")
//                                             ? { backgroundColor: iteration.descriptor }
//                                             : {}
//                                         }
//                                       />
//                                     )}
//                                   {(details.configurationType === "alphabet" ||
//                                     details.configurationType === "numeric") && (
//                                     <span className="text-[#002045] font-manrope font-extrabold text-xs sm:text-sm">
//                                       {iteration.descriptor}
//                                     </span>
//                                   )}
//                                   <span className="text-[10px] sm:text-xs font-manrope font-extrabold uppercase tracking-widest text-[#002045]">
//                                     {iteration.set}
//                                   </span>
//                                 </div>
//                               </>
//                             ) : isProcessingThis ? (
//                               <>
//                                 <div>
//                                   <p className="text-[9px] font-manrope font-extrabold text-[#68dba9] uppercase tracking-widest mb-1">
//                                     Synthesizing Block {stepNum}
//                                   </p>
//                                   <p className="text-xs font-inter text-white/80">
//                                     Populating secure matrix buffers...
//                                   </p>
//                                 </div>
//                                 <div className="text-[9px] font-manrope font-extrabold text-[#68dba9] tracking-widest uppercase animate-pulse">
//                                   Running
//                                 </div>
//                               </>
//                             ) : (
//                               <>
//                                 <div>
//                                   <p className="text-[9px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest mb-1">
//                                     Queue Block {stepNum}
//                                   </p>
//                                   <p className="text-xs font-inter text-[#43474e]">
//                                     Awaiting execution parameters
//                                   </p>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Voting Results Section */}
//                   {completedIterations.length === details.noOfIteration && !isProcessing && (
//                     <div className="mt-12 pt-12 relative">
//                       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2f3ff] to-transparent"></div>

//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
//                             <BarChart3 className="text-[#002045]" size={20} />
//                           </div>
//                           <h4 className="text-2xl sm:text-3xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent">
//                             Statistical Convergence
//                           </h4>
//                         </div>
//                         {isTie && (
//                           <div className="px-4 py-2 bg-gradient-to-r from-[#faf8ff] to-white rounded-xl flex items-center gap-2 shadow-sm">
//                             <AlertCircle size={14} className="text-[#002045]" />
//                             <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
//                               Anomaly: Tie
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-col gap-2 mb-8">
//                         <div className="grid grid-cols-12 px-5 py-3 bg-gradient-to-r from-[#f2f3ff] to-white rounded-xl">
//                           <div className="col-span-8 text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest">
//                             Data Set
//                           </div>
//                           <div className="col-span-4 text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest text-right">
//                             Occurrences
//                           </div>
//                         </div>

//                         {Object.entries(votingMetrics).map(([set, count]) => {
//                           const descriptor = getDescriptor(
//                             parseInt(set),
//                             details.defaultConfiguration,
//                             details.configurationType
//                           );
//                           const isCandidate = candidates.includes(parseInt(set));

//                           return (
//                             <div
//                               key={set}
//                               className={`grid grid-cols-12 px-5 py-3 rounded-xl items-center transition-all ${
//                                 isCandidate
//                                   ? "bg-white shadow-md border border-[#68dba9]/20"
//                                   : "bg-white/40 backdrop-blur-sm opacity-70"
//                               }`}
//                             >
//                               <div className="col-span-8 flex items-center gap-3">
//                                 {details.configurationType === "colour" && descriptor && (
//                                   <div
//                                     className="w-3 h-3 rounded-full shadow-sm"
//                                     style={
//                                       descriptor.startsWith("#")
//                                         ? { backgroundColor: descriptor }
//                                         : {}
//                                     }
//                                   />
//                                 )}
//                                 <p className="text-xs sm:text-sm font-inter font-bold text-[#002045] uppercase tracking-wide">
//                                   Set {set.padStart(2, "0")}{" "}
//                                   {descriptor && `(${descriptor})`}
//                                 </p>
//                               </div>
//                               <div className="col-span-4 flex items-baseline justify-end gap-2 text-right">
//                                 <span className="text-lg sm:text-xl font-manrope font-bold text-[#002045]">
//                                   {count}
//                                 </span>
//                                 <span className="text-[9px] sm:text-[10px] font-manrope text-[#43474e]">
//                                   / {details.noOfIteration}
//                                 </span>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {isTie ? (
//                         <div className="bg-gradient-to-r from-[#f2f3ff] to-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
//                           <div>
//                             <p className="text-sm sm:text-base font-inter font-bold text-[#002045] mb-2">
//                               Symmetrical equilibrium between:{" "}
//                               {candidates
//                                 .map((c) => `Set ${c.toString().padStart(2, "0")}`)
//                                 .join(", ")}
//                             </p>
//                             <p className="text-xs sm:text-sm font-inter text-[#43474e]">
//                               Secondary cryptographic resolution protocol required.
//                             </p>
//                           </div>
//                           <button
//                             onClick={handleResolveTie}
//                             disabled={isResolvingTie || finalWinner !== null}
//                             className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#002045] to-[#1a365d] hover:from-[#1a365d] hover:to-[#002045] disabled:from-[#f2f3ff] disabled:to-[#f2f3ff] text-white disabled:text-[#43474e] rounded-xl font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[12px] flex items-center gap-3 transition-all duration-300 shadow-md disabled:shadow-none"
//                           >
//                             <Zap
//                               size={16}
//                               className={isResolvingTie ? "animate-pulse text-[#68dba9]" : ""}
//                             />
//                             {isResolvingTie ? "Resolving..." : "Engage Resolution"}
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="bg-gradient-to-r from-[#002045] to-[#1a365d] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-2xl">
//                           <div className="flex items-center gap-5">
//                             {details.configurationType?.toLowerCase() === "colour" &&
//                               finalWinner && (
//                                 <div
//                                   className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl shadow-lg"
//                                   style={(() => {
//                                     const d = getDescriptor(
//                                       finalWinner,
//                                       details.defaultConfiguration,
//                                       details.configurationType?.toLowerCase()
//                                     );
//                                     return d?.startsWith("#") ? { backgroundColor: d } : {};
//                                   })()}
//                                 />
//                               )}
//                             <div>
//                               <p className="text-[9px] sm:text-[11px] font-manrope font-extrabold uppercase tracking-[0.2em] text-[#68dba9] mb-2">
//                                 Algorithm Confirmed
//                               </p>
//                               <p className="text-xl sm:text-3xl font-manrope font-extrabold tracking-tight">
//                                 Set {finalWinner?.toString().padStart(2, "0")}
//                                 {finalWinner &&
//                                   ` (${getDescriptor(
//                                     finalWinner,
//                                     details.defaultConfiguration,
//                                     details.configurationType
//                                   )}) `}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="mt-4 sm:mt-0">
//                             <CheckCircle2 size={32} className="text-[#68dba9]" />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Tie Breaker Progress */}
//                   {isResolvingTie && (
//                     <div className="mt-8 p-6 bg-gradient-to-r from-[#1a365d] to-[#002045] rounded-2xl text-white shadow-2xl">
//                       <div className="relative z-10">
//                         <div className="flex items-center gap-3 mb-6">
//                           <div className="w-1 h-6 bg-[#68dba9] rounded-full"></div>
//                           <h4 className="text-xl sm:text-2xl font-manrope font-extrabold tracking-tight">
//                             Resolution Matrix
//                           </h4>
//                         </div>

//                         <div className="mb-6">
//                           <div className="flex justify-between items-center mb-2">
//                             <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold uppercase tracking-widest text-white/60">
//                               Cryptographic Decoupling
//                             </span>
//                             <span className="text-[10px] sm:text-[11px] font-manrope font-bold text-[#68dba9]">
//                               {Math.round(tieBreakerProgress)}%
//                             </span>
//                           </div>
//                           <div className="w-full h-1.5 bg-[#002045] rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-gradient-to-r from-[#68dba9] to-[#68dba9]/80 transition-all duration-300 shadow-[0_0_15px_rgba(104,219,169,0.5)]"
//                               style={{ width: `${tieBreakerProgress}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Fixed Footer Bar NO BORDER */}
//       <footer className=" ml-52 fixed bottom-0 left-0 right-0 h-16 bg-[#faf8ff]/90 backdrop-blur-[16px] flex items-center justify-between px-12 z-50">
//         <div className="flex items-center gap-12">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-[#68dba9] rounded-full shadow-[0_0_8px_rgba(104,219,169,0.8)]"></div>
//             <span className="text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
//               End-to-End Environment
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-[#68dba9] rounded-full shadow-[0_0_8px_rgba(104,219,169,0.8)]"></div>
//             <span className="text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
//               Global Telemetry Live
//             </span>
//           </div>
//         </div>
//         <div className="flex items-center gap-8 text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest">
//           <span>T-Zero: 142.22.11</span>
//           <div className="w-1.5 h-1.5 bg-[#f2f3ff] rounded-full"></div>
//           <span>Build 4.2.0-CURATOR</span>
//         </div>
//       </footer>
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Shield,
  Clock,
  BarChart3,
  BookOpen, 
  Clock1,
  Fingerprint,
  CheckCircle2, 
  AlertCircle, 
  Radio,
  Zap,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import Header from "../../../layouts/SelectorLayout/Header";
import {
  fetchAllocationData,
  performRandomization,
  resolveTie,
} from "../../../services/randomization.service"
export default function RandomizationInProgress() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [searchParams] = useSearchParams();

const subjectId = searchParams.get("subjectId");  
const shiftId = searchParams.get("shiftId");
const examId = searchParams.get("examId");

  const [details, setDetails] = useState<{
    subjectName: string;
    shiftName: string;
    examName: string;
    examBodyName: string;
    noOfIteration: number;
    rotationType: "manual_roll" | "automated_roll";
    configurationType: string;
    defaultConfiguration: any;
  }>({
    subjectName: "Loading Subject...",
    shiftName: "Loading Shift...",
    examName: "Loading Exam Data...",
    examBodyName: "National Certification Board",
    noOfIteration: 5,
    rotationType: "automated_roll",
    configurationType: "colour",
    defaultConfiguration: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedIterations, setCompletedIterations] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTie, setIsTie] = useState(false);
  const [candidates, setCandidates] = useState<number[]>([]);
  const [votingMetrics, setVotingMetrics] = useState<Record<number, number>>(
    {},
  );
  const [isResolvingTie, setIsResolvingTie] = useState(false);
  const [tieBreakerProgress, setTieBreakerProgress] = useState(0);
  const [finalWinner, setFinalWinner] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  // CONTROL REFS: For immediate stop functionality
  const abortControllerRef = useRef<AbortController | null>(null);
  const stopRequestedRef = useRef(false);

  useEffect(() => {
    return () => {
      // CLEANUP: Abort any pending requests on unmount
      abortControllerRef.current?.abort();
      stopRequestedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (examId) {
      fetchDetails();
    }
  }, [examId, subjectId, shiftId]);

  useEffect(() => {
    if (
      !loading &&
      isRegistered === true &&
      examId &&
      subjectId &&
      shiftId &&
      !isProcessing &&
      completedIterations.length === 0 &&
      details.rotationType === "automated_roll"
    ) {
      startRandomization();
    }
  }, [
    loading,
    isRegistered,
    examId,
    subjectId,
    shiftId,
    isProcessing,
    completedIterations.length,
    details.rotationType,
  ]);

  const fetchDetails = async () => {
    try {
      const data = await fetchAllocationData(
      examId!,
      subjectId!,
      shiftId!,
      navigate
    );

      console.log("Voting Results:", data.votingResults);

      const subject = data.subjects?.find(
        (s: any) => s.id.toString() === subjectId,
      );
      const shift = data.shifts?.find((s: any) => s.id.toString() === shiftId);

      const examConfig = data.exam;
      let parsedConfig = examConfig?.defaultConfiguration;
      if (typeof parsedConfig === "string") {
        try {
          parsedConfig = JSON.parse(parsedConfig);
        } catch (e) {}
      }

      setDetails({
        subjectName: subject?.subjectName || "Unknown Subject",
        shiftName: shift
          ? `${shift.startTime} - ${shift.endTime}`
          : "Unknown Shift",
        examName: examConfig?.examName || "National Medical Entrance",
        examBodyName:
          examConfig?.examBodyName || "National Certification Board",
        noOfIteration: examConfig?.noOfIteration || 5,
        rotationType: examConfig?.rotationType || "automated_roll",
        configurationType: (
          examConfig?.configurationType || "colour"
        ).toLowerCase(),
        defaultConfiguration: parsedConfig,
      });

      setIsRegistered(!!data.ssData);

      // RESUME EXISTING ITERATIONS
      if (data.currentIterations?.length > 0) {
        const formatted = data.currentIterations.map((it: any) => {
          const descriptor = getDescriptor(
            it.selectedSet,
            parsedConfig,
            (examConfig?.configurationType || "colour").toLowerCase(),
          );
          return {
            id: it.iterationCount.toString().padStart(2, "0"),
            time: new Date(it.ts).toLocaleTimeString("en-US", {
              timeZone: "Asia/Kolkata",
            }),
            set: descriptor
              ? `Set ${it.selectedSet.toString().padStart(2, "0")} (${descriptor})`
              : `Set ${it.selectedSet.toString().padStart(2, "0")}`,
            setNum: it.selectedSet,
            descriptor: descriptor,
            raw: it,
          };
        });
        setCompletedIterations(formatted);
        setCurrentStep(data.currentIterations.length + 1);

        // RESUME VOTING RESULTS IF AVAILABLE
        if (data.votingResults) {
          setVotingMetrics(data.votingResults.metrics || {});
          setIsTie(data.votingResults.isTie || false);
          setCandidates(data.votingResults.candidates || []);
          setFinalWinner(data.votingResults.finalWinner || null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch details", err);
    } finally {
      setLoading(false);
    }
  };

  const getDescriptor = (setNum: number, config: any, type: string) => {
    if (!config) return null;
    const idx = setNum - 1;
    let val: any = null;

    if (Array.isArray(config)) val = config[idx];
    else if (config[idx] !== undefined) val = config[idx];
    else if (config[setNum] !== undefined) val = config[setNum];
    else {
      const values = Object.values(config);
      val = values[idx] || null;
    }

    if (!val) return null;
    return val;
  };

  const startRandomization = async (targetIteration?: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // If starting full randomization (automated), clear previous if it's a fresh start
    if (!targetIteration && completedIterations.length === 0) {
      setCompletedIterations([]);
      setIsTie(false);
      setCandidates([]);
      setFinalWinner(null);
    }

    stopRequestedRef.current = false;

    // Initialize AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const result = await performRandomization(
  {
    subjectId: subjectId!,
    shiftId: shiftId!,
    examId: examId!,
    iterationIndex: targetIteration,
  },
  abortControllerRef.current?.signal,
  navigate
);

      if (result.error) throw new Error(result.error);

      // ALGORITHM: Staggered UI Simulation for iterations returned in this call
      for (let i = 0; i < result.iterations.length; i++) {
        if (stopRequestedRef.current) break;

        const iter = result.iterations[i];
        if (!targetIteration) setCurrentStep(iter.iterationNum);

        await new Promise((resolve) => setTimeout(resolve, 800));

        const descriptor = getDescriptor(
          iter.selectedSet,
          details.defaultConfiguration,
          details.configurationType,
        );

        setCompletedIterations((prev) => [
          ...prev,
          {
            id: iter.iterationNum.toString().padStart(2, "0"),
            time: iter.ts,
            set: descriptor
              ? `Set ${iter.selectedSet.toString().padStart(2, "0")} (${descriptor})`
              : `Set ${iter.selectedSet.toString().padStart(2, "0")}`,
            setNum: iter.selectedSet,
            descriptor: descriptor,
            raw: iter,
          },
        ]);
      }

      // If process finished (either full loop or last manual step)
      if (result.isComplete) {
        setIsTie(result.isTie);
        setCandidates(result.candidates);
        setVotingMetrics(result.metadata.votingMetrics);
        if (!result.isTie) {
          setFinalWinner(result.winner);
        }
      } else if (targetIteration) {
        // Manual mode, update to next step
        setCurrentStep(targetIteration + 1);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Randomization process aborted by user");
      } else {
        alert(err.message || "Randomization failed");
        console.error("Backend randomization failed", err);
      }
    } finally {
      setIsProcessing(false);
      // Auto-update step if full randomization finished
      if (!targetIteration && !stopRequestedRef.current) {
        setCurrentStep(details.noOfIteration + 1);
      }
    }
  };

  const handleStopProcess = () => {
    stopRequestedRef.current = true;
    abortControllerRef.current?.abort();
    setIsProcessing(false);
  };

  const handleResolveTie = async () => {
    if (isResolvingTie) return;
    setIsResolvingTie(true);
    setTieBreakerProgress(0);

    // Progress bar simulation for transparency
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setTieBreakerProgress(Math.min((currentStep / steps) * 100, 100));
      if (currentStep >= steps) clearInterval(progressInterval);
    }, interval);

    try {
      const result = await resolveTie(
  {
    subjectId: subjectId!,
    shiftId: shiftId!,
    candidates,
  },
  navigate
);
      console.log("Tie Resolve Result:", result);
      // Wait for progress bar to finish
      await new Promise((resolve) => setTimeout(resolve, duration));

      setFinalWinner(result.finalSet);
      // setFinalWinner(result.finalWinner);
    } catch (err) {
      console.error("Tie resolution failed", err);
    } finally {
      setIsResolvingTie(false);
    }
  };


  return (
    <div className=" h-screen w-full bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f3ff] text-[#43474e] font-inter selection:bg-[#68dba9]/20 selection:text-[#002045]">
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;800&display=swap'); .font-manrope { font-family: 'Manrope', sans-serif !important; } .font-inter { font-family: 'Inter', sans-serif !important; }`,
        }}
      />

      {/* Top Header Bar NO BORDER */}
      <Header />

      <main className="pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  {/* Page Title Section - Stacked vertically, no columns */}
  <div className="mb-12 px-4">
    <div className="max-w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#68dba9]/20 to-transparent flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#68dba9] rounded-full"></div>
        </div>
        <span className="text-[10px] font-manrope font-extrabold text-[#68dba9] uppercase tracking-widest">Secure Randomization Protocol</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent leading-[1.1] tracking-tight mb-4">
  
  {/* Exam Name */}
  <span className="block">
    {details.examName}
  </span>

  {/* Exam Body Name */}
  <span className="text-[#43474e] font-manrope block text-xl sm:text-2xl font-medium mt-1">
  {details.examBodyName
    ?.toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())}
</span>
</h1>
      
      {/* All elements in one row - flex row with wrap for responsive */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Subject Domain Card */}
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm">
          <div className="p-2.5 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
            <BookOpen size={18} className="text-[#002045]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-manrope font-extrabold uppercase tracking-widest text-[#43474e]">
              Subject Domain
            </span>
            <span className="text-sm font-inter font-bold text-[#002045]">
              {details.subjectName}
            </span>
          </div>
        </div>

        {/* Examination Shift Card */}
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm">
          <div className="p-2.5 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
            <Clock1 size={18} className="text-[#002045]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-manrope font-extrabold uppercase tracking-widest text-[#43474e]">
              Examination Shift
            </span>
            <span className="text-sm font-inter font-bold text-[#002045]">
              Shift: {details.shiftName}
            </span>
          </div>
        </div>

        {/* Selected Winner Badge - Only shown when finalWinner exists */}
        {finalWinner !== null && !isProcessing && (
          <div className="px-5 py-3 bg-gradient-to-r from-[#f2f3ff] to-white rounded-xl flex items-center gap-3 text-[#002045] font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px] shadow-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-[#68dba9] rounded-full blur-[2px] absolute inset-0"></div>
              <div className="w-2 h-2 bg-[#68dba9] rounded-full relative"></div>
            </div>
            {details.configurationType?.toLowerCase() === "colour" &&
              getDescriptor(
                finalWinner,
                details.defaultConfiguration,
                details.configurationType,
              ) && (
                <div
                  className="w-4 h-4 rounded-full shadow-md"
                  style={(() => {
                    const d = getDescriptor(
                      finalWinner,
                      details.defaultConfiguration,
                      details.configurationType,
                    );
                    return d?.startsWith("#")
                      ? { backgroundColor: d }
                      : {};
                  })()}
                />
              )}
            <span className="whitespace-nowrap">
              Selected: Set {finalWinner.toString().padStart(2, "0")}
              {getDescriptor(
                finalWinner,
                details.defaultConfiguration,
                details.configurationType,
              ) && details.configurationType !== "colour"
                ? ` (${getDescriptor(finalWinner, details.defaultConfiguration, details.configurationType)})`
                : ""}
            </span>
          </div>
        )}

        {/* Publish Button */}
        <button
          disabled={
            isProcessing ||
            completedIterations.length < details.noOfIteration ||
            (isTie && finalWinner === null)
          }
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#002045] to-[#1a365d] hover:from-[#1a365d] hover:to-[#002045] disabled:from-[#f2f3ff] disabled:to-[#f2f3ff] rounded-xl flex items-center gap-3 text-white disabled:text-[#43474e] font-manrope font-extrabold uppercase tracking-widest text-[11px] sm:text-[12px] shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300"
        >
          <Zap size={16} className="text-[#68dba9]" />
          Publish Final Document
        </button>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-8">
    {/* Left Column: Iterations Timeline */}
    <div className="col-span-1">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-8 shadow-2xl shadow-black/5 min-h-[600px] relative border border-slate-200">
        {isRegistered === false ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-[#f2f3ff] to-white rounded-full flex items-center justify-center shadow-xl">
              <div className="relative">
                <div className="w-12 h-12 bg-red-400/20 rounded-full blur-xl absolute inset-0"></div>
                <AlertCircle className="w-12 h-12 text-[#002045] relative z-10" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-manrope font-extrabold text-[#002045] tracking-tight">
              Data Origin Unverified
            </h3>
            <p className="text-sm sm:text-base font-inter font-medium text-[#43474e] max-w-lg mx-auto leading-relaxed">
              This subject object is isolated from the current shift
              environment. Secure randomization routines cannot engage
              until the global administrator maps this entity to the
              active registry.
            </p>
            <div className="flex items-center gap-3 bg-[#f2f3ff] px-5 py-3 rounded-xl">
              <Shield size={14} className="text-[#002045]" />
              <p className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-[#002045]">
                Administrator action pending
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <h3 className="text-2xl sm:text-3xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent tracking-tight">
                Entropy Sequences
              </h3>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                {details.rotationType === "manual_roll" &&
                  currentStep <= details.noOfIteration &&
                  !finalWinner &&
                  !isTie && (
                    <button
                      onClick={() => startRandomization(currentStep)}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-gradient-to-r from-[#1a365d] to-[#002045] hover:from-[#002045] hover:to-[#1a365d] text-white rounded-xl font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px] flex items-center gap-3 transition-all duration-300 shadow-md"
                    >
                      <Zap
                        size={14}
                        className={
                          isProcessing
                            ? "animate-pulse text-[#68dba9]"
                            : ""
                        }
                      />
                      {isProcessing
                        ? `Running Block ${currentStep}...`
                        : `Engage Block ${currentStep}`}
                    </button>
                  )}

                <div className="flex items-center gap-2 bg-[#f2f3ff] px-4 py-2 rounded-xl">
                  <Shield size={12} className="text-[#002045]" />
                  <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
                    TLS Encrypted
                  </span>
                </div>
              </div>
            </div>

            {/* Entropy Sequences Content  */}
            <div className="max-w-7xl space-y-5">
              {/* Dynamic Iterations Mapping - Enhanced Cards */}
              {Array.from({ length: details.noOfIteration }).map(
                (_, idx) => {
                  const stepNum = idx + 1;
                  const iteration = completedIterations.find(
                    (it) => parseInt(it.id) === stepNum,
                  );
                  const isProcessingThis =
                    isProcessing && currentStep === stepNum;

                  return (
                    <div
                      key={stepNum}
                      className={`group relative flex items-center gap-6 p-5 rounded-xl transition-all duration-500 ${
                        iteration 
                          ? "bg-gradient-to-r from-[#f2f3ff] to-white shadow-md" 
                          : isProcessingThis 
                            ? "bg-gradient-to-r from-[#002045] to-[#1a365d] text-white shadow-xl shadow-[#002045]/20 scale-[1.01]" 
                            : "bg-white/40 backdrop-blur-sm opacity-60 hover:opacity-80"
                      }`}
                    >
                      {/* Status indicator bar */}
                      {iteration && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#68dba9] to-[#68dba9]/40 rounded-l-xl"></div>
                      )}
                      
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-manrope font-extrabold text-lg transition-all ${
                          iteration 
                            ? "bg-white text-[#002045] shadow-sm" 
                            : isProcessingThis 
                              ? "bg-[#1a365d] text-[#68dba9] shadow-lg" 
                              : "bg-[#f2f3ff] text-[#43474e]"
                        }`}
                      >
                        {isProcessingThis ? (
                          <Radio
                            size={18}
                            className="animate-spin duration-[3000ms] text-[#68dba9]"
                          />
                        ) : (
                          stepNum.toString().padStart(2, "0")
                        )}
                      </div>

                      <div className="flex-1 flex flex-wrap justify-between items-center gap-4">
                        {iteration ? (
                          <>
                            <div>
                              <p className="text-[12px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest mb-2">
                                Block Processed
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs font-inter font-medium text-[#002045]">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-[#43474e]" />{" "}
                                  {iteration.time}
                                </span>
                                <span className="text-[#43474e] hidden sm:inline">
                                  &bull;
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Fingerprint size={12} className="text-[#68dba9]" />{" "}
                                  SHA-256 Auth
                                </span>
                              </div>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white flex items-center gap-3 shadow-sm">
                              {details.configurationType === "colour" &&
                                iteration.descriptor && (
                                  <div
                                    className="w-4 h-4 rounded-full shadow-sm"
                                    style={
                                      iteration.descriptor.startsWith("#")
                                        ? {
                                            backgroundColor:
                                              iteration.descriptor,
                                          }
                                        : {}
                                    }
                                  />
                                )}
                              {(details.configurationType ===
                                "alphabet" ||
                                details.configurationType ===
                                  "numeric") && (
                                <span className="text-[#002045] font-manrope font-extrabold text-xs sm:text-sm">
                                  {iteration.descriptor}
                                </span>
                              )}
                              <span className="text-[10px] sm:text-xs font-manrope font-extrabold uppercase tracking-widest text-[#002045]">
                                {iteration.set}
                              </span>
                            </div>
                          </>
                        ) : isProcessingThis ? (
                          <>
                            <div>
                              <p className="text-[9px] font-manrope font-extrabold text-[#68dba9] uppercase tracking-widest mb-1">
                                Synthesizing Block {stepNum}
                              </p>
                              <p className="text-xs font-inter text-white/80">
                                Populating secure matrix buffers...
                              </p>
                            </div>
                            <div className="text-[9px] font-manrope font-extrabold text-[#68dba9] tracking-widest uppercase animate-pulse">
                              Running
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-[9px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest mb-1">
                                Queue Block {stepNum}
                              </p>
                              <p className="text-xs font-inter text-[#43474e]">
                                Awaiting execution parameters
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* Majority Voting Results Section - Enhanced */}
            {completedIterations.length === details.noOfIteration &&
              !isProcessing && (
                <div className="mt-12 pt-12 relative">
                  {/* Sub-header background shift visually instead of line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2f3ff] to-transparent"></div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-[#f2f3ff] to-white rounded-xl shadow-sm">
                        <BarChart3 className="text-[#002045]" size={20} />
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-manrope font-extrabold bg-gradient-to-r from-[#002045] to-[#1a365d] bg-clip-text text-transparent">
                        Statistical Convergence
                      </h4>
                    </div>
                    {isTie && (
                      <div className="px-4 py-2 bg-gradient-to-r from-[#faf8ff] to-white rounded-xl flex items-center gap-2 shadow-sm">
                        <AlertCircle
                          size={14}
                          className="text-[#002045]"
                        />
                        <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
                          Anomaly: Tie
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-8">
                    {/* Table Header Look-alike without lines */}
                    <div className="grid grid-cols-12 px-5 py-3 bg-gradient-to-r from-[#f2f3ff] to-white rounded-xl">
                      <div className="col-span-8 text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest">
                        Data Set
                      </div>
                      <div className="col-span-4 text-[9px] sm:text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest text-right">
                        Occurrences
                      </div>
                    </div>

                    {Object.entries(votingMetrics).map(([set, count]) => {
                      const descriptor = getDescriptor(
                        parseInt(set),
                        details.defaultConfiguration,
                        details.configurationType,
                      );
                      const isCandidate = candidates.includes(
                        parseInt(set),
                      );

                      return (
                        <div
                          key={set}
                          className={`grid grid-cols-12 px-5 py-3 rounded-xl items-center transition-all ${
                            isCandidate 
                              ? "bg-white shadow-md border border-[#68dba9]/20" 
                              : "bg-white/40 backdrop-blur-sm opacity-70"
                          }`}
                        >
                          <div className="col-span-8 flex items-center gap-3">
                            {details.configurationType === "colour" &&
                              descriptor && (
                                <div
                                  className="w-3 h-3 rounded-full shadow-sm"
                                  style={
                                    descriptor.startsWith("#")
                                      ? { backgroundColor: descriptor }
                                      : {}
                                  }
                                />
                              )}
                            <p className="text-xs sm:text-sm font-inter font-bold text-[#002045] uppercase tracking-wide">
                              Set {set.padStart(2, "0")}{" "}
                              {descriptor && `(${descriptor})`}
                            </p>
                          </div>
                          <div className="col-span-4 flex items-baseline justify-end gap-2 text-right">
                            <span className="text-lg sm:text-xl font-manrope font-bold text-[#002045]">
                              {count}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-manrope text-[#43474e]">
                              / {details.noOfIteration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {isTie ? (
                    <div className="bg-gradient-to-r from-[#f2f3ff] to-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
                      <div>
                        <p className="text-sm sm:text-base font-inter font-bold text-[#002045] mb-2">
                          Symmetrical equilibrium between:{" "}
                          {candidates
                            .map((c) => {
                              return `Set ${c.toString().padStart(2, "0")}`;
                            })
                            .join(", ")}
                        </p>
                        <p className="text-xs sm:text-sm font-inter text-[#43474e]">
                          Secondary cryptographic resolution protocol
                          required.
                        </p>
                      </div>
                      <button
                        onClick={handleResolveTie}
                        disabled={isResolvingTie || finalWinner !== null}
                        className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#002045] to-[#1a365d] hover:from-[#1a365d] hover:to-[#002045] disabled:from-[#f2f3ff] disabled:to-[#f2f3ff] text-white disabled:text-[#43474e] rounded-xl font-manrope font-extrabold uppercase tracking-widest text-[10px] sm:text-[12px] flex items-center gap-3 transition-all duration-300 shadow-md disabled:shadow-none"
                      >
                        <Zap
                          size={16}
                          className={
                            isResolvingTie
                              ? "animate-pulse text-[#68dba9]"
                              : ""
                          }
                        />
                        {isResolvingTie
                          ? "Resolving..."
                          : "Engage Resolution"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-[#002045] to-[#1a365d] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-2xl">
                      <div className="flex items-center gap-5">
                        {details.configurationType?.toLowerCase() ===
                          "colour" &&
                          finalWinner && (
                            <div
                              className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl shadow-lg"
                              style={(() => {
                                const d = getDescriptor(
                                  finalWinner,
                                  details.defaultConfiguration,
                                  details.configurationType?.toLowerCase(),
                                );
                                return d?.startsWith("#")
                                  ? { backgroundColor: d }
                                  : {};
                              })()}
                            />
                          )}
                        <div>
                          <p className="text-[9px] sm:text-[11px] font-manrope font-extrabold uppercase tracking-[0.2em] text-[#68dba9] mb-2">
                            Algorithm Confirmed
                          </p>
                          <p className="text-xl sm:text-3xl font-manrope font-extrabold tracking-tight">
                            Set {finalWinner?.toString().padStart(2, "0")}
                            {finalWinner &&
                              ` (${getDescriptor(finalWinner, details.defaultConfiguration, details.configurationType)}) `}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <CheckCircle2
                          size={32}
                          className="text-[#68dba9]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Tie-Breaker Progress Section - Enhanced */}
            {isTie && (
              <div className="mt-8 p-6 bg-gradient-to-r from-[#1a365d] to-[#002045] rounded-2xl text-white shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-[#68dba9] rounded-full"></div>
                    <h4 className="text-xl sm:text-2xl font-manrope font-extrabold tracking-tight">
                      Resolution Matrix
                    </h4>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold uppercase tracking-widest text-white/60">
                        Cryptographic Decoupling
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-manrope font-bold text-[#68dba9]">
                        {Math.round(tieBreakerProgress)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#002045] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#68dba9] to-[#68dba9]/80 transition-all duration-300 shadow-[0_0_15px_rgba(104,219,169,0.5)]"
                        style={{ width: `${tieBreakerProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {finalWinner !== null && !isResolvingTie && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-[#002045]/50 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        {details.configurationType?.toLowerCase() ===
                          "colour" &&
                          finalWinner && (
                            <div
                              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg shadow-lg"
                              style={(() => {
                                const d = getDescriptor(
                                  finalWinner,
                                  details.defaultConfiguration,
                                  details.configurationType?.toLowerCase(),
                                );
                                return d?.startsWith("#")
                                  ? { backgroundColor: d }
                                  : {};
                              })()}
                            />
                          )}
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-manrope font-extrabold uppercase tracking-widest text-[#68dba9] mb-1">
                            Matrix Resolved
                          </p>
                          <p className="text-lg sm:text-2xl font-manrope font-extrabold tracking-tight">
                            Set {finalWinner.toString().padStart(2, "0")}
                            {` (${getDescriptor(finalWinner, details.defaultConfiguration, details.configurationType)}) `}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                        <Fingerprint
                          size={14}
                          className="text-[#68dba9]"
                        />
                        <span className="text-[8px] sm:text-[10px] font-manrope font-extrabold uppercase tracking-widest text-white">
                          Auditable Truth
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
</main>

      {/* Fixed Footer Bar NO BORDER */}
      <footer className=" ml-50 fixed bottom-0 left-0 right-0 h-16 bg-[#faf8ff]/90 backdrop-blur-[16px] flex items-center justify-between px-12 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#68dba9] rounded-full shadow-[0_0_8px_rgba(104,219,169,0.8)]"></div>
            <span className="text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
              End-to-End Environment
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#68dba9] rounded-full shadow-[0_0_8px_rgba(104,219,169,0.8)]"></div>
            <span className="text-[10px] font-manrope font-extrabold text-[#002045] uppercase tracking-widest">
              Global Telemetry Live
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-manrope font-extrabold text-[#43474e] uppercase tracking-widest">
          <span>T-Zero: 142.22.11</span>
          <div className="w-1.5 h-1.5 bg-[#f2f3ff] rounded-full"></div>
          <span>Build 4.2.0-CURATOR</span>
        </div>
      </footer>
    </div>
  );
}
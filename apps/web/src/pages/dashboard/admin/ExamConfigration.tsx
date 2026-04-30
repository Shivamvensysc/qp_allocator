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
  ChevronDown,
  Link2Off,
  Palette,
  Eraser,
  Dices,
  ChevronLeft,
} from "lucide-react";
import { fetchExamById, saveExam } from "../../../services/exam.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { useToast } from "../../../hooks/useToast";
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("id");

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [validationAttempted, setValidationAttempted] = useState(false);

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

  const resetFormState = () => {
    // Reset all form fields
    setExamName("");
    setRegulatoryBody("");
    setExamCode("");
    setAcademicYear("2025-26");
    setStartDate("");
    setEndDate("");
    setTotalSets(10);
    setCodingType("Alpha-Numeric");
    setSetColors({});
    setSetCodes({});
    setNoOfIteration(5);
    setRotationType("manual_roll");
    setReUsableSet("no");
    setShifts([]);
    setSubjects([]);
    setNewShift({
      date: "",
      startTime: "",
      endTime: "",
      type: "Morning",
    });
    setNewSubject({
      name: "",
      category: "General",
    });
    setIsShiftBoxOpen(false);
    setIsSubjectBoxOpen(false);
    setFormErrors({});
    setShiftErrors({
      date: "",
      startTime: "",
      endTime: "",
      timeRange: "",
    });
    setTouchedFields({
      date: false,
      startTime: false,
      endTime: false,
    });
    setTouchedFormFields({
      examName: false,
      regulatoryBody: false,
      examCode: false,
      startDate: false,
      endDate: false,
    });
    setValidationAttempted(false);
    setActiveStep(0);
  };

  const [isShiftBoxOpen, setIsShiftBoxOpen] = useState(false);
  const [isSubjectBoxOpen, setIsSubjectBoxOpen] = useState(false);

  // Form validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validation state for shift with touched tracking
  const [shiftErrors, setShiftErrors] = useState({
    date: "",
    startTime: "",
    endTime: "",
    timeRange: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    date: false,
    startTime: false,
    endTime: false,
  });

  // Track touched state for form fields
  const [touchedFormFields, setTouchedFormFields] = useState({
    examName: false,
    regulatoryBody: false,
    examCode: false,
    startDate: false,
    endDate: false,
  });

  // Function to validate a specific field
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "date":
        if (!value) {
          return "Date is required";
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if date is in the past
        if (selectedDate < today) {
          return "Date cannot be in the past";
        }
        
        // Check if date is within exam start and end dates
        if (startDate && endDate) {
          const examStartDate = new Date(startDate);
          const examEndDate = new Date(endDate);
          
          if (selectedDate < examStartDate) {
            return `Date must be on or after exam start date (${startDate})`;
          }
          
          if (selectedDate > examEndDate) {
            return `Date must be on or before exam end date (${endDate})`;
          }
        } else {
          return "Exam start date and end date must be set before adding shifts";
        }
        
        return "";

      case "startTime":
        if (!value) {
          return "Start time is required";
        }
        return "";

      case "endTime":
        if (!value) {
          return "End time is required";
        }
        return "";

      default:
        return "";
    }
  };

  // Function to validate time range
  const validateTimeRange = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      if (startTime >= endTime) {
        return "End time must be after start time";
      }

      // Check for overlapping shifts
      const isOverlapping = shifts.some((shift) => {
        if (shift.date !== newShift.date) return false;

        const existingStart = shift.startTime;
        const existingEnd = shift.endTime;
        const newStart = startTime;
        const newEnd = endTime;

        return newStart < existingEnd && newEnd > existingStart;
      });

      if (isOverlapping) {
        return "Time slot overlaps with existing shift";
      }
    }
    return "";
  };

  // Handle field blur
  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    let error = "";
    if (field === "date") {
      error = validateField("date", newShift.date);
    } else if (field === "startTime") {
      error = validateField("startTime", newShift.startTime);
    } else if (field === "endTime") {
      error = validateField("endTime", newShift.endTime);
    }

    setShiftErrors((prev) => ({ ...prev, [field]: error }));

    // Validate time range if both times are filled
    if (newShift.startTime && newShift.endTime) {
      const timeRangeError = validateTimeRange(
        newShift.startTime,
        newShift.endTime,
      );
      setShiftErrors((prev) => ({ ...prev, timeRange: timeRangeError }));
    }
  };

  // Handle field change
  const handleFieldChange = (field: string, value: string) => {
    setNewShift((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it was touched
    if (touchedFields[field as keyof typeof touchedFields]) {
      const error = validateField(field, value);
      setShiftErrors((prev) => ({ ...prev, [field]: error }));
    }

    // Revalidate time range if both times are filled
    if (field === "startTime" || field === "endTime") {
      const startTime = field === "startTime" ? value : newShift.startTime;
      const endTime = field === "endTime" ? value : newShift.endTime;

      if (startTime && endTime) {
        const timeRangeError = validateTimeRange(startTime, endTime);
        setShiftErrors((prev) => ({ ...prev, timeRange: timeRangeError }));
      } else {
        setShiftErrors((prev) => ({ ...prev, timeRange: "" }));
      }
    }
  };

  // Check if add button should be disabled
  const isAddShiftDisabled = () => {
    return (
      !newShift.date ||
      !newShift.startTime ||
      !newShift.endTime ||
      !!shiftErrors.date ||
      !!shiftErrors.startTime ||
      !!shiftErrors.endTime ||
      !!shiftErrors.timeRange
    );
  };

  // Revalidate shift date when exam dates change
  useEffect(() => {
    if (touchedFields.date && newShift.date) {
      const error = validateField("date", newShift.date);
      setShiftErrors((prev) => ({ ...prev, date: error }));
    }
  }, [startDate, endDate]);

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
              data.exam.startDate ? data.exam.startDate.split("T")[0] : "",
            );
            setEndDate(
              data.exam.endDate ? data.exam.endDate.split("T")[0] : "",
            );
            setNoOfIteration(data.exam.noOfIteration || 5);
            setCodingType(data.exam.configurationType || "Alpha-Numeric");
            setRotationType(data.exam.rotationType || "manual_roll");
            setReUsableSet(data.exam.reUsableSet || "no");

            let parsedConfig = data.exam.defaultConfiguration || {};

            if (typeof parsedConfig === "string") {
              try {
                parsedConfig = JSON.parse(parsedConfig);
              } catch {
                parsedConfig = {};
              }
            }

            if (data.exam.configurationType === "Colour") {
              setSetColors(parsedConfig);
            } else {
              setSetCodes(parsedConfig);
            }

            // Populate shifts
            const fetchedShifts = (data.shifts || []).map((s: any) => ({
              id: s.id,
              date: s.date ? s.date.split("T")[0] : "",
              startTime: s.startTime ? s.startTime.substring(0, 5) : "",
              endTime: s.endTime ? s.endTime.substring(0, 5) : "",
              type: s.type || "Morning",
            }));

            setShifts(fetchedShifts);

            // Populate subjects
            const fetchedSubjects = (data.subjects || []).map((sub: any) => {
              const mapping = sub.mappings && sub.mappings[0];

              const shiftIdx = mapping
                ? fetchedShifts.findIndex((fs: any) => fs.id === mapping.ssId)
                : null;

              return {
                subjectName: sub.subjectName,
                category: sub.category || "General",
                shiftIndex: shiftIdx === -1 ? null : shiftIdx,
              };
            });

            setSubjects(fetchedSubjects);

            if (data.subjects.length > 0) {
              setTotalSets(data.subjects[0].setCount);
            }
          }
        })
        .catch((err) => console.error("Error fetching exam:", err));
    } else {
      resetFormState();
    }
  }, [examId]);

  const handleAddShift = () => {
    // Mark all fields as touched
    setTouchedFields({
      date: true,
      startTime: true,
      endTime: true,
    });

    // Validate all fields
    const dateError = validateField("date", newShift.date);
    const startTimeError = validateField("startTime", newShift.startTime);
    const endTimeError = validateField("endTime", newShift.endTime);
    const timeRangeError = validateTimeRange(
      newShift.startTime,
      newShift.endTime,
    );

    setShiftErrors({
      date: dateError,
      startTime: startTimeError,
      endTime: endTimeError,
      timeRange: timeRangeError,
    });

    if (
      !dateError &&
      !startTimeError &&
      !endTimeError &&
      !timeRangeError &&
      newShift.date &&
      newShift.startTime &&
      newShift.endTime
    ) {
      setShifts([...shifts, { ...newShift }]);
      setNewShift({ date: "", startTime: "", endTime: "", type: "Morning" });
      setShiftErrors({ date: "", startTime: "", endTime: "", timeRange: "" });
      setTouchedFields({ date: false, startTime: false, endTime: false });
      setIsShiftBoxOpen(false);
    }
    toast.success("Shift created successfully!");
  };

  const handleDeleteShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
    setSubjects(
      subjects.map((sub) =>
        sub.shiftIndex === index ? { ...sub, shiftIndex: null } : sub,
      ),
    );

     toast.success("Shift deleted successfully!");
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
    toast.success(`${newSubject.name} subject added successfully!`);
  };

  const handleLinkSubject = (subIndex: number, shiftIndex: string) => {
    const updated = [...subjects];
    updated[subIndex].shiftIndex =
      shiftIndex === "none" ? null : parseInt(shiftIndex);
    setSubjects(updated);

    if (shiftIndex === "none") {
    toast.info("Subject unlinked from shift");
  } else {
    toast.success("Subject linked to shift successfully!");
  }
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

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (activeStep === 0) {
      // Validate Create Exam Event step
      if (!examName.trim()) newErrors.examName = "Exam Name is required";
      if (!regulatoryBody.trim())
        newErrors.regulatoryBody = "Regulatory Body is required";
      if (!examCode.trim()) newErrors.examCode = "Exam Code is required";
      
      // Add past date validation for start date
      if (!startDate) {
        newErrors.startDate = "Start Date is required";
      } else {
        const selectedStartDate = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedStartDate < today) {
          newErrors.startDate = "Start date cannot be in the past";
        }
      }
      
      if (!endDate) {
        newErrors.endDate = "End Date is required";
      } else if (startDate && endDate) {
        // Check if end date is after start date
        const selectedStartDate = new Date(startDate);
        const selectedEndDate = new Date(endDate);
        
        if (selectedEndDate < selectedStartDate) {
          newErrors.endDate = "End date must be on or after start date";
        }
      }

      if (codingType === "1") {
        newErrors.codingType = "Please select a Set Coding Type";
      } else {
        if (totalSets <= 0) {
          newErrors.totalSets = "Total Paper Sets must be greater than 0";
        }
      }

      if (noOfIteration <= 0) {
        newErrors.noOfIteration = "Randomization Cycles must be at least 1";
      }

      // Mark all form fields as touched if there are errors
      if (Object.keys(newErrors).length > 0) {
        setTouchedFormFields({
          examName: true,
          regulatoryBody: true,
          examCode: true,
          startDate: true,
          endDate: true,
        });
      }
    } else if (activeStep === 1) {
      // Validate Paper Set Sandbox step
      if (codingType !== "1" && totalSets > 0) {
        for (let i = 0; i < totalSets; i++) {
          if (codingType === "Colour") {
            if (!setColors[i]) {
              newErrors[`setColor_${i}`] =
                `Color for Set ${i + 1} is not assigned`;
            }
          } else {
            if (!setCodes[i] || !setCodes[i].trim()) {
              newErrors[`setCode_${i}`] =
                `Code for Set ${i + 1} is not assigned`;
            }
          }
        }
      }
    } else if (activeStep === 2) {
      // Validate Global Shift Configuration step
      if (shifts.length === 0) {
        newErrors.shifts = "At least one shift must be created";
      }
    } else if (activeStep === 3) {
      // Validate Subject & Shift Matrix step
      if (subjects.length === 0) {
        newErrors.subjects = "At least one subject must be registered";
      } else {
        const unlinkedSubjects = subjects.filter(
          (sub) => sub.shiftIndex === null,
        );
        if (unlinkedSubjects.length > 0) {
          newErrors.subjectMapping = `${unlinkedSubjects.length} subject(s) are not linked to any shift`;
        }
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFullForm = (status: "draft" | "publish") => {
    const newErrors: Record<string, string> = {};

    // Basic Info
    if (!examName.trim()) newErrors.examName = "Exam Name is required";
    if (!regulatoryBody.trim())
      newErrors.regulatoryBody = "Regulatory Body is required";
    if (!examCode.trim()) newErrors.examCode = "Exam Code is required";
    
    // Add past date validation for start date
    if (!startDate) {
      newErrors.startDate = "Start Date is required";
    } else {
      const selectedStartDate = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedStartDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }
    
    if (!endDate) {
      newErrors.endDate = "End Date is required";
    } else if (startDate && endDate) {
      // Check if end date is after start date
      const selectedStartDate = new Date(startDate);
      const selectedEndDate = new Date(endDate);
      
      if (selectedEndDate < selectedStartDate) {
        newErrors.endDate = "End date must be on or after start date";
      }
    }

    // Configuration
    if (codingType === "1") {
      newErrors.codingType = "Please select a Set Coding Type";
    } else {
      if (totalSets <= 0) {
        newErrors.totalSets = "Total Paper Sets must be greater than 0";
      } else {
        for (let i = 0; i < totalSets; i++) {
          if (codingType === "Colour") {
            if (!setColors[i]) {
              newErrors[`setColor_${i}`] =
                `Color for Set ${i + 1} is not assigned`;
            }
          } else {
            if (!setCodes[i] || !setCodes[i].trim()) {
              newErrors[`setCode_${i}`] =
                `Code for Set ${i + 1} is not assigned`;
            }
          }
        }
      }
    }

    if (noOfIteration <= 0) {
      newErrors.noOfIteration = "Randomization Cycles must be at least 1";
    }

    if (shifts.length === 0) {
      newErrors.shifts = "At least one shift must be created";
    }

    if (subjects.length === 0) {
      newErrors.subjects = "At least one subject must be registered";
    } else {
      const unlinkedSubjects = subjects.filter(
        (sub) => sub.shiftIndex === null,
      );
      if (unlinkedSubjects.length > 0) {
        newErrors.subjectMapping = `${unlinkedSubjects.length} subject(s) are not linked to any shift`;
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: "draft" | "publish") => {
    if (!validateFullForm(status)) return;

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
        defaultConfiguration: codingType === "Colour" ? setColors : setCodes,
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
      const data = await saveExam(payload, examId || undefined);

      alert(
        `Exam ${
          status === "publish" ? "published" : "saved as draft"
        } successfully!`,
      );

      navigate(`/admin/review_publish?id=${data.id}`);
    } catch (err: any) {
      console.error(err);

      alert(err?.response?.data?.error || "Failed to save exam");
    }
  };

  const handleFormFieldBlur = (field: string) => {
    setTouchedFormFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    setValidationAttempted(true);
    if (validateStep()) {
      setActiveStep((prev) => Math.min(prev + 1, 3));
      setValidationAttempted(false);
      setFormErrors({});
    }
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    setValidationAttempted(false);
    setFormErrors({});
  };

  const steps = [
    { id: 0, name: "Create Exam Event" },
    { id: 1, name: "Paper Set Sandbox" },
    { id: 2, name: "Global Shift Configuration" },
    { id: 3, name: "Subject & Shift Matrix" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-4xl">
            <h1 className="text-xl md:text-3xl font-bold text-[#14223E] tracking-tight leading-tight mb-1">
              Exam Configuration
            </h1>
            <p className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed">
              Define the structural parameters for your high-stakes evaluation
              events. Your inputs here will govern the entire allocation logic.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex flex-col w-full lg:w-auto">
            <div className="flex items-center justify-between bg-gray-200 border border-slate-400 rounded-xl px-4 md:px-4 py-3  shrink-0">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      setActiveStep(step.id);
                      setValidationAttempted(false);
                      setFormErrors({});
                    }}
                    className={`flex flex-col items-center transition-all cursor-pointer ${
                      activeStep === step.id
                        ? "opacity-100"
                        : "opacity-60 hover:opacity-80"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeStep === step.id
                          ? "bg-[#14223E] text-white"
                          : "bg-white text-slate-500 border border-slate-300"
                      }`}
                    >
                      {step.id + 1}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1 whitespace-nowrap">
                      {step.name}
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className="w-8 md:w-12 h-[2px] bg-slate-300 mx-1 md:mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Only show active step */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] mt-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Step 0: Create Exam Event */}
            {activeStep === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-4 md:p-5 lg:p-5 relative overflow-hidden">
                <div className="absolute top-6 right-6 md:right-8 opacity-5 hidden sm:block">
                  <CalendarDays className="w-24 h-24 md:w-32 md:h-32" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Create Exam Event
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 md:gap-y-4  relative z-10">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Exam Name
                    </label>
                    <input
                      className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all ${
                        (touchedFormFields.examName || validationAttempted) &&
                        formErrors.examName
                          ? "border-red-500"
                          : "border-slate-400"
                      }`}
                      placeholder="e.g., Annual Board Exams 2026"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      onBlur={() => handleFormFieldBlur("examName")}
                    />
                    {(touchedFormFields.examName || validationAttempted) &&
                      formErrors.examName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.examName}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Exam Code
                    </label>
                    <input
                      className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all ${
                        (touchedFormFields.examCode || validationAttempted) &&
                        formErrors.examCode
                          ? "border-red-500"
                          : "border-slate-400"
                      }`}
                      placeholder="e.g., EXAM-2026"
                      value={examCode}
                      onChange={(e) => setExamCode(e.target.value)}
                      onBlur={() => handleFormFieldBlur("examCode")}
                    />
                    {(touchedFormFields.examCode || validationAttempted) &&
                      formErrors.examCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.examCode}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Regulatory Body
                    </label>
                    <input
                      className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all ${
                        (touchedFormFields.regulatoryBody ||
                          validationAttempted) &&
                        formErrors.regulatoryBody
                          ? "border-red-500"
                          : "border-slate-400"
                      }`}
                      placeholder="e.g., Regulatory Body"
                      value={regulatoryBody}
                      onChange={(e) => setRegulatoryBody(e.target.value)}
                      onBlur={() => handleFormFieldBlur("regulatoryBody")}
                    />
                    {(touchedFormFields.regulatoryBody ||
                      validationAttempted) &&
                      formErrors.regulatoryBody && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.regulatoryBody}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Randomization Cycles
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all ${
                        formErrors.noOfIteration
                          ? "border-red-500"
                          : "border-slate-400"
                      }`}
                      value={noOfIteration}
                      onChange={(e) =>
                        setNoOfIteration(parseInt(e.target.value) || 4)
                      }
                    />
                    {formErrors.noOfIteration && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.noOfIteration}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
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
                        min={new Date().toISOString().split('T')[0]}
                        className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer transition-all ${
                          (touchedFormFields.startDate ||
                            validationAttempted) &&
                          formErrors.startDate
                            ? "border-red-500"
                            : "border-slate-400"
                        }`}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onBlur={() => handleFormFieldBlur("startDate")}
                      />
                      <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    {(touchedFormFields.startDate || validationAttempted) &&
                      formErrors.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.startDate}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-1.5">
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
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full cursor-pointer transition-all ${
                          (touchedFormFields.endDate || validationAttempted) &&
                          formErrors.endDate
                            ? "border-red-500"
                            : "border-slate-400"
                        }`}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        onBlur={() => handleFormFieldBlur("endDate")}
                      />
                      <CalendarDays className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    {(touchedFormFields.endDate || validationAttempted) &&
                      formErrors.endDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.endDate}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-1.5">
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

                  <div className="flex flex-col gap-1.5">
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
                </div>
              </div>
            )}

            {/* Step 1: Paper Set Sandbox */}
            {activeStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-4 md:p-6 lg:p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Paper Set Sandbox
                  </h2>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Set Coding Type
                    </label>
                    <div className="relative">
                      <select
                        value={codingType}
                        onChange={(e) => setCodingType(e.target.value)}
                        className={`bg-[#F8F9FA] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full appearance-none transition-all ${
                          formErrors.codingType
                            ? "border-red-500"
                            : "border-slate-400"
                        }`}
                      >
                        <option value="1">Select...</option>
                        <option value="Alpha-Numeric">Alpha-Numeric</option>
                        <option value="Colour">Colour</option>
                      </select>
                      <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    {formErrors.codingType && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.codingType}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Total Paper Sets
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={totalSets}
                      onChange={(e) =>
                        setTotalSets(parseInt(e.target.value) || 0)
                      }
                      className={`bg-[#F4F5F9] border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] text-slate-800 focus:ring-2 focus:ring-[#162A42] outline-none w-full transition-all ${
                        formErrors.totalSets
                          ? "border-red-500"
                          : "border-slate-400"
                      }`}
                    />
                    {formErrors.totalSets && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.totalSets}
                      </p>
                    )}
                  </div>
                </div>

                {(codingType === "Colour" || codingType === "Alpha-Numeric") &&
                  totalSets > 0 && (
                    <div className="bg-white p-4 md:p-6 lg:p-6 rounded-xl md:rounded-xl border border-slate-300 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-slate-50 rounded-full -mr-24 -mt-24 blur-3xl opacity-50"></div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 relative z-10">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Palette className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="text-base md:text-lg font-black text-[#14223E] tracking-tight">
                              Set Configuration
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
                          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-300">
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
                                <>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button className="w-full text-left focus:outline-none">
                                        <div
                                          className={`bg-slate-50/50 border rounded-xl p-3 md:p-4 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300 active:scale-[0.98] ${
                                            formErrors[`setColor_${idx}`]
                                              ? "border-red-500"
                                              : "border-slate-300"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-3 md:mb-4">
                                            <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-tighter uppercase">
                                              Set{" "}
                                              {String(idx + 1).padStart(2, "0")}
                                            </span>
                                            <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200">
                                              <Plus className="w-3 h-3" />
                                            </div>
                                          </div>

                                          <div className="relative">
                                            <div
                                              className="w-full h-10 md:h-12 rounded-lg shadow-inner border border-white transition-transform duration-500 group-hover/set:scale-[1.02]"
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
                                          if (formErrors[`setColor_${idx}`]) {
                                            setFormErrors((prev) => {
                                              const newErrors = { ...prev };
                                              delete newErrors[
                                                `setColor_${idx}`
                                              ];
                                              return newErrors;
                                            });
                                          }
                                        }}
                                        disableAlpha
                                      />
                                      <div className="p-3 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                                        <div className="grid grid-cols-6 gap-2">
                                          {PRESET_COLORS.slice(0, 12).map(
                                            (c) => (
                                              <button
                                                key={c}
                                                onClick={() => {
                                                  setSetColors((prev) => ({
                                                    ...prev,
                                                    [idx]: c,
                                                  }));
                                                  if (
                                                    formErrors[
                                                      `setColor_${idx}`
                                                    ]
                                                  ) {
                                                    setFormErrors((prev) => {
                                                      const newErrors = {
                                                        ...prev,
                                                      };
                                                      delete newErrors[
                                                        `setColor_${idx}`
                                                      ];
                                                      return newErrors;
                                                    });
                                                  }
                                                }}
                                                className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white shadow-sm hover:scale-125 transition-transform"
                                                style={{ backgroundColor: c }}
                                              />
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  {formErrors[`setColor_${idx}`] && (
                                    <p className="text-red-500 text-xs mt-1 text-center">
                                      {formErrors[`setColor_${idx}`]}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <div>
                                  <div
                                    className={`bg-slate-50/50 border rounded-xl p-3 hover:bg-white hover:shadow-xl transition-all duration-300 ${
                                      formErrors[`setCode_${idx}`]
                                        ? "border-red-500"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-tighter uppercase">
                                        Set {String(idx + 1).padStart(2, "0")}
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="CODE"
                                      value={setCodes[idx] || ""}
                                      onChange={(e) => {
                                        setSetCodes({
                                          ...setCodes,
                                          [idx]: e.target.value,
                                        });
                                        if (
                                          formErrors[`setCode_${idx}`] &&
                                          e.target.value.trim()
                                        ) {
                                          setFormErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors[`setCode_${idx}`];
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      className="bg-white border border-slate-300 rounded-lg px-2 py-2.5 text-[12px] md:text-[14px] font-black text-[#14223E] outline-none w-full text-center focus:ring-1 transition-all placeholder:text-slate-200 uppercase tracking-widest"
                                    />
                                  </div>
                                  {formErrors[`setCode_${idx}`] && (
                                    <p className="text-red-500 text-xs mt-1 text-center">
                                      {formErrors[`setCode_${idx}`]}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {codingType === "1" && (
                  <div className="text-center py-12 text-slate-400">
                    Please select a Set Coding Type in the Exam Event section
                    first
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Global Shift Configuration */}
            {activeStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-4 md:p-6 lg:p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">
                    Global Shift Configuration
                  </h2>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <h3 className="font-bold text-[#14223E] text-[14px] md:text-[15px]">
                      Shift Management
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

                  {formErrors.shifts && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-xs font-medium">
                        {formErrors.shifts}
                      </p>
                    </div>
                  )}

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
                            Date<span className="text-red-500">*</span>
                          </label>
                          <div
                            className="relative cursor-pointer"
                            onClick={(e) => {
                              const input =
                                e.currentTarget.querySelector("input");
                              if (input) (input as any).showPicker?.();
                            }}
                          >
                            <input
                              type="date"
                              min={startDate || new Date().toISOString().split('T')[0]}
                              max={endDate || undefined}
                              className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full cursor-pointer ${
                                touchedFields.date && shiftErrors.date
                                  ? "border-red-500"
                                  : "border-slate-200"
                              }`}
                              value={newShift.date}
                              onChange={(e) =>
                                handleFieldChange("date", e.target.value)
                              }
                              onBlur={() => handleFieldBlur("date")}
                            />
                          </div>
                          {touchedFields.date && shiftErrors.date && (
                            <p className="text-red-500 text-xs mt-1">
                              {shiftErrors.date}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Start Time<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full ${
                              touchedFields.startTime && shiftErrors.startTime
                                ? "border-red-500"
                                : "border-slate-200"
                            }`}
                            value={newShift.startTime}
                            onChange={(e) =>
                              handleFieldChange("startTime", e.target.value)
                            }
                            onBlur={() => handleFieldBlur("startTime")}
                          />
                          {touchedFields.startTime && shiftErrors.startTime && (
                            <p className="text-red-500 text-xs mt-1">
                              {shiftErrors.startTime}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            End Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            className={`bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full ${
                              touchedFields.endTime && shiftErrors.endTime
                                ? "border-red-500"
                                : "border-slate-200"
                            }`}
                            value={newShift.endTime}
                            onChange={(e) =>
                              handleFieldChange("endTime", e.target.value)
                            }
                            onBlur={() => handleFieldBlur("endTime")}
                          />
                          {touchedFields.endTime && shiftErrors.endTime && (
                            <p className="text-red-500 text-xs">
                              {shiftErrors.endTime}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Shift Type <span className="text-red-500">*</span>
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

                      {shiftErrors.timeRange &&
                        (touchedFields.startTime || touchedFields.endTime) && (
                          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-xs font-medium">
                              {shiftErrors.timeRange}
                            </p>
                          </div>
                        )}

                      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsShiftBoxOpen(false);
                            setShiftErrors({
                              date: "",
                              startTime: "",
                              endTime: "",
                              timeRange: "",
                            });
                            setTouchedFields({
                              date: false,
                              startTime: false,
                              endTime: false,
                            });
                          }}
                          className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2 w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddShift}
                          disabled={isAddShiftDisabled()}
                          className={`bg-[#1D324F] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition w-full sm:w-auto ${
                            isAddShiftDisabled()
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-[#14253B] cursor-pointer"
                          }`}
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
            )}

            {/* Step 3: Subject & Shift Matrix */}
            {activeStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-4 md:p-6 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  {/* LEFT SIDE (grouped) */}
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      Subject & Shift Matrix
                    </h2>
                  </div>

                  {/* RIGHT SIDE */}
                  {!isSubjectBoxOpen && (
                    <button
                      onClick={() => setIsSubjectBoxOpen(true)}
                      className="bg-[#142135] hover:bg-[#14253B] text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add New Subject
                    </button>
                  )}
                </div>

                {formErrors.subjects && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs font-medium">
                      {formErrors.subjects}
                    </p>
                  </div>
                )}

                {formErrors.subjectMapping && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs font-medium">
                      {formErrors.subjectMapping}
                    </p>
                  </div>
                )}

                {isSubjectBoxOpen && (
                  <div className="bg-[#F8F9FA] border border-slate-300 rounded-2xl p-4 md:p-5 shadow-sm transition-all mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 border border-slate-200 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-emerald-700" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Add New Subject
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          Subject Name
                        </label>
                        <input
                          className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                          placeholder="e.g., add new subject"
                          value={newSubject.name}
                          onChange={(e) =>
                            setNewSubject({
                              ...newSubject,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setIsSubjectBoxOpen(false)}
                        className="text-slate-600 border border-slate-300 rounded-lg hover:text-slate-800 text-xs font-bold px-4 py-2 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubject}
                        className="bg-[#0B1727] hover:bg-[#11213D] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition w-full sm:w-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Register Subject
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {subjects.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#F8F9FA] rounded-2xl p-4 md:p-6"
                    >
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
                                  sub.shiftIndex === null
                                    ? "none"
                                    : sub.shiftIndex
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
                            No shifts assigned to this subject yet. Select and
                            Link a pre-defined shift above.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Always visible */}
          <div className="space-y-6">
            {/* Curator's Pro-Tip Block */}
            <div className="bg-[#11213D] rounded-xl p-5 text-white relative overflow-hidden">
              <div className="absolute -bottom-0 right-2 opacity-10">
                <HelpCircle className="w-24 h-24 md:w-32 md:h-32" />
              </div>

              <h3 className="text-[14px] md:text-[15px] font-bold tracking-tight mb-3 relative z-10">
                Curator&apos;s Pro-Tip
              </h3>

              <ul className="space-y-2 relative z-10">
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Live Configuration Summary
              </h3>

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Total Subjects
                  </span>
                  <span className="text-xl font-bold text-[#14223E] leading-none">
                    {subjects.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Scheduled Shifts
                  </span>
                  <span className="text-xl font-bold text-[#14223E] leading-none">
                    {shifts.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] md:text-[14px] text-slate-600">
                    Unique Paper Sets
                  </span>
                  <span className="text-xl font-bold text-[#14223E] leading-none">
                    {totalSets.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-2 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition ${
              activeStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {activeStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition bg-[#14223E] text-white hover:bg-[#1D324F]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleSave("draft")}
                className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 transition-all text-slate-800 font-bold text-sm rounded-xl cursor-pointer"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave("publish")}
                className="px-8 py-2.5 bg-[#14223E] hover:bg-[#1D324F] transition-all text-white font-bold text-sm rounded-xl shadow-lg shadow-[#14223E]/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                Save & Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
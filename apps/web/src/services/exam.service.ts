import axios from "./axios";

export interface Exam {
  id: number;
  examName: string;
  examBodyName: string;
  startDate: string;
  endDate: string;
  noOfIteration: number;
  configurationType: string;
  rotationType: string;
  reUsableSet: string;
  status?: string;
}

export interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface Mapping {
  ssId: number;
}

export interface Subject {
  subjectName: string;
  category: string;
  setCount: number;
  mappings: Mapping[];
}

export interface ExamData {
  exam: Exam;
  shifts: Shift[];
  subjects: Subject[];
}

export interface ExamPayload {
  exam: any;
  shifts: any[];
  subjects: any[];
}

export const fetchExams = async () => {
  const res = await axios.get("/api/exams");
  return res.data;
};

export const updateExamBody = async (examId: number, newName: string) => {
  const response = await axios.put(`/api/exams/${examId}`, {
    exam: { examBodyName: newName },
    shifts: [],
    subjects: [],
  });

  return response.data;
};

export const fetchExamById = async (examId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`/api/exams/${examId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateExamStatus = async (examId: string, status: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `/api/exams/${examId}/status`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Save or Update Exam (POST / PUT)
export const saveExam = async (payload: ExamPayload, examId?: string) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  let response;

  if (examId) {
    response = await axios.put(`/api/exams/${examId}`, payload, config);
  } else {
    response = await axios.post(`/api/exams`, payload, config);
  }

  return response.data;
};

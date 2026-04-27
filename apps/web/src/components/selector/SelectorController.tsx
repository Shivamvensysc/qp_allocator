import React, { useState, useEffect } from "react";

import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";

import Header from "../../layouts/SelectorLayout/Header";

import { fetchExams, updateExamBody } from "../../services/exam.service";

import { useAuth } from "../../hooks/useAuth";

/* =========================
   Interfaces
========================= */

interface Exam {
  id: number;
  examName: string;
  examBodyName: string;
}

const SelectorController: React.FC = () => {
  const { user } = useAuth();

  /* =========================
     State
  ========================= */

  const [allExams, setAllExams] = useState<Exam[]>([]);

  const [activeExamId, setActiveExamId] = useState<number | null>(null);

  const [activeExamName, setActiveExamName] = useState<string>("");

  const [activeExamBody, setActiveExamBody] = useState<string>("");

  /* =========================
     Load Exams
  ========================= */

  useEffect(() => {
    fetchAllExams();

    if (user?.examId) {
      setActiveExamId(user.examId);

      setActiveExamName(user.examName || "");

      setActiveExamBody(user.examBodyName || "National Certification Board");
    }
  }, [user]);

  /* =========================
     Fetch All Exams
  ========================= */

  const fetchAllExams = async (): Promise<void> => {
    try {
      const data = await fetchExams();

      setAllExams(data.exams || []);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    }
  };

  /* =========================
     Update Exam Body
  ========================= */

  const handleUpdateExamBody = async (newName: string): Promise<void> => {
    if (!activeExamId) return;

    try {
      await updateExamBody(activeExamId, newName);

      setActiveExamBody(newName);
    } catch (err) {
      console.error("Error updating exam body:", err);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        {/* Header */}

        <Header />

        {/* Main Content */}

        <div className="flex flex-1">
          <MainContent
            activeExamId={activeExamId}
            activeExamName={activeExamName}
            activeExamBody={activeExamBody}
            allExams={allExams}
            onUpdateExamBody={handleUpdateExamBody}
          />

          <RightSidebar
            activeExamName={activeExamName}
            activeExamId={activeExamId}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectorController;

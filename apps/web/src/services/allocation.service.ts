import axiosInstance from "./axios";

export const getExamData =
  async (examId: number) => {
    const response =
      await axiosInstance.get(
        `/api/allocations/data?examId=${examId}`
      );

    return response.data;
  };


export const randomizeAllocation =
  async (
    subjectId: string,
    shiftId: number
  ) => {
    const response =
      await axiosInstance.post(
        "/api/allocations/randomize",
        {
          subjectId,
          shiftId,
        }
      );

    return response.data;
  };

export const getHistory =
  async (examId?: number) => {
    const url = examId
      ? `/api/allocations/history?examId=${examId}`
      : "/api/allocations/history";

    const response =
      await axiosInstance.get(url);

    return response.data;
  };
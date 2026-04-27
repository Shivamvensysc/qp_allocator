export interface UserProfile {
  id: number;
  username: string;
  type: "admin" | "selector";

  examId?: number;
  examName?: string;
  examBodyName?: string;
  mobileNumber?: string;
}
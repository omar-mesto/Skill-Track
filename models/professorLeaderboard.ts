export interface ProfessorInfo {
  _id: string;
  name: string;
  avatar: string | null;
  email?: string;
  role: string;
}

export interface LeaderboardItem {
  _id: string;
  professor: ProfessorInfo;
  commentsCount: number;
  evaluationsCount: number;
  postsCount: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LeaderboardResponse {
  success: boolean;
  message: string;
  data: LeaderboardItem[];
}

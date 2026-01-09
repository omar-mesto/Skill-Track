export interface StudentLeaderboardItem {
  _id: string
  student: {
    _id: string
    email: string
    avatar: string | null
  }
  totalPoints: number
  createdAt: string
  updatedAt: string
}

export interface CompanyModel {
  _id: string
  name: string
  email: string
}

export interface TaskModel {
  _id: string
  title: string
  description: string
  skills: string[]
  basePoints: number
  startAt: string
  endAt: string
  durationMinutes: number
  language: string
  referenceSolution: string
  maxAttempts: number
  aiEnabled: boolean
  isActive: boolean
  company: CompanyModel
  createdAt: string
  updatedAt: string
}

export interface SubmissionModel {
  _id: string
  task: {
    _id: string
    title: string
    description: string
  }
  student: string
  attemptNumber: number
  codeAnswer: string
  similarityScore: number
  aiScore: number
  aiFeedback: string
  aiHint: string
  languageMatch: boolean
  isCorrect: boolean
  finalPoints: number
  rank: number | null
  usedHints: boolean
  hintsCount: number
  timeTakenSeconds: number | null
  addToPortfolio: boolean
  status: 'evaluated'
  createdAt: string
  updatedAt: string
}

export interface SimpleResponse {
  success: boolean
  message: string
}

export interface CreateTaskPayload {
  title: string
  description: string
  referenceSolution: string
  startAt: string
  endAt: string
  language?: string
}

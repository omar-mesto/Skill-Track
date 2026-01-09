export interface SubmissionModel {
  _id: string
  task: {
    _id: string
    title: string
  }
  student: string
  attemptNumber: number
  codeAnswer: string
  similarityScore: number
  aiScore: number
  aiFeedback: string
  aiHint: string
  isCorrect: boolean
  finalPoints: number
  usedHints: boolean
  hintsCount: number
  status: 'evaluated'
  createdAt: string
}

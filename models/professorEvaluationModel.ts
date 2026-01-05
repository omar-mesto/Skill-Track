export interface ProfessorEvaluationModel {
  success: boolean
  message: string
  data: ProfessorEvaluationItem[]
}

export interface AIEvaluationModel {
  overall_score: number
  level: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  role_fit: {
    position: string
    fit_score: number
    missing_skills: string[]
  }
}

export type ProfessorEvaluationItem = {
  competencies: Record<string, number>
  _id: string
  student: string
  professor: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  overallComment: string
  totalScore: number
}

export interface StoredAIEvaluation {
  userId: string
  evaluation: AIEvaluationModel

}

export interface EvaluatePayload {
  student: string
  competencies: {
    technicalCompetency: number
    practicalCompetency: number
    problemSolving: number
    analyticalThinking: number
    communicationDocumentation: number
  }
  overallComment: string
}

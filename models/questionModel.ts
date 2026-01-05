export type ReactionType = 'wise' | 'loved' | 'support' | 'applause' | 'like' | 'opps'

export interface QuestionCounters {
  comments: number
  reports: number
}

export interface AuthorRef {
  _id: string
  role: 'student' | 'professor' | 'company' | 'admin'
  avatar: string
  name: string
  email: string
}

export interface QuestionModel {
  _id: string
  authorId: AuthorRef
  authorRole: string
  title: string
  content: string
  tags: string[]
  linkUrl: string | null
  imageUrl: string | null
  isSolved: boolean
  solutionCommentId: string | null
  deletedAt: string | null
  counters: QuestionCounters
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GetQuestionsResponse {
  success: boolean
  message: string
  data: {
    data: QuestionModel[]
    pagination: Pagination
  }
}

export interface GetQuestionDetailResponse {
  success: boolean
  message: string
  data: {
    question: QuestionModel
    tags: string[]
    comments: CommentModel[]
    reactions: {
      questionReactions: number
      commentReactions: number
    }
  }
}

export interface CommentCounters {
  reactions: number
  replies: number
}

export interface CommentAcceptedBy {
  author: boolean
  professor: boolean
}

export interface CommentModel {
  _id: string
  targetId: string
  targetType: 'question'
  authorId: AuthorRef
  parentCommentId: string | null
  content: string
  acceptedBy: CommentAcceptedBy
  deletedAt: string | null
  counters: CommentCounters
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionResponse {
  success: boolean
  message: string
  data: QuestionModel
}

export interface SimpleResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

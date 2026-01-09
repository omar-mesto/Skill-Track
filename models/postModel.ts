export type ReactionType = 'like' | 'loved' | 'applause' | 'wise' | 'support' | 'opps'

export interface AuthorRef {
  _id: string
  role: 'student' | 'professor' | 'company' | 'admin'
  avatar?: string
  name?: string
  email?: string
}

export interface PostCounters {
  comments: number
  reactions: number
  reports: number
}

export interface PostModel {
  _id: string
  authorId: AuthorRef
  authorRole: string
  title: string
  content: string
  imageUrl: string | null
  linkUrl: string | null
  deletedAt: string | null
  counters: PostCounters
  createdAt: string
  updatedAt: string

  reactions?: Partial<Record<ReactionType, number>>
  myReaction?: ReactionType | null
}

export interface PostCommentModel {
  _id: string
  postId: string
  authorId: AuthorRef
  content: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GetPostsResponse {
  success: boolean
  message: string
  data: {
    data: PostModel[]
    pagination: Pagination
  }
}

export interface GetPostDetailResponse {
  success: boolean
  message: string
  data: {
    post: PostModel
    comments: PostCommentModel[]
  }
}

export interface SimpleResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

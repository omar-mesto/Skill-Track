import type { ReactionType } from '~/models/questionModel'

export type ReactionTargetType = 'question' | 'comment' | 'post'

export interface ReactionUserRef {
  _id: string
  role?: string
}

export interface ReactionModel {
  _id?: string
  id?: string

  userId: ReactionUserRef | string
  targetId: string
  targetType: ReactionTargetType
  type: ReactionType

  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface ReactionListResponse {
  success: boolean
  message: string
  data: ReactionModel[]
}

export interface ReactionCountResponse {
  success: boolean
  message: string
  data: { count: number }
}

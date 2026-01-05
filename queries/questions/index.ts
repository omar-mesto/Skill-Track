import { useAPI } from '@@/services/baseApi'
import type { CreateQuestionResponse, GetQuestionsResponse, GetQuestionDetailResponse, SimpleResponse, ReactionType } from '~/models/questionModel'

export const useCreateQuestion = (payload: FormData) => {
  return useAPI<CreateQuestionResponse>({
    url: '/question/create',
    type: 'POST',
    payload,
    queryKey: 'create-question',
  })
}

export const useGetQuestions = (page: number, limit: number) => {
  return useAPI<GetQuestionsResponse>({
    url: `/question/list?page=${page}&limit=${limit}`,
    type: 'GET',
    queryKey: `questions-${page}-${limit}`,
  })
}

export const useGetMyQuestions = (page: number, limit: number) => {
  return useAPI<GetQuestionsResponse>({
    url: `/question/my-questions?page=${page}&limit=${limit}`,
    type: 'GET',
    queryKey: `questions-${page}-${limit}`,
  })
}

export const useGetQuestionDetail = (id: string) => {
  return useAPI<GetQuestionDetailResponse>({
    url: `/question/detail/${id}`,
    type: 'GET',
    queryKey: `question-${id}`,
  })
}

export const useDeleteQuestion = (id: string) => {
  return useAPI<SimpleResponse>({
    url: `/question/delete/${id}`,
    type: 'DELETE',
    queryKey: `delete-question-${id}`,
  })
}

export const useAddComment = (targetType: 'question', targetId: string, payload: { content: string; parentCommentId: string | null }) => {
  return useAPI<SimpleResponse>({
    url: `/comments/add/${targetType}/${targetId}`,
    type: 'POST',
    payload,
    queryKey: `add-comment-${targetType}-${targetId}`,
  })
}

export const useDeleteComment = (commentId: string) => {
  return useAPI<SimpleResponse>({
    url: `/comments/delete/${commentId}`,
    type: 'DELETE',
    queryKey: `delete-comment-${commentId}`,
  })
}

export const useMarkSolution = (commentId: string, checked: boolean) => {
  return useAPI<SimpleResponse>({
    url: `/comments/markSolution/${commentId}`,
    type: 'PUT',
    payload: { checked },
    queryKey: `mark-solution-${commentId}`,
  })
}

export const useAddReaction = (targetType: 'question' | 'comment', targetId: string, type: ReactionType) => {
  return useAPI<SimpleResponse>({
    url: `/reactions/add/${targetType}/${targetId}`,
    type: 'POST',
    payload: { type },
    queryKey: `reaction-add-${targetType}-${targetId}`,
  })
}

export const useDeleteReaction = (targetType: 'question' | 'comment', targetId: string) => {
  return useAPI<SimpleResponse>({
    url: `/reactions/delete/${targetType}/${targetId}`,
    type: 'DELETE',
    queryKey: `reaction-del-${targetType}-${targetId}`,
  })
}

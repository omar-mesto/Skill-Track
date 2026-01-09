import { useAPI } from '@@/services/baseApi'
import type { GetPostsResponse, GetPostDetailResponse, SimpleResponse } from '~/models/postModel'

export const useCreatePost = (payload: FormData) => {
  return useAPI({
    url: '/post/create',
    type: 'POST',
    payload,
    queryKey: 'create-post',
  })
}

export const useGetPosts = (page: number, limit: number) => {
  return useAPI<GetPostsResponse>({
    url: `/post/getPosts?page=${page}&limit=${limit}`,
    type: 'GET',
    queryKey: `posts-${page}-${limit}`,
  })
}

export const useGetPostDetail = (id: string) => {
  return useAPI<GetPostDetailResponse>({
    url: `/post/getPostDetail/${id}`,
    type: 'GET',
    queryKey: `post-${id}`,
  })
}

export const useUpdatePost = (id: string, payload: any) => {
  return useAPI({
    url: `/post/updatePost/${id}`,
    type: 'PUT',
    payload,
    queryKey: `update-post-${id}`,
  })
}

export const useDeletePost = (id: string) => {
  return useAPI<SimpleResponse>({
    url: `/post/deletePost/${id}`,
    type: 'DELETE',
    queryKey: `delete-post-${id}`,
  })
}

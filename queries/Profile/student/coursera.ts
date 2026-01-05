import { useAPI } from '@@/services/baseApi'
import type {
  CourseraResponse,
  GetCourseraResponse,
  VerifyCourseraDto,
} from '@@/models/courseraModel'

export const useVerifyCoursera = (payload: VerifyCourseraDto) => {
  return useAPI<CourseraResponse>({
    url: '/coursera/verify',
    type: 'POST',
    payload,
    queryKey: 'coursera',
  })
}

export const useGetMyCoursera = () => {
  return useAPI<GetCourseraResponse>({
    url: '/coursera/my-certificates',
    type: 'GET',
    queryKey: 'coursera',
  })
}

export const useDeleteCoursera = (id: string) => {
  return useAPI({
    url: `/profile/delete/CourseLink/${id}`,
    type: 'DELETE',
    queryKey: 'coursera',
  })
}

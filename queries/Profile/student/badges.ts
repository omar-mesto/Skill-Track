import { useAPI } from '@@/services/baseApi'
import type { GetBadgesResponse } from '~/models/badgesModel'

export const useGetBadges = () => {
  return useAPI<GetBadgesResponse>({
    url: '/badges/myBadges',
    type: 'GET',
    queryKey: 'badges',
  })
}

import { useQuery } from '@tanstack/react-query'
import { coursesHttp } from '@/utils/http'

export const useBundle = () => {
  const useGetActiveBundleById = (id: string) =>
    useQuery({
      queryKey: ['bundle', id],
      queryFn: async () => {
        const resp = await coursesHttp.get(`/bundles/active/${id}`)
        return resp.data
      },
      enabled: !!id,
    })

  return { useGetActiveBundleById }
}

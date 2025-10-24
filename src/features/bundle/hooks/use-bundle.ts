import { useQuery } from '@tanstack/react-query'
import { paymentsHttp } from '@/utils/http'

export const useBundle = () => {
  const useGetBundleById = (id: string) =>
    useQuery({
      queryKey: ['bundle', id],
      queryFn: async () => {
        const resp = await paymentsHttp.get(`/bundles/${id}`)
        return resp.data
      },
      enabled: !!id,
    })

  return { useGetBundleById }
}

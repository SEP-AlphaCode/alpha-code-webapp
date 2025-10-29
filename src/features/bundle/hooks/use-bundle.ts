import { useQuery } from '@tanstack/react-query'
import { getActiveBundleById } from '../api/bundle-api'

export const useBundle = () => {
  const useGetActiveBundleById = (id: string) =>
    useQuery({
      queryKey: ['bundle', id],
      queryFn: () => getActiveBundleById(id),
      enabled: !!id,
    })

  return { useGetActiveBundleById }
}

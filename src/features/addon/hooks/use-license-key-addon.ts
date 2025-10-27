import { ValidateAddon } from "@/types/addon"
import { useQuery } from "@tanstack/react-query"
import { validateAddonApi } from "../api/license-key-addon-api"

export const useAddonAccess = () => {
  const useValidateAccess = (payload: ValidateAddon) =>
    useQuery({
      queryKey: ['validate-access', payload],
      queryFn: () => validateAddonApi(payload),
      enabled:
        !!payload?.sessionKey && !!payload?.accountId && !!payload?.category,
      staleTime: 0,
      gcTime: 0,
    })

  return { useValidateAccess }
}

import { ValidateAddon } from "@/types/addon"
import { useQuery } from "@tanstack/react-query"
import { validateAddonApi } from "../api/license-key-addon-api"

export const useAddonAccess = () => {
  const useValidateAccess = (payload: ValidateAddon) => {
    // Make category/accountId optional for the enabled check — allow validation when `key` is present.
    // Some flows only have a session key and backend can validate based on key alone.
    const enabled = payload?.key != null;
    // Dev log to help debugging when the query is skipped
    // eslint-disable-next-line no-console
    console.log('useValidateAccess: enabled', { enabled, key: payload?.key, accountId: payload?.accountId, category: payload?.category });

    return useQuery({
      queryKey: ['validate-access', payload?.key, payload?.accountId, payload?.category],
      queryFn: () => validateAddonApi(payload),
      enabled,
      staleTime: 0,
      gcTime: 0,
    })
  }

  return { useValidateAccess }
}

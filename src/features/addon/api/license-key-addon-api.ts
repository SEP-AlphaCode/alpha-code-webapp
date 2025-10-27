import { ValidateAddon } from "@/types/addon"
import { paymentsHttp } from "@/utils/http"

export const validateAddonApi = async (payload: ValidateAddon): Promise<boolean> => {
  const res = await paymentsHttp.post('/license-key-addons/validate', payload)
  return !!res.data?.allowed
}
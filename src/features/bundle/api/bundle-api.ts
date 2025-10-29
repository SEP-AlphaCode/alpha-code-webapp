import { coursesHttp } from "@/utils/http"


export const getActiveBundleById = async (id: string) => {
  const resp = await coursesHttp.get(`/bundles/active/${id}`)
  return resp.data
}
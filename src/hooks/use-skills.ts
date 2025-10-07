
import { useQuery } from "@tanstack/react-query";
// TODO: Move this to '@/utils/http' and implement real API call
async function fetchSkills({ page, pageSize, search }: { page: number; pageSize: number; search: string }) {
  // Replace with your actual API endpoint
  return {
    data: [],
    total_pages: 1,
  };
}

export function useSkills(page: number, pageSize: number, search: string) {
  return useQuery({
    queryKey: ["skills", page, pageSize, search],
    queryFn: () => fetchSkills({ page, pageSize, search }),
  });
}

// Example fetchSkills implementation (adjust as needed):
// export async function fetchSkills({ page, pageSize, search }) {
//   const response = await fetch(`/api/skills?page=${page}&page_size=${pageSize}&search=${search}`);
//   if (!response.ok) throw new Error("Failed to fetch skills");
//   return response.json();
// }

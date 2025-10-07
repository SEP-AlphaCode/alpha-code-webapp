import { Skill } from "@/types/skill";

// Example API call for paged skills
export async function getPagedSkills(page: number, size: number, search: string, signal?: AbortSignal) {
  // Replace with your real API endpoint
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    search,
  });
  const res = await fetch(`/api/skills?${params.toString()}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
}

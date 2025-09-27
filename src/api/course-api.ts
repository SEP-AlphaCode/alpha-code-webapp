import { Category, Course } from "@/types/courses";
import { categories, courses } from "@/types/mock-course";
import { PagedResult } from "@/types/page-result";

export const getCategories = async (): Promise<PagedResult<Category>> => {
  return {
    data: categories,
    has_next: false,
    has_previous: false,
    page: 1,
    per_page: 10,
    total_count: 10,
    total_pages: 1
  }
}

export const getCourses = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  // Handle abort signal
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }

  // Filter courses by search term if provided
  let filteredCourses = courses;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.slug.toLowerCase().includes(searchLower) ||
      course.categoryId.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination values
  const totalCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCount / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  // Get paginated slice
  const sliced = filteredCourses.slice(startIndex, endIndex);

  // Check if there are next/previous pages
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    data: sliced,
    has_next: hasNext,
    has_previous: hasPrevious,
    page: page,
    per_page: size,
    total_count: totalCount,
    total_pages: totalPages
  };
};

export const getCourseBySlug = async (slug: string) => {
  return courses.find(x => x.slug === slug)
}

export const getCategoryBySlug = async (slug: string) => {
  return categories.find(x => x.slug === slug)
}

export const getOwnedCourses = async (username: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<Course>> => {
  // Handle abort signal
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }
  const filtered = courses.filter(x => x.categoryId === "1")
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const sliced = filtered.slice(startIndex, endIndex);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  return {
    data: sliced,
    has_next: hasNext,
    has_previous: hasPrevious,
    page: page,
    per_page: size,
    total_count: totalCount,
    total_pages: totalPages
  }
}
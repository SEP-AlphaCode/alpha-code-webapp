import { AccountCourse } from "@/types/courses";
import { PagedResult } from "@/types/page-result";

export const accountCourses: AccountCourse[] = [
    // Account 1: ed27548b-f858-47e2-b29a-ad9f6e2ef225
    {
        id: "ac1-course1",
        accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225",
        completed: true,
        completedLesson: 5,
        courseId: "a33e476c-1567-43e3-bc14-8308adf58f65",
        lastAccessed: "2024-06-15T10:30:00Z",
        progressPercent: 100,
        purchaseDate: "2024-05-10T08:15:00Z",
        status: 1,
        statusText: "Hoàn thành",
        totalLesson: 5,
        slug: "course-1",
        imageUrl: "/images/course-1.jpg",
        name: "Khóa học 1"
    },
    {
        id: "ac1-course2",
        accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225",
        completed: false,
        completedLesson: 3,
        courseId: "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        lastAccessed: "2024-06-18T14:20:00Z",
        progressPercent: 50,
        purchaseDate: "2024-05-12T09:45:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 6,
        slug: "course-2",
        imageUrl: "/images/course-2.jpg",
        name: "Khóa học 2"
    },
    {
        id: "ac1-course3",
        accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225",
        completed: false,
        completedLesson: 1,
        courseId: "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        lastAccessed: "2024-06-20T16:10:00Z",
        progressPercent: 17,
        purchaseDate: "2024-05-15T11:30:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 6,
        slug: "course-3",
        imageUrl: "/images/course-3.jpg",
        name: "Khóa học 3"
    }
];

export const getMockAccountCourses = async (accountId: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<AccountCourse>> => {
    const filtered = accountCourses.filter(ac => ac.accountId === accountId);
    const start = (page - 1) * size;
    const paged = filtered.slice(start, start + size);
    const total_count = filtered.length;
    const total_pages = Math.ceil(total_count / size);
    const has_next = page < total_pages;
    const has_prev = page > 1;
    return {
        data: paged,
        page,
        has_next,
        has_previous: has_prev,
        total_count,
        total_pages,
        per_page: size
    }
}
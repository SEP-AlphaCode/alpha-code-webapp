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
        totalLesson: 5
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
        totalLesson: 6
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
        totalLesson: 6
    },

    // Account 2: 5fb9b761-e7bb-445c-81d3-4417a71a4c32
    {
        id: "ac2-course1",
        accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32",
        completed: false,
        completedLesson: 4,
        courseId: "a33e476c-1567-43e3-bc14-8308adf58f65",
        lastAccessed: "2024-06-16T11:45:00Z",
        progressPercent: 80,
        purchaseDate: "2024-05-08T10:20:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 5
    },
    {
        id: "ac2-course2",
        accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32",
        completed: true,
        completedLesson: 6,
        courseId: "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        lastAccessed: "2024-06-19T15:30:00Z",
        progressPercent: 100,
        purchaseDate: "2024-05-09T13:15:00Z",
        status: 1,
        statusText: "Hoàn thành",
        totalLesson: 6
    },
    {
        id: "ac2-course3",
        accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32",
        completed: false,
        completedLesson: 2,
        courseId: "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        lastAccessed: "2024-06-21T17:25:00Z",
        progressPercent: 33,
        purchaseDate: "2024-05-11T14:50:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 6
    },

    // Account 3: 177c8fb2-8b39-4ed3-9fb8-aa64a51014bf
    {
        id: "ac3-course1",
        accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf",
        completed: false,
        completedLesson: 2,
        courseId: "a33e476c-1567-43e3-bc14-8308adf58f65",
        lastAccessed: "2024-06-14T09:15:00Z",
        progressPercent: 40,
        purchaseDate: "2024-05-14T16:40:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 5
    },
    {
        id: "ac3-course2",
        accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf",
        completed: false,
        completedLesson: 5,
        courseId: "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        lastAccessed: "2024-06-17T13:50:00Z",
        progressPercent: 83,
        purchaseDate: "2024-05-16T12:25:00Z",
        status: 1,
        statusText: "Đang học",
        totalLesson: 6
    },
    {
        id: "ac3-course3",
        accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf",
        completed: true,
        completedLesson: 6,
        courseId: "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        lastAccessed: "2024-06-22T18:05:00Z",
        progressPercent: 100,
        purchaseDate: "2024-05-18T15:10:00Z",
        status: 1,
        statusText: "Hoàn thành",
        totalLesson: 6
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
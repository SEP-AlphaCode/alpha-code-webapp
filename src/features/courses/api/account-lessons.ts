import { AccountLesson, Lesson } from "@/types/courses";
import { PagedResult } from "@/types/page-result";

export interface AccountLessonDB {
    id: string;
    accountId: string;
    lessonId: string;
    status: number;
    completedAt: string | null;
}
const lessons = [
    {
        "id": "b86982cc-809e-4f8f-a6e9-6a83b0503d1b",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 300,
        "title": "Nguyên lý điều khiển từ xa"
    },
    {
        "id": "ab275a7e-f485-41d8-ab0c-05e235d577be",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 350,
        "title": "Kết nối điều khiển"
    },
    {
        "id": "76571ce5-7fcc-4160-97ea-d951770186d6",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 400,
        "title": "Điều khiển bằng app"
    },
    {
        "id": "a7fc4689-f935-44a9-8bf6-d537edefd23a",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 380,
        "title": "Tùy chỉnh điều khiển"
    },
    {
        "id": "c877896f-5c2f-4dff-b443-af30e62f11a1",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 320,
        "title": "Bài tập điều khiển"
    },
    {
        "id": "dc62ef8c-a5be-4be7-8e60-edb079ed7d67",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 350,
        "title": "Linh kiện robot mini"
    },
    {
        "id": "9db98b17-0990-4c47-ba44-b8aecd5f1548",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 420,
        "title": "Lắp ráp khung robot"
    },
    {
        "id": "44b6a0fe-4654-4135-82ea-a2cdfd7d44f2",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 380,
        "title": "Lắp động cơ"
    },
    {
        "id": "899f787a-33ed-41a0-987b-12e73ad166f6",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 340,
        "title": "Board điều khiển"
    },
    {
        "id": "dca7cb99-57a8-49cc-a686-9600269dedea",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 450,
        "title": "Hoàn thiện robot"
    },
    {
        "id": "2befd10b-b10c-4345-a8e1-41a8995bb34b",
        "course_id": "a33e476c-1567-43e3-bc14-8308adf58f65",
        "duration": 350,
        "title": "Giới thiệu lập trình"
    },
    {
        "id": "b5511e5d-a5f4-45ac-95b8-da7b76f49a0e",
        "course_id": "a33e476c-1567-43e3-bc14-8308adf58f65",
        "duration": 380,
        "title": "Câu lệnh cơ bản"
    },
    {
        "id": "8a90d526-38cc-4948-b0fd-125f37d0971d",
        "course_id": "a33e476c-1567-43e3-bc14-8308adf58f65",
        "duration": 420,
        "title": "Lập trình điều kiện"
    },
    {
        "id": "cdf319dc-7400-4797-b9d1-b1e4a0ad965c",
        "course_id": "a33e476c-1567-43e3-bc14-8308adf58f65",
        "duration": 360,
        "title": "Biến và lập trình"
    },
    {
        "id": "51916e86-2878-44b2-9c9c-07be5e1bccef",
        "course_id": "a33e476c-1567-43e3-bc14-8308adf58f65",
        "duration": 400,
        "title": "Bài kiểm tra lập trình"
    },
    {
        "id": "c19988eb-0101-4865-bcd7-0bbba8c28843",
        "course_id": "f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602",
        "duration": 500,
        "title": "Thử thách từ xa"
    },
    {
        "id": "5a63294e-eb40-4a1d-a8b0-71a29a32ff86",
        "course_id": "b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5",
        "duration": 380,
        "title": "Trang trí robot"
    }
]

const accountLessonsDB: AccountLessonDB[] = [
    // Account: ed27548b-f858-47e2-b29a-ad9f6e2ef225 - Course: a33e476c-1567-43e3-bc14-8308adf58f65 (5/5 completed)
    { id: "ed27548b-2befd10b", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "2befd10b-b10c-4345-a8e1-41a8995bb34b", status: 1, completedAt: "2024-06-10T08:30:00Z" },
    { id: "ed27548b-b5511e5d", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "b5511e5d-a5f4-45ac-95b8-da7b76f49a0e", status: 1, completedAt: "2024-06-11T10:15:00Z" },
    { id: "ed27548b-8a90d526", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "8a90d526-38cc-4948-b0fd-125f37d0971d", status: 1, completedAt: "2024-06-12T14:20:00Z" },
    { id: "ed27548b-cdf319dc", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "cdf319dc-7400-4797-b9d1-b1e4a0ad965c", status: 1, completedAt: "2024-06-13T16:45:00Z" },
    { id: "ed27548b-51916e86", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "51916e86-2878-44b2-9c9c-07be5e1bccef", status: 1, completedAt: "2024-06-14T09:30:00Z" },

    // Account: 5fb9b761-e7bb-445c-81d3-4417a71a4c32 - Course: a33e476c-1567-43e3-bc14-8308adf58f65 (4/5 completed)
    { id: "5fb9b761-2befd10b", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "2befd10b-b10c-4345-a8e1-41a8995bb34b", status: 1, completedAt: "2024-06-11T11:20:00Z" },
    { id: "5fb9b761-b5511e5d", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "b5511e5d-a5f4-45ac-95b8-da7b76f49a0e", status: 1, completedAt: "2024-06-12T13:45:00Z" },
    { id: "5fb9b761-8a90d526", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "8a90d526-38cc-4948-b0fd-125f37d0971d", status: 1, completedAt: "2024-06-13T15:30:00Z" },
    { id: "5fb9b761-cdf319dc", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "cdf319dc-7400-4797-b9d1-b1e4a0ad965c", status: 1, completedAt: "2024-06-14T17:15:00Z" },
    { id: "5fb9b761-51916e86", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "51916e86-2878-44b2-9c9c-07be5e1bccef", status: 0, completedAt: null },

    // Account: 177c8fb2-8b39-4ed3-9fb8-aa64a51014bf - Course: a33e476c-1567-43e3-bc14-8308adf58f65 (2/5 completed)
    { id: "177c8fb2-2befd10b", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "2befd10b-b10c-4345-a8e1-41a8995bb34b", status: 1, completedAt: "2024-06-12T09:45:00Z" },
    { id: "177c8fb2-b5511e5d", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "b5511e5d-a5f4-45ac-95b8-da7b76f49a0e", status: 1, completedAt: "2024-06-13T11:30:00Z" },
    { id: "177c8fb2-8a90d526", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "8a90d526-38cc-4948-b0fd-125f37d0971d", status: 0, completedAt: null },
    { id: "177c8fb2-cdf319dc", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "cdf319dc-7400-4797-b9d1-b1e4a0ad965c", status: 0, completedAt: null },
    { id: "177c8fb2-51916e86", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "51916e86-2878-44b2-9c9c-07be5e1bccef", status: 0, completedAt: null },

    // Account: ed27548b-f858-47e2-b29a-ad9f6e2ef225 - Course: f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602 (3/6 completed)
    { id: "ed27548b-b86982cc", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "b86982cc-809e-4f8f-a6e9-6a83b0503d1b", status: 1, completedAt: "2024-06-15T10:30:00Z" },
    { id: "ed27548b-ab275a7e", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "ab275a7e-f485-41d8-ab0c-05e235d577be", status: 1, completedAt: "2024-06-16T14:20:00Z" },
    { id: "ed27548b-76571ce5", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "76571ce5-7fcc-4160-97ea-d951770186d6", status: 1, completedAt: "2024-06-17T16:45:00Z" },
    { id: "ed27548b-a7fc4689", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "a7fc4689-f935-44a9-8bf6-d537edefd23a", status: 0, completedAt: null },
    { id: "ed27548b-c877896f", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "c877896f-5c2f-4dff-b443-af30e62f11a1", status: 0, completedAt: null },
    { id: "ed27548b-c19988eb", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "c19988eb-0101-4865-bcd7-0bbba8c28843", status: 0, completedAt: null },

    // Account: 5fb9b761-e7bb-445c-81d3-4417a71a4c32 - Course: f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602 (6/6 completed)
    { id: "5fb9b761-b86982cc", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "b86982cc-809e-4f8f-a6e9-6a83b0503d1b", status: 1, completedAt: "2024-06-14T08:15:00Z" },
    { id: "5fb9b761-ab275a7e", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "ab275a7e-f485-41d8-ab0c-05e235d577be", status: 1, completedAt: "2024-06-15T12:30:00Z" },
    { id: "5fb9b761-76571ce5", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "76571ce5-7fcc-4160-97ea-d951770186d6", status: 1, completedAt: "2024-06-16T15:45:00Z" },
    { id: "5fb9b761-a7fc4689", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "a7fc4689-f935-44a9-8bf6-d537edefd23a", status: 1, completedAt: "2024-06-17T17:20:00Z" },
    { id: "5fb9b761-c877896f", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "c877896f-5c2f-4dff-b443-af30e62f11a1", status: 1, completedAt: "2024-06-18T09:40:00Z" },
    { id: "5fb9b761-c19988eb", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "c19988eb-0101-4865-bcd7-0bbba8c28843", status: 1, completedAt: "2024-06-19T11:25:00Z" },

    // Account: 177c8fb2-8b39-4ed3-9fb8-aa64a51014bf - Course: f5bc51ac-61f6-4f35-8ed8-fb91ccfd6602 (5/6 completed)
    { id: "177c8fb2-b86982cc", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "b86982cc-809e-4f8f-a6e9-6a83b0503d1b", status: 1, completedAt: "2024-06-13T10:10:00Z" },
    { id: "177c8fb2-ab275a7e", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "ab275a7e-f485-41d8-ab0c-05e235d577be", status: 1, completedAt: "2024-06-14T13:35:00Z" },
    { id: "177c8fb2-76571ce5", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "76571ce5-7fcc-4160-97ea-d951770186d6", status: 1, completedAt: "2024-06-15T16:50:00Z" },
    { id: "177c8fb2-a7fc4689", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "a7fc4689-f935-44a9-8bf6-d537edefd23a", status: 1, completedAt: "2024-06-16T18:15:00Z" },
    { id: "177c8fb2-c877896f", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "c877896f-5c2f-4dff-b443-af30e62f11a1", status: 1, completedAt: "2024-06-17T14:40:00Z" },
    { id: "177c8fb2-c19988eb", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "c19988eb-0101-4865-bcd7-0bbba8c28843", status: 0, completedAt: null },

    // Account: ed27548b-f858-47e2-b29a-ad9f6e2ef225 - Course: b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5 (1/6 completed)
    { id: "ed27548b-dc62ef8c", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "dc62ef8c-a5be-4be7-8e60-edb079ed7d67", status: 1, completedAt: "2024-06-18T12:20:00Z" },
    { id: "ed27548b-9db98b17", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "9db98b17-0990-4c47-ba44-b8aecd5f1548", status: 0, completedAt: null },
    { id: "ed27548b-44b6a0fe", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "44b6a0fe-4654-4135-82ea-a2cdfd7d44f2", status: 0, completedAt: null },
    { id: "ed27548b-899f787a", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "899f787a-33ed-41a0-987b-12e73ad166f6", status: 0, completedAt: null },
    { id: "ed27548b-dca7cb99", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "dca7cb99-57a8-49cc-a686-9600269dedea", status: 0, completedAt: null },
    { id: "ed27548b-5a63294e", accountId: "ed27548b-f858-47e2-b29a-ad9f6e2ef225", lessonId: "5a63294e-eb40-4a1d-a8b0-71a29a32ff86", status: 0, completedAt: null },

    // Account: 5fb9b761-e7bb-445c-81d3-4417a71a4c32 - Course: b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5 (2/6 completed)
    { id: "5fb9b761-dc62ef8c", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "dc62ef8c-a5be-4be7-8e60-edb079ed7d67", status: 1, completedAt: "2024-06-16T15:30:00Z" },
    { id: "5fb9b761-9db98b17", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "9db98b17-0990-4c47-ba44-b8aecd5f1548", status: 1, completedAt: "2024-06-17T17:45:00Z" },
    { id: "5fb9b761-44b6a0fe", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "44b6a0fe-4654-4135-82ea-a2cdfd7d44f2", status: 0, completedAt: null },
    { id: "5fb9b761-899f787a", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "899f787a-33ed-41a0-987b-12e73ad166f6", status: 0, completedAt: null },
    { id: "5fb9b761-dca7cb99", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "dca7cb99-57a8-49cc-a686-9600269dedea", status: 0, completedAt: null },
    { id: "5fb9b761-5a63294e", accountId: "5fb9b761-e7bb-445c-81d3-4417a71a4c32", lessonId: "5a63294e-eb40-4a1d-a8b0-71a29a32ff86", status: 0, completedAt: null },

    // Account: 177c8fb2-8b39-4ed3-9fb8-aa64a51014bf - Course: b5fffb19-c2ee-46ec-a812-7a9dfd6edbc5 (6/6 completed)
    { id: "177c8fb2-dc62ef8c", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "dc62ef8c-a5be-4be7-8e60-edb079ed7d67", status: 1, completedAt: "2024-06-15T09:25:00Z" },
    { id: "177c8fb2-9db98b17", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "9db98b17-0990-4c47-ba44-b8aecd5f1548", status: 1, completedAt: "2024-06-16T11:40:00Z" },
    { id: "177c8fb2-44b6a0fe", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "44b6a0fe-4654-4135-82ea-a2cdfd7d44f2", status: 1, completedAt: "2024-06-17T13:55:00Z" },
    { id: "177c8fb2-899f787a", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "899f787a-33ed-41a0-987b-12e73ad166f6", status: 1, completedAt: "2024-06-18T15:10:00Z" },
    { id: "177c8fb2-dca7cb99", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "dca7cb99-57a8-49cc-a686-9600269dedea", status: 1, completedAt: "2024-06-19T17:25:00Z" },
    { id: "177c8fb2-5a63294e", accountId: "177c8fb2-8b39-4ed3-9fb8-aa64a51014bf", lessonId: "5a63294e-eb40-4a1d-a8b0-71a29a32ff86", status: 1, completedAt: "2024-06-20T19:40:00Z" }
];

export const getMockAccountLessons = async (accountId: string, courseId: string, page: number, size: number, signal?: AbortSignal): Promise<PagedResult<AccountLesson>> => {
    const filtered = accountLessonsDB.filter(al => al.accountId === accountId && lessons.find(l => l.id === al.lessonId)?.course_id === courseId);
    const start = (page - 1) * size;
    const paged = filtered.slice(start, start + size);
    const has_next = start + size < filtered.length;
    const has_previous = page > 1;
    return {
        data: paged.map(al => ({
            id: al.lessonId,
            status: al.status,
            title: lessons.find(l => l.id === al.lessonId)?.title || "Unknown",
            duration: lessons.find(l => l.id === al.lessonId)?.duration || 0,
        })),
        has_next,
        has_previous,
        total_count: filtered.length,
        page,
        per_page: size,
        total_pages: Math.ceil(filtered.length / size)
    }
}
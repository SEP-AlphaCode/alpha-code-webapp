import { Course } from "@/types/courses"
import { Bundle } from "@/types/bundle"

// -----------------------------
// 🔗 1️⃣ Gắn khóa học vào bundle (Assign)
// POST /api/v1/course-bundles
// -----------------------------
export interface CourseBundleAssignRequest {
  courseId: string[]    // danh sách ID khóa học cần gán
  bundleIds: string     // ID bundle nhận khóa học
}

// -----------------------------
// 📘 2️⃣ Khóa học thuộc bundle
// GET /api/v1/course-bundles/get-all-course-by-bundle/{bundleId}
// -----------------------------
export interface CourseInBundle extends Course {
  bundleId: string
  assignedDate?: string
}

// -----------------------------
// 📦 3️⃣ Phản hồi khi tạo/gán khóa học vào bundle
// (nếu API trả về danh sách mới hoặc xác nhận thành công)
// -----------------------------
export interface CourseBundleResponse {
  bundleId: string
  totalCourses: number
  courses: CourseInBundle[]
}

// -----------------------------
// 🧾 4️⃣ API response cơ bản cho CRUD course-bundle
// -----------------------------
export interface CourseBundle {
  id: string
  bundleId: string
  courseId: string
  createdDate: string
  lastUpdated?: string
  course?: Course
  bundle?: Bundle
}

'use client'
import { CourseError } from '@/components/parent/course/detail/course-error'
import { CourseSkeleton } from '@/components/parent/course/detail/course-skeleton'
import LoadingState from '@/components/loading-state'
import { useCourse } from '@/features/courses/hooks/use-course'
import { useSections } from '@/features/courses/hooks/use-section'
import { AppDispatch } from '@/store/store'
import { setCurrentCourse } from '@/store/user-course-slice'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation';
import { getUserIdFromToken } from '@/utils/tokenUtils'
import { useCreateAccountCourse } from '@/features/courses/hooks/use-account-course'
import { AccountCourse } from '@/types/account-course'

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter(); // Add router for navigation
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: courseData, isLoading: isCourseLoading } = useCourse().useGetCourseBySlug(slug);

  const { data: sectionsData, isLoading: isSectionsLoading, error: sectionsError } = useSections(
    courseData?.id || ''
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAllSections = () => {
    if (!sectionsData) return;

    if (expandedSections.length === sectionsData.length) {
      setExpandedSections([]);
    } else {
      setExpandedSections(sectionsData.map((section) => section.id));
    }
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/parent/courses/learning/${slug}/lesson/${lessonId}`); // Navigate to lesson detail page
  };

  const handleRegisterClick = () => {
    // If the course is paid, go to payment page instead of enrolling directly
    if (courseData?.price && courseData.price > 0) {
      // Use payment page with query params expected by PaymentPageClient
      router.push(`/payment?category=course&id=${encodeURIComponent(courseData.id)}`)
      return
    }

    setIsDialogOpen(true);
  };

  const createMutation = useCreateAccountCourse();

  const handleConfirmRegister = async () => {
    // Use mutation hook to create account-course for the logged-in account
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') || '' : '';
    const accountId = accessToken ? getUserIdFromToken(accessToken) : null;

    if (!accountId) {
      // Not authenticated or no account id found
      console.error('No account id found. Please login.');
      setIsDialogOpen(false);
      return;
    }
    try {
      // Some React Query versions/types may not expose mutateAsync on the typed object.
      // Use a safe wrapper that falls back to mutate+callbacks when mutateAsync is not present.
      type MutateFn = (data: Partial<AccountCourse>) => Promise<unknown>

      const maybeMutateAsync = (createMutation as unknown as { mutateAsync?: MutateFn }).mutateAsync

      const mutateAsyncFn: MutateFn = maybeMutateAsync
        ? (maybeMutateAsync.bind(createMutation) as MutateFn)
        : (data: Partial<AccountCourse>) =>
            new Promise<unknown>((resolve, reject) =>
              createMutation.mutate(data, { onSuccess: (res) => resolve(res), onError: (err) => reject(err) })
            )

      await mutateAsyncFn({ accountId, courseId: courseData!.id });
      setIsDialogOpen(false);
      // Use replace to avoid keeping the dialog route in history
      router.replace(`/parent/courses/learning/${courseData!.slug}`);
    } catch (err) {
      console.error('Failed to assign course to account', err);
      setIsDialogOpen(false);
    }
  };



  useEffect(() => {
    if (courseData) {
      dispatch(setCurrentCourse({ name: courseData.name, slug: courseData.slug }));
    }
    return () => {
      dispatch(setCurrentCourse(null));
    };
  }, [courseData, dispatch]);

  if (isCourseLoading) return <CourseSkeleton />;
  if (!courseData) return <CourseError />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li
                onClick={() => window.history.back()}
                className="hover:cursor-pointer hover:text-blue-600 transition-colors"
              >
                Khóa học
              </li>
              <li>›</li>
              <li className="text-blue-600 font-medium">{courseData.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
                {courseData.name}
              </h1>
              <p
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseData.description }}
              />


              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <span>{sectionsData?.length || 0} Học Phần</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">⏱️</span>
                  </div>
                  <span>Thời lượng {Math.floor(courseData.totalDuration / 60)} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">🎯</span>
                  </div>
                  <span>{courseData?.levelText || 'Trình độ cơ bản'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {courseData?.imageUrl ? (
                    <img src={courseData.imageUrl} alt={courseData.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border">
                        <span className="text-2xl ml-1">▶️</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-orange-500">
                      {courseData?.price && courseData.price > 0
                        ? `${new Intl.NumberFormat('vi-VN').format(courseData.price)} VND`
                        : 'Miễn phí'}
                    </span>
                  </div>
                  <Button
                    onClick={handleRegisterClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
                  >
                    {courseData?.price && courseData.price > 0 ? 'Mua khóa học' : 'Đăng ký khóa học'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nội dung khóa học</h2>
              <button
                onClick={toggleAllSections}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {expandedSections.length === sectionsData?.length ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {sectionsData?.length || 0} Học Phần
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {isSectionsLoading && (
              <div className="p-6">
                <LoadingState message="Đang tải chương học..." />
              </div>
            )}

            {sectionsError && (
              <div className="p-6 text-center text-red-600">
                <p>Có lỗi xảy ra khi tải chương học</p>
              </div>
            )}

            {sectionsData && sectionsData.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>Chưa có chương học nào</p>
              </div>
            )}

            {sectionsData && sectionsData.length > 0 && sectionsData.map((section, index) => (
              <div key={section.id} className="border-b border-gray-200">
                <div
                  className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <h3 className="text-gray-900 font-medium">{section.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{section.lessons?.length || 0} bài học</span>
                    <div className={`transform transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedSections.includes(section.id) && (
                  <div className="bg-gray-50">
                    {Array.isArray(section.lessons) && section.lessons.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <p>Chưa có bài học nào trong chương này</p>
                      </div>
                    )}

                    {Array.isArray(section.lessons) && section.lessons.length > 0 && (
                      <ul className="divide-y divide-gray-200">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lesson.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                          // onClick={() => handleLessonClick(lesson.id)} // Add click handler
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                                {lessonIndex + 1}
                              </div>
                              <div>
                                <h4 className="text-gray-900 font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-500">{lesson.duration} phút</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m12 0l-6-6m6 6l-6 6" />
                              </svg>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận đăng ký</DialogTitle>
            </DialogHeader>

            <div>
              <p>Bạn có chắc chắn muốn đăng ký khóa học này?</p>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400" disabled={createMutation.status === 'pending'}>
                Hủy
              </Button>
              <Button onClick={handleConfirmRegister} className="bg-orange-500 text-white hover:bg-orange-600" disabled={createMutation.status === 'pending'}>
                {createMutation.status === 'pending' ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
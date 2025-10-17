"use client"
import { useCourse } from '@/features/courses/hooks/use-course';
import { useCategories } from '@/features/courses/hooks/use-categories';
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearch } from '@/store/teacher-course-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen, 
  Grid3X3,
  List
} from 'lucide-react';
import { CourseGrid } from '@/components/teacher/course/course-grid';
import { Pagination } from '@/components/teacher/course/pagination';

export default function CoursePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { pagination, filters } = useSelector((s: RootState) => s.teacherCourse);
  const { useGetCourses } = useCourse();
  const { useGetAllCategories } = useCategories();

  // Get courses and categories
  const { data: coursesData, isLoading: loadingCourses } = useGetCourses(
    pagination.page,
    pagination.size,
    filters.search,
  );
  const { data: categoriesData, isLoading: loadingCategories } = useGetAllCategories();
  
  const courses = coursesData?.data ?? [];
  const total = coursesData?.total_count ?? 0;
  const totalPages = Math.ceil(total / pagination.size);
  
  // Get categories
  const categories = categoriesData?.data ?? [];

  // Fallback categories if API fails
  const fallbackCategories = [
    { id: '1', name: 'Lập trình cơ bản', description: 'Khóa học lập trình căn bản' },
    { id: '2', name: 'Robot điều khiển', description: 'Học điều khiển robot' },
    { id: '3', name: 'AI & Machine Learning', description: 'Trí tuệ nhân tạo' },
    { id: '4', name: 'IoT & Sensors', description: 'Internet vạn vật' },
  ];

  // Use fallback if no categories from API
  const displayCategories = categories.length > 0 ? categories : (loadingCategories ? [] : fallbackCategories);
  
  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) {
      return courses; // Show all courses
    }
    return courses.filter(course => course.categoryId === selectedCategory);
  }, [courses, selectedCategory]);

  // Auto-scroll categories animation
  useEffect(() => {
    const scrollContainer = categoriesRef.current;
    if (!scrollContainer || displayCategories.length === 0) return;

    let scrollPosition = 0;
    const scrollStep = 0.5; // Smooth scroll speed
    let intervalId: NodeJS.Timeout;
    let isPaused = false;
    
    const autoScroll = () => {
      if (isPaused) return;
      
      scrollPosition += scrollStep;
      
      // Reset when reaching end (seamless loop)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const startAutoScroll = () => {
      intervalId = setInterval(autoScroll, 16); // ~60fps
    };

    const stopAutoScroll = () => {
      clearInterval(intervalId);
    };

    const handleMouseEnter = () => {
      isPaused = true;
      stopAutoScroll();
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
      startAutoScroll();
    };

    // Start auto scroll
    startAutoScroll();

    // Add event listeners
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      stopAutoScroll();
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [displayCategories]);  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalCourses: total,
      activeCourses: courses.filter(c => c.status === 1).length,
      avgRating: 4.8,
      totalStudents: 1245
    };
  }, [courses, total]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .category-button {
          position: relative;
          overflow: hidden;
        }
        .category-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .category-button:hover::before {
          left: 100%;
        }
        .bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-10px); opacity: 0.8; }
          70% { transform: scale(0.9) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.8), 0 0 30px rgba(249, 115, 22, 0.4); }
        }
      `}</style>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học <span className="text-orange-500">Alpha Code</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Học lập trình robot từ cơ bản đến nâng cao với những khóa học chất lượng
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm khóa học, bài viết, video, ..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loadingCategories ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
            </div>
          ) : displayCategories.length > 0 ? (
            <div className="relative">
              {/* Fade effects for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <div 
                ref={categoriesRef}
                className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth px-4"
              >
                {/* Duplicate categories for seamless loop */}
                {[...displayCategories, ...displayCategories].map((category, index) => (
                  <button 
                    key={`${category.id}-${index}`}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-button flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap slide-in ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white shadow-lg pulse-glow scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title and Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Khóa học Pro</h2>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">MỚI</span>
          </div>
        </div>

        {/* Course Content by Categories */}
        {loadingCourses ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Đang tải các khóa học...</p>
          </div>
        ) : filteredCourses.length === 0 && selectedCategory ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Không có khóa học trong danh mục này</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Danh mục bạn chọn hiện tại chưa có khóa học nào
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chưa có khóa học nào</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Hiện tại chưa có khóa học nào trong hệ thống
            </p>
          </div>
        ) : (
          <div>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredCourses.length} khóa học
                  {selectedCategory && (
                    <span className="ml-1 text-orange-600">
                      trong danh mục đã chọn
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Course Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <CourseGrid courses={filteredCourses} viewMode={viewMode} />
            </div>

            {/* Pagination - Hide when filtering by category */}
            {totalPages > 1 && !selectedCategory && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={pagination.page}
                  totalPages={totalPages}
                  onPageChange={(page: number) => dispatch(setPage(page))}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
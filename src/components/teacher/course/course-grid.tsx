import { cn } from "@/lib/utils";
import { Course, mapDifficulty, formatTimespan, formatPrice } from "@/types/courses";
import Link from "next/link";
import { Clock, BookOpen, Users, Star } from "lucide-react";

interface CourseGridProps {
    courses: Course[];
    viewMode?: 'grid' | 'list';
}

export function CourseGrid({ courses, viewMode = 'grid' }: CourseGridProps) {
    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Không có khóa học nào phù hợp</p>
            </div>
        );
    }

    // Define gradient patterns for courses (F8 style)
    const gradients = [
        'from-blue-500 to-purple-600',
        'from-yellow-400 to-orange-500', 
        'from-pink-500 to-rose-500',
        'from-green-400 to-teal-500',
        'from-indigo-500 to-blue-600',
        'from-purple-500 to-pink-500',
        'from-red-500 to-pink-600',
        'from-cyan-400 to-blue-500'
    ];

    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {courses.map((course, index) => {
                    const diff = mapDifficulty(course.level);
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                        <Link
                            href={`courses/${course.slug}`}
                            key={course.id}
                            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300 flex gap-6"
                        >
                            <div className="relative flex-shrink-0">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.name}
                                        className="w-32 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`w-32 h-24 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute top-2 left-2">
                                            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                                <Star className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <BookOpen className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                <div className="absolute -top-2 -right-2 bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
                                    <span className={cn("text-xs font-bold", diff.color)}>
                                        {diff.text}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                        {course.name}
                                    </h3>
                                    <div className="text-lg font-bold text-orange-600">
                                        {formatPrice(course.price)}
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course.totalLessons} bài học</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTimespan(course.totalDuration)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>125 học viên</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
                const diff = mapDifficulty(course.level);
                const gradient = gradients[index % gradients.length];
                
                return (
                    <Link
                        href={`courses/${course.slug}`}
                        key={course.id}
                        className="group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 hover:border-orange-300"
                    >
                        {/* Course Card Header with Gradient */}
                        <div className={`relative h-40 bg-gradient-to-br ${gradient} flex flex-col justify-between p-4 text-white overflow-hidden`}>
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white rounded-full"></div>
                            </div>
                            
                            {/* Top Icons */}
                            <div className="flex items-start justify-between relative z-10">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <span className="text-xs font-bold text-white">
                                        {diff.text}
                                    </span>
                                </div>
                            </div>

                            {/* Course Title */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-1 line-clamp-2 group-hover:scale-105 transition-transform duration-300">
                                    {course.name}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Cho người mới bắt đầu
                                </p>
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-4 flex-grow">
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {course.description}
                            </p>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                                        <Users className="w-2 h-2" />
                                    </div>
                                    <span>125</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTimespan(course.totalDuration)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>4.8</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Footer */}
                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    {course.price > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatPrice(course.price)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(course.price * 1.5)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-lg font-bold text-green-600">Miễn phí</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {course.totalLessons} bài học
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
import { cn } from "@/lib/utils";
import { Course, mapDifficulty, formatTimespan, formatPrice } from "@/types/courses";
import Link from "next/link";

interface CourseGridProps {
    courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
    if (courses.length === 0) {
        return <div className="text-center py-12 text-slate-600">Không có khóa học nào phù hợp</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {courses.map(course => {
                const diff = mapDifficulty(course.level);
                return (
                    <Link
                        href={`/courses/${course.slug}`}
                        key={course.id}
                        className="group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-300"
                    >
                        <div className="relative overflow-hidden">
                            {course.imageUrl ? (
                                <img
                                    src={course.imageUrl}
                                    alt={course.name}
                                    className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className={cn(
                                    "w-full h-40 md:h-48 flex items-center justify-center",
                                )}>
                                    <span className="text-lg md:text-xl font-semibold text-white text-center px-4">
                                        {course.name}
                                    </span>
                                </div>
                            )}
                            <div className={cn("absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md")}>
                                <span className={cn("text-xs md:text-sm font-bold", diff.color)}>
                                    {diff.text}
                                </span>
                            </div>
                        </div>

                        <div className="flex-grow p-4 md:p-5">
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {course.name}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 line-clamp-3 mb-3 md:mb-4">
                                {course.description}
                            </p>
                            <div className="flex items-center justify-between text-xs md:text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                                <span className="flex items-center gap-1 font-medium">📚 {course.totalLessons} bài</span>
                                <span className="flex items-center gap-1 font-medium">⏱️ {formatTimespan(course.totalDuration)}</span>
                            </div>
                        </div>

                        <div className="px-4 md:px-5 pb-4 md:pb-5">
                            <div className="flex bg-blue-50 rounded-lg p-3 border border-slate-200 text-xl font-bold text-blue-600 justify-center">
                                {formatPrice(course.price)}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
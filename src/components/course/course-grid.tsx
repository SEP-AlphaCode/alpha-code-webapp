import { cn } from "@/lib/utils";
import { Course, mapDifficulty, formatTimespan, formatPrice, AccountCourse } from "@/types/courses";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

interface CourseGridProps {
    courses: AccountCourse[]
    showProgress?: boolean
    progressData?: Record<string, number> // courseId -> progress percentage
}

export function CourseGrid({ courses, showProgress = false, progressData = {} }: CourseGridProps) {
    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">Không có khóa học nào phù hợp</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 mb-8">
            {courses.map((course) => {
                const progress = progressData[course.id] || 0

                return (
                    <Link
                        href={`/courses/${course.courseId}`}
                        key={course.id}
                        className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 p-4 sm:p-5">
                            <div className="relative flex-shrink-0 w-full sm:w-44 h-44 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                {course.id ? (
                                    <img
                                        src={"/placeholder.svg"}
                                        alt={course.courseId}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <span className="text-base font-bold text-primary text-center line-clamp-3">{course.id}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0 mt-4 sm:mt-0">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors line-clamp-2 flex-1">
                                        {course.id}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{course.id}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="font-medium">{course.completedLesson} / ?</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            {/* <span className="font-medium">{formatTimespan(course.totalDuration)}</span> */}
                                        </div>
                                        {showProgress && progress > 0 && (
                                            <div className="flex items-center gap-1.5 text-primary">
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="font-semibold">{progress}% hoàn thành</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {showProgress && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-medium">Tiến độ học tập</span>
                                            <span className="font-bold text-black">{progress}%</span>
                                        </div>
                                        <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/100 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
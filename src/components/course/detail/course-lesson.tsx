'use client'
import { Lesson } from "@/types/courses";
import { useState } from "react";

export function CourseLessons({
  lessons,
  lessonCount,
  totalDuration,
  courseId
}: {
  lessons: Lesson[];
  lessonCount: number;
  totalDuration: number;
  courseId: string
}) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleComplete = (lessonId: string) => {
    setCompleted((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  return (
    <div className="py-6">
      {/* Mobile: dropdown selector */}
      <div className="block lg:hidden">
        <select
          className="w-full border border-slate-300 rounded-lg p-3 text-slate-800"
          value={activeLesson || ""}
          onChange={(e) => setActiveLesson(e.target.value)}
        >
          <option value="">Chọn bài học...</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: lesson progress list */}
      <div className="hidden lg:flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
        {lessons.map((lesson, i) => {
          const isCompleted = completed.includes(lesson.id);
          const isActive = activeLesson === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`group flex items-center gap-3 w-full text-left px-3 py-4 rounded-lg transition ${isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-slate-50 text-slate-700"
                }`}
            >
              {/* Progress circle */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(lesson.id);
                }}
                className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition ${isCompleted
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white group-hover:border-blue-400"
                  }`}
              >
                {isCompleted ? "✓" : ""}
              </div>

              {/* Lesson title */}
              <span className="truncate flex-1">{lesson.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

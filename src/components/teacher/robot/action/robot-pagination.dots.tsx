"use client";

export function RobotPaginationDots({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (index: number) => void;
}) {
  return (
    <div className="flex justify-center mt-2 space-x-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index)}
          className={`w-8 h-2 rounded-full transition-colors ${
            index === currentPage ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

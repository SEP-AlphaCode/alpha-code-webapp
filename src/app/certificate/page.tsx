import Image from "next/image";

export default function CertificatePage() {
    // Dữ liệu mẫu, có thể thay bằng props hoặc lấy từ API
    const studentName = "Nguyễn Văn A";
    const courseName = "Khóa học Robot Alpha Mini";
    const date = new Date().toLocaleDateString("vi-VN");
    const certificateId = "CHN-2025-0001";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
            <div className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-lg border-8 border-blue-200 p-12 flex flex-col items-center overflow-hidden">
                {/* BG Alpha Mini mờ */}
                <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
                    <Image src="/alpha-mini-2.webp" alt="Alpha Mini" fill style={{ objectFit: "cover" }} />
                </div>
                {/* Viền nhấn phụ */}
                <div className="absolute inset-4 rounded-[24px] border-2 border-blue-100 pointer-events-none z-10" />
                {/* Logo Alpha Mini */}
                <div className="relative z-20 mb-4 flex justify-center items-center">
                    <Image src="/logo1.png" alt="AlphaCode Logo" width={140} height={140} />
                </div>
                {/* Tiêu đề */}
                <h1 className="relative z-20 text-4xl font-serif font-bold text-blue-700 mb-2 text-center tracking-wide uppercase drop-shadow">Chứng Nhận Hoàn Thành</h1>
                <div className="relative z-20 w-16 h-1 bg-blue-100 rounded-full mx-auto mb-4" />
                <h2 className="relative z-20 text-xl font-semibold text-gray-700 mb-8 text-center uppercase">{courseName}</h2>
                {/* Tên học viên */}
                <div className="relative z-20 mb-8 text-center">
                    <span className="block text-lg text-blue-700">Trao tặng cho học viên</span>
                    <span className="block text-3xl font-serif font-bold text-gray-800 mt-2 tracking-wide">{studentName}</span>
                </div>
                {/* Nội dung xác nhận */}
                <div className="relative z-20 text-center text-lg text-gray-700 mb-8 px-2">
                    <span>
                        Đã xuất sắc hoàn thành khóa học <span className="font-bold text-blue-700">{courseName}</span> và thể hiện sự nỗ lực, cam kết trong quá trình học tập cùng Alpha Mini.
                    </span>
                </div>
                {/* Ngày cấp và mã chứng nhận + chữ ký/dấu */}
                <div className="relative z-20 flex flex-col items-center w-full px-5">
                    {/* Ngày cấp và mã chứng nhận */}
                    <div className="flex flex-row justify-between w-full max-w-xl mb-6">
                        <div className="text-gray-500 text-base">
                            Ngày cấp: <span className="font-semibold text-blue-700">{date}</span>
                        </div>
                        <div className="text-gray-500 text-base">
                            Mã chứng nhận: <span className="font-semibold text-blue-700">{certificateId}</span>
                        </div>
                    </div>

                    {/* Chữ ký và đóng dấu */}
                    <div className="flex flex-row justify-around w-full max-w-2xl items-end gap-x-40">
                        <div className="flex flex-col items-center mr-10">
                            <Image src="/signature.png" alt="Chữ ký đại diện AlphaCode" width={90} height={60} className="object-contain" />
                            <span className="text-xs text-gray-500 mt-2">Chữ ký đại diện AlphaCode</span>
                        </div>
                        <div className="flex flex-col items-center mr-15">
                            <Image src="/logo2.png" alt="Đóng dấu xác nhận" width={90} height={60} className="object-contain" />
                            <span className="text-xs text-gray-500 mt-2">Đóng dấu xác nhận</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

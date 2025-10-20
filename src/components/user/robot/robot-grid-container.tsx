import React from 'react';
import { RobotGrid } from './robot-grid';
import { useRobotStore } from '@/hooks/use-robot-store'; // Hook của bạn
import { Robot as RobotState, ConnectMode } from '@/store/robot-slice'; // Import kiểu dữ liệu cần thiết

// --- Helper Ánh xạ Dữ liệu ---
// Ánh xạ từ Robot State trong Redux sang Robot type của RobotGridProps
// (Lưu ý: Bạn nên định nghĩa Robot type cho GridProps ở 1 file chung)
interface GridRobot {
    id: string;
    serialNumber: string;
    name: string;
    status: 'online' | 'offline' | 'charging' | 'busy';
    battery: number | null;
    lastSeen: string;
    version: string;
    students: number;
    currentTask: string;
    uptime: string;
    ip: string;
    temperature: number;
    image: string;
    robotModelName?: string;
}

const mapReduxRobotToGridRobot = (robot: RobotState): GridRobot => ({
    id: robot.id,
    serialNumber: robot.serial,
    name: robot.name || robot.serial,
    // Ánh xạ các status còn thiếu nếu cần, ví dụ:
    status: (robot.status === 'online' || robot.status) 
        ? 'online' 
        : (robot.status === 'busy' ? 'busy' : 'offline'), 
    battery: robot.battery ?? null,
    lastSeen: robot.lastConnected || 'N/A',
    version: robot.ctrl_version || 'N/A',
    // Giả định các trường còn lại
    students: 0, 
    currentTask: 'Idle',
    uptime: 'N/A', 
    ip: 'N/A', 
    temperature: 0, 
    image: "/img_top_alphamini_connect.webp", 
    robotModelName: robot.robotModelName,
});
// -----------------------------

export function RobotGridContainer() {
    // 1. Lấy trạng thái và actions từ hook
    const {
        robots,
        selectedRobotSerial,
        selectRobot,
        connectMode, // Lấy connectMode
        toggleConnectMode, // Lấy action để dễ dàng chuyển đổi
    } = useRobotStore();

    // 2. Tính toán multiMode
    const multiMode = connectMode === 'multi';

    // 3. Chuẩn bị dữ liệu cho RobotGrid
    const gridRobots = robots.map(mapReduxRobotToGridRobot);

    // 4. Hàm xử lý khi chọn robot (dispatch action)
    const handleRobotSelect = (serial: string) => {
        // Gọi action selectRobot từ hook
        selectRobot(serial); 
    };

    // Text hiển thị cho RobotGrid
    const statusTexts = {
        online: 'Trực tuyến',
        offline: 'Ngoại tuyến',
        charging: 'Đang sạc', 
        busy: 'Đang bận',
    };

    return (
        <div>
            {/* VÍ DỤ: UI chuyển đổi mode */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={toggleConnectMode}
                    className={`p-2 rounded font-semibold transition-colors ${
                        multiMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    {multiMode ? 'Hiện tại: Đa chọn (Multi)' : 'Hiện tại: Đơn chọn (Single)'}
                </button>
            </div>
            
            {/* TRUYỀN DỮ LIỆU VÀO ROBOTGRID */}
            <RobotGrid
                robots={gridRobots}
                selectedRobot={selectedRobotSerial}
                onRobotSelect={handleRobotSelect}
                sectionTitle={`Danh sách Robot`}
                statusTexts={statusTexts}
            />
        </div>
    );
}
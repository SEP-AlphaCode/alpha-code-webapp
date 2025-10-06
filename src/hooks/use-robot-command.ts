"use client";

import { pythonHttp } from "@/utils/http";

export function useRobotCommand(
  setNotify: (msg: string, type: "success" | "error") => void
) {
  const sendCommandToBackend = async (
    actionCode: string,
    robotSerial: string,
    type: "action" | "expression" = "action" // 👈 mặc định là action
  ) => {
    // 👇 Tạo body linh hoạt theo loại command
    const body =
      type === "expression"
        ? {
            type,
            data: {
              code: actionCode, // 👈 backend có thể yêu cầu key này
            },
          }
        : {
            type,
            data: {
              code: actionCode, // 👈 action & dance dùng code
            },
          };

    try {
      await pythonHttp.post(`/websocket/command/${robotSerial}`, body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setNotify("✅ Gửi lệnh thành công!", "success");
    } catch (err) {
      console.error("Lỗi khi gửi lệnh:", err);
      setNotify("❌ Gửi lệnh thất bại!", "error");
    }
  };

  return { sendCommandToBackend };
}

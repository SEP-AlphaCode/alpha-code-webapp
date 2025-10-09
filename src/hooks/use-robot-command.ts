"use client";

import { pythonHttp } from "@/utils/http";

export function useRobotCommand(
  setNotify: (msg: string, type: "success" | "error") => void
) {
  const sendCommandToBackend = async (
    actionCode: string,
    robotSerial: string,
    type: "action" | "expression" | "skill_helper" | "extended_action" = "action"
  ) => {
    const body = {
      type,
      data: {
        code: actionCode,
      },
    };

    try {
      const res = await pythonHttp.post(`/websocket/command/${robotSerial}`, body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // 👇 Đọc response body
      const data = res.data as {
        status: "sent" | "failed";
        to: string;
        command: {
          type: string;
          data: { code: string };
        };
        active_clients: number;
      };

      console.log("📨 Robot response:", data);

      if (data.status === "sent") {
        setNotify("✅ Gửi lệnh thành công!", "success");
      } else if (data.status === "failed") {
        setNotify("❌ Gửi lệnh thất bại!", "error");
      } else {
        setNotify("⚠️ Phản hồi không xác định từ robot.", "error");
      }
    } catch (err) {
      console.error("🚨 Lỗi khi gửi lệnh:", err);
      setNotify("❌ Gửi lệnh thất bại! Không thể kết nối đến robot.", "error");
    }
  };

  return { sendCommandToBackend };
}

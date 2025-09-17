"use client";

import { pythonHttp } from "@/utils/http";

export function useRobotCommand(setNotify: (msg: string, type: "success" | "error") => void) {
  const sendCommandToBackend = async () => {
    const body = {
      type: "string",
      data: {
        activities: [
          {
            color: { a: 0, b: 0, g: 0, r: 255 },
            duration: 48752,
            action_id: "dance_0001en",
            start_time: 0,
            action_type: "dance",
          },
        ],
        total_duration: 48752,
      },
    };
    try {
      await pythonHttp.post("/websocket/command/1", body, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setNotify("Gửi lệnh thành công!", "success");
    } catch (err) {
      setNotify("Gửi lệnh thất bại!", "error");
      console.error(err);
    }
  };

  return { sendCommandToBackend };
}

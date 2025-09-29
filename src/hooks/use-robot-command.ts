"use client";

import { pythonHttp } from "@/utils/http";

export function useRobotCommand(
  setNotify: (msg: string, type: "success" | "error") => void
) {
  const sendCommandToBackend = async (actionCode: string, robotSerial: string) => {
    const body = {
      type: "action",
      data: {
        code: actionCode, // lấy code từ action
      },
    };

    try {
      await pythonHttp.post(`/websocket/command/${robotSerial}`, body, {
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

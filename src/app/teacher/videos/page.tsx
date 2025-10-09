"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { socketUrl } from "@/app/constants/constants";
import { useRobotStore } from "@/hooks/use-robot-store";

export default function VideoPage() {
  const [mode, setMode] = useState<"webcam" | "robot">("webcam");
  const [isLoading, setIsLoading] = useState(false);
  const [robotError, setRobotError] = useState<string | null>(null);

  const webcamRef = useRef<HTMLVideoElement>(null);
  const robotVideoRef = useRef<HTMLVideoElement>(null);

  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const { selectedRobotSerial } = useRobotStore();

  // ---------------- Webcam ----------------
  useEffect(() => {
    if (mode !== "webcam") return;
    setIsLoading(true);

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (webcamRef.current) webcamRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      } finally {
        setIsLoading(false);
      }
    };

    startWebcam();

    return () => {
      if (webcamRef.current?.srcObject) {
        const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        webcamRef.current.srcObject = null;
      }
    };
  }, [mode]);

  // ---------------- Robot Camera ----------------
useEffect(() => {
  if (mode !== "robot" || !selectedRobotSerial) return;

  setIsLoading(true);
  setRobotError(null);

  const pc = new RTCPeerConnection();
  const ws = new WebSocket(`${socketUrl}/signaling/${selectedRobotSerial}/web`);

  let isClosed = false;

  pc.ontrack = (event) => {
    if (robotVideoRef.current) {
      robotVideoRef.current.srcObject = event.streams[0];
      setIsLoading(false);
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ice", candidate: event.candidate.toJSON() }));
    }
  };

  ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        // 👉 Robot gửi offer trước
        await pc.setRemoteDescription({ type: "offer", sdp: data.sdp });

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
      } else if (data.type === "answer") {
        // trong trường hợp robot yêu cầu web tạo offer thì mới cần, nhưng hiện tại không cần
        await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
      } else if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    } catch (err) {
      console.error("WebRTC error:", err);
      setRobotError("Không thể nhận dữ liệu từ robot");
      setIsLoading(false);
    }
  };

  ws.onerror = () => {
    console.error("WebSocket error");
    setRobotError("Không thể kết nối WebSocket tới robot");
    setIsLoading(false);
  };

  ws.onclose = () => {
    isClosed = true;
  };

  return () => {
    if (!isClosed && ws.readyState === WebSocket.OPEN) ws.close();
    pc.close();
    setIsLoading(false);
  };
}, [mode, selectedRobotSerial]);


  // ---------------- Fullscreen ----------------
  const toggleFullscreen = () => {
    const container = mode === "webcam" ? webcamContainerRef.current : robotContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "webcam" | "robot")}>
              <TabsList className="mb-6 bg-gray-100 p-1 rounded-xl w-full max-w-md mx-auto text-center flex">
                <TabsTrigger
                  value="webcam"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg py-3 transition-all duration-200"
                >
                  🎥 Webcam của máy
                </TabsTrigger>
                <TabsTrigger
                  value="robot"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 rounded-lg py-3 transition-all duration-200"
                >
                  🤖 Camera Robot
                </TabsTrigger>
              </TabsList>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isLoading ? "bg-green-500 animate-pulse" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {mode === "webcam"
                      ? isLoading
                        ? "Webcam đang khởi động..."
                        : "Webcam đang hoạt động"
                      : isLoading
                      ? "Đang kết nối tới robot..."
                      : robotError
                      ? robotError
                      : "Robot camera đang hoạt động"}
                  </span>
                </div>
              </div>

              <TabsContent value="webcam">
                <div className="flex flex-col items-center">
                  <div
                    ref={webcamContainerRef}
                    className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-white text-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                          <p>Đang khởi động webcam...</p>
                        </div>
                      </div>
                    )}
                    <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white p-2 rounded-md transition"
                    >
                      {isFullscreen ? "❎" : "⛶"}
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="robot">
                <div className="flex flex-col items-center">
                  <div
                    ref={robotContainerRef}
                    className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-white text-center">
                          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                          <p>Đang kết nối tới robot...</p>
                        </div>
                      </div>
                    )}
                    {robotError && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <p className="text-xl">{robotError}</p>
                      </div>
                    )}
                    <video ref={robotVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white p-2 rounded-md transition"
                    >
                      {isFullscreen ? "❎" : "⛶"}
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

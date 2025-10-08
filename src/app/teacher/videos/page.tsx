"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function VideoPage() {
  const [mode, setMode] = useState<"webcam" | "robot">("webcam");
  const [robotStreamUrl, setRobotStreamUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Option 1: Dùng webcam máy ---
  useEffect(() => {
    if (mode === "webcam") {
      setIsLoading(true);
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
          setIsLoading(false);
        }
      };
      startWebcam();
    }

    // Dừng webcam khi chuyển chế độ
    return () => {
      if (webcamRef.current?.srcObject) {
        const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        webcamRef.current.srcObject = null;
      }
    };
  }, [mode]);

  // --- Option 2: Stream từ robot ---
  useEffect(() => {
    if (mode === "robot") {
      setIsLoading(true);
      setRobotStreamUrl("http://localhost:5000/robot/stream");
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [mode]);

  // --- Fullscreen logic ---
  const toggleFullscreen = () => {
    const container = videoContainerRef.current;

    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // --- Detect exit fullscreen manually ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}


        {/* Main Card */}
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "webcam" | "robot")}
            >
              <TabsList className="mb-6 bg-gray-100 p-1 rounded-xl w-full max-w-md mx-auto text-center flex">
                <TabsTrigger
                  value="webcam"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg py-3 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🎥</span>
                    Webcam của máy
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="robot"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 rounded-lg py-3 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    Camera Robot
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Status Indicator */}
              <div className=" text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border">
                  <div
                    className={`w-3 h-3 rounded-full ${mode === "webcam" ? "bg-green-500 animate-pulse" : "bg-gray-300"
                      }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-600">
                    {mode === "webcam" ? "Webcam đang hoạt động" : "Webcam đã tắt"}
                  </span>
                </div>
              </div>

              {/* Option 1: Webcam */}
              <TabsContent value="webcam" className="mt-0">
                <div className="flex flex-col items-center">
                  <div
                    ref={videoContainerRef}
                    className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-white text-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p>Đang khởi động webcam...</p>
                        </div>
                      </div>
                    )}
                    <video
                      ref={webcamRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Nút full screen */}
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white p-2 rounded-md transition"
                      title="Toàn màn hình"
                    >
                      {isFullscreen ? "❎" : "⛶"}
                    </button>
                  </div>
                  <div className="mt-6 text-center max-w-2xl">
                    <p className="text-gray-600 text-lg bg-blue-50 py-3 px-6 rounded-xl border border-blue-100">
                      Đang sử dụng webcam của thiết bị để trình chiếu hình ảnh
                      robot.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Option 2: Robot camera */}
              <TabsContent value="robot" className="mt-0">
                <div className="flex flex-col items-center">
                  <div
                    ref={videoContainerRef}
                    className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-white text-center">
                          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p>Đang kết nối tới robot...</p>
                        </div>
                      </div>
                    ) : robotStreamUrl ? (
                      <img
                        src={robotStreamUrl}
                        alt="Robot Camera Stream"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🤖</div>
                          <p className="text-xl">
                            Không thể kết nối tới camera robot
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Nút full screen */}
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 text-white p-2 rounded-md transition"
                      title="Toàn màn hình"
                    >
                      {isFullscreen ? "❎" : "⛶"}
                    </button>
                  </div>
                  <div className="mt-6 text-center max-w-2xl">
                    <p className="text-gray-600 text-lg bg-purple-50 py-3 px-6 rounded-xl border border-purple-100">
                      Đang hiển thị hình ảnh trực tiếp từ camera của robot.
                    </p>
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

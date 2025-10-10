"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { socketUrl } from "@/app/constants/constants";
import { useRobotStore } from "@/hooks/use-robot-store";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { 
  Video, 
  Bot, 
  Maximize2, 
  Minimize2, 
  Loader2, 
  AlertCircle,
  Radio,
  Monitor,
  Play,
  Square
} from "lucide-react";

export default function VideoPage() {
  const [mode, setMode] = useState<"webcam" | "robot">("webcam");
  const [isLoading, setIsLoading] = useState(false);
  const [robotError, setRobotError] = useState<string | null>(null);
  const [isWebRTCStarted, setIsWebRTCStarted] = useState(false);

  const webcamRef = useRef<HTMLVideoElement>(null);
  const robotVideoRef = useRef<HTMLVideoElement>(null);

  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs để lưu WebSocket và PeerConnection cho control
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const { selectedRobotSerial } = useRobotStore();

  // Toast notification system
  const setNotify = (msg: string, type: "success" | "error") => {
    console.log(`${type === "success" ? "✅" : "❌"} ${msg}`);
    // You can replace this with actual toast notification system later
  };

  // 🤖 Robot Command Hook for WebRTC
  const { sendWebRTCCommand } = useRobotCommand(setNotify);

  // WebRTC Control Functions - Updated to handle signaling connection
  const sendWebRTCStart = async () => {
    if (!selectedRobotSerial || isLoading || isWebRTCStarted) return;
    
    console.log("📤 Starting WebRTC for robot:", selectedRobotSerial);
    setIsLoading(true);
    setRobotError(null);
    
    try {
      // 1. Gửi start command qua HTTP API trước
      await sendWebRTCCommand(selectedRobotSerial, "webrtc_start");
      
      // 2. Sau đó khởi tạo WebSocket signaling connection
      initializeWebRTCConnection();
      
    } catch (error) {
      console.error("❌ Failed to send webrtc_start:", error);
      setRobotError("Không thể bắt đầu WebRTC");
      setIsLoading(false);
    }
  };

  const sendWebRTCStop = async () => {
    if (!selectedRobotSerial || isLoading || !isWebRTCStarted) return;
    
    console.log("📤 Stopping WebRTC for robot:", selectedRobotSerial);
    setIsLoading(true);
    
    try {
      // 1. Gửi stop command qua HTTP API
      await sendWebRTCCommand(selectedRobotSerial, "webrtc_stop");
      
      // 2. Đóng signaling connection
      cleanupWebRTCConnection();
      
    } catch (error) {
      console.error("❌ Failed to send webrtc_stop:", error);
      setRobotError("Không thể dừng WebRTC");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm khởi tạo WebRTC connection (chỉ gọi khi cần)
  const initializeWebRTCConnection = () => {
    if (!selectedRobotSerial) return;

    console.log("🔗 Initializing WebRTC signaling connection");

    let pc: RTCPeerConnection | null = null;
    let ws: WebSocket | null = null;
    let isClosed = false;

    try {
      pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Debug signaling state
      pc.onsignalingstatechange = () => {
        console.log("🔄 Signaling state:", pc?.signalingState);
      };

      // Khi robot gửi video track
      pc.ontrack = (event) => {
        console.log("📹 Received video track from robot");
        if (robotVideoRef.current) {
          robotVideoRef.current.srcObject = event.streams[0];
          setIsLoading(false);
        }
      };

      // Khi browser có ICE candidate mới
      pc.onicecandidate = (event) => {
        if (event.candidate && ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ice", candidate: event.candidate.toJSON() }));
        }
      };

      // Tạo WebSocket signaling
      ws = new WebSocket(`${socketUrl}/signaling/${selectedRobotSerial}/web`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket signaling connected");
      };

      ws.onmessage = async (event) => {
        if (isClosed) return;
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "webrtc_start_response") {
            console.log("📨 Robot confirmed WebRTC start");
            setIsWebRTCStarted(true);
            setIsLoading(false);
            setRobotError(null);
          }
          else if (data.type === "webrtc_stop_response") {
            console.log("📨 Robot confirmed WebRTC stop");
            setIsWebRTCStarted(false);
            setIsLoading(false);
          }
          else if (data.type === "offer") {
            console.log("📨 Received offer from robot");
            if (!pc || pc.signalingState !== "stable") {
              console.warn("⚠️ Ignoring offer, state:", pc?.signalingState);
              return;
            }

            await pc.setRemoteDescription({ type: "offer", sdp: data.sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws?.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
          }
          else if (data.type === "answer") {
            console.log("📨 Received answer from robot");
            if (pc?.signalingState === "have-local-offer") {
              await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
            }
          }
          else if (data.type === "ice" && data.candidate) {
            try {
              if (pc) {
                await pc.addIceCandidate(data.candidate);
              }
            } catch (iceErr) {
              console.warn("⚠️ Failed to add ICE candidate:", iceErr);
            }
          }
        } catch (err) {
          console.error("💥 WebRTC signaling error:", err);
          setRobotError("Lỗi xử lý signaling");
          setIsLoading(false);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket signaling error:", err);
        setRobotError("Lỗi kết nối signaling");
        setIsLoading(false);
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket signaling closed");
        isClosed = true;
        setIsWebRTCStarted(false);
      };

    } catch (err) {
      console.error("💥 Failed to initialize WebRTC:", err);
      setRobotError("Không thể khởi tạo WebRTC");
      setIsLoading(false);
    }
  };

  // Hàm cleanup WebRTC connection
  const cleanupWebRTCConnection = () => {
    console.log("🧹 Cleaning up WebRTC connection");
    
    setIsWebRTCStarted(false);
    
    // Clear video
    if (robotVideoRef.current) {
      robotVideoRef.current.srcObject = null;
    }
    
    // Close WebSocket
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    } catch (e) {
      console.warn("⚠️ Error closing WebSocket:", e);
    }
    
    // Close PeerConnection
    try {
      if (pcRef.current) {
        pcRef.current.close();
      }
      pcRef.current = null;
    } catch (e) {
      console.warn("⚠️ Error closing PeerConnection:", e);
    }
  };

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

  // Robot Mode Effect - Chỉ setup UI, KHÔNG tự động kết nối
  useEffect(() => {
    if (mode !== "robot" || !selectedRobotSerial) {
      // Cleanup khi rời robot mode
      if (mode !== "robot") {
        cleanupWebRTCConnection();
      }
      return;
    }

    console.log("🤖 Robot mode activated for", selectedRobotSerial);
    console.log("� Ready to connect. Click 'Start' to begin WebRTC.");
    
    setIsLoading(false);
    setRobotError(null);
    setIsWebRTCStarted(false);

    // Cleanup function
    return () => {
      console.log("🧹 Robot mode cleanup");
      
      // Gửi stop command nếu đang active
      if (isWebRTCStarted && selectedRobotSerial) {
        try {
          sendWebRTCCommand(selectedRobotSerial, "webrtc_stop");
        } catch (e) {
          console.warn("⚠️ Error sending stop during cleanup:", e);
        }
      }
      
      cleanupWebRTCConnection();
    };
  }, [mode, selectedRobotSerial]);

  // Fullscreen
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

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Camera Studio
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý và theo dõi video từ webcam hoặc robot Alpha Mini
          </p>
        </div>

        <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-lg">
          <CardContent className="p-6 lg:p-8">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "webcam" | "robot")}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <TabsList className="bg-gray-100/80 p-1 rounded-2xl w-full lg:w-auto">
                  <TabsTrigger
                    value="webcam"
                    className="flex-1 lg:flex-none data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 rounded-xl py-3 px-6 transition-all duration-300 font-medium"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Webcam
                  </TabsTrigger>
                  <TabsTrigger
                    value="robot"
                    className="flex-1 lg:flex-none data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-600 rounded-xl py-3 px-6 transition-all duration-300 font-medium"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Robot Camera
                  </TabsTrigger>
                </TabsList>

                {/* Status Badge */}
                <Badge 
                  variant={isLoading ? "secondary" : robotError ? "destructive" : isWebRTCStarted ? "default" : "outline"}
                  className="px-4 py-2 text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : robotError ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : isWebRTCStarted ? (
                      <Radio className="w-4 h-4" />
                    ) : (
                      <Radio className="w-4 h-4 opacity-50" />
                    )}
                    <span>
                      {mode === "webcam"
                        ? isLoading
                          ? "Khởi động Webcam..."
                          : "Webcam hoạt động"
                        : isLoading
                          ? "Đang kết nối Robot..."
                          : robotError
                            ? robotError
                            : isWebRTCStarted
                              ? "Robot Camera hoạt động"
                              : "Robot Camera chưa bắt đầu"}
                    </span>
                  </div>
                </Badge>

                {/* WebRTC Controls - Chỉ hiện khi ở robot mode */}
                {mode === "robot" && selectedRobotSerial && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={sendWebRTCStart}
                      disabled={isLoading || isWebRTCStarted}
                      size="sm"
                      variant="default"
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                    
                    <Button
                      onClick={sendWebRTCStop}
                      disabled={isLoading || !isWebRTCStarted}
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="webcam" className="mt-0">
                <div className="relative">
                  <div
                    ref={webcamContainerRef}
                    className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl group"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <div className="text-white text-center">
                          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
                          <p className="text-lg font-medium">Đang khởi động webcam...</p>
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
                    
                    {/* Fullscreen Button */}
                    <Button
                      onClick={toggleFullscreen}
                      size="sm"
                      variant="secondary"
                      className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>

                    {/* Video overlay info */}
                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4" />
                        <span>Webcam đang hoạt động</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="robot" className="mt-0">
                <div className="relative">
                  <div
                    ref={robotContainerRef}
                    className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl group"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <div className="text-white text-center">
                          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
                          <p className="text-lg font-medium">Đang kết nối tới robot...</p>
                        </div>
                      </div>
                    )}
                    
                    {robotError && (
                      <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60 backdrop-blur-sm z-20">
                        <div className="text-center">
                          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                          <p className="text-xl font-medium">{robotError}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative w-full h-full overflow-hidden rounded-3xl bg-gray-900">
                      <video
                        ref={robotVideoRef}
                        autoPlay
                        playsInline
                        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
                        style={{
                          transform: 'translate(-50%, -50%) rotate(270deg)',
                          transformOrigin: 'center center',
                        }}
                      />
                    </div>

                    {/* Fullscreen Button */}
                    <Button
                      onClick={toggleFullscreen}
                      size="sm"
                      variant="secondary"
                      className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>

                    {/* Video overlay info */}
                    {!robotError && !isLoading && (
                      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center gap-2 text-sm">
                          <Bot className="w-4 h-4" />
                          <span>Robot camera đang hoạt động</span>
                        </div>
                      </div>
                    )}
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

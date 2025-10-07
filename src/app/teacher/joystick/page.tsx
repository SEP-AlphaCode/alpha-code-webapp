'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotCommand } from '@/hooks/use-robot-command';
import { useRobotStore } from '@/hooks/use-robot-store';
import { RobotSelector } from '@/components/teacher/robot-selector';

interface JoystickPosition {
  x: number;
  y: number;
}

interface ButtonState {
  [key: string]: boolean;
}

export default function JoystickPage() {
  const [leftJoystick, setLeftJoystick] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [rightJoystick, setRightJoystick] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [buttons, setButtons] = useState<ButtonState>({
    A: false,
    B: false,
    X: false,
    Y: false,
    L1: false,
    L2: false,
    R1: false,
    R2: false,
    START: false,
    SELECT: false,
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });

  // Robot control setup
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const setNotify = (msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 3000);
  };

  const { sendCommandToBackend } = useRobotCommand(setNotify);
  const { selectedRobot, selectedRobotSerial, initializeMockData } = useRobotStore();

  // Action codes for ABXY buttons - specific robot actions
  const actionCodes = {
    A: '027',           // Ngồi xuống
    B: 'dance_0001en',             // Ngồi xổm
    X: '007',           // Đứng lên
    Y: '015',         // Vẫy tay
  };

  const actionDescriptions = {
    A: { name: 'Ngồi xuống', category: 'action' as const },
    B: { name: 'Nhảy', category: 'action' as const },
    X: { name: 'Đứng lên', category: 'action' as const },
    Y: { name: 'Vẫy tay', category: 'action' as const },
  };

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  // Joystick drag handlers
  const handleJoystickMouseDown = (isLeft: boolean) => {
    if (isLeft) {
      isDraggingLeft.current = true;
    } else {
      isDraggingRight.current = true;
    }
  };

  const handleJoystickMouseMove = (e: MouseEvent) => {
    if (isDraggingLeft.current && leftJoystickRef.current) {
      updateJoystickPosition(e, leftJoystickRef.current, setLeftJoystick);
    }
    if (isDraggingRight.current && rightJoystickRef.current) {
      updateJoystickPosition(e, rightJoystickRef.current, setRightJoystick);
    }
  };

  const handleJoystickMouseUp = () => {
    isDraggingLeft.current = false;
    isDraggingRight.current = false;
    setLeftJoystick({ x: 0, y: 0 });
    setRightJoystick({ x: 0, y: 0 });
  };

  const updateJoystickPosition = (
    e: MouseEvent,
    joystickElement: HTMLDivElement,
    setPosition: React.Dispatch<React.SetStateAction<JoystickPosition>>
  ) => {
    const rect = joystickElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRadius = centerX - 20;

    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const limitedDistance = Math.min(distance, maxRadius);

    const angle = Math.atan2(y, x);
    const limitedX = Math.cos(angle) * limitedDistance;
    const limitedY = Math.sin(angle) * limitedDistance;

    setPosition({
      x: limitedX / maxRadius,
      y: limitedY / maxRadius,
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleJoystickMouseMove);
    document.addEventListener('mouseup', handleJoystickMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleJoystickMouseMove);
      document.removeEventListener('mouseup', handleJoystickMouseUp);
    };
  }, []);

  const handleButtonPress = (buttonName: string) => {
    setButtons(prev => ({ ...prev, [buttonName]: !prev[buttonName] }));
    setTimeout(() => {
      setButtons(prev => ({ ...prev, [buttonName]: false }));
    }, 150);
  };

  const handleActionButtonPress = async (buttonName: 'A' | 'B' | 'X' | 'Y') => {
    // Set button visual state
    setButtons(prev => ({ ...prev, [buttonName]: true }));
    setTimeout(() => {
      setButtons(prev => ({ ...prev, [buttonName]: false }));
    }, 150);

    // Send robot command - all are action type now
    await handleSendCommand(actionCodes[buttonName], 'action');
  };

  const handleSendCommand = async (actionCode: string, type: "action" | "expression" = "action") => {
    if (!selectedRobotSerial || !selectedRobot) {
      setNotify("Bạn chưa chọn robot!", "error");
      return Promise.resolve();
    }
    if (selectedRobot.status === "offline") {
      setNotify(`Robot ${selectedRobot.name} đang offline!`, "error");
      return Promise.resolve();
    }
    await sendCommandToBackend(actionCode, selectedRobotSerial, type);
  };

  const handleButtonHold = (buttonName: string, isPressed: boolean) => {
    setButtons(prev => ({ ...prev, [buttonName]: isPressed }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Game Controller Simulator</h1>
          <p className="text-blue-200">Giả lập tay cầm chơi game với đầy đủ chức năng</p>
        </div>

        {/* Robot Selector */}
        <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Chọn Robot</h3>
              <div className="flex-1 max-w-md ml-4">
                <RobotSelector />
              </div>
            </div>
            {selectedRobot && (
              <div className="mt-2 text-sm text-gray-300">
                Đã chọn: <span className="text-blue-400">{selectedRobot.name}</span>
                <Badge 
                  variant={selectedRobot.status === 'online' ? 'default' : 'destructive'} 
                  className="ml-2"
                >
                  {selectedRobot.status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controller Display */}
        <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm mb-6">
          <CardContent className="p-8">
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-4xl">
                {/* Controller Body */}
                <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl p-8 border-4 border-gray-600 shadow-2xl">
                  <div className="grid grid-cols-3 gap-8 items-center">
                    
                    {/* Left Side - Left Joystick + D-Pad */}
                    <div className="space-y-6">
                      {/* Left Joystick */}
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="text-xs">Left Stick</Badge>
                        <div
                          ref={leftJoystickRef}
                          className="relative w-24 h-24 bg-gray-900 rounded-full border-4 border-gray-500 cursor-pointer"
                          onMouseDown={() => handleJoystickMouseDown(true)}
                        >
                          <div
                            className="absolute w-6 h-6 bg-blue-400 rounded-full shadow-lg transition-all duration-100"
                            style={{
                              left: `calc(50% + ${leftJoystick.x * 30}px - 12px)`,
                              top: `calc(50% + ${leftJoystick.y * 30}px - 12px)`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-300 text-center">
                          X: {(leftJoystick.x * 100).toFixed(0)}%<br/>
                          Y: {(leftJoystick.y * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* D-Pad */}
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="text-xs">D-Pad</Badge>
                        <div className="relative">
                          <div className="grid grid-cols-3 gap-1 w-24 h-24">
                            <div></div>
                            <Button
                              variant={buttons.UP ? "default" : "outline"}
                              size="sm"
                              className="h-6 w-6 p-0 rounded-sm"
                              onMouseDown={() => handleButtonHold('UP', true)}
                              onMouseUp={() => handleButtonHold('UP', false)}
                              onMouseLeave={() => handleButtonHold('UP', false)}
                            >
                              ↑
                            </Button>
                            <div></div>
                            <Button
                              variant={buttons.LEFT ? "default" : "outline"}
                              size="sm"
                              className="h-6 w-6 p-0 rounded-sm"
                              onMouseDown={() => handleButtonHold('LEFT', true)}
                              onMouseUp={() => handleButtonHold('LEFT', false)}
                              onMouseLeave={() => handleButtonHold('LEFT', false)}
                            >
                              ←
                            </Button>
                            <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                            <Button
                              variant={buttons.RIGHT ? "default" : "outline"}
                              size="sm"
                              className="h-6 w-6 p-0 rounded-sm"
                              onMouseDown={() => handleButtonHold('RIGHT', true)}
                              onMouseUp={() => handleButtonHold('RIGHT', false)}
                              onMouseLeave={() => handleButtonHold('RIGHT', false)}
                            >
                              →
                            </Button>
                            <div></div>
                            <Button
                              variant={buttons.DOWN ? "default" : "outline"}
                              size="sm"
                              className="h-6 w-6 p-0 rounded-sm"
                              onMouseDown={() => handleButtonHold('DOWN', true)}
                              onMouseUp={() => handleButtonHold('DOWN', false)}
                              onMouseLeave={() => handleButtonHold('DOWN', false)}
                            >
                              ↓
                            </Button>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center - Start/Select + Logo */}
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                        🎮
                      </div>
                      
                      <div className="flex space-x-4">
                        <Button
                          variant={buttons.SELECT ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleButtonPress('SELECT')}
                        >
                          SELECT
                        </Button>
                        <Button
                          variant={buttons.START ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleButtonPress('START')}
                        >
                          START
                        </Button>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons + Right Joystick */}
                    <div className="space-y-6">
                      {/* Action Buttons (ABXY) */}
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="text-xs">Action Buttons</Badge>
                        <div className="relative">
                          <div className="grid grid-cols-3 gap-1 w-24 h-24">
                            <div></div>
                            <Button
                              variant={buttons.Y ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold"
                              onClick={() => handleActionButtonPress('Y')}
                              title="Đứng lên"
                            >
                              Y
                            </Button>
                            <div></div>
                            <Button
                              variant={buttons.X ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                              onClick={() => handleActionButtonPress('X')}
                              title="Vẫy tay"
                            >
                              X
                            </Button>
                            <div className="w-8 h-8"></div>
                            <Button
                              variant={buttons.B ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold"
                              onClick={() => handleActionButtonPress('B')}
                              title="Nhảy"
                            >
                              B
                            </Button>
                            <div></div>
                            <Button
                              variant={buttons.A ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                              onClick={() => handleActionButtonPress('A')}
                              title="Ngồi xuống"
                            >
                              A
                            </Button>
                            <div></div>
                          </div>
                        </div>
                        {/* Action descriptions */}
                        <div className="text-xs text-gray-300 text-center space-y-1">
                          <div>🟡 A: Ngồi xuống</div>
                          <div>🔴 B: Nhảy</div>
                          <div>🔵 X: Vẫy tay</div>
                          <div>🟢 Y: Đứng lêny</div>
                        </div>
                      </div>

                      {/* Right Joystick */}
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="secondary" className="text-xs">Right Stick</Badge>
                        <div
                          ref={rightJoystickRef}
                          className="relative w-24 h-24 bg-gray-900 rounded-full border-4 border-gray-500 cursor-pointer"
                          onMouseDown={() => handleJoystickMouseDown(false)}
                        >
                          <div
                            className="absolute w-6 h-6 bg-red-400 rounded-full shadow-lg transition-all duration-100"
                            style={{
                              left: `calc(50% + ${rightJoystick.x * 30}px - 12px)`,
                              top: `calc(50% + ${rightJoystick.y * 30}px - 12px)`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-300 text-center">
                          X: {(rightJoystick.x * 100).toFixed(0)}%<br/>
                          Y: {(rightJoystick.y * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shoulder Buttons */}
                  <div className="flex justify-between mt-4 px-8">
                    <div className="flex space-x-2">
                      <Button
                        variant={buttons.L1 ? "default" : "outline"}
                        size="sm"
                        onMouseDown={() => handleButtonHold('L1', true)}
                        onMouseUp={() => handleButtonHold('L1', false)}
                        onMouseLeave={() => handleButtonHold('L1', false)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        L1
                      </Button>
                      <Button
                        variant={buttons.L2 ? "default" : "outline"}
                        size="sm"
                        onMouseDown={() => handleButtonHold('L2', true)}
                        onMouseUp={() => handleButtonHold('L2', false)}
                        onMouseLeave={() => handleButtonHold('L2', false)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        L2
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={buttons.R1 ? "default" : "outline"}
                        size="sm"
                        onMouseDown={() => handleButtonHold('R1', true)}
                        onMouseUp={() => handleButtonHold('R1', false)}
                        onMouseLeave={() => handleButtonHold('R1', false)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        R1
                      </Button>
                      <Button
                        variant={buttons.R2 ? "default" : "outline"}
                        size="sm"
                        onMouseDown={() => handleButtonHold('R2', true)}
                        onMouseUp={() => handleButtonHold('R2', false)}
                        onMouseLeave={() => handleButtonHold('R2', false)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        R2
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Panel */}
        <Card className="bg-gray-800/50 border-gray-600 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Controller Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Joystick Values */}
              <div className="space-y-2">
                <h4 className="font-medium text-blue-300">Joystick Values</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Left Stick: ({(leftJoystick.x * 100).toFixed(1)}, {(leftJoystick.y * 100).toFixed(1)})</div>
                  <div>Right Stick: ({(rightJoystick.x * 100).toFixed(1)}, {(rightJoystick.y * 100).toFixed(1)})</div>
                </div>
              </div>

              {/* Button States */}
              <div className="space-y-2">
                <h4 className="font-medium text-green-300">Button States</h4>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  {Object.entries(buttons).map(([button, pressed]) => (
                    <Badge
                      key={button}
                      variant={pressed ? "default" : "outline"}
                      className={`text-center ${pressed ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      {button}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Robot Actions */}
              <div className="space-y-2">
                <h4 className="font-medium text-purple-300">Robot Actions</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>🟡 A: Ngồi xuống (sitdown)</div>
                  <div>🔴 B: Ngồi xổm (squat)</div>
                  <div>🔵 X: Đứng lên (standup)</div>
                  <div>🟢 Y: Vẫy tay (wave_hand)</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="font-medium text-orange-300">Instructions</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>• Kéo thả joystick để di chuyển</div>
                  <div>• Click ABXY để thực hiện hành động</div>
                  <div>• Chọn robot trước khi điều khiển</div>
                  <div>• Xem các hành động cụ thể ở trên</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification */}
      {notify && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 ${
            notify.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notify.msg}
        </div>
      )}
    </div>
  );
}

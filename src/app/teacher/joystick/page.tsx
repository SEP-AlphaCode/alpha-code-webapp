'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRobotCommand } from '@/hooks/use-robot-command';
import { useRobotStore } from '@/hooks/use-robot-store';
import JoystickConfigurationModal from '@/components/teacher/joystick/joystick-configuration-modal';
import { useJoystick } from '@/features/activities/hooks/use-joystick';
import { Joystick } from '@/types/joystick';
import { getUserInfoFromToken } from '@/utils/tokenUtils';

interface JoystickPosition {
  x: number;
  y: number;
}

interface ButtonState {
  [key: string]: boolean;
}

export default function JoystickPage() {
  // --- State ---
  const [leftJoystick, setLeftJoystick] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [buttons, setButtons] = useState<ButtonState>({
    A: false,
    B: false,
    X: false,
    Y: false,
    START: false,
    SELECT: false,
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [notify, setNotifyState] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const setNotify = (msg: string, type: 'success' | 'error') => {
    setNotifyState({ msg, type });
    setTimeout(() => setNotifyState(null), 3000);
  };

  // hooks and stores
  const { sendCommandToBackend } = useRobotCommand(setNotify);
  const { selectedRobot, selectedRobotSerial, initializeMockData } = useRobotStore();
  const { useGetJoystickByAccountRobot } = useJoystick();

  // fixed robotId example (you had this)
  const robotId = '7754417e-e9a4-48e4-8f72-164a612403e0';

  // accountId derivation (memoized)
  const accountId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        const id = userInfo?.id || '';
        return id;
      }
    }
    return '';
  }, []);

  // fetch joystick config
  const { data: joystickData, error: joystickError } =
    useGetJoystickByAccountRobot(accountId, robotId);

  // caching fallback
  const effectiveJoystickData = useMemo(() => {
    if (joystickData) {
      const cacheKey = `joystick_${accountId}_${robotId}`;
      try {
        localStorage.setItem(cacheKey, JSON.stringify(joystickData));
      } catch (_e) {
        // ignore localStorage error
      }
      return joystickData;
    }

    if (joystickError) {
      const cacheKey = `joystick_${accountId}_${robotId}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch (_e) {
          // ignore
        }
      }
    }

    return joystickData;
  }, [joystickData, joystickError, accountId, robotId]);

  const mockJoystickData = useMemo(
    () => ({
      joysticks: [
        {
          buttonCode: 'A',
          danceId: 'dee9a7a3-bb8a-4ca2-a562-ba9384614bc9',
          danceName: 'Dance 2',
          danceCode: 'dance_0002en',
          actionId: null,
          actionName: null,
          actionCode: null,
        },
        {
          buttonCode: 'B',
          actionId: '89145fc0-7871-456b-96c5-ce23a285c612',
          actionName: 'Squat',
          actionCode: '031',
          danceId: null,
          danceName: null,
          danceCode: null,
        },
      ],
    }),
    []
  );

  const finalJoystickData = useMemo(() => {
    return effectiveJoystickData?.joysticks && effectiveJoystickData.joysticks.length > 0
      ? effectiveJoystickData
      : mockJoystickData;
  }, [effectiveJoystickData, mockJoystickData]);

  const [actionCodes, setActionCodes] = useState<Record<string, string>>({});
  const [actionDescriptions, setActionDescriptions] = useState<{
    [key: string]: { name: string; category: 'action' | 'dance' | 'expression' | 'skill' | 'extended_action' };
  }>({});

  useEffect(() => {
    if (finalJoystickData?.joysticks && finalJoystickData.joysticks.length > 0) {
      const newActionCodes: Record<string, string> = {};
      const newActionDescriptions: Record<string, { name: string; category: 'action' | 'dance' | 'expression' | 'skill' | 'extended_action' }> =
        {};

      finalJoystickData.joysticks.forEach((joystick: Joystick) => {
        const buttonName = joystick.buttonCode as 'A' | 'B' | 'X' | 'Y';

        if (['A', 'B', 'X', 'Y'].includes(buttonName)) {
          let actionCode = '';
          let actionName = '';
          let category: 'action' | 'dance' | 'expression' | 'skill' | 'extended_action' = 'action';

          if (joystick.actionId && joystick.actionName && joystick.actionCode) {
            actionCode = joystick.actionCode;
            actionName = joystick.actionName;
            category = 'action';
          } else if (joystick.danceId && joystick.danceName && joystick.danceCode) {
            actionCode = joystick.danceCode;
            actionName = joystick.danceName;
            category = 'dance';
          } else if (joystick.expressionId && joystick.expressionName && joystick.expressionCode) {
            actionCode = joystick.expressionCode;
            actionName = joystick.expressionName;
            category = 'expression';
          } else if (joystick.skillId && joystick.skillName && joystick.skillCode) {
            actionCode = joystick.skillCode;
            actionName = joystick.skillName;
            category = 'skill';
          } else if (
            joystick.extendedActionId &&
            joystick.extendedActionName &&
            joystick.extendedActionCode
          ) {
            actionCode = joystick.extendedActionCode;
            actionName = joystick.extendedActionName;
            category = 'extended_action';
          }

          if (actionCode && actionName) {
            newActionCodes[buttonName] = actionCode;
            newActionDescriptions[buttonName] = {
              name: actionName,
              category,
            };
          }
        }
      });

      setActionCodes(newActionCodes);
      setActionDescriptions(newActionDescriptions);
    } else {
      setActionCodes({});
      setActionDescriptions({});
    }
  }, [finalJoystickData]);

  // initialize mock data if needed
  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  // --- Joystick interaction (support mouse + touch) ---
  const leftJoystickRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const computePositionFromPointer = useCallback(
    (clientX: number, clientY: number, el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxRadius = centerX - 16; // padding

      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;
      const distance = Math.sqrt(x * x + y * y);
      const limitedDistance = Math.min(distance, maxRadius);
      const angle = Math.atan2(y, x);
      const limitedX = Math.cos(angle) * limitedDistance;
      const limitedY = Math.sin(angle) * limitedDistance;

      return {
        x: limitedX / maxRadius,
        y: limitedY / maxRadius,
      };
    },
    []
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current || !leftJoystickRef.current) return;
      const pos = computePositionFromPointer(e.clientX, e.clientY, leftJoystickRef.current);
      setLeftJoystick(pos);
    },
    [computePositionFromPointer]
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
    setLeftJoystick({ x: 0, y: 0 });
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // capture pointer for consistent events
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // first position
    if (leftJoystickRef.current) {
      const pos = computePositionFromPointer(e.clientX, e.clientY, leftJoystickRef.current);
      setLeftJoystick(pos);
    }
  };

  // For older browsers / fallback, also support touch events
  useEffect(() => {
    const touchMove = (ev: TouchEvent) => {
      if (!draggingRef.current || !leftJoystickRef.current) return;
      const t = ev.touches[0];
      if (!t) return;
      const pos = computePositionFromPointer(t.clientX, t.clientY, leftJoystickRef.current);
      setLeftJoystick(pos);
    };
    const handleTouchEnd = () => {
      draggingRef.current = false;
      setLeftJoystick({ x: 0, y: 0 });
    };

    window.addEventListener('touchmove', touchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [computePositionFromPointer]);

  // --- Button handlers ---
  const handleButtonPress = (buttonName: string) => {
    setButtons(prev => ({ ...prev, [buttonName]: !prev[buttonName] }));
    setTimeout(() => {
      setButtons(prev => ({ ...prev, [buttonName]: false }));
    }, 150);
  };

  const handleActionButtonPress = async (buttonName: 'A' | 'B' | 'X' | 'Y') => {
    setButtons(prev => ({ ...prev, [buttonName]: true }));
    setTimeout(() => {
      setButtons(prev => ({ ...prev, [buttonName]: false }));
    }, 150);

    if (!actionCodes[buttonName]) {
      setNotify(`Nút ${buttonName} chưa được cấu hình!`, 'error');
      return;
    }

    const actionCategory = actionDescriptions[buttonName]?.category || 'action';
    let actionType: 'action' | 'expression' | 'skill_helper' | 'extended_action';
    
    switch (actionCategory) {
      case 'expression':
        actionType = 'expression';
        break;
      case 'skill':
        actionType = 'skill_helper';
        break;
      case 'extended_action':
        actionType = 'extended_action';
        break;
      case 'action':
      case 'dance':
      default:
        actionType = 'action';
        break;
    }

    await handleSendCommand(actionCodes[buttonName], actionType);
  };

  // Handler for D-pad buttons with fixed movement commands
  const handleDPadButtonPress = async (direction: 'up' | 'down' | 'left' | 'right') => {
    setButtons(prev => ({ ...prev, [direction]: true }));
    setTimeout(() => {
      setButtons(prev => ({ ...prev, [direction]: false }));
    }, 150);

    // Fixed command mapping for D-pad
    const commandMap = {
      'up': 'Keep_moving_forward',     // Tiến lên
      'down': 'Keep_going_backwards',  // Lùi lại  
      'left': 'Keep_turning_left',      // Quay trái
      'right': 'Keep_turning_right'     // Quay phải
    };

    // D-pad commands are extended actions
    const actionCode = commandMap[direction];
    await handleSendCommand(actionCode, 'skill_helper');
  };

  const handleSendCommand = async (actionCode: string, type: 'action' | 'expression' | 'skill_helper' | 'extended_action' = 'action') => {
    if (!selectedRobotSerial || !selectedRobot) {
      setNotify('Bạn chưa chọn robot!', 'error');
      return Promise.resolve();
    }
    if (selectedRobot.status === 'offline') {
      setNotify(`Robot ${selectedRobot.name} đang offline!`, 'error');
      return Promise.resolve();
    }
    await sendCommandToBackend(actionCode, selectedRobotSerial, type);
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">🎮 Controller Studio</h1>
            <p className="text-sm text-gray-600">Simulator • Interactive preview • Map buttons to robot actions</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsConfigModalOpen(true)}
              variant="ghost"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              ⚙️ Cấu hình Joystick
            </Button>
          </div>
        </header>

        {/* Controller */}
        <div className="relative rounded-[3rem] overflow-visible mb-6">
          {/* soft shadow */}
          <div className="absolute inset-x-6 -bottom-8 h-24 blur-3xl opacity-20 rounded-3xl bg-gray-500/60" />

          {/* Controller body */}
          <div className="relative z-10 mx-auto bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-[2.5rem] border border-gray-300 shadow-2xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  {/* Left Grip: joystick + DPad */}
                  <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                    <Badge variant="secondary" className="mb-2 bg-gray-200 text-gray-700">Left Stick</Badge>

                    <div
                      ref={leftJoystickRef as React.RefObject<HTMLDivElement>}
                      onPointerDown={handlePointerDown}
                      // To support touch initial capture: onPointerDown handles pointer
                      className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-400 flex items-center justify-center shadow-inner cursor-grab active:cursor-grabbing"
                      style={{ touchAction: 'none' }}
                    >
                      {/* subtle ring */}
                      <div className="absolute -inset-1 rounded-full opacity-30 blur-sm bg-gradient-to-br from-blue-500 to-blue-600" />

                      <motion.div
                        animate={{ x: leftJoystick.x * 28, y: leftJoystick.y * 28 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                        className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full border-2 border-blue-400 shadow-lg"
                      />
                    </div>

                    <div className="text-xs text-gray-600 font-mono text-center">
                      X: {(leftJoystick.x * 100).toFixed(0)} • Y: {(leftJoystick.y * 100).toFixed(0)}
                    </div>

                    {/* D-Pad */}
                    <div className="mt-4">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700">D-Pad</Badge>
                      <div className="mt-3 grid grid-cols-3 gap-1 w-32 h-32">
                        <div />
                        <Button
                          variant={buttons.up ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 w-10 p-0 rounded-sm text-base font-bold"
                          onClick={() => handleDPadButtonPress('up')}
                        >
                          ↑
                        </Button>
                        <div />
                        <Button
                          variant={buttons.left ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 w-10 p-0 rounded-sm text-base font-bold"
                          onClick={() => handleDPadButtonPress('left')}
                        >
                          ←
                        </Button>
                        <div className="w-10 h-10 bg-gray-300 rounded-sm" />
                        <Button
                          variant={buttons.right ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 w-10 p-0 rounded-sm text-base font-bold"
                          onClick={() => handleDPadButtonPress('right')}
                        >
                          →
                        </Button>
                        <div />
                        <Button
                          variant={buttons.down ? 'default' : 'outline'}
                          size="sm"
                          className="h-10 w-10 p-0 rounded-sm text-base font-bold"
                          onClick={() => handleDPadButtonPress('down')}
                        >
                          ↓
                        </Button>
                        <div />
                      </div>
                    </div>
                  </div>

                  {/* Center Logo + Start/Select */}
                  <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                    <div className="relative">
                      <div
                        className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl shadow-2xl
                          ${selectedRobot?.status === 'online' ? 'ring-4 ring-blue-500/40' : 'ring-0'}`}
                        style={{
                          background:
                            'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.8), rgba(96,165,250,0.7) 40%, rgba(147,197,253,0.5) 100%)',
                        }}
                      >
                        🎮
                      </div>
                      {/* <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                        {selectedRobot ? (
                          <span>
                            {selectedRobot.name} • <span className="font-semibold">{selectedRobot.status}</span>
                          </span>
                        ) : (
                          'Chưa chọn robot'
                        )}
                      </div> */}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant={buttons.SELECT ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => handleButtonPress('SELECT')}
                        className="px-4 py-2 font-semibold"
                      >
                        SELECT
                      </Button>
                      <Button
                        variant={buttons.START ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => handleButtonPress('START')}
                        className="px-4 py-2 font-semibold"
                      >
                        START
                      </Button>
                    </div>
                  </div>

                  {/* Right Grip: ABXY */}
                  <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
                    <Badge variant="secondary">Action Buttons</Badge>

                    <div className="relative grid grid-cols-3 gap-3 w-44 h-44">
                      {/* Y */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionButtonPress('Y')}
                        title={actionDescriptions.Y?.name || 'Y Button'}
                        className={`col-start-2 row-start-1 w-12 h-12 rounded-full font-bold text-lg text-white shadow-lg ${
                          buttons.Y ? 'scale-95' : ''
                        }`}
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,1))',
                        }}
                      >
                        Y
                      </motion.button>

                      {/* X */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionButtonPress('X')}
                        title={actionDescriptions.X?.name || 'X Button'}
                        className="col-start-1 row-start-2 w-12 h-12 rounded-full font-bold text-lg text-white shadow-lg"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(37,99,235,1), rgba(59,130,246,1))',
                        }}
                      >
                        X
                      </motion.button>

                      <div className="w-12 h-12" />

                      {/* B */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionButtonPress('B')}
                        title={actionDescriptions.B?.name || 'B Button'}
                        className="col-start-3 row-start-2 w-12 h-12 rounded-full font-bold text-lg text-white shadow-lg"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(239,68,68,1), rgba(220,38,38,1))',
                        }}
                      >
                        B
                      </motion.button>

                      <div />

                      {/* A */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionButtonPress('A')}
                        title={actionDescriptions.A?.name || 'A Button'}
                        className="col-start-2 row-start-3 w-12 h-12 rounded-full font-bold text-lg text-white shadow-lg"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(245,158,11,1), rgba(234,88,12,1))',
                        }}
                      >
                        A
                      </motion.button>
                    </div>

                    {/* action labels */}
                    <div className="text-sm text-gray-700 text-center space-y-1 mt-2 w-full ml-47">
                      <div className="flex items-center gap-2"><span>🟡 A:</span><span className="font-medium">{actionDescriptions.A?.name || 'Chưa cấu hình'}</span></div>
                      <div className="flex items-center gap-2"><span>🔴 B:</span><span className="font-medium">{actionDescriptions.B?.name || 'Chưa cấu hình'}</span></div>
                      <div className="flex items-center gap-2"><span>🔵 X:</span><span className="font-medium">{actionDescriptions.X?.name || 'Chưa cấu hình'}</span></div>
                      <div className="flex items-center gap-2"><span>🟢 Y:</span><span className="font-medium">{actionDescriptions.Y?.name || 'Chưa cấu hình'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Bottom status panel */}
        <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Joystick status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">🕹️ Joystick</h4>
                <div className="text-xs text-gray-600">Left: ({(leftJoystick.x * 100).toFixed(1)}, {(leftJoystick.y * 100).toFixed(1)})</div>
              </div>

              {/* Buttons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">🎛️ Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(buttons).map(([btn, pressed]) => (
                    <Badge key={btn} variant={pressed ? 'default' : 'outline'} className={`px-3 py-1 ${pressed ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {btn}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Robot actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">🎯 Mapped Actions</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>🟡 A: {actionDescriptions.A?.name || 'Chưa cấu hình'}</div>
                  <div>🔴 B: {actionDescriptions.B?.name || 'Chưa cấu hình'}</div>
                  <div>🔵 X: {actionDescriptions.X?.name || 'Chưa cấu hình'}</div>
                  <div>🟢 Y: {actionDescriptions.Y?.name || 'Chưa cấu hình'}</div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📋 Instructions</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Kéo/nhấn joystick để di chuyển</div>
                  <div>• Nhấn ABXY để gửi lệnh đến robot</div>
                  <div>• Chọn robot trước khi điều khiển</div>
                  <div>• Mở cấu hình để map nút</div>
                </div>
              </div>
            </div>
        </Card>
      </div>

      {/* Notification */}
      {notify && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold ${
            notify.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notify.msg}
        </div>
      )}

      {/* Config modal */}
      <JoystickConfigurationModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          // react-query will handle refetch if needed
        }}
        existingJoysticks={finalJoystickData?.joysticks || []}
        onSuccess={() => {
          // Modal already shows toast notification, no need for duplicate
        }}
      />
    </div>
  );
}

import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../../components/blockly-logic/toolbox';
import { blockControls, Operations } from '@/components/blockly-logic/control';
import { toast } from 'sonner';
import { loadModelIdData } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import Image from 'next/image';
import { Play, Square, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'blockly/blocks';
import 'blockly/javascript'; // Or the generator of your choice

type BlocklyUIProps = {
    robotModelId: string,
    serial: string,
    hasAllData: boolean,
    data: {
        actions: string[][],
        extActions: string[][],
        exps: string[][],
        skills: string[][]
    }
}

export default function BlocklyUI({ robotModelId, serial, hasAllData, data }: BlocklyUIProps) {
    const blocklyRef = useRef<HTMLDivElement>(null)
    const workspaceRef = useRef<Blockly.WorkspaceSvg>(undefined)
    const [wsHelper, setWsHelper] = useState<Operations>()
    const [codeGenerator, setCodeGenerator] = useState<JavascriptGenerator>()
    const [definedModels, setDefinedModel] = useState(new Set<string>())
    const [isRunning, setIsRunning] = useState(false)
    const [showRobot, setShowRobot] = useState(false)
    const key = 'AlphaCode'

    const executeCode = (code: string, resultKey: string) => {
        setIsRunning(true)
        setShowRobot(true)

        toast.success('🎉 Đang chạy chương trình...')
        try {
            // Use Function constructor to create an async function
            const fn = new Function(code)
            const x = fn()
            if (x.error) {
                toast.error(x.error)
                setShowRobot(false)
            } else {
                toast.success('✨ Đã chạy thành công!')
                setTimeout(() => setShowRobot(false), 2000)
            }
        }
        catch (e) {
            toast.error('❌ Lỗi khi chạy mã')
            setShowRobot(false)
        }
        finally {
            setIsRunning(false)
        }
    }

    const actualInit = () => {
        if (!workspaceRef.current) return;
        if (!blocklyRef.current) return;
        if (!wsHelper) return;

        if (!definedModels.has(robotModelId)) {
            const allBlocks = loadModelIdData(robotModelId, data.actions, data.extActions, data.exps, data.skills)
            Blockly.common.defineBlocksWithJsonArray(allBlocks)
        }

        const gen = buildCodeGeneratorForModelId(robotModelId, serial)
        setCodeGenerator(gen)

        workspaceRef.current?.updateToolbox(wsHelper.getDefaultToolbox())
        const newToolbox = wsHelper.getToolboxForRobotModel(robotModelId)
        // curToolbox.contents.push(robotCategory)
        workspaceRef.current.updateToolbox(newToolbox)
    }

    useEffect(() => {
        if (!blocklyRef || !blocklyRef.current) return;
        workspaceRef.current = Blockly.inject(blocklyRef.current, { toolbox })
        if (!workspaceRef.current) { return; }
        const tmp = blockControls(workspaceRef.current)
        setWsHelper(tmp)
        tmp.addStrayScrollbarDestructor?.(blocklyRef.current)
        tmp.setUpUI()
        return () => {
            if (!workspaceRef.current) { return; }
            workspaceRef.current.dispose()
            workspaceRef.current = undefined
        }
    }, [])

    useEffect(() => {
        if (!hasAllData) return;
        // Wipe the workspace
        wsHelper?.loadFromJson({})
        // Redo init
        actualInit()
        definedModels.add(robotModelId)
    }, [robotModelId, hasAllData])

    useEffect(() => {
        const gen = buildCodeGeneratorForModelId(robotModelId, serial)
        setCodeGenerator(gen)
    }, [serial])

    const handleRun = () => {
        if (!codeGenerator || !wsHelper) return;
        try {
            const code = wsHelper.makeListCode(codeGenerator);
            executeCode(code.code, code.listVar);
        } catch {
            toast.error('❌ Lỗi khi chạy mã')
        }
    }

    const handleStop = () => {
        setIsRunning(false);
        setShowRobot(false);
        toast.info('⏸️ Đã dừng thực thi');
    }

    const handleSave = () => {
        if (!wsHelper) return;
        const blockData = wsHelper.serialize();
        localStorage.setItem(key + '.' + robotModelId, JSON.stringify(blockData));
        toast.success("💾 Đã lưu kết quả!");
        workspaceRef.current?.getAllBlocks().forEach(b => {
            console.log(b);
        })
    }

    const handleLoad = () => {
        if (!wsHelper) return;
        const data = JSON.parse(localStorage.getItem(key + '.' + robotModelId) ?? "{}");
        if (data) {
            wsHelper.loadFromJson(data);
            toast.success("📂 Đã tải không gian làm việc!");
        } else {
            toast.error('❌ Không có dữ liệu để tải')
        }
    }

    const handleClear = () => {
        if (!wsHelper) return;
        wsHelper.loadFromJson({})
        toast.success("🗑️ Đã xóa tất cả khối!");
    }

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
            {/* Main Layout - Full Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar with Robot */}
                <div className="w-80 flex-shrink-0 bg-white border-r-4 border-blue-500 shadow-2xl flex flex-col">
                    {/* Robot Display Area */}
                    <div className="flex-1 bg-gradient-to-b from-blue-100 to-white p-6 flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <div className="relative">
                                <Image
                                    src="/running.png"
                                    alt="Robot"
                                    width={200}
                                    height={200}
                                    className="drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            {showRobot && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                                    <div className="text-6xl">✨</div>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Robot Alpha</h2>
                            <p className="text-gray-600 text-sm">Sẵn sàng lập trình!</p>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="bg-gray-900 p-6 space-y-3 border-t-4 border-blue-500">
                        <Button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-lg font-bold disabled:bg-gray-600 disabled:transform-none disabled:shadow-none"
                        >
                            <Play className="w-7 h-7" />
                            <span className="text-xl">Chạy Chương Trình</span>
                        </Button>

                        <Button
                            onClick={handleStop}
                            disabled={!isRunning}
                            className="w-full h-14 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base font-bold disabled:bg-gray-600 disabled:transform-none disabled:shadow-none"
                        >
                            <Square className="w-6 h-6" />
                            <span>Dừng</span>
                        </Button>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button
                                onClick={handleSave}
                                className="h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                            >
                                <Save className="w-5 h-5" />
                                <span>Lưu</span>
                            </Button>
                            <Button
                                onClick={handleLoad}
                                disabled={isRunning}
                                className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:bg-gray-600 disabled:transform-none"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Tải bản lưu</span>
                            </Button>
                        </div>

                        <Button
                            onClick={handleClear}
                            disabled={isRunning}
                            className="w-full h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:bg-gray-600 disabled:transform-none"
                        >
                            <span className="text-xl mr-2">🗑️</span>
                            <span>Xóa Hết</span>
                        </Button>
                    </div>
                </div>

                {/* Right Side - Workspace Area */}
                <div className="flex-1 min-w-0 flex flex-col bg-gray-100 overflow-hidden">
                    {/* Workspace Container */}
                    <div className="flex-1 bg-white m-4 rounded-2xl shadow-2xl border-2 border-gray-300 overflow-hidden">
                        <div className="relative w-full h-full">
                            <div
                                ref={blocklyRef}
                                className="absolute inset-0"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </div>

                    {/* Info Bar at Bottom */}
                    <div className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-lg border-2 border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-gray-700 text-sm font-medium">
                                Kéo khối từ bên trái vào không gian làm việc để bắt đầu lập trình robot của bạn!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../../components/blockly-logic/toolbox';
import { blockControls, Operations } from '@/components/blockly-logic/control';
import { toast } from 'sonner';
import { loadModelIdData } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
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
    const key = 'AlphaCode'
    const executeCode = (code: string, resultKey: string) => {
        setIsRunning(true)
        
        toast.success('Đang chạy')
        try {
            // Use Function constructor to create an async function
            const fn = new Function(code)
            const x = fn()
            if (x.error) {
                toast.error(x.error)
            } else {

                toast.success('Đã chạy thành công')
            }
        }
        catch (e) {
            toast.error('Lỗi biên dịch khi chạy mã')
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Toolbar */}
            <div className="mb-8 bg-white p-4 rounded-2xl shadow-lg sticky top-4 z-10">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
                    <button
                        onClick={() => {
                            if (!wsHelper) return;
                            const blockData = wsHelper.serialize();
                            localStorage.setItem(key + '.' + robotModelId, JSON.stringify(blockData));
                            toast.success("Đã lưu kết quả");
                        }}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
                    >
                        <span className="text-lg">💾</span>
                        <span>Lưu</span>
                    </button>
                    <button
                        onClick={() => {
                            if (!wsHelper) return;
                            const data = JSON.parse(localStorage.getItem(key + '.' + robotModelId) ?? "{}");
                            if (data) {
                                wsHelper.loadFromJson(data);
                            } else {
                                toast.error('Không thể tải không gian làm việc')
                            }
                        }}
                        disabled={isRunning}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:transform-none"
                    >
                        <span className="text-lg">📂</span>
                        <span>Tải không gian làm việc</span>
                    </button>
                    <button
                        onClick={() => {
                            if (!codeGenerator || !wsHelper) return;
                            try {
                                const code = wsHelper.makeListCode(codeGenerator);
                                executeCode(code.code, code.listVar);
                            } catch {
                                toast.error('Lỗi khi chạy mã')
                            }
                        }}
                        disabled={isRunning}
                        className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:transform-none"
                    >
                        <span className="text-lg">▶</span>
                        <span>Chạy</span>
                    </button>
                    <button
                        onClick={() => {
                            setIsRunning(false);
                            toast.info('Đã dừng thực thi');
                        }}
                        disabled={!isRunning}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-105 shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:transform-none"
                    >
                        <span className="text-lg">⏹</span>
                        <span>Dừng</span>
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative border border-gray-200 bg-white h-[700px]">
                    <div
                        ref={blocklyRef}
                        className="absolute inset-0"
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
}
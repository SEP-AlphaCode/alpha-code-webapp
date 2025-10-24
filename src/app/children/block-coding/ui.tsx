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
import * as Vi from 'blockly/msg/vi';
import { registerFieldColour } from '@blockly/field-colour';

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
    const [resultCode, setResultCode] = useState('')
    const [listResult, setListResult] = useState<{ code?: string, text?: string, lang?: string, type: string }[]>([])
    const [definedModels, setDefinedModel] = useState(new Set<string>())
    const key = 'AlphaCode'
    const executeCode = async (code: string) => {
        try {
            const fn = new Function(code);
            const result = fn();
            if(!result.success) return;
            toast.success('Dịch mã thành công')
            setListResult(result.list)
            wsHelper?.sendCommandToBackend(result.list, serial, (text: string, status: string) => {
                toast(text)
            })
        } catch (err) {
            console.log(err);
        } finally {
        }
    }

    const actualInit = async () => {
        if (!workspaceRef.current) return;
        if (!blocklyRef.current) return;
        if (!wsHelper) return;

        if (!definedModels.has(robotModelId)) {
            const allBlocks = loadModelIdData(robotModelId, data.actions, data.extActions, data.exps, data.skills)
            Blockly.common.defineBlocksWithJsonArray(allBlocks)
        }

        const gen = buildCodeGeneratorForModelId(robotModelId)
        setCodeGenerator(gen)

        workspaceRef.current?.updateToolbox(wsHelper.getDefaultToolbox())
        const newToolbox = wsHelper.getToolboxForRobotModel(robotModelId)
        // curToolbox.contents.push(robotCategory)
        workspaceRef.current.updateToolbox(newToolbox)
    }

    useEffect(() => {
        registerFieldColour()
        Blockly.setLocale(Vi as unknown as {[key: string]: string})
        Blockly.utils.colour.setHsvSaturation(0.7) // 0 (inclusive) to 1 (exclusive), defaulting to 0.45
        Blockly.utils.colour.setHsvValue(0.9) // 0 (inclusive) to 1 (exclusive), defaulting to 0.65

        if (!blocklyRef || !blocklyRef.current) return;
        workspaceRef.current = Blockly.inject(blocklyRef.current, { toolbox })
        if (!workspaceRef.current) { return; }
        const tmp = blockControls(workspaceRef.current)
        setWsHelper(tmp)
        tmp.addStrayScrollbarDestructor?.(blocklyRef.current)
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

    return (
        <div className="p-4 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center bg-gray-100 p-3 rounded-xl shadow-sm sticky top-0 z-10">
                <button
                    onClick={() => {
                        if (!wsHelper) return;
                        const blockData = wsHelper.serialize();
                        localStorage.setItem(key + '.' + robotModelId, JSON.stringify(blockData));
                        toast.success("Đã lưu kết quả");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    💾 Lưu
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    📂 Tải không gian làm việc
                </button>
                <button
                    onClick={() => {
                        if (!codeGenerator || !wsHelper) return;
                        try {
                            const code = wsHelper.makeListCode(codeGenerator);
                            setResultCode(code);
                        } catch { }
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                    🔤 Xem mã
                </button>
                <button
                    onClick={() => {
                        if (!codeGenerator || !wsHelper) return;
                        try {
                            const code = wsHelper.makeListCode(codeGenerator);
                            console.log(code);
                            executeCode(code);
                        } catch { }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    ▶ Chạy
                </button>
            </div>

            {/* Workspace + Code */}
            <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
                {/* Workspace container */}
                <div className="md:flex-[2] flex-[1] relative border-2 border-gray-300 shadow-inner bg-white min-h-[400px] md:min-h-[500px] flex-shrink-0">
                    <div
                        ref={blocklyRef}
                        className="absolute inset-0"
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>

                {/* Code display */}
                <pre
                    className="md:flex-[1] flex-[1] p-4 bg-gray-900 text-green-300 font-mono text-sm rounded-xl overflow-auto shadow-md min-h-[200px] md:min-h-[500px]"
                    dangerouslySetInnerHTML={{
                        __html: resultCode
                            .trim()
                            .replaceAll("\n", "<br/>")
                            .replaceAll("\t", '')
                    }}
                />
            </div>

            {/* Result */}
            <div className="space-y-2">
                <p className="font-semibold text-lg text-gray-700">Kết quả:</p>
                <div
                    className="p-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-mono text-sm text-gray-800 overflow-auto max-h-60"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(listResult, null, 2)
                    }}
                />
            </div>
        </div>
    );
}
import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { robotCategory, toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls, CATEGORY_NAME, Operations } from '@/components/blockly-logic/control';
import { toast } from 'sonner';
import { loadModelIdData } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import { randomUUID } from 'crypto';
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
    const key = 'AlphaCode'
    const executeCode = async (code: string) => {
        try {
            const fn = new Function(code);
            const result = fn();
            setListResult(result)
            wsHelper?.sendCommandToBackend(result, serial, (text: string, status: string) => {
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
        
        const allBlocks = loadModelIdData(data.actions, data.extActions, data.exps, data.skills)
        Blockly.common.defineBlocksWithJsonArray(allBlocks)
        const gen = buildCodeGeneratorForModelId()
        setCodeGenerator(gen)

        const curToolbox = JSON.parse(JSON.stringify(toolbox));
        
        workspaceRef.current?.updateToolbox(toolbox)
        curToolbox.contents.push(robotCategory)
        workspaceRef.current?.updateToolbox(curToolbox)
    }

    useEffect(() => {
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
        actualInit()
    }, [hasAllData])

    return (
        <div>
            <div className='*:border-2 space-x-5 mb-4'>
                <button onClick={(e) => {
                    if (!wsHelper) return;
                    const blockData = wsHelper.serialize()
                    localStorage.setItem(key, JSON.stringify(blockData))
                    toast.success('Saved')
                }}>Save</button>
                <button onClick={(e) => {
                    if (!wsHelper) return;
                    const data = JSON.parse(localStorage.getItem(key) ?? '{}')
                    if (data) {
                        wsHelper.loadFromJson(data)
                        toast.success('Loaded')
                    }
                }}>Load</button>
                <button onClick={(e) => {
                    if (!codeGenerator || !wsHelper) return;
                    try {
                        const code = wsHelper.makeListCode(codeGenerator)
                        setResultCode(code)
                    }
                    catch {

                    }
                }}>Translate to code</button>
                <button onClick={(e) => {
                    if (!codeGenerator || !wsHelper) return;
                    try {
                        const code = wsHelper.makeListCode(codeGenerator)
                        console.log(code);

                        executeCode(code)
                    }
                    catch {

                    }
                }}>Run code</button>
            </div>
            <div className='flex'>
                <div ref={blocklyRef} style={{ height: 500, width: 1000, overflow: 'auto' }} className=''></div>
                <code
                    className='p-2 bg-blue-800 text-white'
                    dangerouslySetInnerHTML={{
                        __html: resultCode.replaceAll('\n', '<br/>')
                            .replaceAll('\t', '&nbsp;&nbsp;')
                    }}
                />
            </div>
            <p>Kết quả:</p>
            <div
                className='p-2 border-2'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(listResult)?.replaceAll('\n', '<br/>').replaceAll('\t', '&nbsp;&nbsp;')
                }}
            />
        </div>
    );
}
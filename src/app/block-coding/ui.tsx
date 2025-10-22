import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { robotCategory, toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls, CATEGORY_NAME, Operations } from '@/components/blockly-logic/control';
import { toast } from 'sonner';
import { loadModelIdData } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
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
    const executeCode = (code: string) => {
        try {
            const fn = new Function(code);
            fn();
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
        const gen = buildCodeGeneratorForModelId(robotModelId, serial)
        setCodeGenerator(gen)

        const curToolbox = toolbox;
        toolbox.contents.push(robotCategory)
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
                }}>Save</button>
                <button onClick={(e) => {
                }}>Load</button>
                <button onClick={(e) => {
                    if(!codeGenerator || !wsHelper) return;
                    const code = wsHelper.translate(codeGenerator)
                    setResultCode(code)
                }}>Translate to code</button>
                <button onClick={(e) => {
                    executeCode(`console.log('Hello')`)
                }}>Run code</button>
            </div>
            <div className=''>
                <div ref={blocklyRef} style={{ height: 750, width: 1000, flexBasis: '100%', overflow: 'auto' }} className='border-2 border-red-300'></div>
                <div
                    className='border-2 p-2 bg-blue-50'
                    dangerouslySetInnerHTML={{ __html: resultCode.replaceAll('\n', '<br/>')
                        .replaceAll('\t', '&nbsp;&nbsp;')
                     }}
                />
            </div>
        </div>
    );
}
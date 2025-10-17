import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls } from '@/components/blockly-logic/control';
import { customBlocks } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';

export default function UseMe() {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<any>(null);
    const [saved, setSaved] = useState<undefined | { [key: string]: any }>()
    const [code, setCode] = useState('')
    const actions = blockControls()
    const key = 'workspace-state'
    const [gen, setGen] = useState<JavascriptGenerator | undefined>()
    useEffect(() => {
        console.log('UseMe component mounted');
        async function fn() {
            Blockly.common.defineBlocks(customBlocks)
            const s = await buildCodeGeneratorForModelId('abc', 'abc')
            setGen(s)
            if (blocklyRef.current && !workspaceRef.current) {
                // Only initialize if not already initialized
                workspaceRef.current = Blockly.inject(blocklyRef.current, {
                    toolbox: toolbox
                });
            }
        }

        fn()

        return () => {
            console.log('UseMe component unmounted');
            // Clean up Blockly workspace
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    return (
        <div>
            <div className='*:border-2 space-x-5 mb-4'>
                <button onClick={(e) => {
                    const state = actions.serialize(workspaceRef.current)
                    localStorage.setItem(key, JSON.stringify(state))
                    setSaved(state)
                }}>Save</button>
                <button onClick={(e) => {
                    const state = localStorage.getItem(key)
                    if (!state) return;
                    const json = JSON.parse(state)
                    actions.load(json, workspaceRef.current)
                    setSaved(json)
                }}>Load</button>
                <button onClick={(e) => {
                    if(!gen) return;
                    const c = actions.translate(gen, workspaceRef.current)
                    setCode(c)
                }}>Translate to code</button>
            </div>
            <div ref={blocklyRef} style={{ height: 500, width: 900 }}></div>
            <div className='grid grid-cols-2 *:border-2 *:p-2'>
                <div>
                    {
                        JSON.stringify(saved, undefined, '')
                    }
                </div>
                <div>
                    {code}
                </div>
            </div>
        </div>
    );
}
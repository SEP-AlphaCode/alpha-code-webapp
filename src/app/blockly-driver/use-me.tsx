import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { addRobotActions, toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls } from '@/components/blockly-logic/control';
import { customBlocks } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import { toast } from 'sonner';

export default function UseMe() {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<any>(null);
    const [saved, setSaved] = useState<undefined | { [key: string]: any }>()
    const [code, setCode] = useState('')
    const actions = blockControls()
    const key = 'workspace-state'
    const [gen, setGen] = useState<JavascriptGenerator | undefined>()
    const [curTool, setCurTool] = useState(toolbox)

    function inject(x: string) {
        if (blocklyRef.current && !workspaceRef.current) {
            toast.success(x)
            workspaceRef.current = Blockly.inject((blocklyRef.current), {
                toolbox: curTool,
                move: {
                    scrollbars: {
                        horizontal: true,
                        vertical: true
                    },
                    drag: true,
                    wheel: true
                },
                trashcan: true
            });
            console.log(workspaceRef);
            
        }
    }

    useEffect(() => {
        async function fn() {
            setTimeout(async () => {
                const x = actions.serialize(workspaceRef.current)
                Blockly.common.defineBlocks(customBlocks)
                if (!curTool.contents.find(x => x.name == 'Robot')) {
                    setCurTool(addRobotActions(curTool))
                }
                const s = await buildCodeGeneratorForModelId('abc', 'abc')
                setGen(s)
                if (workspaceRef.current) {
                    workspaceRef.current.dispose();
                    workspaceRef.current = null;
                }
                inject('Load')
                actions.loadFromJson(x ?? {}, workspaceRef.current)
            }, 2000);
            inject('Init')
        }

        fn()

        workspaceRef.current.addChangeListener((event: Blockly.Events.Abstract) => {
            console.log('Event!', event.type);
            
            if (event.type === Blockly.Events.UI) {
                console.log('Select item');
                
                // Small delay to let Blockly finish its internal updates
                setTimeout(() => {
                    Blockly.svgResize(workspaceRef.current);
                    if (workspaceRef.current.scrollbar) {
                        workspaceRef.current.scrollbar.resize();
                    }
                }, 150);
            }
        });

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
                    actions.loadFromJson(json, workspaceRef.current)
                    setSaved(json)
                }}>Load</button>
                <button onClick={(e) => {
                    if (!gen) return;
                    const c = actions.translate(gen, workspaceRef.current)
                    setCode(c)
                    alert(c)
                }}>Translate to code</button>

                <div>
                    {gen &&
                        <p>
                            Loaded!
                        </p>
                    }
                </div>

            </div>
            <div ref={blocklyRef} style={{ height: 600, width: 1000 }}></div>
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
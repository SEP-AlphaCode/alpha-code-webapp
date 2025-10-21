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
                toolbox: curTool
            });
            workspaceRef.current.addChangeListener((event: Blockly.Events.Abstract) => {
                if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
                    // Cast to the correct subtype
                    const toolboxEvent = event as Blockly.Events.ToolboxItemSelect;

                    // Now TypeScript recognizes newItem
                    const newItem = toolboxEvent.newItem;

                    if (Object.hasOwn(toolboxEvent, 'newItem')) {
                        const toolbox = (workspaceRef.current as Blockly.WorkspaceSvg).getToolbox();
                        const flyout = toolbox?.getFlyout();
                        const flyouts = blocklyRef.current?.querySelectorAll<SVGElement>('.blocklyFlyoutScrollbar');
                        // Deselecting toolbox → hide rogue scrollbars
                        if (!newItem) {
                            flyouts?.forEach((el) => {
                                el.style.display = 'none';
                            });

                            Blockly.svgResize(workspaceRef.current);
                        } else {
                            flyouts?.forEach((el) => {
                                el.style.display = 'block';
                            });
                        }

                        // Always resize after toolbox state change
                        setTimeout(() => Blockly.svgResize(workspaceRef.current), 100);
                    }
                }
            });
        }
    }

    useEffect(() => {
        async function fn() {
            setTimeout(async () => {
                const x = actions.serialize(workspaceRef.current)
                Blockly.common.defineBlocks(customBlocks)
                if (!curTool.contents.find(x => x.name == 'Robot')) {
                    var t = curTool
                    t = addRobotActions(t)
                }
                const s = await buildCodeGeneratorForModelId('abc', 'abc')
                setGen(s);
                if (workspaceRef.current) {
                    workspaceRef.current.dispose();
                    workspaceRef.current = null;
                }
                inject('Load');
                (workspaceRef.current as Blockly.WorkspaceSvg).getToolbox();
                actions.loadFromJson(x ?? {}, workspaceRef.current)
            }, 100);
            inject('Init')
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
                    actions.loadFromJson(json, workspaceRef.current)
                    setSaved(json)
                }}>Load</button>
                <button onClick={(e) => {
                    if (!gen) return;
                    const c = actions.translate(gen, workspaceRef.current)
                    setCode(c)
                    alert(c)
                }}>Translate to code</button>
                <button onClick={(e) => {
                    Blockly.svgResize(workspaceRef.current)
                }}>Resize</button>
                <div>
                    {gen &&
                        <p>
                            Loaded!
                        </p>
                    }
                </div>

            </div>
            <div className=''>
                <div ref={blocklyRef} style={{ height: 600, width: 1000, flexBasis: '100%', overflow: 'auto' }} className='border-2 border-red-300'></div>
                <div
                    className='border-2 p-2 bg-blue-50'
                    dangerouslySetInnerHTML={{ __html: code.replaceAll('\n', '<br/>') }}
                />
            </div>
            <div >
                <div>
                    {
                        JSON.stringify(saved, undefined, '')
                    }
                </div>

            </div>
        </div>
    );
}
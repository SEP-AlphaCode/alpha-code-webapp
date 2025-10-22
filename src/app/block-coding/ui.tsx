import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { addRobotActions, toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls } from '@/components/blockly-logic/control';
import { customBlocks } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import { toast } from 'sonner';
import { StaticCategoryInfo } from '@/types/blockly';
type CodeActionKV = { code: string, name: string }
type BlocklyUIProps = {
    robotModelId: string,
    serialId: string,
    actions: CodeActionKV[],
    extendedActions: CodeActionKV[],
    skillHelpers: CodeActionKV[],
    expressions: CodeActionKV[]
}

export default function BlocklyUI() {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<any>(null);
    const [saved, setSaved] = useState<undefined | { [key: string]: any }>()
    const [code, setCode] = useState('')
    const actions = blockControls(workspaceRef.current)
    const key = 'workspace-state'
    const [gen, setGen] = useState<JavascriptGenerator | undefined>()
    const [curTool, setCurTool] = useState(toolbox)

    function inject(x: string) {
        if (!blocklyRef.current || workspaceRef.current) { return; }
        toast.success(x)
        workspaceRef.current = Blockly.inject((blocklyRef.current), {
            toolbox: curTool
        });
        workspaceRef.current.addChangeListener((event: Blockly.Events.Abstract) => {
            if (event.type !== Blockly.Events.TOOLBOX_ITEM_SELECT) { return; }
            // Cast to the correct subtype
            const toolboxEvent = event as Blockly.Events.ToolboxItemSelect;

            // Now TypeScript recognizes newItem
            const newItem = toolboxEvent.newItem;

            if (Object.hasOwn(toolboxEvent, 'newItem')) {
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
            }
        });
    }

    useEffect(() => {
        async function fn() {
            setTimeout(async () => {
                const x = actions.serialize()
                Blockly.common.defineBlocks(customBlocks)
                if (!curTool.contents.find(x => (x as StaticCategoryInfo).name == 'Robot')) {
                    var t = curTool
                    t = addRobotActions(t)
                }
                const s = await buildCodeGeneratorForModelId('6e4e14b3-b073-4491-ab2a-2bf315b3259f', 'EAA007UBT10000341')
                setGen(s);
                if (workspaceRef.current) {
                    workspaceRef.current.dispose();
                    workspaceRef.current = null;
                }
                inject('Load');
                (workspaceRef.current as Blockly.WorkspaceSvg).getToolbox();
                actions.loadFromJson(x ?? {})
            }, 1000);
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

    const executeCode = (code: string) => {
        try {
            const fn = new Function(code);
            fn();
        } catch (err) {
            console.log(err);
        } finally {
        }
    }
    return (
        <div>
            <div className='*:border-2 space-x-5 mb-4'>
                <button onClick={(e) => {
                    const state = actions.serialize()
                    localStorage.setItem(key, JSON.stringify(state))
                    setSaved(state)
                }}>Save</button>
                <button onClick={(e) => {
                    const state = localStorage.getItem(key)
                    if (!state) return;
                    const json = JSON.parse(state)
                    actions.loadFromJson(json)
                    setSaved(json)
                }}>Load</button>
                <button onClick={(e) => {
                    if (!gen) return;
                    const c = actions.translate(gen)
                    setCode(c)
                }}>Translate to code</button>
                <button onClick={(e) => {
                    if (!gen) return;
                    const state = actions.serialize()
                    localStorage.setItem(key, JSON.stringify(state))
                    setSaved(state)
                    const code = actions.translate(gen)
                    executeCode(code)
                }}>Run code</button>
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
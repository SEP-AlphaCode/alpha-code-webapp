import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from '../../components/blockly-logic/toolbox';
import { Json } from '@/types/block-coding';
import { blockControls } from '@/components/blockly-logic/control';
export default function UseMe() {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<any>(null);
    const [saved, setSaved] = useState<undefined | Json>()
    const actions = blockControls()
    const key = 'workspace-state'
    useEffect(() => {
        console.log('UseMe component mounted');

        if (blocklyRef.current && !workspaceRef.current) {
            // Only initialize if not already initialized
            workspaceRef.current = Blockly.inject(blocklyRef.current, {
                toolbox: toolbox
            });
        }

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
            <button className='border-2' onClick={(e) => {
                const state = actions.serialize(workspaceRef.current)
                localStorage.setItem(key, JSON.stringify(state))
                setSaved(state)
            }}>Save</button>
            <button className='border-2' onClick={(e) => {
                const state = localStorage.getItem(key)
                if (!state) return;
                const json = JSON.parse(state)
                actions.load(json, workspaceRef.current)
                setSaved(json)
            }}>Load</button>
            <div ref={blocklyRef} style={{ height: 500, width: 900 }}></div>
            <div>
                {
                    JSON.stringify(saved, undefined, '')
                }
            </div>
        </div>
    );
}
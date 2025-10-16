import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { toolbox } from './toolbox';
export default function UseMe() {
    const blocklyRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<any>(null);
    const [saved, setSaved] = useState<undefined | { [key: string]: any }>()
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
            <button onClick={(e) => {
                const state = Blockly.serialization.workspaces.save(workspaceRef.current)
                localStorage.setItem('workspace-state', JSON.stringify(state))
                setSaved(state)
            }}>Save</button>
            <div ref={blocklyRef} style={{ height: 500, width: 750 }}></div>
            {
                JSON.stringify(saved, undefined, '')
            }
        </div>
    );
}
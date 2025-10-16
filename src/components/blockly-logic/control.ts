import { Json } from '@/types/block-coding';
import * as Blockly from 'blockly/core';

export const blockControls = () => {
    const serialize = (ws: Blockly.Workspace) => Blockly.serialization.workspaces.save(ws)

    const load = (json: Json, ws: Blockly.Workspace) => Blockly
    .serialization.workspaces.load(json, ws)

    return {
        serialize,
        load
    }
}
import * as Blockly from 'blockly/core';
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';

export const blockControls = () => {
    const serialize = (ws: Blockly.Workspace) => Blockly.serialization.workspaces.save(ws)

    const load = (json: { [key: string]: any }, ws: Blockly.Workspace) => Blockly
        .serialization.workspaces.load(json, ws)

    const translate = (gen: JavascriptGenerator, ws: Blockly.Workspace) => gen.workspaceToCode(ws)
    return {
        serialize,
        load,
        translate
    }
}
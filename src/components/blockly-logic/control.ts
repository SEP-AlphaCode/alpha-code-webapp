import * as Blockly from 'blockly/core';
import { JavascriptGenerator } from 'blockly/javascript';

export const blockControls = (ws: Blockly.Workspace) => {
    const serialize = () => Blockly.serialization.workspaces.save(ws)

    const loadFromJson = (json: { [key: string]: any }) => Blockly
        .serialization.workspaces.load(json, ws)

    const translate = (gen: JavascriptGenerator) => gen.workspaceToCode(ws)

    return {
        serialize,
        loadFromJson,
        translate
    }
}
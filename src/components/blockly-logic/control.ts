import * as Blockly from 'blockly/core';
import { JavascriptGenerator } from 'blockly/javascript';
import { RefObject } from 'react';
export const HUE = 60
export const CATEGORY_NAME = 'Robot'
export type Operations = {
    serialize: () => { [key: string]: unknown },
    loadFromJson: (json: { [key: string]: unknown }) => void,
    translate: (gen: JavascriptGenerator) => string,
    addStrayScrollbarDestructor: (injectedDiv: HTMLDivElement) => void
}
export const blockControls = (ws: Blockly.WorkspaceSvg): Operations => {
    const serialize = () => {
        const u = Blockly.serialization.workspaces

        return u.save(ws)
    }

    const loadFromJson = (json: { [key: string]: unknown }) => Blockly
        .serialization.workspaces.load(json, ws)

    const translate = (gen: JavascriptGenerator) => {
        const main = gen.workspaceToCode(ws)
        return `async function main(){
        \t${main}
        }

        main()`
    }

    const addStrayScrollbarDestructor = (injectedDiv: HTMLDivElement) => {
        ws.addChangeListener((event: Blockly.Events.Abstract) => {
            if (!ws) return;
            if (event.type !== Blockly.Events.TOOLBOX_ITEM_SELECT) { return; }
            // Cast to the correct subtype
            const toolboxEvent = event as Blockly.Events.ToolboxItemSelect;
            const newItem = toolboxEvent.newItem;
            const flyouts = injectedDiv.querySelectorAll<SVGElement>('.blocklyFlyoutScrollbar');
            // Deselecting toolbox → hide rogue scrollbars
            if (!newItem) {
                flyouts?.forEach((el) => {
                    el.style.display = 'none';
                });
            } else {
                flyouts?.forEach((el) => {
                    el.style.display = 'block';
                });
            }
        });
    }

    return {
        serialize,
        loadFromJson,
        translate,
        addStrayScrollbarDestructor
    }
}
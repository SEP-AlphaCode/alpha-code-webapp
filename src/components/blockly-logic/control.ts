import * as Vi from 'blockly/msg/vi';
import { registerFieldColour } from '@blockly/field-colour';
import { pythonHttp } from '@/utils/http';
import * as Blockly from 'blockly/core';
import { JavascriptGenerator } from 'blockly/javascript';
import { robotCategory, toolbox, ToolboxDef } from './toolbox';
import * as uuid from 'uuid'
import { injectLoopCheck } from './format-code';

export const HUE = 175
export const CATEGORY_NAME = 'Robot'
export type Operations = {
    serialize: () => { [key: string]: unknown },
    loadFromJson: (json: { [key: string]: unknown }) => void,
    makeListCode: (gen: JavascriptGenerator) => { code: string, listVar: string },
    addStrayScrollbarDestructor: (injectedDiv: HTMLDivElement) => void,
    sendCommandToBackend: (
        actions: { type: string, code?: string, text?: string, lang?: string }[],
        robotSerial: string,
        setNotify: (text: string, status: string) => void
    ) => void,
    getToolboxForRobotModel: (robotModelId: string) => ToolboxDef,
    getDefaultToolbox: () => ToolboxDef,
    setUpUI: () => void
}
export const blockControls = (ws: Blockly.WorkspaceSvg): Operations => {
    const serialize = () => Blockly.serialization.workspaces.save(ws)

    const loadFromJson = (json: { [key: string]: unknown }) => Blockly
        .serialization.workspaces.load(json, ws)

    const makeListCode = (gen: JavascriptGenerator) => {
        try {
            // main code
            const main = gen.workspaceToCode(ws)
            //yield checks
            const startTimeVarName = '_' + (uuid.v4()).replaceAll('-', '_')
            const nowVarName = '_' + (uuid.v4()).replaceAll('-', '_')
            const listVar = 'pending_call_' + (uuid.v4()).replaceAll('-', '_')
            let mainFn = `
function main() {
    var ${listVar} = []
    try{
        ${main}
        return {
            result: ${listVar}
        }
    }
    catch(e) {
        console.log('Error in main function', e);
        if(e.message.includes('Time exceeded')) {
            return {
            error: "Thời gian thực thi vượt quá giới hạn. Vui lòng kiểm tra lại các vòng lặp trong chương trình."
            }
        }
        if(e.message.includes('Maximum call stack size exceeded')) {
            return {
            error: "Chương trình của bạn có thể đã bị lặp vô hạn. Vui lòng kiểm tra lại các vòng lặp trong chương trình."
            }
        }
        return {
            error: String(e)
        }
    }
}

return main()`
            mainFn = mainFn.replaceAll('<LIST_VAR>', listVar)
            const injected = injectLoopCheck(mainFn)
            mainFn = injected.result
            const checkFnName = injected.checkFnName
            const loopCheck = `let ${startTimeVarName} = Date.now(), ${nowVarName} = ${startTimeVarName}
function ${checkFnName}() {
    ${nowVarName} = Date.now()
    //console.log('Checking loop time', ${nowVarName} - ${startTimeVarName})
    if(${nowVarName} - ${startTimeVarName} >= 0.25 * 1000) throw Error("Time exceeded")
}`
            return { code: loopCheck + '\n' + mainFn, listVar }
        }
        catch (e) {
            console.log(e);
        }
        return { code: '', listVar: '' }
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

    const sendCommandToBackend = async (
        actions: { type: string, code?: string, text?: string, lang?: string }[],
        robotSerial: string,
        setNotify: (text: string, action: string) => void
    ) => {
        const body = {
            type: 'coding_block',
            data: {
                actions,
            },
        };

        try {
            const res = await pythonHttp.post(`/websocket/command/${robotSerial}`, body, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // 👇 Đọc response body
            const data = res.data as {
                status: "sent" | "failed";
                to: string;
                command: {
                    type: string;
                    data: { code: string };
                };
                active_clients: number;
            };

            console.log("📨 Robot response:", data);

            if (data.status === "sent") {
                setNotify("✅ Gửi lệnh thành công!", "success");
            } else if (data.status === "failed") {
                setNotify("❌ Gửi lệnh thất bại!", "error");
            } else {
                setNotify("⚠️ Phản hồi không xác định từ robot.", "error");
            }
        } catch (err) {
            console.error("🚨 Lỗi khi gửi lệnh:", err);
            setNotify("❌ Gửi lệnh thất bại! Không thể kết nối đến robot.", "error");
        }
    };

    const getDefaultToolbox = (): ToolboxDef => {
        return JSON.parse(JSON.stringify(toolbox))
    }

    const getToolboxForRobotModel = (robotModelId: string) => {
        const def = getDefaultToolbox()
        const newRobotCategory = JSON.parse(JSON.stringify(robotCategory)) as { kind: string, name: string, color: string, contents: { type: string, invariant?: boolean }[] }
        newRobotCategory.contents.forEach(x => {
            if (x.type.startsWith('.')) {
                x.type = robotModelId + x.type
            }
        })

        def.contents.push(newRobotCategory)
        return def
    }

    const setUpUI = () => {
        registerFieldColour()
        // Blockly.setLocale(Vi as unknown as { [key: string]: string })
        Blockly.utils.colour.setHsvSaturation(1) // 0 (inclusive) to 1 (exclusive), defaulting to 0.45
        Blockly.utils.colour.setHsvValue(0.75) // 0 (inclusive) to 1 (exclusive), defaulting to 0.65
        // Make blocks bigger and easier for children to see
        // ws.addChangeListener((e) => {
        //     console.log(e)
        // })

        if (!Blockly.Extensions.isRegistered('flag_with_text_extension')) {
            Blockly.Extensions.register('flag_with_text_extension',
                function () {
                    function createFlagWithTextDiv(text: string, src: string) {
                        const div = document.createElement('div');
                        div.setAttribute('style', 'padding: 2px');
                        const img = document.createElement('img');
                        img.setAttribute('src', src);
                        img.setAttribute('style', 'width: 20px; height: 15px; display: inline;');
                        const para = document.createElement('span');
                        para.setAttribute('style', 'flex:row')
                        para.appendChild(img)
                        const textNode = document.createElement('span')
                        textNode.innerHTML = `&nbsp;&nbsp;${text}`
                        para.appendChild(textNode);
                        div.appendChild(para);
                        div.setAttribute('title', text);
                        return div;
                    }

                    const viDiv = createFlagWithTextDiv('Tiếng Việt', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png?20250708231458');
                    const enDiv = createFlagWithTextDiv('Tiếng Anh', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png');
                    const options: Blockly.MenuGenerator = [
                        [viDiv, 'vi'],
                        [enDiv, 'en'],
                    ];
                    const f = this.getField('LANGUAGE') as Blockly.FieldDropdown;
                    if (f) {
                        f.setOptions(options);
                    }
                });
        }
    }
    return {
        serialize,
        loadFromJson,
        makeListCode,
        addStrayScrollbarDestructor,
        sendCommandToBackend,
        getDefaultToolbox,
        getToolboxForRobotModel,
        setUpUI
    }
}
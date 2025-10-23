import { pythonHttp } from '@/utils/http';
import * as Blockly from 'blockly/core';
import { JavascriptGenerator } from 'blockly/javascript';

export const HUE = 60
export const CATEGORY_NAME = 'Robot'
export type Operations = {
    serialize: () => { [key: string]: unknown },
    loadFromJson: (json: { [key: string]: unknown }) => void,
    makeListCode: (gen: JavascriptGenerator) => string,
    addStrayScrollbarDestructor: (injectedDiv: HTMLDivElement) => void,
    sendCommandToBackend: (
        actions: { type: string, code?: string, text?: string, lang?: string }[], 
        robotSerial: string, 
        setNotify: (text: string, status: string) => void
    ) => void
}
export const blockControls = (ws: Blockly.WorkspaceSvg): Operations => {
    const serialize = () => Blockly.serialization.workspaces.save(ws)

    const loadFromJson = (json: { [key: string]: unknown }) => Blockly
        .serialization.workspaces.load(json, ws)

    const makeListCode = (gen: JavascriptGenerator) => {
        const main = gen.workspaceToCode(ws)
        return `
        function makeList(){
        const list = []
        ${main}
        return list
        }

        return makeList()
        `
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

    return {
        serialize,
        loadFromJson,
        makeListCode,
        addStrayScrollbarDestructor,
        sendCommandToBackend
    }
}
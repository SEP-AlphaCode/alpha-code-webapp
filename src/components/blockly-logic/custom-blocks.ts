import * as Blockly from 'blockly';
import { HUE } from './control';
import { BaseBlockDef } from '@/types/blockly';

/**
 * This is the template for actions. DO NOT USE THIS DIRECTLY.
 * To load actions for a robot model, use ```loadModelIdData```.
 */
const customBlockTemplate: BaseBlockDef[] = [
    {
        "type": "action",
        "tooltip": "",
        "helpUrl": "",
        "message0": "thực hiện hành động %1 %2 lần %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here
                    // [name, code]
                ]
            },
            {
                "type": "field_number",
                "name": "COUNT",
                "value": 1,
                "min": 1
            },
            {
                "type": "input_dummy",
                "name": "DUMMY"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "extended_action",
        "tooltip": "",
        "helpUrl": "",
        "message0": "thực hiện hành động mở rộng %1 %2 lần %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here
                    // [name, code]
                ]
            },
            {
                "type": "field_number",
                "name": "COUNT",
                "value": 1,
                "min": 1
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "expression",
        "tooltip": "",
        "helpUrl": "",
        "message0": "thực hiện biểu cảm %1 %2 lần %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here
                    // [name, code]
                ]
            },
            {
                "type": "field_number",
                "name": "COUNT",
                "value": 1,
                "min": 1
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "skill_helper",
        "tooltip": "",
        "helpUrl": "",
        "message0": "thực hiện kỹ năng %1 %2 lần %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here
                    // [name, code]
                ]
            },
            {
                "type": "field_number",
                "name": "COUNT",
                "value": 1,
                "min": 1
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "tts",
        "tooltip": "Nói bằng TIẾNG VIỆT",
        "helpUrl": "",
        "message0": "nói %1 %2",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT_INPUT",
                "text": "Tôi là Alpha Mini"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "tts_en",
        "tooltip": "Nói bằng TIẾNG ANH (spoken in ENGLISH)",
        "helpUrl": "",
        "message0": "say %1 %2",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT_INPUT",
                "text": "I am Alpha Mini"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    },
    {
        "type": "set_mouth_led",
        "tooltip": "",
        "helpUrl": "",
        "message0": "đặt LED miệng thành màu %1 trong %2 giây %3",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
            },
            {
                "type": "field_number",
                "name": "DURATION",
                "value": 1,
                "min": 0
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE
    }

]

const loadDropdownOptions = (customBlockTemplate: BaseBlockDef[], name: string, data: string[][]) => {
    const actionBlocks = customBlockTemplate.find(x => x.type === name)
    const arg0 = actionBlocks?.args0.find(x => x.name === 'ACTION_NAME')
    if (arg0 && arg0.options) {
        arg0.options = arg0.options.concat(data)
    }
}

const pushSthIfEmpty = (target: string[][]) => {
    if (target.length === 0) target.push(['???', '???'])
}

/**
 * 
 * @param modelId 
 * @param actions list of actions in a [string, string] format. 
 * If empty, an element ['???', '???'] will be inserted to make sure the options array isn't empty (Blockly doesn't allow empty dropdown).
 * @param extActions see above
 * @param exps see above
 * @param skills see above
 * @returns The object representing the blocks that a robot model supports
 * ### Note:
 * 1. All types becomes ```<robot model id>.<base type>```. Example:
 * ``` js
 * [{
 *       "type": "ABCXYZ.extended_action",
 *      ...
 * }]
 * ```
 */
export const loadModelIdData = (modelId: string, actions: string[][], extActions: string[][], exps: string[][], skills: string[][]) => {
    const tmpTemplate = JSON.parse(JSON.stringify(customBlockTemplate)) as BaseBlockDef[]
    tmpTemplate.forEach(x => {
        x.type = modelId + '.' + x.type
    })
    pushSthIfEmpty(actions)
    pushSthIfEmpty(exps)
    pushSthIfEmpty(extActions)
    pushSthIfEmpty(skills)
    loadDropdownOptions(tmpTemplate, modelId + '.action', actions)
    loadDropdownOptions(tmpTemplate, modelId + '.expression', exps)
    loadDropdownOptions(tmpTemplate, modelId + '.extended_action', extActions)
    loadDropdownOptions(tmpTemplate, modelId + '.skill_helper', skills)
    return tmpTemplate
}
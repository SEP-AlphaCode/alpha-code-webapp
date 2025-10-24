import * as Blockly from 'blockly';
import { HUE } from './control';
import { BaseBlockDef } from '@/types/blockly';

/**
 * This is the template for actions. DO NOT USE THIS DIRECTLY.
 * 
 * To load actions for a robot model, use ```loadModelIdData```.
 * 
 * If the values in the block depends on robot model, add a  '.' before the type
 */
const customBlockTemplate: BaseBlockDef[] = [
    {
        "type": ".action",
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
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
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
        "type": ".extended_action",
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
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
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
        "type": ".expression",
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
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
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
        "type": ".skill_helper",
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
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
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
        "type": "tts",
        "tooltip": "Nói bằng TIẾNG VIỆT",
        "helpUrl": "",
        "message0": "nói %1",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
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
        "message0": "say %1",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
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
        "message0": "đặt LED miệng thành màu %1 trong %2 %3 giây %4",
        "args0": [
            {
                "type": "input_value",
                "name": "COLOR",
                "check": "Color"
            },
            {
                "type": "input_dummy",
                "name": "LABEL"
            },
            {
                "type": "input_value",
                "name": "DURATION",
                "check": "Number"
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
        "type": "inp_color",
        "tooltip": "Trả về 1 màu",
        "helpUrl": "",
        "message0": "%1 %2",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
            },
            {
                "type": "input_dummy",
                "name": "NONE"
            }
        ],
        "output": "Color",
        "colour": 180
    }
]

const pushSthIfEmpty = (target: string[][]) => {
    if (target.length === 0) target.push(['???', '???'])
}

const loadDropdownOptions = (customBlockTemplate: BaseBlockDef[], name: string, data: string[][]) => {
    pushSthIfEmpty(data)
    const actionBlocks = customBlockTemplate.find(x => x.type === name)
    const arg0 = actionBlocks?.args0.find(x => x.name === 'ACTION_NAME')
    if (arg0 && arg0.options) {
        arg0.options = arg0.options.concat(data)
    }
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
        if (x.type.startsWith('.')) {
            x.type = modelId + x.type
        }
    })
    //Load your data from robot model here
    loadDropdownOptions(tmpTemplate, modelId + '.action', actions)
    loadDropdownOptions(tmpTemplate, modelId + '.expression', exps)
    loadDropdownOptions(tmpTemplate, modelId + '.extended_action', extActions)
    loadDropdownOptions(tmpTemplate, modelId + '.skill_helper', skills)
    return tmpTemplate
}
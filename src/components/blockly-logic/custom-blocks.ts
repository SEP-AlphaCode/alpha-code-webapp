import * as Blockly from 'blockly';
const customBlockData = [
    {
        "type": "do_action",
        "tooltip": "do an action",
        "helpUrl": "nothing here",
        "message0": "play action %1 for %2 time(s) %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    [
                        "option",
                        "OPTIONNAME1"
                    ],
                    [
                        "option",
                        "OPTIONNAME2"
                    ],
                    [
                        "option",
                        "OPTIONNAME3"
                    ]
                ]
            },
            {
                "type": "field_number",
                "name": "COUNT",
                "value": 0,
                "min": 0
            },
            {
                "type": "input_dummy",
                "name": "DUMMY"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 225
    }
]

export const customBlocks = Blockly.common.createBlockDefinitionsFromJsonArray(customBlockData)
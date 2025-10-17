import * as Blockly from 'blockly';
const customBlockData = [
    {
        "type": "action",
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
    },
    {
        "type": "extended_action",
        "tooltip": "",
        "helpUrl": "",
        "message0": "do extended action %1 for %2 time(s) %3",
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
        "colour": 225
    },
    {
        "type": "expression",
        "tooltip": "",
        "helpUrl": "",
        "message0": "do expression %1 for %2 time(s) %3",
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
        "colour": 225
    },
    {
        "type": "skill_helper",
        "tooltip": "",
        "helpUrl": "",
        "message0": "do skill %1 for %2 time(s) %3",
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
        "colour": 225
    }
]

export const customBlocks = Blockly.common.createBlockDefinitionsFromJsonArray(customBlockData)
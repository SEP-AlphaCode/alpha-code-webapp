import * as Blockly from 'blockly';
const customBlockData = [
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
                    [
                        "dance_0001",
                        "dance_0001"
                    ],
                    [
                        "dance_0002en",
                        "dance_0002en"
                    ],
                    [
                        "Drive_015",
                        "Drive_015"
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
        "message0": "thực hiện hành động mở rộng %1 %2 lần %3",
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
        "message0": "thực hiện biểu cảm %1 %2 lần %3",
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
        "message0": "thực hiện kỹ năng %1 %2 lần %3",
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
        "type": "tts",
        "tooltip": "Không hỗ trợ dịch sang tiếng Anh",
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
        "colour": 225
    }

]

export const customBlocks = Blockly.common.createBlockDefinitionsFromJsonArray(customBlockData)
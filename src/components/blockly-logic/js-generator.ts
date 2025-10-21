import { javascriptGenerator, Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

const pythonPath = 'https://backend.alpha-code.site'

// fetch('abc', {
//     body: JSON.stringify(123)
// })

export const buildCodeGeneratorForModelId = async (modelId: string, serial: string) => {
    // TODO: Load allowed actions specific to a robot model
    const callUrl = pythonPath + "/websocket/command/" + serial
    const alphaCodeGenerator = javascriptGenerator
    function baseRequest(body: string) {
        return `await fetch("${callUrl}",
        {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST', 
        body:JSON.stringify(${body})
        }
        )`
    }
    function generateActionBlocks(block: Blockly.Block) {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type,
            lang: 'vi',
            data: {
                code: dropdown_action_name
            }
        })
        const comment = `// calling function ${block.type}\n`
        const inner = baseRequest(body)

        //Then wrap the code inside a for loop
        //NOTE: USE let TO MAKE THE LOOP USE THE i FROM WITHIN THE LOOP'S SCOPE. DECLARING i WITH var WILL BREAK THE EXECUTION
        const code = number_count !== 1 ?
            `for(let i = 0; i < ${number_count}; i++) {
        ${inner}\n}` : inner;
        return comment + code + '\n';
    }
    alphaCodeGenerator.forBlock['action'] = generateActionBlocks
    alphaCodeGenerator.forBlock['extended_action'] = generateActionBlocks
    alphaCodeGenerator.forBlock['expression'] = generateActionBlocks
    alphaCodeGenerator.forBlock['skill_helper'] = generateActionBlocks
    alphaCodeGenerator.forBlock['tts'] = (block) => {
        const text_text_input = block.getFieldValue('TEXT_INPUT');
        const body = JSON.stringify({
            type: '',
            lang: 'en',
            data: {
                text: text_text_input
            }
        })
        const comment = `// calling function ${block.type}\n`
        const inner = baseRequest(body)
        // TODO: Assemble javascript into the code variable.
        const code = comment + inner + '\n';
        return code;
    }
    return alphaCodeGenerator
}
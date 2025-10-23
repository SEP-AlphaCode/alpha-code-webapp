import { javascriptGenerator, Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

const pythonPath = 'https://backend.alpha-code.site'

// fetch('abc', {
//     body: JSON.stringify(123)
// })

export const buildCodeGeneratorForModelId = () => {
    // TODO: Load allowed actions specific to a robot model
    const alphaCodeGenerator = javascriptGenerator
    function baseRequest(body: string, n: unknown) {
        if (n === 1) {
            return `\tlist.push(${body})`
        }
        return `\t for(let i = 0; i < ${n}; i++){
        \t\tlist.push(${body})
        \t}`
    }
    function generateActionBlocks(block: Blockly.Block) {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type,
            code: dropdown_action_name
        })
        const comment = `// calling function ${block.type} ${number_count} time(s)\n`
        const inner = baseRequest(body, number_count)
        return `${comment} ${inner} \n`
    }
    alphaCodeGenerator.forBlock['action'] = generateActionBlocks
    alphaCodeGenerator.forBlock['extended_action'] = (block: Blockly.Block) => {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type,
            data: {
                code: dropdown_action_name
            }
        })
        const comment = `// calling function ${block.type} ${number_count} time(s)\n`
        const inner = baseRequest(body, number_count)
        return `${comment} ${inner} \n`
    }
    alphaCodeGenerator.forBlock['expression'] = generateActionBlocks
    alphaCodeGenerator.forBlock['skill_helper'] = generateActionBlocks
    alphaCodeGenerator.forBlock['tts'] = (block) => {
        const text_text_input = block.getFieldValue('TEXT_INPUT');
        const body = JSON.stringify({
            type: 'tts',
            lang: 'vi',
            text: text_text_input
        })
        const comment = `// calling function ${block.type}\n`
        const inner = baseRequest(body, 1)
        return `${comment} ${inner}\n`
    }
    alphaCodeGenerator.forBlock['tts_en'] = (block) => {
        const text_text_input = block.getFieldValue('TEXT_INPUT');
        const body = JSON.stringify({
            type: 'tts',
            lang: 'en',
            text: text_text_input
        })
        const comment = `// calling function ${block.type}\n`
        const inner = baseRequest(body, 1)
        return `${comment} ${inner}\n`
    }
    return alphaCodeGenerator
}
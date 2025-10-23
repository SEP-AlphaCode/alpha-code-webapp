import { javascriptGenerator, Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

const pythonPath = 'https://backend.alpha-code.site'

// fetch('abc', {
//     body: JSON.stringify(123)
// })

export const buildCodeGeneratorForModelId = (modelId: string) => {
    // TODO: Load allowed actions specific to a robot model
    const alphaCodeGenerator = javascriptGenerator
    /**
     * 
     * @param body A block call 
     * ```code 
     * {type: ???, code: ???, ...}
     * ```
     * @param n number of times it should be called. Not necessarily a number
     * @returns A string code that push the number of call into variable 'list'
     */
    function baseRequest(body: string, n: unknown) {
        if (n === 1) {
            return `\tlist.push(${body})`
        }
        return `\t for(let i = 0; i < ${n}; i++){
        \t\tlist.push(${body})
        \t}`
    }
    /**
     * @param block Blocky.Block type where it MUST have these fields:
     * 1. A dropdown named ACTION_NAME
     * 2. A numeric field named COUNT
     * ### Note: the type MUST follow this format: ```<a string>.<a string>``` where each part MUST NOT contains '.'
     * @returns The representation of this block
     */
    function generateActionBlocks(block: Blockly.Block) {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type.split('.')[1],
            code: dropdown_action_name
        })
        const comment = `// calling function ${block.type} ${number_count} time(s)\n`
        const inner = baseRequest(body, number_count)
        return `${comment} ${inner} \n`
    }
    alphaCodeGenerator.forBlock[modelId + '.action'] = generateActionBlocks
    alphaCodeGenerator.forBlock[modelId + '.extended_action'] = (block: Blockly.Block) => {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type.split('.')[1],
            data: {
                code: dropdown_action_name
            }
        })
        const comment = `// calling function ${block.type} ${number_count} time(s)\n`
        const inner = baseRequest(body, number_count)
        return `${comment} ${inner} \n`
    }
    alphaCodeGenerator.forBlock[modelId + '.expression'] = generateActionBlocks
    alphaCodeGenerator.forBlock[modelId + '.skill_helper'] = generateActionBlocks
    alphaCodeGenerator.forBlock[modelId + '.tts'] = (block) => {
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
    alphaCodeGenerator.forBlock[modelId + '.tts_en'] = (block) => {
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
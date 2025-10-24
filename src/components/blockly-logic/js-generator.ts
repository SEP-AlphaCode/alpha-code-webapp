import { javascriptGenerator, Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

function addPrefixInPlace<T>(obj: Record<string, T>, prefix: string, condition: (x: string) => boolean) {
    for (const key of Object.keys(obj)) {
        if (!condition(key)) continue;
        const value = obj[key];
        const newKey = prefix + key;
        if (newKey !== key) {
            obj[newKey] = value;
            delete obj[key];
        }
    }
}

function hexToRgb(hex: string) {
    // hex is like "#1a2b3c"
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}


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
            return `list.push(${body})`
        }
        return `for(let i = 0; i < ${n}; i++){
list.push(${body})
}`
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
        const value_count = alphaCodeGenerator.valueToCode(block, 'COUNT', Order.ATOMIC);

        var count = value_count.length === 0 ? '0' : value_count
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type.split('.')[1],
            code: dropdown_action_name
        })
        const comment = `// calling function ${block.type} ${count} time(s)\n`
        const inner = baseRequest(body, count)
        return `${comment} ${inner} \n`
    }
    /**
     * Define how block are generated into js here. Use the same type from ```custom-blocks```
     */
    alphaCodeGenerator.forBlock['.action'] = generateActionBlocks
    alphaCodeGenerator.forBlock['.extended_action'] = (block: Blockly.Block) => {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const value_count = alphaCodeGenerator.valueToCode(block, 'COUNT', Order.ATOMIC);

        var count = value_count.length === 0 ? '0' : value_count
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type.split('.')[1],
            data: {
                code: dropdown_action_name
            }
        })
        const comment = `// calling function ${block.type} ${count} time(s)\n`
        const inner = baseRequest(body, count)
        return `${comment} ${inner} \n`
    }
    alphaCodeGenerator.forBlock['.expression'] = generateActionBlocks
    alphaCodeGenerator.forBlock['.skill_helper'] = generateActionBlocks
    alphaCodeGenerator.forBlock['tts'] = (block) => {
        const value_text = alphaCodeGenerator.valueToCode(block, 'TEXT', Order.ATOMIC);
        const body = JSON.stringify({
            type: 'tts',
            lang: 'vi',
            text: value_text
        })
        const comment = `// nói '${value_text}'\n`
        const inner = baseRequest(body, 1)
        return `${comment} ${inner}\n`
    }
    alphaCodeGenerator.forBlock['tts_en'] = (block) => {
        const value_text = alphaCodeGenerator.valueToCode(block, 'TEXT', Order.ATOMIC);
        const body = JSON.stringify({
            type: 'tts',
            lang: 'en',
            text: value_text
        })
        const comment = `// say "${value_text}"\n`
        const inner = baseRequest(body, 1)
        return `${comment} ${inner}\n`
    }
    alphaCodeGenerator.forBlock['inp_color'] = (block) => {
        const colour_color = block.getFieldValue('COLOR');
        // TODO: Assemble javascript into the code variable.
        const code = JSON.stringify(hexToRgb(colour_color));
        // TODO: Change Order.NONE to the correct operator precedence strength
        return [code, Order.ATOMIC];
    }
    alphaCodeGenerator.forBlock['set_mouth_led'] = function (block) {
        const colour_name = alphaCodeGenerator.valueToCode(block, 'COLOR', Order.ATOMIC);

        // TODO: change Order.ATOMIC to the correct operator precedence strength
        const value_duration = alphaCodeGenerator.valueToCode(block, 'DURATION', Order.ATOMIC);
        const body = JSON.stringify({
            type: 'led',
            color: JSON.parse(colour_name),
            duration: value_duration
        })

        // TODO: Assemble javascript into the code variable.
        const comment = `// setting mouth LED for ${value_duration}(s)\n`
        const inner = baseRequest(body, 1)
        return `${comment} ${inner}\n`;
    }

    //Automatically append robot model prefix
    addPrefixInPlace(alphaCodeGenerator.forBlock, modelId, (x) => x.startsWith('.'))
    return alphaCodeGenerator
}
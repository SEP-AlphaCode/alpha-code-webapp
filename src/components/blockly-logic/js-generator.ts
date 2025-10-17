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
    function executableTask(block: Blockly.Block) {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');
        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const body = JSON.stringify({
            type: block.type,
            lang: 'en',
            data: {
                code: dropdown_action_name
            }
        })
        const comment = `// calling function ${block.type}\n`
        const inner =
            `fetch("${callUrl}",
        {body:${body}}
        )`
        //Then wrap the code inside a for loop
        const code = number_count !== 1 ?
            `for(int i = 0; i < ${number_count}; i++) {
        ${inner}\n}` : inner;
        return comment + code + '\n';
    }
    alphaCodeGenerator.forBlock['action'] = executableTask
    alphaCodeGenerator.forBlock['extended_action'] = executableTask
    alphaCodeGenerator.forBlock['expression'] = executableTask
    alphaCodeGenerator.forBlock['skill_helper'] = executableTask
    return alphaCodeGenerator
}
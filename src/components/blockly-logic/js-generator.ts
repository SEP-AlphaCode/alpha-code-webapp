import { javascriptGenerator, Order } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

const pythonPath = 'https://backend.alpha-code.site'

export const buildCodeGeneratorForModelId = async (modelId: string, serial: string) => {
    // TODO: Load allowed actions specific to a robot model
    const callUrl = pythonPath + "/websocket/command/" + serial
    const alphaCodeGenerator = javascriptGenerator
    alphaCodeGenerator.forBlock['do_action'] = function (block) {
        const dropdown_action_name = block.getFieldValue('ACTION_NAME');
        const number_count = block.getFieldValue('COUNT');

        // TODO: Assemble javascript into the code variable.
        //Inner function, fetch the ws call
        const inner = `
            fetch("${callUrl}").then(x => x)
        `
        const code = `for(int i = 0; i < ${number_count}; i++) ${inner}`;
        return code;
    }
    return alphaCodeGenerator
}
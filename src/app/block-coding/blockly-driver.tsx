import * as Blockly from 'blockly'
import { useEffect, useRef, useState } from 'react';
import { addRobotActions, toolbox } from '../../components/blockly-logic/toolbox';
import { blockControls } from '@/components/blockly-logic/control';
import { customBlocks } from '@/components/blockly-logic/custom-blocks';
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';
import { buildCodeGeneratorForModelId } from '@/components/blockly-logic/js-generator';
import { toast } from 'sonner';
import { StaticCategoryInfo } from '@/types/blockly';
import { useGetSelectOptions } from '@/features/block-coding/api';

export default function UseMe() {
    const [modelId, setModelId] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const { useGetActions, useGetExpressions, useGetExtendedActions, useGetSkills } = useGetSelectOptions(modelId)
    const {data: actionData, isLoading: actionLoading} = useGetActions()
    const {data: expData, isLoading: expLoading} = useGetActions()
    const {data: extActionData, isLoading: extActionLoading} = useGetActions()
    const {data: skillData, isLoading: skillLoading} = useGetActions()
    const actions = actionData?.data ?? []
    const exps = expData?.data ?? []
    const extActions = extActionData?.data ?? []
    const skills = skillData?.data ?? []
    return (
        <div>
        </div>
    );
}
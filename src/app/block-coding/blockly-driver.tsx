import * as Blockly from 'blockly'
import { useEffect, useState } from 'react';
import { useGetSelectOptions } from '@/features/block-coding/api';
import BlocklyUI from './ui';

export default function UseMe() {
    const [modelId, setModelId] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const [serial, setSerial] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const { useGetActions, useGetExpressions, useGetExtendedActions, useGetSkills } = useGetSelectOptions(modelId)
    const { data: actionData, isLoading: actionLoading } = useGetActions()
    const { data: expData, isLoading: expLoading } = useGetExpressions()
    const { data: extActionData, isLoading: extActionLoading } = useGetExtendedActions()
    const { data: skillData, isLoading: skillLoading } = useGetSkills()
    const actions = actionData?.data ?? []
    const exps = expData?.data ?? []
    const extActions = extActionData?.data ?? []
    const skills = skillData?.data ?? []
    const completedLoad = actionLoading && expLoading && extActionLoading && skillLoading
    const to2DArray = (p: { code: string, name: string }[]) => {
        return p.map(x => [x.name, x.code])
    }
    return (
        <div>
            <BlocklyUI
                actions={to2DArray(actions)}
                expressions={to2DArray(exps)}
                extendedActions={to2DArray(extActions)}
                skillHelpers={to2DArray(skills)}
                completedLoad={completedLoad}
                robotModelId={modelId}
                serialId={serial}                
            />
        </div>
    );
}
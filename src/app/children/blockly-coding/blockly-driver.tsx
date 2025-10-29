import * as Blockly from 'blockly'
import { useEffect, useState } from 'react';
import BlocklyUI from './ui';
import { useGetSelectOptions } from '@/features/block-coding/hooks';

export default function UseMe() {
    const [modelId, setModelId] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const [serial, setSerial] = useState('EAA007UBT10000341')
    const { useGetActions, useGetExpressions, useGetExtendedActions, useGetSkills } = useGetSelectOptions(modelId)
    const { data: actionData, isLoading: actionLoading } = useGetActions()
    const { data: expData, isLoading: expLoading } = useGetExpressions()
    const { data: extActionData, isLoading: extActionLoading } = useGetExtendedActions()
    const { data: skillData, isLoading: skillLoading } = useGetSkills()
    const actions = actionData?.data ?? []
    const exps = expData?.data ?? []
    const extActions = extActionData?.data ?? []
    const skills = skillData?.data ?? []
    const isLoading = actionLoading || expLoading || extActionLoading || skillLoading
    
    const to2DArray = (p: { code: string, name: string }[]) => {
        return p.map(x => [x.name, x.code])
    }
    
    const data = {
        actions: to2DArray(actions),
        exps: to2DArray(exps),
        extActions: to2DArray(extActions),
        skills: to2DArray(skills)
    }
    
    return (
        <div className="relative">
            
            <BlocklyUI
                robotModelId={modelId}
                serial={serial}
                hasAllData={!isLoading}
                data={data}
            />
        </div>
    );
}
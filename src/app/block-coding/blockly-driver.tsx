import * as Blockly from 'blockly'
import { useEffect, useState } from 'react';
import { useGetSelectOptions } from '@/features/block-coding/api';
import BlocklyUI from './ui';

export default function UseMe() {
    const [modelId, setModelId] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const [serial, setSerial] = useState('Some models here')
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
    const hasAllData = (actions.length * exps.length * extActions.length * skills.length !== 0) && !isLoading
    const to2DArray = (p: { code: string, name: string }[]) => {
        return p.map(x => [x.name, x.code])
    }
    return (
        <div>
            {
                isLoading && <p>Đang tải các hoạt động của robot. Vui lòng đợi một chút</p>
            }
            Model id:
            <input
                type='text'
                value={modelId}
                onChange={(e) => setModelId(e.currentTarget.value)}
            />
            <br />
            Serial:
            <input
                type='text'
                value={serial}
                onChange={(e) => setSerial(e.currentTarget.value)}
            />
            <BlocklyUI
                robotModelId={modelId}
                serial={serial}
                hasAllData={hasAllData}
                data={{
                    actions: to2DArray(actions),
                    exps: to2DArray(exps),
                    extActions: to2DArray(extActions),
                    skills: to2DArray(skills)
                }}
            />
        </div>
    );
}
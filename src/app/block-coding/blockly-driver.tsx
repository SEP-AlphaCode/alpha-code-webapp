import * as Blockly from 'blockly'
import { useEffect, useState } from 'react';
import BlocklyUI from './ui';
import { useGetSelectOptions } from '@/features/block-coding/hooks';

export default function UseMe() {
    const [modelId, setModelId] = useState('6e4e14b3-b073-4491-ab2a-2bf315b3259f')
    const [curModelId, setCurModelId] = useState(modelId)
    const [serial, setSerial] = useState('EAA007UBT10000341')
    const { useGetActions, useGetExpressions, useGetExtendedActions, useGetSkills } = useGetSelectOptions(modelId)
    const { data: actionData, isLoading: actionLoading, status } = useGetActions()
    const { data: expData, isLoading: expLoading } = useGetExpressions()
    const { data: extActionData, isLoading: extActionLoading } = useGetExtendedActions()
    const { data: skillData, isLoading: skillLoading } = useGetSkills()
    const actions = actionData?.data ?? []
    const exps = expData?.data ?? []
    const extActions = extActionData?.data ?? []
    const skills = skillData?.data ?? []
    const isLoading = actionLoading || expLoading || extActionLoading || skillLoading
    // const hasAllData = (actions.length * exps.length * extActions.length * skills.length !== 0) && !isLoading
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
                value={curModelId}
                className='border-black border-2 p-1'
                onChange={(e) => setCurModelId(e.currentTarget.value)}
            />
            Serial:
            <input
                type='text'
                value={serial}
                className='border-black border-2 p-1'
                onChange={(e) => setSerial(e.currentTarget.value)}
            />
            <br />
            <button className='border-black border-2 p-1' onClick={() => setModelId(curModelId)}>Load from model Id</button>
            <BlocklyUI
                robotModelId={modelId}
                serial={serial}
                hasAllData={!isLoading}
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
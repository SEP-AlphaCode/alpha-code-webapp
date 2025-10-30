import * as Blockly from 'blockly'
import { useEffect, useState } from 'react';
import BlocklyUI from './ui';
import { useGetSelectOptions } from '@/features/block-coding/hooks';
import { useRobotStore } from '@/hooks/use-robot-store';
import { toast } from 'sonner';

export default function UseMe() {
    const { selectedRobot } = useRobotStore()
    const { useGetActions, useGetExpressions, useGetExtendedActions, useGetSkills } = useGetSelectOptions(selectedRobot?.robotModelId ?? '')
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
    if(!selectedRobot) {
        return <p>...</p>
    }

    return (
        <div className="relative">

            <BlocklyUI
                robotModelId={selectedRobot.robotModelId}
                serial={selectedRobot.serialNumber}
                hasAllData={!isLoading}
                data={data}
            />
        </div>
    );
}
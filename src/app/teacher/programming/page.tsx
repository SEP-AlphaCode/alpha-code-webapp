"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProgramBlock {
    id: string;
    name: string;
    description: string;
    color: string;
}

interface SequenceBlock extends Omit<ProgramBlock, 'id'> {
    id: number;
    name: string;
    description: string;
    color: string;
}

type CategoryType = 'Movement' | 'Sound' | 'Emotion' | 'Control';

function ProgrammingPage() {
    const searchParams = useSearchParams();
    const selectedRobotName = searchParams.get('robot') || 'No Robot Selected';
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Movement');
    const [programSequence, setProgramSequence] = useState<SequenceBlock[]>([]);

    const categories = [
        { name: 'Movement' as CategoryType, icon: '🏃' },
        { name: 'Sound' as CategoryType, icon: '🔊' },
        { name: 'Emotion' as CategoryType, icon: '😊' },
        { name: 'Control' as CategoryType, icon: '⚙️' }
    ];

    const programmingBlocks: Record<CategoryType, ProgramBlock[]> = {
        Movement: [
            { id: 'move_forward', name: 'Move Forward', description: 'Move robot forward', color: 'bg-blue-500' },
            { id: 'move_backward', name: 'Move Backward', description: 'Move robot backward', color: 'bg-blue-500' },
            { id: 'turn_left', name: 'Turn Left', description: 'Turn robot left', color: 'bg-blue-500' },
            { id: 'turn_right', name: 'Turn Right', description: 'Turn robot right', color: 'bg-blue-500' },
            { id: 'rotate_left', name: 'Rotate Left', description: 'Rotate in place left', color: 'bg-blue-500' },
            { id: 'rotate_right', name: 'Rotate Right', description: 'Rotate in place right', color: 'bg-blue-500' }
        ],
        Sound: [
            { id: 'beep', name: 'Beep', description: 'Play beep sound', color: 'bg-green-500' },
            { id: 'music', name: 'Play Music', description: 'Play music', color: 'bg-green-500' },
            { id: 'voice', name: 'Say Hello', description: 'Voice greeting', color: 'bg-green-500' },
            { id: 'custom_sound', name: 'Custom Sound', description: 'Play custom sound', color: 'bg-green-500' }
        ],
        Emotion: [
            { id: 'happy', name: 'Happy', description: 'Show happy emotion', color: 'bg-yellow-500' },
            { id: 'sad', name: 'Sad', description: 'Show sad emotion', color: 'bg-yellow-500' },
            { id: 'angry', name: 'Angry', description: 'Show angry emotion', color: 'bg-yellow-500' },
            { id: 'surprised', name: 'Surprised', description: 'Show surprised emotion', color: 'bg-yellow-500' }
        ],
        Control: [
            { id: 'wait', name: 'Wait', description: 'Wait for seconds', color: 'bg-purple-500' },
            { id: 'loop', name: 'Loop', description: 'Repeat actions', color: 'bg-purple-500' },
            { id: 'if_condition', name: 'If Condition', description: 'Conditional logic', color: 'bg-purple-500' },
            { id: 'stop', name: 'Stop', description: 'Stop all actions', color: 'bg-purple-500' }
        ]
    };

    const quickPrograms = [
        { name: 'Happy Dance', description: 'Robot performs a simple dance', blocks: ['move_forward', 'rotate_left', 'happy'] },
        { name: 'Friendly Greeting', description: 'Robot greets visitors', blocks: ['voice', 'happy'] },
        { name: 'Room Explorer', description: 'Robot explores the classroom', blocks: ['move_forward', 'turn_right', 'move_forward'] }
    ];

    const addToSequence = (block: ProgramBlock) => {
        setProgramSequence([...programSequence, { ...block, id: Date.now() }]);
    };

    const removeFromSequence = (index: number) => {
        setProgramSequence(programSequence.filter((_, i) => i !== index));
    };

    const runProgram = () => {
        console.log('Running program for robot', selectedRobotName, ':', programSequence);
        // Gửi chương trình đến robot
    };

    const clearProgram = () => {
        setProgramSequence([]);
    };

    return (
        <div className="space-y-6 p-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Robot Programming</h1>
                <div className="flex space-x-2">
                    <Button onClick={runProgram} className="bg-green-600 hover:bg-green-700">
                        ▶ Run
                    </Button>
                    <Button onClick={clearProgram} variant="outline">
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Programming Blocks */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Programming Blocks</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop blocks to create robot programs
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Category Tabs */}
                            <div className="flex space-x-2 mb-6">
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.name
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* Programming Blocks Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {programmingBlocks[selectedCategory].map((block) => (
                                    <div
                                        key={block.id}
                                        onClick={() => addToSequence(block)}
                                        className={`${block.color} text-white p-4 rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">
                                                {block.id === 'move_forward' && '⬆️'}
                                                {block.id === 'move_backward' && '⬇️'}
                                                {block.id === 'turn_left' && '⬅️'}
                                                {block.id === 'turn_right' && '➡️'}
                                                {block.id === 'rotate_left' && '↩️'}
                                                {block.id === 'rotate_right' && '↪️'}
                                                {block.id === 'beep' && '🔊'}
                                                {block.id === 'music' && '🎵'}
                                                {block.id === 'voice' && '🗣️'}
                                                {block.id === 'custom_sound' && '🎤'}
                                                {block.id === 'happy' && '😊'}
                                                {block.id === 'sad' && '😢'}
                                                {block.id === 'angry' && '😠'}
                                                {block.id === 'surprised' && '😲'}
                                                {block.id === 'wait' && '⏰'}
                                                {block.id === 'loop' && '🔄'}
                                                {block.id === 'if_condition' && '❓'}
                                                {block.id === 'stop' && '⏹️'}
                                            </div>
                                            <h3 className="font-medium mb-1">{block.name}</h3>
                                            <p className="text-xs opacity-90">{block.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    {/* Program Sequence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Program Sequence</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Click blocks to add them to your program
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="min-h-[200px] border-2 border-dashed border-muted rounded-lg p-4">
                                {programSequence.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>Click blocks to add them here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {programSequence.map((block, index) => (
                                            <div
                                                key={block.id}
                                                className="flex items-center justify-between p-2 bg-muted rounded"
                                            >
                                                <span className="text-sm">
                                                    {index + 1}. {block.name}
                                                </span>
                                                <button
                                                    onClick={() => removeFromSequence(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Programs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Programs</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Load pre-made programs
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {quickPrograms.map((program, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                        onClick={() => {
                                            const blocks = program.blocks.map(blockId => {
                                                for (const category of Object.keys(programmingBlocks) as CategoryType[]) {
                                                    const block = programmingBlocks[category].find((b: ProgramBlock) => b.id === blockId);
                                                    if (block) return { ...block, id: Date.now() + Math.random() };
                                                }
                                                return null;
                                            }).filter((block): block is SequenceBlock => block !== null);
                                            setProgramSequence(blocks);
                                        }}
                                    >
                                        <h4 className="font-medium">{program.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {program.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Robot Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Robot Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Selected Robot:</span>
                                    <span className="text-sm font-medium">
                                        {selectedRobotName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Status:</span>
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Ready
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Battery:</span>
                                    <span className="text-sm">85%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Location:</span>
                                    <span className="text-sm">Classroom A</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function ProgrammingPageWrapper() {
    return (
        <Suspense fallback={<div className="p-10">Loading...</div>}>
            <ProgrammingPage />
        </Suspense>
    );
}
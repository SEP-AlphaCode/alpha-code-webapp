"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Zap } from "lucide-react";

const actions = [
  {
    id: "tai-chi",
    name: "Tai Chi",
    description: "Perform graceful tai chi movements",
    image: "🧘‍♂️",
    commands: ["Do a tai chi move", "Do some tai chi moves", "Perform some tai chi moves"],
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50"
  },
  {
    id: "push-up",
    name: "Push-ups",
    description: "Execute strength training push-ups",
    image: "💪",
    commands: ["Do a push-up", "Show me eight push-ups", "Show me a push-up"],
    color: "from-red-400 to-orange-400",
    bgColor: "bg-red-50"
  },
  {
    id: "kungfu",
    name: "Kung Fu",
    description: "Practice Chinese martial arts",
    image: "🥋",
    commands: ["Show me Kung fu", "Practice kung fu", "Practice Chinese kung fu"],
    color: "from-amber-500 to-yellow-400",
    bgColor: "bg-amber-50"
  },
  {
    id: "yoga",
    name: "Yoga",
    description: "Demonstrate yoga poses and stretches",
    image: "🧘‍♀️",
    commands: ["Do a yoga pose", "Show me some yoga", "Practice yoga"],
    color: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-50"
  },
  {
    id: "lunge",
    name: "Lunge",
    description: "Perform lower body lunge exercises",
    image: "🏃‍♂️",
    commands: ["Do a lunge", "Show me a lunge", "Perform a lunge"],
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50"
  },
  {
    id: "nod",
    name: "Nod",
    description: "Simple head nodding gesture",
    image: "👤",
    commands: ["Nod your head", "Show me a nod", "Give a nod"],
    color: "from-gray-400 to-slate-400",
    bgColor: "bg-gray-50"
  },
  {
    id: "raise-hand",
    name: "Raise Hand",
    description: "Raise hand up in the air",
    image: "✋",
    commands: ["Raise your hand", "Put your hand up", "Hand up"],
    color: "from-indigo-400 to-blue-400",
    bgColor: "bg-indigo-50"
  },
  {
    id: "lift-foot",
    name: "Lift Foot",
    description: "Lift right foot off the ground",
    image: "👣",
    commands: ["Lift your right foot", "Raise your right foot", "Pick up your right foot"],
    color: "from-teal-400 to-cyan-400",
    bgColor: "bg-teal-50"
  },
  // ✅ New actions
  {
    id: "lift-left-foot",
    name: "Lift Left Foot",
    description: "Lift left foot off the ground",
    image: "🦶",
    commands: ["Lift your left foot", "Raise your left foot", "Pick up your left foot"],
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    id: "bow",
    name: "Bow",
    description: "Bow politely as a greeting",
    image: "🙏",
    commands: ["Bow", "Give a bow", "Make a bow"],
    color: "from-purple-400 to-fuchsia-500",
    bgColor: "bg-purple-50"
  },
  {
    id: "sit-down",
    name: "Sit Down",
    description: "Sit down and rest",
    image: "🪑",
    commands: ["Sit down", "Take a seat", "Please sit down"],
    color: "from-orange-400 to-red-400",
    bgColor: "bg-orange-50"
  }
];


export default function RobotActionPage() {
  const [currentAction, setCurrentAction] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const actionsPerPage = 8;
  const totalPages = Math.ceil(actions.length / actionsPerPage);

  const currentPageActions = actions.slice(
    currentPage * actionsPerPage,
    (currentPage + 1) * actionsPerPage
  );

  const action = actions[currentAction];

  const executeCommand = (command: string) => {
    setIsExecuting(true);
    console.log(`Executing: ${command}`);
    // Here you would send the command to your robot

    // Simulate execution delay
    setTimeout(() => setIsExecuting(false), 1500);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handlePrevAction = () => {
    setCurrentAction((prev) => (prev - 1 + actions.length) % actions.length);
  };
  const handleNextAction = () => {
    setCurrentAction((prev) => (prev + 1) % actions.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Robot Action Controller</h1>
          <p className="text-gray-600">Select an action and command for your robot to perform</p>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 overflow-hidden relative">
          {/* Left Chevron - Positioned outside the main content */}
          <button
            onClick={handlePrevAction}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-10"
            aria-label="Previous action"
          >
            <ChevronLeft size={36} className="text-gray-700" />
          </button>
          
          {/* Right Chevron - Positioned outside the main content */}
          <button
            onClick={handleNextAction}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-10"
            aria-label="Next action"
          >
            <ChevronRight size={36} className="text-gray-700" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Image Area */}
            <div className="lg:col-span-1 flex flex-col items-center">
              {/* Action Image */}
              <div className={`rounded-2xl h-64 w-64 flex items-center justify-center bg-gradient-to-br ${action.color} relative overflow-hidden`}>
                <div className="text-8xl z-10">{action.image}</div>
                <div className="absolute inset-0 bg-white/10"></div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl w-full">
                <h3 className="font-semibold text-gray-700 mb-2">About this action</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </div>

            {/* Right - Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-xl shadow-md">
                <div className="text-center font-bold text-2xl">{action.name}</div>
              </div>

              {/* Commands */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Available Commands</h3>
                {action.commands.map((command, index) => (
                  <button
                    key={index}
                    onClick={() => executeCommand(command)}
                    disabled={isExecuting}
                    className={`w-full p-4 text-left rounded-xl font-medium transition-all duration-200 flex items-center ${
                      index === 0 ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : 
                      index === 1 ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 
                      'bg-gray-800 hover:bg-gray-900 text-white'
                    } ${isExecuting ? 'opacity-70' : 'shadow-md hover:shadow-lg'}`}
                  >
                    <Play size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">&quot;{command}&quot;</span>
                  </button>
                ))}
              </div>

              {/* Try It Out Button */}
              <button 
                onClick={() => executeCommand(action.commands[0])}
                disabled={isExecuting}
                className={`w-full p-4 rounded-xl font-bold text-white transition-all flex items-center justify-center ${
                  isExecuting ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                } shadow-md hover:shadow-lg`}
              >
                <Zap size={20} className="mr-2" />
                {isExecuting ? 'Executing...' : 'Try It Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-between w-full mb-4">
            {/* Left Arrow */}
            <button 
              onClick={prevPage}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 0}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Circle Grid */}
            <div className="grid grid-cols-4 gap-6 mx-4">
              {currentPageActions.map((actionItem, index) => (
                <div 
                  key={actionItem.id}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={() => setCurrentAction(currentPage * actionsPerPage + index)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                      currentAction === currentPage * actionsPerPage + index 
                        ? `ring-4 ring-offset-2 ring-blue-400 ${actionItem.bgColor}`
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{actionItem.image}</div>
                  </button>
                  <span className="text-xs font-medium text-gray-700 mt-2 text-center max-w-16 truncate">
                    {actionItem.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={nextPage}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-2 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-8 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
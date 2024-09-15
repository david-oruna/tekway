'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, CheckCircle } from 'lucide-react'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid'
import { careerPaths, Skill, CareerPath, SkillCategory } from '../config/career-paths'

import { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


function CartoonButton({ skill, onClick, isSelected }: { skill: Skill, onClick: () => void, isSelected: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`
          w-24 h-24 rounded-full text-2xl font-bold text-primary-foreground
          shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(0,0,0,0.2)]
          transition-all duration-100 ease-in-out relative
          ${isSelected || 'hover:'}transform ${isSelected || 'hover:'}translate-y-1 ${isSelected || 'hover:'}shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.1),0_2px_0_0_rgba(0,0,0,0.2)]
        `}
      >
        <div 
          className="
            absolute inset-2 bg-white rounded-full 
            flex items-center justify-center
            shadow-[inset_0px_5px_1px_1px_rgba(0,0,0,0.25)]
          "
        >
          <Image 
            src={skill.logo} 
            alt={skill.name} 
            width={40} 
            height={40} 
            className="z-10"
          />
        </div>
      </button>
      <span className="mt-2 text-sm font-medium">{skill.name}</span>
    </div>
  )
}

interface RoadmapProps {
  chatHelpers: {
    handleSubmit: (message: string) => void;
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  };
  careerPathId: string;
}

export function Roadmap({ chatHelpers, careerPathId }: RoadmapProps) {
  const { handleSubmit, setMessages } = chatHelpers
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState("1")

  const careerPath = careerPaths[careerPathId]

  


  if (!careerPath) {
    return <div>Career path not found</div>
  }

  const handleButtonClick = (skillName: string) => {
    setSelectedButton(selectedButton === skillName ? null : skillName)
  }

  const handleOptionSelect = (option: string, skillName: string) => {
    const message = `I want to ${option} about ${skillName}`
    chatHelpers.handleSubmit(message);
    setSelectedButton(null);
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
  }

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardContent className="p-10 h-full">
      <h2 className="text-2xl font-bold mb-4">{careerPath.name} Roadmap</h2>

      <div className="flex flex-row justify-between items-center">
      <div className="flex items-center space-x-4 z-10">
        <Select onValueChange={handleLevelChange} value={selectedLevel}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="relative flex flex-col items-center px-12 py-8">
            {careerPath.levels[selectedLevel]?.map((category: SkillCategory, categoryIndex: number) => (
              <div key={category.name} className="w-full mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-4 text-lg font-semibold">{category.name}</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex flex-col justify-center gap-4 ">
                  {category.skills.map((skill: Skill, skillIndex: number) => (
                    <div key={skill.name} 
                    className={`relative mb-5 ${skillIndex % 2 === 0 ? 'self-start' : 'self-end'}`}>
                      <CartoonButton
                        skill={skill}
                        onClick={() => handleButtonClick(skill.name)}
                        isSelected={selectedButton === skill.name}
                      />
                      {selectedButton === skill.name && (
                        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10">
                          <FloatingWindow onClose={(option) => handleOptionSelect(option, skill.name)} skill={skill.name} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function FloatingWindow({ onClose, skill }: { onClose: (option: string, skill: string) => void, skill: string }) {
  return (
    <div className="bg-popover p-4 rounded-lg shadow-lg w-48">
      <div className="flex flex-col space-y-2">
        <Button variant="outline" size="sm" onClick={() => onClose('chat', skill)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button variant="outline" size="sm" onClick={() => onClose('complete', skill)}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as complete
        </Button>
      </div>
    </div>
  )
}
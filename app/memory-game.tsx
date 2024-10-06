"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// MemoryGame component
const MemoryGame = () => {
    // State variables
    const [initialPattern, setInitialPattern] = useState<number[][]>(Array(3).fill(Array(3).fill(0)))
    const [userSequence, setUserSequence] = useState<Array<number[]>>(Array(3).fill(Array(3).fill(0)))
    const [showInitial, setShowInitial] = useState(true)
    const [rightCount, setRightCount] = useState(0)
    const [errorCount, setErrorCount] = useState(0)
    const [userLevel, setUserLevel] = useState(1)
    const [userLife, setUserLife] = useState(3)
    const [blockWidth, setBlockWidth] = useState(24)

    const [startBtn, setStartBtn] = useState(false)

    // Function to start the game
    function startGame() {
      setInitialPattern(generateRandomPattern(3, 3))
      setStartBtn(true)
      const timer = setTimeout(() => setShowInitial(false), 2000)
      return () => clearTimeout(timer)
    }

    // Function to restart the game
    const restartGame = () => {
      setUserLevel(1)
      setErrorCount(0)
      setRightCount(0)
      setUserLife(3)
      setShowInitial(true)
      setUserSequence(Array(3).fill(Array(3).fill(0)))
      setInitialPattern(generateRandomPattern(3, 3))
      const timer = setTimeout(() => setShowInitial(false), 2000)
      return () => clearTimeout(timer)
    }

    // Handle cell click event
    const handleCellClick = (rowIndex: number, colIndex: number) => {
      const audio = new Audio('/sounds/click-sound.mp3')
      audio.play()
      setUserSequence(prevSequence => 
        prevSequence.map((row: number[], rIdx: number) =>
          row.map((cell: number, cIdx: number) => {
            if (rIdx === rowIndex && cIdx === colIndex) {
              if (initialPattern[rowIndex][colIndex] === 1) {
                if (initialPattern.flat().filter(cell => cell === 1).length === rightCount + 1) {
                  const audio = new Audio('/sounds/success.mp3')
                  audio.play()
                  setUserLevel(userLevel + 1)
                  setRightCount(0)
                  setErrorCount(0)
                  setShowInitial(true)
                  updatePatternAndSequence(userLevel + 1)
                  const timer = setTimeout(() => setShowInitial(false), 2000)
                  return () => clearTimeout(timer)
                }
                setRightCount(rightCount + 1)
                return 1
              } else {
                if (errorCount === 2) {
                  setUserLife(userLife - 1)
                  if (userLife === 1) {
                    setUserLevel(1)
                    setUserLife(3)
                    updatePatternAndSequence(1)
                  }
                  else updatePatternAndSequence(userLevel)

                  setRightCount(0)
                  setErrorCount(0)
                  setShowInitial(true)
                  const timer = setTimeout(() => setShowInitial(false), 2000)
                  return () => clearTimeout(timer)
                }
                setErrorCount(errorCount + 1)
                const audio = new Audio('/sounds/wrong.mp3')
                audio.play()
                return 2
              }
            }
            return cell;
          })
        )
      )
    }

    // Update pattern and sequence based on the current level
    const updatePatternAndSequence = (level: number) => {
      const size = level <= 4 ? 3 : level <= 7 ? 4 : level <= 10 ? 5 : level <= 14 ? 6 : 7
      const onesCount = level <= 3 ? level + 2 : level <= 5 ? level + 3 : level <= 8 ? level + 4 : level <= 10 ? level + 5 : level + 6
      setInitialPattern(generateRandomPattern(size, onesCount))
      setUserSequence(Array(size).fill(Array(size).fill(0)))
      setBlockWidth(size <= 4 ? 24 : size <= 5 ? 20 : 16)
    }

    return (
      <>
        <div className='w-full min-h-[30rem] max-h-4/5 rounded-lg flex flex-col items-center justify-center'>
          <div
            className='rounded-lg gap-2 p-4 grid'
            style={{ gridTemplateColumns: `repeat(${initialPattern[0]?.length || 0}, minmax(0, 1fr))` }}
          >
            {(showInitial ? initialPattern : userSequence).map((row: number[], rowIndex: number) =>
              row.map((cell: number, colIndex: number) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex items-center justify-center rounded-lg cursor-pointer ${
                    cell === 1 ? 'bg-[#6283fd]' : cell === 2 ? 'bg-[#283976]' : 'bg-[#c9d4fc]'
                  } ${blockWidth === 24 ? 'w-24 h-24' : blockWidth === 20 ? 'w-20 h-20' : 'w-16 h-16'}`}
                  onClick={() => (!showInitial && cell === 0) && handleCellClick(rowIndex, colIndex)}
                  whileTap={{ scale: 0.9 }}
                />
              ))
            )}
          </div>
         <div className='flex space-x-4'>
            { startBtn === false && <button className='btn bg-white' onClick={()=>startGame()}>Start</button> }
            { startBtn === true && <button className='btn bg-white' onClick={()=>restartGame()}>Restart</button> }
         </div>
        </div>
        <div className='flex space-x-4 mt-6 justify-center w-full'>
          <div className="stats shadow w-32 text-center">
            <div className="stat">
              <div className="stat-title">Level</div>
              <div className="stat-value">{userLevel}</div>
            </div>
          </div>
          <div className="stats shadow w-48 text-center">
            <div className="stat">
              <div className="stat-title">Remaining Rights</div>
              <div className="stat-value">{userLife}</div>
            </div>
          </div>
        </div>
      </>
    )
}

export default MemoryGame

// Function to generate a random pattern
function generateRandomPattern(size: number, onesCount: number): number[][] {
  const pattern = Array.from({ length: size }, () => Array(size).fill(0))
  let placedOnes = 0

  while (placedOnes < onesCount) {
    const row = Math.floor(Math.random() * size)
    const col = Math.floor(Math.random() * size)

    if (pattern[row][col] === 0) {
      pattern[row][col] = 1
      placedOnes++
    }
  }

  return pattern
}
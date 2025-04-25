import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { verifyQuizId } from '../utils/api';

export default function Home() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [fullQuizLink, setFullQuizLink] = useState("")
  const { setQuizId } = useAuth()

  const handleCreateNewQuiz = () => {
    nav('/create')
  }

  const handleJoinQuiz = async () => {
    if (fullQuizLink) {
      const extractId = fullQuizLink.split("/").pop() // Extract the quiz ID from the URL

      // CHeck if the ID is valid - exists in the database
      if (extractId) {
        try {
          await verifyQuizId(extractId)
          setQuizId(extractId) // Set the quiz ID in the context
          localStorage.setItem("quizId", extractId) // Set the quiz ID in local storage
          nav(`/login/${extractId}`) // Navigate to the login page
        } catch (error) {
          console.error("Error verifying quiz ID:", error)
          notyf.error("Invalid quiz ID. Please create a new quiz or join an existing one.")
          return
        }
      }
    }
  }

  return (
    <div className='flex flex-col justify-center text-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-300 gap-6 p-4'>
      <div className='text-white mb-4'>
        <h1 className='text-5xl font-bold drop-shadow-md'>Welcome to Trivia Quiz!</h1>
        <p className='text-lg font-light mt-2 text-white/80'>Create your own quiz or join a friend’s challenge. Fun, fast and competitive!</p>
      </div>

      <button onClick={handleCreateNewQuiz} className='w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Create New Quiz</button>

      <div className='flex items-center w-full max-w-xs gap-4'>
        <hr className='flex-grow border-t border-white/50' />
        <span className='text-white text-sm font-light'>OR</span>
        <hr className='flex-grow border-t border-white/50' />
      </div>

      <input onChange={(e) => setFullQuizLink(e.target.value)} value={fullQuizLink} type='text' placeholder='Enter quiz URL to join' className='w-full max-w-xs text-white bg-white/10 border border-gray-300 rounded-xl text-center p-3 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400' />
      <button onClick={handleJoinQuiz} className='w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Join Quiz</button>
    </div>

  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function ShareQuizPage() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [generatedQuizId, setGeneratedQuizId] = useState(null)

  // Effect to get the quiz ID from local storage when the component mounts
  useEffect(() => {
    const localQuizId = localStorage.getItem("quizId") // Get the quiz ID from local storage
    if (!localQuizId) {
      notyf.error("Something went wrong. Please try again.")
      nav("/home") // Redirect to home if no quiz ID is found
      return
    }
    
    const fullQuizLink = `${import.meta.env.VITE_FRONTEND_URL}/invite/${localQuizId}` // Construct the full quiz link
    setGeneratedQuizId(fullQuizLink) // Set the quiz ID in state
  }, [])

  // Function to handle the copy link button
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedQuizId)
    notyf.success("Quiz link copied to clipboard!")
  }

  // Function to handle the back to home button
  const handleHomeBtn = () => {
    localStorage.removeItem("quizId")
    nav("/home")
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-300 gap-6 p-4 text-center select-none'>
      <h1 className='text-white text-5xl font-bold drop-shadow-md'>Quiz Ready!</h1>
      <p className='text-white/80 text-lg max-w-xl'>Invite your friends and find out who's the trivia champ!</p>

      <div className='bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md'>
        <h2 className='text-white text-xl font-semibold mb-4'>Your Quiz Link</h2>
        <div className='relative w-full mb-6'>
          <input type='text' value={generatedQuizId || ""} readOnly className='w-full text-white bg-white/10 border border-gray-300 rounded-xl text-center p-3 pr-12 placeholder-white outline-none' />
          <button onClick={handleCopyLink} className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-xl shadow-md active:scale-95 duration-150 outline-none'>Copy</button>
        </div>
        <button onClick={handleHomeBtn} className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Back to Home</button>
      </div>
    </div>
  )
}
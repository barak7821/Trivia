import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

export default function QuizRedirect() {
    const nav = useNavigate()
    const { quizId } = useParams()
    const { setQuizId } = useAuth()

    // Check if quizId is present in the URL params and set it in the context
    const checkQuizId = () => {
        if (quizId) {
            setQuizId(quizId) // Set the quiz ID in the context
            localStorage.setItem("quizId", quizId) // Set the quiz ID in local storage
            nav(`/login/${quizId}`) // Navigate to the login page
        } else {
            nav("/home")
        }
    }

    useEffect(() => {
        checkQuizId()
    }, [])

    return (
        <div className='bg-gradient-to-br from-blue-500 to-purple-300 flex items-center justify-center min-h-screen'>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    )
}

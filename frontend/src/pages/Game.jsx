import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useAuth } from '../utils/AuthContext';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { fetchQuestions } from '../utils/api';

export default function Game() {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const { quizId } = useParams()
    const [questionIndex, setQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState()
    const [isAnswering, setIsAnswering] = useState(false)
    const [shuffledAnswers, setShuffledAnswers] = useState([])
    const [shuffledQuestions, setShuffledQuestions] = useState([])
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { userName } = useAuth()

    // Get quiz questions from the database
    const getQuestions = async () => {
        if (!userName) return nav("/home") // If userName is not set, navigate to home page

        // Fetch questions from the server
        try {
            const data = await fetchQuestions(quizId)
            const questions = data.questions
            const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10) // Shuffle and limit to 10 questions
            setShuffledQuestions(shuffled)
            localStorage.setItem("points", 0)
        } catch (error) {
            console.error("Error fetching questions:", error)
        }
    }

    // Fetch questions when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                await getQuestions()
            } catch (error) {
                console.error("Error fetching data:", error)
                setError(true)
                notyf.error("An error occurred while fetching the quiz. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [quizId])

    // Shuffle answers every time the question changes
    useEffect(() => {
        if (shuffledQuestions.length > 0) {
            setShuffledAnswers(shuffleAnswers(currentQuestion.answers))
        }
    }, [shuffledQuestions, questionIndex])

    // If there is an error, show error message
    if (error) {
        return (
            <Error />
        )
    }

    // If loading, show spinner
    if (isLoading) {
        return (
            <Loading />
        )
    }
    // Get current question based on index
    const currentQuestion = shuffledQuestions[questionIndex]

    // If there are no questions to show, render fallback
    if (!currentQuestion) return <p className="text-white text-3xl">No questions are available right now.</p>


    // Shuffle function for answers
    const shuffleAnswers = (answers) => {
        return [...answers].sort(() => Math.random() - 0.5)
    }

    // Handle answer selection
    const checkAnswer = (selected) => {
        // Prevent clicking during delay
        if (isAnswering) return

        setSelectedAnswer(selected)
        setIsAnswering(true)

        // If answer is correct, update points and save to localStorage
        if (selected === currentQuestion.correctAnswer) {
            const currentPoints = +localStorage.getItem("points") || 0
            localStorage.setItem("points", currentPoints + 1)
        }

        // Add a 1-second delay before moving to the next question or game over screen
        // This gives the user visual feedback (button turns green/red) to see if their answer was correct or wrong
        // Without this delay, the transition is instant and the user can't tell what happened
        setTimeout(() => {
            if (questionIndex < shuffledQuestions.length - 1) {
                setQuestionIndex(questionIndex + 1)
                setSelectedAnswer(null)
            } else {
                nav(`/gameover/${quizId}`)
            }
            setIsAnswering(false)
        }, 1000)
    }

    // Skip question function
    const skipQuestion = () => {
        if (isAnswering) return
        setSelectedAnswer(null)

        // Move to next question or finish game
        if (questionIndex < shuffledQuestions.length - 1) {
            setQuestionIndex(questionIndex + 1)
        } else {
            nav(`/gameover/${quizId}`)
        }
    }

    return (
        <div className='bg-gradient-to-br from-blue-500 to-purple-300 p-4'>
            {/* Navigate back to home page */}
            <div className='w-full max-w-xl self-start'>
                <button type='button' onClick={() => nav("/home")} className='text-white text-sm hover:underline flex items-center gap-1'>
                    <span>←</span> Back to Home
                </button>
            </div>

            <div className='min-h-screen flex flex-col text-center items-center justify-center gap-6'>
                <h1 className='font-bold text-5xl text-white drop-shadow-md'>Trivia Quiz</h1>
                <h2 className='text-white text-2xl max-w-xl w-full bg-white/10 backdrop-blur-md p-4 rounded-xl ring-1 ring-white/30 shadow-md'>{currentQuestion.question}?</h2>
                <div className='grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl max-w-xl w-full p-4'>
                    {shuffledAnswers.map((answer) => {
                        const isCorrect = selectedAnswer === answer && answer === currentQuestion.correctAnswer
                        const isWrong = selectedAnswer === answer && answer !== currentQuestion.correctAnswer
                        return (
                            <button key={answer} disabled={isAnswering} onClick={() => checkAnswer(answer)} className={`text-white font-semibold text-lg rounded-xl py-3 px-4 shadow-md active:scale-95 disabled:scale-100 disabled:opacity-60 ${!selectedAnswer ? "bg-blue-500 hover:bg-blue-600" : isCorrect ? "bg-green-500" : ""} ${isWrong ? "bg-red-500" : "bg-blue-500"}`}>{answer}</button>
                        )
                    })}
                </div>
                <button onClick={skipQuestion} disabled={isAnswering} className='text-white text-lg font-semibold rounded-full px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors shadow-md active:scale-95 disabled:bg-blue-500 disabled:opacity-60'>Skip</button>
            </div>
        </div>
    )
}
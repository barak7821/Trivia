import React, { useState } from 'react'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom'
import { createQuiz } from '../utils/api';

export default function CreateQuiz() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("")
  const [questions, setQuestions] = useState([])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: ["", "", ""],
        correctAnswer: ""
      }
    ])
  }

  const handleRemoveQuestion = index => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (questions.length === 0) {
      notyf.error("Please add at least one question.")
      return
    }
    if (questions.some(q => q.question === "" || q.correctAnswer === "" || q.answers.some(a => a === ""))) {
      notyf.error("Please fill in all fields for each question.")
      return
    }

    // data to be sent to the backend
    const quizData = {
      timeLimitMinutes: +timeLimitMinutes,
      questions: questions.map((question) => ({
        question: question.question,
        answers: [...question.answers, question.correctAnswer],
        correctAnswer: question.correctAnswer
      }))
    }

    try {
      const data = await createQuiz(quizData)
      notyf.success("Quiz created successfully!")
      localStorage.setItem("quizId", data.quizId) // Store the quiz ID in local storage
      nav("/share") // Redirect to the share page after successful creation
    } catch (error) {
      console.error("Error creating quiz:", error)
      notyf.error("Failed to create quiz. Please try again.")
    }
  }

  return (
    <div className='bg-gradient-to-br from-blue-500 to-purple-300 p-4'>
      {/* Navigate back to home page */}
      <div className='w-full max-w-xl self-start'>
        <button type='button' onClick={() => nav("/")} className='text-white text-sm hover:underline flex items-center gap-1'>
          <span>←</span> Back to Home
        </button>
      </div>

      <div className='min-h-screen flex flex-col text-center items-center justify-center gap-6'>
        <h1 className='font-bold text-4xl text-white drop-shadow-md'>Create a Trivia Quiz</h1>
        <form className='flex flex-col items-center gap-6 w-full max-w-xl bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl' onSubmit={handleSubmit}>
          <div className='text-center'>
            <label className='block text-white text-lg font-semibold mb-1'>
              What is the time limit for the quiz in minutes? <span className='text-sm text-gray-300'>(optional)</span>
            </label>
            <label className='block text-gray-200 text-sm mb-2'>
              Leave empty for default (10 minutes), minimum if set: 1 minute
            </label>
            <input onChange={(e) => setTimeLimitMinutes(e.target.value)} value={timeLimitMinutes} type='number' min='1' placeholder='e.g. 5, or leave empty for default' className='w-full text-white bg-white/10 border border-gray-300 rounded-xl text-center p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white' />
          </div>

          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className='w-full bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md flex flex-col gap-4 relative'>
              <button type='button' onClick={() => handleRemoveQuestion(questionIndex)} className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold'>×</button>
              <h2 className='text-white font-bold text-lg'>Question {questionIndex + 1}</h2>
              <input type='text' placeholder='Enter your question' value={question.question} onChange={e => handleQuestionChange(questionIndex, "question", e.target.value)} className='w-full text-white bg-white/10 border border-gray-300 rounded-xl p-3 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400' />
              <div className='flex flex-col gap-2'>
                {question.answers.map((answer, answerIndex) => (
                  <input key={answerIndex} type='text' placeholder={`Answer option ${answerIndex + 1}`} value={answer} onChange={e => handleAnswerChange(questionIndex, answerIndex, e.target.value)} className='w-full text-white bg-white/10 border border-gray-300 rounded-xl p-3 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400' />
                ))}
              </div>
              <input type='text' placeholder='Correct answer' value={question.correctAnswer} onChange={e => handleQuestionChange(questionIndex, "correctAnswer", e.target.value)} className='w-full text-white bg-white/10 border border-gray-300 rounded-xl p-3 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>
          ))}

          <button onClick={handleAddQuestion} type='button' className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Add New Question</button>
          <button type='submit' className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Submit Quiz</button>
        </form>
      </div>
    </div>
  )
}
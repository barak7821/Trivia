import React, { useState } from 'react'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext';
import { newUser } from '../utils/api';

export default function Login() {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const { quizId } = useParams()
    const [userNameValue, setUserNameValue] = useState("")
    const { setUserName } = useAuth()

    const handleOnClick = async () => {
        // Check if the username is valid
        if (!userNameValue || userNameValue.length === 0) return notyf.error("Name is required. Please fill it in.")
        if (userNameValue.length <= 2 || userNameValue.length >= 8) return notyf.error("Name need to be 2-8 characters only.")
        if (userNameValue.includes(" ")) return notyf.error("Name cannot contain spaces.")
        if (!/^[a-zA-Z0-9]+$/.test(userNameValue)) return notyf.error("Name can only contain letters.")
        if (/\d/.test(userNameValue)) return notyf.error("Name cannot contain numbers.")

        localStorage.setItem("userName", userNameValue) // Set the username in local storage
        setUserName(userNameValue) // Set the username in context

        // Create a new user for the quiz
        try {
            newUser(userNameValue, quizId)
            nav(`/quiz/${quizId}`)
        } catch (error) {
            console.error("Error creating user:", error)
            if (error?.response?.status === 400 && error.response.data?.code === "name_exist") {
                notyf.error("Name already exists. Please choose a different name.")
            }
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
                <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center space-y-6'>
                    <h1 className='font-bold text-5xl text-white drop-shadow-md'>Trivia Quiz</h1>
                    <h2 className='text-white text-2xl font-medium'>Enter your name to start</h2>
                    <input onChange={(e) => setUserNameValue(e.target.value)} className='w-full text-white border border-gray-300 bg-white/10 rounded-xl text-center p-3 focus:outline-none
                focus:ring focus:ring-blue-400 focus:border-blue-400 placeholder-white' type='text' placeholder='Enter your name' value={userNameValue} />
                    <button onClick={handleOnClick} className='w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold rounded-full py-3 shadow-md active:scale-95 duration-150'>Play</button>
                </div>
            </div>
        </div>
    )
}
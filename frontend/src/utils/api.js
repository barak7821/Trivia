import axios from "axios";

// This is the base URL for the API
const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

// Check if the quiz ID is valid - exists in the database
export const verifyQuizId = async (id) => {
    try {
        await axios.post(`${baseApiUrl}/quiz/check`, {
            id
        })
    } catch (error) {
        throw error
    }
}

// Create a new user for the quiz
export const newUser = async (name, quizId) => {
    try {
        await axios.post(`${baseApiUrl}/quiz/user`, {
            name,
            quizId
        })
    } catch (error) {
        throw error
    }
}

// Create a new quiz
export const createQuiz = async (quizData) => {
    try {
        const { data } = await axios.post(`${baseApiUrl}/quiz`,
            quizData
        )
        return data
    } catch (error) {
        throw error
    }
}

// Fetch quiz questions from the database
export const fetchQuestions = async (quizId) => {
    try {
        const { data } = await axios.get(`${baseApiUrl}/quiz/${quizId}`)
        return data
    } catch (error) {
        throw error
    }
}

// Update player data in the database
export const fetchPlayerData = async (quizId, name, score) => {
    try {
        await axios.put(`${baseApiUrl}/quiz/${quizId}`, {
            name,
            score
        })
    } catch (error) {
        throw error
    }
}

// Fetch quiz results from the database
export const fetchQuizResults = async (quizId) => {
    try {
        const { data } = await axios.get(`${baseApiUrl}/quiz/user/${quizId}`)
        return data
    } catch (error) {
        throw error
    }
}

// Check if quiz and attempt exist before updating
export const fetchQuizAndAttempt = async (quizId) => {
    try {
        const { data: quiz } = await axios.get(`${baseApiUrl}/quiz/${quizId}`)
        return quiz
    } catch (error) {
        throw error
    }
}
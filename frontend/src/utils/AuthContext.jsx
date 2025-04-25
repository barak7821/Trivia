import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '')
    const [quizId, setQuizId] = useState(localStorage.getItem('quizId') || '')

    return (
        <AuthContext.Provider value={{ userName, setUserName, quizId, setQuizId }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext (arrow function)
export const useAuth = () => useContext(AuthContext)
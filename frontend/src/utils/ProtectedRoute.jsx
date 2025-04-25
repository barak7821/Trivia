import React, { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { verifyQuizId } from "./api"
import Loading from "../components/Loading"

export default function ProtectedRoute({ children }) {
  const notyf = new Notyf({ position: { x: "center", y: "top" } })
  const { quizId } = useParams()
  const [isValid, setIsValid] = useState(null)

  useEffect(() => {
    let isMounted = true
    const handleQuizIdValidation = async () => {
      try {
        await verifyQuizId(quizId)
        if (isMounted) setIsValid(true)
      } catch (error) {
        if (isMounted) {
          setIsValid(false)
          notyf.error("Invalid quiz ID. Please create a new quiz or join an existing one.")
        }
      }
    }
    if (quizId) handleQuizIdValidation()
    return () => { isMounted = false }
  }, [quizId])

  if (!quizId) return <Navigate to="/" replace />
  if (isValid === null) return <Loading />
  if (!isValid) return <Navigate to="/" replace />
  return children
}
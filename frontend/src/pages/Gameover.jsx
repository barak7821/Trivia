import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { fetchPlayerData, fetchQuizAndAttempt, fetchQuizResults } from '../utils/api';

export default function Gameover() {
    const nav = useNavigate()
    const { quizId } = useParams()
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const [points, setPoints] = useState(Number(localStorage.getItem("points")) || 0)
    const [players, setPlayers] = useState([])
    const { userName } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    // Update player data in the database
    const updatePlayerData = async () => {
        if (!userName && points == null) { // Check if userName and points are available
            console.error("User name or points are not available.")
            nav("/home")
            setIsLoading(false)
            return
        }

        // Fetch player data from server
        try {
            await fetchPlayerData(quizId, userName, points)
        } catch (error) {
            console.error("Error updating player data:", error)
            throw error
        }
    }

    // Fetch quiz results from the database
    const getQuizResults = async () => {
        try {
            const data = await fetchQuizResults(quizId)
            return addDurationToPlayers(data)
        } catch (error) {
            console.error("Error fetching quiz results:", error)
            throw error
        }
    }

    // Check if quiz and attempt exist before updating
    const checkQuizAndAttempt = async () => {
        try {
            const quiz = await fetchQuizAndAttempt(quizId)
            const lowerName = userName?.toLowerCase()
            const hasAttempt = quiz.attempts.some(a => a.name === lowerName)
            if (!hasAttempt) {
                notyf.error("No attempt found for this user. Please join the quiz again.")
                nav("/home")
                return false
            }
            return true
        } catch (error) {
            notyf.error("Quiz not found. Please join or create a quiz.")
            nav("/home")
            return false
        }
    }

    useEffect(() => {
        const updateAndFetch = async () => {
            setIsLoading(true)
            try {
                if (!userName || points == null) {
                    nav("/home")
                    return
                }
                const valid = await checkQuizAndAttempt()
                if (!valid) return
                await updatePlayerData()
                const playersWithDuration = await getQuizResults()
                setPlayers(playersWithDuration)
            } catch (error) {
                setError(true)
                notyf.error("An error occurred while fetching the quiz results. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }
        updateAndFetch()
    }, [quizId])

    // Handle the back to home button click
    const handleHomeBtn = () => {
        setPoints(null)
        localStorage.removeItem("points")
        localStorage.removeItem("userName")
        nav("/home")
    }

    // Add duration to players
    // This function calculates the duration of each player's quiz attempt and adds it to the player object
    const addDurationToPlayers = (players) => {
        return players.map(player => {
            const start = new Date(player.startedAt)
            const end = new Date(player.submittedAt)
            const durationMs = end - start
            const totalMinutes = Math.floor(durationMs / 1000 / 60)
            const minutes = totalMinutes % 60

            return {
                ...player,
                duration: `${minutes}m`,
                durationInMinutes: totalMinutes
            }
        })
    }

    // Sort players by score and duration
    const sortedPlayers = [...players].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score
        }
        return a.durationInMinutes - b.durationInMinutes
    })

    // Get the rank of the current player
    const playerRank = (() => {
        const index = sortedPlayers.findIndex(p => p.name.toLowerCase() === userName?.toLowerCase())
        return index >= 0 ? index + 1 : null
    })()

    // This function returns the rank of the player based on their index in the sorted players array
    const placeLabel = (rank) => {
        if (!rank) return "Place unknown"
        switch (rank) {
            case 1: return "🥇 1st Place"
            case 2: return "🥈 2nd Place"
            case 3: return "🥉 3rd Place"
            default: return `${rank}th Place`
        }
    }

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

    return (
        <div className='bg-gradient-to-br from-blue-500 to-purple-300 p-6 min-h-screen flex flex-col text-center items-center justify-center gap-8'>

            <h1 className='font-bold text-5xl text-white drop-shadow-md'>Trivia Quiz</h1>

            <h2 className='text-4xl font-bold text-yellow-300'>
                {placeLabel(playerRank)}
            </h2>

            <p className='text-white text-2xl'>
                {points !== null && points > 0
                    ? `You answered ${points} ${points === 1 ? "question" : "questions"} correctly`
                    : "No correct answers"}
            </p>

            {/* Top 3 Players */}
            <div className='flex flex-col gap-3 mt-4 bg-white/10 p-4 rounded-xl text-white w-full max-w-md'>
                <h3 className='text-xl font-bold mb-2 underline'>🏆 Top 3 Players</h3>
                {sortedPlayers.slice(0, 3).map((player, idx) => (
                    <div key={idx} className='flex justify-between font-semibold'>
                        <span>{placeLabel(idx + 1)} - {player.name}</span>
                        <span>{player.score} pts</span>
                    </div>
                ))}
            </div>

            {/* All Players List */}
            <div className='bg-white/10 p-4 rounded-xl text-white w-full max-w-md mt-4'>
                <h3 className='text-lg font-bold mb-2 underline'>All Participants</h3>
                {sortedPlayers.map((player, idx) => (
                    <div key={idx} className='flex justify-between border-b border-white/20 py-1'>
                        <span>{player.name}</span>
                        <span>{player.score} pts</span>
                    </div>
                ))}
            </div>

            <button onClick={handleHomeBtn} className='text-white text-lg font-semibold rounded-full px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors shadow-md active:scale-95 mt-6'>
                Back to Home
            </button>
        </div>
    )
}

// Create the built-in quiz
import Quiz from "../models/quizModel.js"
import mongoose from "mongoose"

// Custom ObjectId for the built-in quiz
const BUILTIN_ID = new mongoose.Types.ObjectId("64e2b89c9f1e8c0012a1cdef")

// This is set to a date far in the future to avoid expiration
const FAR_FUTURE = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)

// Define the built-in quiz data
const builtInQuizData = {
    _id: BUILTIN_ID,
    questions: [
        {
            question: "What is the capital of France",
            answers: [
                "Berlin",
                "Madrid",
                "Paris",
                "Rome"
            ],
            correctAnswer: "Paris"
        },
        {
            question: "What is the largest planet in our solar system",
            answers: [
                "Earth",
                "Jupiter",
                "Mars",
                "Saturn"
            ],
            correctAnswer: "Jupiter"
        },
        {
            question: "What is the chemical symbol for gold",
            answers: [
                "Au",
                "Ag",
                "Fe",
                "Pb"
            ],
            correctAnswer: "Au"
        },
        {
            question: "Who wrote 'Romeo and Juliet'",
            answers: [
                "Charles Dickens",
                "William Shakespeare",
                "Mark Twain",
                "Jane Austen"
            ],
            correctAnswer: "William Shakespeare"
        },
        {
            question: "What is the smallest prime number",
            answers: [
                "0",
                "1",
                "2",
                "3"
            ],
            correctAnswer: "2"
        },
        {
            question: "What is the speed of light",
            answers: [
                "300,000 km/s",
                "150,000 km/s",
                "450,000 km/s",
                "600,000 km/s"
            ],
            correctAnswer: "300,000 km/s"
        },
        {
            question: "What is the largest mammal in the world",
            answers: [
                "Elephant",
                "Blue Whale",
                "Giraffe",
                "Great White Shark"
            ],
            correctAnswer: "Blue Whale"
        },
        {
            question: "What is the main ingredient in guacamole",
            answers: [
                "Tomato",
                "Avocado",
                "Onion",
                "Pepper"
            ],
            correctAnswer: "Avocado"
        },
        {
            question: "What is the hardest natural substance on Earth",
            answers: [
                "Gold",
                "Diamond",
                "Iron",
                "Platinum"
            ],
            correctAnswer: "Diamond"
        },
        {
            question: "What is the largest ocean on Earth",
            answers: [
                "Atlantic Ocean",
                "Indian Ocean",
                "Arctic Ocean",
                "Pacific Ocean"
            ],
            correctAnswer: "Pacific Ocean"
        }
    ],
    attempts: [],
    createdAt: FAR_FUTURE
}

// Create a new quiz or update the existing one
export const createBuiltInQuiz = async () => {
    try {
        const res = await Quiz.updateOne( // Create or update the built-in quiz
            { _id: BUILTIN_ID }, // Find the quiz by ID
            { $setOnInsert: builtInQuizData }, // Set the built-in quiz data if it doesn't exist
            { upsert: true } // Upsert option to create if it doesn't exist
        )

        if (res.upsertedCount) { // Check if a new quiz was created
            console.log("Built-in quiz created successfully.")
        } else { // If no new quiz was created, it means it already exists
            console.log("Built-in quiz already exists. Skipping creation.")
        }
    } catch (error) {
        console.error("Error creating built-in quiz:", error)
        throw error
    }
}
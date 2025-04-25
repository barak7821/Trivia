import Quiz, { quizValidationSchema } from "../models/quizModel.js"

// Controller to get quiz by ID from params
export const getQuiz = async (req, res) => {
    const { id } = req.params // Extract quiz ID from request parameters
    if (!id) return res.status(400).json({ message: "Quiz ID is required" }) // Check if ID is provided

    try {
        const quiz = await Quiz.findById(id) // Fetch quiz from the database using ID
        if (!quiz) return res.status(404).json({ message: "Quiz not found" }) // Check if quiz exists

        console.log("Quiz fetched successfully")
        res.status(200).json(quiz) // Return the quiz as JSON response
    } catch (error) {
        console.error("Error in getQuiz:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// Controller to create a new question
export const createQuiz = async (req, res) => {
    const { questions } = req.body
    try {
        if (!questions) return res.status(400).json({ message: "Missing required fields" })

        const { error } = quizValidationSchema.validate(req.body) // Validate request body against the schema
        if (error) {
            console.error("Validation error:", error.message)
            return res.status(400).json({ message: error.message })
        }

        const newQuiz = new Quiz({
            questions
        })

        await newQuiz.save() // Save the quiz to the database
        console.log("Quiz created successfully")
        res.status(201).json({ message: "Quiz created successfully", quizId: newQuiz._id }) // Return success message and quiz ID
    } catch (error) {
        console.error("Error in createQuiz:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// Controller to create a new attempt - player
export const createAttempt = async (req, res) => {
    const { name, quizId } = req.body
    console.log("Request body:", req.body) // Log the request body for debugging
    if (!name || !quizId) return res.status(400).json({ message: "Name and quiz ID are required" }) // Check if name and quizId are provided

    try {
        const quiz = await Quiz.findById(quizId) // Fetch quiz from the database using ID
        if (!quiz) return res.status(404).json({ message: "Quiz not found" }) // Check if quiz exists

        const lowerCaseName = name.toLowerCase() // Convert name to lowercase for case-insensitive comparison

        const existingAttempt = quiz.attempts.find((attempt) => attempt.name === lowerCaseName) // Check if the name already exists in attempts
        if (existingAttempt) return res.status(400).json({ code: "name_exist", message: "Name already exists" }) // Check if name already exists

        const attempt = {
            name: lowerCaseName,
            score: 0,
            startedAt: new Date(),
            submittedAt: new Date()
        }

        quiz.attempts.push(attempt) // Add the attempt to the quiz
        await quiz.save() // Save the updated quiz to the database

        console.log("Attempt created successfully")
        res.status(201).json({ message: "Attempt created successfully", attemptId: attempt._id }) // Return success message and attempt ID
    } catch (error) {
        console.error("Error in createAttempt:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// Controller to update the attempt data - player
export const updateAttempt = async (req, res) => {
    const { name, score } = req.body
    if (!name || score == null) return res.status(400).json({ message: "Name and score are required" }) // Check if name and score are provided

    const { id } = req.params // Extract quiz ID from request parameters
    if (!id) return res.status(400).json({ message: "Quiz ID is required" }) // Check if ID is provided

    try {
        const quiz = await Quiz.findById(id) // Fetch quiz from the database using ID
        if (!quiz) return res.status(404).json({ message: "Quiz not found" }) // Check if quiz exists

        const lowerCaseName = name.toLowerCase() // Convert name to lowercase for case-insensitive comparison

        const existingAttempt = quiz.attempts.find((attempt) => attempt.name === lowerCaseName) // Check if the name already exists in attempts
        if (!existingAttempt) return res.status(404).json({ message: "Attempt not found" }) // Check if attempt exists


        const updatedAttempt = {
            ...existingAttempt.toObject(), // Convert Mongoose document to plain object
            score,
            submittedAt: new Date() // Update the score and submittedAt fields
        }

        quiz.attempts = quiz.attempts.map((attempt) => (attempt.name === lowerCaseName ? updatedAttempt : attempt)) // Update the attempt in the quiz
        await quiz.save() // Save the updated quiz to the database

        console.log("Attempt updated successfully")
        res.status(200).json({ message: "Attempt updated successfully", attemptId: updatedAttempt._id }) // Return success message and attempt ID
    } catch (error) {
        console.error("Error in updateAttempt:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// Controller to get all the scores of a quiz
export const getScores = async (req, res) => {
    const { id } = req.params // Extract quiz ID from request parameters
    if (!id) return res.status(400).json({ message: "Quiz ID is required" }) // Check if ID is provided

    try {
        const quiz = await Quiz.findById(id) // Fetch quiz from the database using ID
        if (!quiz) return res.status(404).json({ message: "Quiz not found" }) // Check if quiz exists

        console.log("Scores fetched successfully")
        res.status(200).json(quiz.attempts) // Return the attempts as JSON response
    } catch (error) {
        console.error("Error in getScores:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// Controller to check if quiz ID is valid - exists in the database
export const checkQuizId = async (req, res) => {
    const { id } = req.body // Extract quiz ID from request body
    if (!id) return res.status(400).json({ message: "Quiz ID is required" }) // Check if ID is provided
    try {
        const quiz = await Quiz.findById(id) // Fetch quiz from the database using ID
        if (!quiz) return res.status(404).json({ message: "Quiz not found" }) // Check if quiz exists

        console.log("Quiz ID is valid")
        res.status(200).json({ message: "Quiz ID is valid" }) // Return success message
    } catch (error) {
        console.error("Error in checkQuizId:", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}
import mongoose from 'mongoose';
import Joi from 'joi';

// Define joi schemas for validation
const joiQuestionSchema = Joi.object({
    question: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).length(4).required(),
    correctAnswer: Joi.string().required(),
})

export const quizValidationSchema = Joi.object({
    questions: Joi.array().items(joiQuestionSchema).min(1).required()
})

export const attemptValidationSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    score: Joi.number().min(0).required(),
    startedAt: Joi.date().iso().required(),
    submittedAt: Joi.date().iso().required()
})

// Define the schema for the Question model
const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        answers: [{
            type: String,
            required: true,
        }],
        correctAnswer: {
            type: String,
            required: true,
        }
    }
)

const attemptSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        startedAt: {
            type: Date,
            required: true
        },
        submittedAt: {
            type: Date,
            required: true
        }
    }
)

const quizSchema = new mongoose.Schema(
    {
        questions: [questionSchema],
        attempts: [attemptSchema],
        createdAt: {
            type: Date,
            default: Date.now,
            expires: "2h" // Automatically delete the document after 2 hours
        }
    }
)

const Quiz = mongoose.model("Quiz", quizSchema)
export default Quiz
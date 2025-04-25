import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/quizRoutes.js'
import setConnectionDB from './config/dbConfig.js';

dotenv.config()

const app = Express()
app.use(Express.json())
app.use(cors({
    origin: "*"
}))

// Define route handlers
app.use('/api/quiz', routes)

// Define a simple ping endpoint to check if the server is running
app.get("/api/ping", (req, res) => res.send("Running"))

// Define the port number
const PORT = process.env.PORT || 3000 // Get the port number from environment variables

try {
    await setConnectionDB() // Connect to the database
    app.listen(PORT, async () => {
        console.log(`listening on ${PORT}...`)
    })
} catch (error) {
    console.error("Error starting the server:", error)
}
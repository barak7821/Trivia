import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Game from './pages/Game'
import Gameover from './pages/Gameover'
import NotFound from './pages/NotFound'
import CreateQuiz from './pages/CreateQuiz.jsx'
import Home from './pages/Home.jsx'
import ShareQuiz from './pages/ShareQuiz.jsx'
import QuizRedirect from './pages/QuizRedirect.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import WakeUp from './pages/WakeUp.jsx'

function App() {

  return (
    <Routes>
      <Route index element={<WakeUp />} />
      <Route path='/home' element={<Home />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/share" element={<ShareQuiz />} />
      <Route path="/login/:quizId" element={<ProtectedRoute><Login /></ProtectedRoute>} />
      <Route path="/invite/:quizId" element={<ProtectedRoute><QuizRedirect /></ProtectedRoute>} />
      <Route path="/quiz/:quizId" element={<ProtectedRoute><Game /></ProtectedRoute>} />
      <Route path="/gameover/:quizId" element={<ProtectedRoute><Gameover /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes >
  )
}

export default App

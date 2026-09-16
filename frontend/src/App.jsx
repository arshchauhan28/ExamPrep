import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import { analyzeSyllabus, generateNotes, generateQuiz, submitQuiz, friendlyError } from './services/api'

const SESSION_KEY = 'examPrepAISession'

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || {}
  } catch { return {} }
}

function buildReadiness(topicScores, quizzes, totalTopics = 0) {
  const scores = Object.values(topicScores)
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  const coverage = totalTopics ? Math.min(100, (scores.length / totalTopics) * 100) : 0
  const recent = quizzes.length ? quizzes.slice(-3).reduce((a, q) => a + q.percentage, 0) / Math.min(3, quizzes.length) : 0
  const score = Math.round((avg * 0.45) + (coverage * 0.25) + (recent * 0.30))
  const entries = Object.entries(topicScores).sort((a, b) => a[1] - b[1])
  const weak = entries.filter(([, value]) => value < 70).slice(0, 3).map(([topic]) => topic)
  const strong = entries.filter(([, value]) => value >= 80).slice(-3).reverse().map(([topic]) => topic)
  const recommended = [...weak.map((t) => `Review ${t} notes`), ...weak.slice(0, 2).map((t) => `Take another quiz on ${t}`)]
  if (!recommended.length) recommended.push('Take another quiz to keep your readiness score fresh.')
  return { score, label: score >= 80 ? 'Excellent preparation' : score >= 60 ? 'Good Progress' : 'Keep building your foundation', strong, weak, recommended: recommended.slice(0, 3) }
}

export default function App() {
  const saved = useMemo(loadSession, [])
  const [page, setPage] = useState(saved.syllabus ? 'dashboard' : 'home')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(saved.fileName || '')
  const [syllabus, setSyllabus] = useState(saved.syllabus || null)
  const [notes, setNotes] = useState(saved.notes || {})
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [result, setResult] = useState(saved.result || null)
  const [quizHistory, setQuizHistory] = useState(saved.quizHistory || [])
  const [topicScores, setTopicScores] = useState(saved.topicScores || {})
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ fileName, syllabus, notes, result, quizHistory, topicScores }))
  }, [fileName, syllabus, notes, result, quizHistory, topicScores])

  const totalTopics = syllabus?.units?.reduce((sum, unit) => sum + unit.topics.length, 0) || 0
  const readiness = useMemo(() => buildReadiness(topicScores, quizHistory, totalTopics), [topicScores, quizHistory, totalTopics])

  const selectFile = (value) => {
    if (value?.error) { setError(value.error); setFile(null); return }
    setError(''); setFile(value)
  }

  const analyze = async () => {
    setLoading('syllabus'); setError('')
    try {
      const data = await analyzeSyllabus(file)
      setSyllabus(data); setFileName(file.name); setPage('dashboard')
    } catch (err) { setError(friendlyError(err, 'Something went wrong while analyzing your syllabus. Please try again.')) }
    finally { setLoading('') }
  }

  const analyzePastedText = async (text) => {
  setLoading('syllabus')
  setError('')

  try {
    const data = await analyzeSyllabus(null, text)

    setSyllabus(data)
    setFileName('Pasted syllabus')
    setPage('dashboard')
  } catch (err) {
    setError(
      friendlyError(
        err,
        'Something went wrong while analyzing your syllabus.'
      )
    )
  } finally {
    setLoading('')
  }
}

  const openNotes = (topic) => { setSelectedTopic(topic); setError(''); setPage('notes') }
  const createNotes = async () => {
    setLoading('notes'); setError('')
    try {
      const context = JSON.stringify(syllabus)
      const data = await generateNotes(selectedTopic.name, context)
      setNotes((prev) => ({ ...prev, [selectedTopic.name]: data }))
    } catch (err) { setError(friendlyError(err, 'Something went wrong while generating notes.')) }
    finally { setLoading('') }
  }

  const openQuiz = async (topic) => {
    setSelectedTopic(topic); setLoading('quiz'); setError('')
    try {
      const data = await generateQuiz(topic.name, 10, 'medium', JSON.stringify(syllabus))
      setCurrentQuiz(data); setAnswers({}); setCurrentQuestion(0); setResult(null); setPage('quiz')
    } catch (err) { setError(friendlyError(err, 'Something went wrong while creating your quiz.')) }
    finally { setLoading('') }
  }

  const generateAllNotes = async () => {
    setLoading('all-notes'); setError('')
    try {
      const topics = syllabus.units.flatMap((u) => u.topics)
      const next = { ...notes }
      for (const topic of topics) next[topic.name] = await generateNotes(topic.name, JSON.stringify(syllabus))
      setNotes(next)
    } catch (err) { setError(friendlyError(err, 'Something went wrong while generating notes.')) }
    finally { setLoading('') }
  }

  const createGeneralQuiz = () => openQuiz({ name: syllabus.subject })

  const submit = async () => {
    setLoading('submit'); setError('')
    try {
      const answerPayload = currentQuiz.questions.map((q) => ({ question_id: q.id, selected_answer: answers[q.id] }))
      const data = await submitQuiz(currentQuiz.quiz_id, answerPayload)
      setResult(data); setQuizHistory((prev) => [...prev, data])
      setTopicScores((prev) => ({ ...prev, [data.topic]: data.percentage }))
      setPage('results')
    } catch (err) { setError(friendlyError(err, 'Something went wrong while submitting your quiz.')) }
    finally { setLoading('') }
  }

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY); setFile(null); setFileName(''); setSyllabus(null); setNotes({}); setSelectedTopic(null); setCurrentQuiz(null); setAnswers({}); setCurrentQuestion(0); setResult(null); setQuizHistory([]); setTopicScores({}); setError(''); setPage('home')
  }

  const dashboard = () => setPage(syllabus ? 'dashboard' : 'home')
  const resultReadiness = readiness

  return (
    <div className="app">
      <Navbar onHome={() => setPage('home')} onDashboard={dashboard} onNew={clearSession} />
      {error && page !== 'quiz' && <div className="shell"><div className="error-banner top-error">{error}<button onClick={() => setError('')}>×</button></div></div>}
      {page === 'home' && (
      <Home
        file={file}
        onFileChange={selectFile}
        onAnalyze={analyze}
        onPasteAnalyze={analyzePastedText}
        loading={loading === 'syllabus'}
      />
    )}
      {page === 'dashboard' && syllabus && <Dashboard syllabus={syllabus} fileName={fileName} readiness={resultReadiness} onNotes={openNotes} onQuiz={openQuiz} onGenerateAllNotes={generateAllNotes} onGenerateQuiz={createGeneralQuiz} onStartNew={clearSession} bulkLoading={loading === 'all-notes'} quizLoading={loading === 'quiz'} />}
      {page === 'notes' && <Notes selectedTopic={selectedTopic} notes={notes[selectedTopic?.name]} loading={loading === 'notes'} onGenerate={createNotes} onBack={dashboard} />}
      {page === 'quiz' && currentQuiz && <Quiz quiz={currentQuiz} answers={answers} current={currentQuestion} error={error} loading={loading === 'submit'} onSelect={(value) => setAnswers((prev) => ({ ...prev, [currentQuiz.questions[currentQuestion].id]: value }))} onPrevious={() => setCurrentQuestion((c) => Math.max(0, c - 1))} onNext={() => setCurrentQuestion((c) => Math.min(currentQuiz.questions.length - 1, c + 1))} onSubmit={submit} />}
      {page === 'results' && result && <Results result={result} onTryAgain={() => openQuiz({ name: result.topic })} onDashboard={dashboard} />}
    </div>
  )
}

import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './assets/pages/Home'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
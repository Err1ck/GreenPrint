import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './assets/pages/Home'
import CommunityPage from './assets/pages/Communities'
import SuggestedUsersPage from './assets/pages/SuggestedUsers'
import Login from './assets/pages/Login'
import Register from './assets/pages/Register'
import ViewPost from './assets/pages/ViewPost'
import ViewProfile from './assets/pages/ViewProfile'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/users" element={<SuggestedUsersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<ViewPost />} />
         <Route path="/profile/:userId" element={<ViewProfile />} /> 
      </Routes>
    </div>
  )
}

export default App
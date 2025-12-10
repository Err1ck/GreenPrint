import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./assets/pages/Home";
import CommunityPage from "./assets/pages/Communities";
import SuggestedUsersPage from "./assets/pages/SuggestedUsers";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import ViewPost from "./assets/pages/ViewPost";
import ViewProfile from "./assets/pages/ViewProfile";
import ViewCommunity from "./assets/pages/ViewCommunity";
import Search from "./assets/pages/Search";
import SavedPosts from "./assets/pages/SavedPosts";
import ForgetPassword from "./assets/pages/ForgetPassword";
import Messages from "./assets/pages/Messages";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/users" element={<SuggestedUsersPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/profile/:userId" element={<ViewProfile />} />
        <Route path="/community/:communityId" element={<ViewCommunity />} />
        <Route path="/saved" element={<SavedPosts />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </>
  );
}

export default App;

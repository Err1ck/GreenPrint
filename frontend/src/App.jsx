import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
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
import Notifications from "./assets/pages/Notifications";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Cargar tema al iniciar la aplicación
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      // Asegurar que el tema por defecto sea light
      if (!storedTheme) {
        localStorage.setItem("theme", "light");
      }
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/users" element={<SuggestedUsersPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/profile/:userId" element={<ViewProfile />} />
        <Route path="/community/:communityId" element={<ViewCommunity />} />
        <Route path="/saved" element={<SavedPosts />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;

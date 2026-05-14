import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Materials from "../pages/Materials";
import Loans from "../pages/Loans";
import Navbar from "../components/Navbar";
import Register from "../auth/Register";
import Login from "../auth/Login";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
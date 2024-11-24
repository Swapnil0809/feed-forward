import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import AdminDashboard from "./components/AdminDashboard"
import CityAdminDashboard from "./components/CityAdminDashboard";
import DonorDashboard from "./components/DonorDashboard";
import RecipientDashboard from "./components/RecipientDashboard";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/cityadmindashboard" element={<CityAdminDashboard/>} />
        <Route path="/donordashboard" element={<DonorDashboard/>} />
        <Route path="/recipientdashboard" element={<RecipientDashboard/>} />


      </Routes>
    </>
  );
}

export default App;

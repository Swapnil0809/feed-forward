import { Route, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast"

import Home from "./Pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp"
import Dashboard from "./pages/Dashboard";
import DonationComplete from "./pages/DonationComplete";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/donation-complete/:donationId" element={<DonationComplete/>} />
      </Routes>
    </>
  );
}

export default App;

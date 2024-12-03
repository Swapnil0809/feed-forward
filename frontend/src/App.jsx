import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp"
import Dashboard from "./pages/Dashboard";
import {Toaster} from "react-hot-toast"


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  );
}

export default App;

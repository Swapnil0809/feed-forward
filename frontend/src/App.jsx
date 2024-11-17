import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;

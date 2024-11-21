import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./pages/Signup"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup/>} />
      </Routes>
    </>
  );
}

export default App;

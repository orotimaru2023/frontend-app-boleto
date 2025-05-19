
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Boletos from "./pages/Boletos";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate to="/boletos" />} />
        <Route path="/boletos" element={token ? <Boletos /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

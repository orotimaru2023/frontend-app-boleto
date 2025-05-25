import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Boletos from "./pages/Boletos";
import Admin from "./pages/Admin";
import api from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Atualiza o token em tempo real quando ele muda no localStorage
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Sempre que o token mudar, verifica permissões
  useEffect(() => {
    const verificarPermissoes = async () => {
      if (token) {
        try {
          const response = await api.get('/usuarios/me');
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Erro ao verificar permissões:', error);
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    };
    verificarPermissoes();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {token && (
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center space-x-8">
                  <h1 className="text-xl font-semibold text-gray-800">Sistema de Boletos</h1>
                  <div className="hidden md:flex space-x-4">
                    <a href="/boletos" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Boletos
                    </a>
                    {userRole === 'admin' && (
                      <a href="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                        Administração
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/boletos" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/boletos" />} />
          <Route path="/boletos" element={token ? <Boletos /> : <Navigate to="/" />} />
          <Route 
            path="/admin" 
            element={
              token ? (
                userRole === 'admin' ? (
                  <Admin />
                ) : (
                  <Navigate to="/boletos" />
                )
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

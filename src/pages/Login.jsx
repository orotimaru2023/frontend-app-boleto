
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("https://app-boleto-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: senha })
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "/boletos";
      } else {
        alert("Login inválido!");
      }
    } catch {
      alert("Erro no login.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Login</h1>
      <input className="border mb-2 p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border mb-2 p-2" placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleLogin}>Entrar</button>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Boletos() {
  const [boletos, setBoletos] = useState([]);

  // Pegue a URL da API das variáveis de ambiente do Vite/Vercel
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBoletos = async () => {
      const res = await fetch(`${apiUrl}/boletos`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const data = await res.json();
      setBoletos(data);
    };
    fetchBoletos();
  }, [apiUrl]);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Boletos</h1>
      <ul>
        {boletos.map(b => (
          <li key={b.id} className="border p-2 mb-2">
            <strong>{b.status}</strong> - {b.valor} - {b.vencimento}
          </li>
        ))}
      </ul>
    </div>
  );
}

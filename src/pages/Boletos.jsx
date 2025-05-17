
import { useEffect, useState } from "react";

export default function Boletos() {
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    const fetchBoletos = async () => {
      const res = await fetch("https://app-boleto-production.up.railway.app/boletos", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      const data = await res.json();
      setBoletos(data);
    };
    fetchBoletos();
  }, []);

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

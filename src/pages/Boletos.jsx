import { useEffect, useState } from "react";
import api from '../services/api';

export default function Boletos() {
  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [novoBoletoDados, setNovoBoletoDados] = useState({
    valor: "",
    vencimento: "",
    descricao: ""
  });

  const fetchBoletos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/boletos');
      setBoletos(response.data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar boletos: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/boletos', novoBoletoDados);
      setNovoBoletoDados({ valor: "", vencimento: "", descricao: "" });
      await fetchBoletos();
    } catch (err) {
      setError("Erro ao criar boleto: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este boleto?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/boletos/${id}`);
      await fetchBoletos();
    } catch (err) {
      setError("Erro ao excluir boleto: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Gerenciar Boletos</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Novo Boleto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={novoBoletoDados.valor}
                onChange={(e) => setNovoBoletoDados({...novoBoletoDados, valor: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vencimento</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={novoBoletoDados.vencimento}
                onChange={(e) => setNovoBoletoDados({...novoBoletoDados, vencimento: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={novoBoletoDados.descricao}
                onChange={(e) => setNovoBoletoDados({...novoBoletoDados, descricao: e.target.value})}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processando...' : 'Criar Boleto'}
          </button>
        </form>
      </div>

      {loading && !error ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Carregando boletos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {boletos.map((boleto) => (
                <tr key={boleto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{boleto.descricao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatarValor(boleto.valor)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatarData(boleto.vencimento)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      boleto.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                      boleto.status === 'PAGO' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {boleto.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(boleto.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {boletos.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum boleto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

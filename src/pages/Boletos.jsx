import { useState, useEffect } from "react";
import api from '../services/api';

export default function Admin() {
  const [documentos, setDocumentos] = useState([]);
  const [novoDocumento, setNovoDocumento] = useState({
    documento: "",
    nome: "",
    tipo: "CPF"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Formata CPF/CNPJ para exibir e salvar só números no backend
  const formatarDocumento = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (novoDocumento.tipo === "CPF") {
      return apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  // Carrega documentos autorizados
  const carregarDocumentos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get('/documentos-autorizados');
      setDocumentos(response.data);
    } catch (err) {
      setError("Erro ao carregar documentos: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDocumentos();
    // eslint-disable-next-line
  }, []);

  // Adiciona documento autorizado
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post('/documentos-autorizados', {
        documento: novoDocumento.documento.replace(/\D/g, ''), // só números
        nome: novoDocumento.nome,
        tipo: novoDocumento.tipo
      });
      setNovoDocumento({ documento: "", nome: "", tipo: "CPF" });
      await carregarDocumentos();
    } catch (err) {
      if (err.response?.data?.detail?.includes('duplicate key') || err.response?.data?.detail?.includes('already exists')) {
        setError("Já existe um documento cadastrado com esse número.");
      } else {
        setError("Erro ao adicionar documento: " + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove documento autorizado
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este documento?")) return;
    setLoading(true);
    setError("");
    try {
      await api.delete(`/documentos-autorizados/${id}`);
      await carregarDocumentos();
    } catch (err) {
      setError("Erro ao remover documento: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Gerenciar Documentos Autorizados</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Adicionar Novo Documento</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={novoDocumento.tipo}
                onChange={e => setNovoDocumento({
                  ...novoDocumento,
                  tipo: e.target.value,
                  documento: ""
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Documento</label>
              <input
                type="text"
                required
                maxLength={novoDocumento.tipo === "CPF" ? 14 : 18}
                placeholder={novoDocumento.tipo === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={novoDocumento.documento}
                onChange={e => setNovoDocumento({
                  ...novoDocumento,
                  documento: formatarDocumento(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={novoDocumento.nome}
                onChange={e => setNovoDocumento({ ...novoDocumento, nome: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adicionando...' : 'Adicionar Documento'}
          </button>
        </form>
      </div>

      {loading && !error ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Carregando documentos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentos.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.documento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doc.registrado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.registrado ? 'Registrado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {documentos.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum documento autorizado encontrado
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

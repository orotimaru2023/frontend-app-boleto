import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    documento: "" // CPF ou CNPJ
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentoVerificado, setDocumentoVerificado] = useState(false);

  // Função para formatar CPF/CNPJ enquanto digita
  const formatarDocumento = (valor) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length <= 11) {
      // Formata como CPF: 000.000.000-00
      return apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formata como CNPJ: 00.000.000/0000-00
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  // Função para verificar se o documento está pré-cadastrado
  const verificarDocumento = async () => {
    if (!formData.documento) return;

    try {
      setLoading(true);
      const response = await api.get(`/verificar-documento/${formData.documento.replace(/\D/g, '')}`);
      setDocumentoVerificado(response.data.autorizado);
      if (!response.data.autorizado) {
        setError("CPF/CNPJ não está pré-cadastrado no sistema. Entre em contato com o administrador.");
      } else {
        setError("");
      }
    } catch (err) {
      setError("Erro ao verificar documento. " + (err.response?.data?.detail || err.message));
      setDocumentoVerificado(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!documentoVerificado) {
      setError("Por favor, verifique seu CPF/CNPJ primeiro.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await api.post('/usuarios', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        documento: formData.documento.replace(/\D/g, '') // Envia apenas os números
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Criar Conta</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                maxLength={18}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.documento}
                onChange={(e) => {
                  const formatado = formatarDocumento(e.target.value);
                  setFormData({...formData, documento: formatado});
                  setDocumentoVerificado(false);
                }}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
              <button
                type="button"
                onClick={verificarDocumento}
                disabled={loading || !formData.documento}
                className={`mt-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${documentoVerificado 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  ${loading || !formData.documento ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {documentoVerificado ? '✓ Verificado' : 'Verificar'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !documentoVerificado}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || !documentoVerificado) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Já tem uma conta? Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
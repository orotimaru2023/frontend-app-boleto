import api from './api';

export const login = async (email, password ) => {
  try {
    // O backend FastAPI espera 'username' e 'password'
    const response = await api.post('/login', {
      username: email,  // IMPORTANTE: deve ser 'username', não 'email'
      password: password
    });
    
    // Resto do código...
  } catch (error) {
    // Tratamento de erro...
  }
};

export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                return {
                    success: true,
                    data: response.data
                };
            } else {
                console.error('Resposta sem token:', response.data);
                return {
                    success: false,
                    error: 'Resposta inválida do servidor'
                };
            }
        } catch (error) {
            console.error('Erro completo:', error);
            
            // Erro de rede
            if (!error.response) {
                return {
                    success: false,
                    error: 'Erro de conexão com o servidor'
                };
            }

            // Erro de credenciais
            if (error.response.status === 401) {
                return {
                    success: false,
                    error: 'Email ou senha incorretos'
                };
            }

            // Outros erros do servidor
            return {
                success: false,
                error: error.response?.data?.message || 'Erro ao fazer login'
            };
        }
    },

    logout() {
        try {
            localStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return {
                success: false,
                error: 'Erro ao fazer logout'
            };
        }
    },

    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUserData() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Decodifica o payload do token JWT (parte 2)
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }
}; 

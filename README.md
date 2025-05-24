# Sistema de Boletos - Frontend

Frontend do sistema de gerenciamento de boletos, desenvolvido com React, Vite e TailwindCSS.

## 🚀 Deploy

O projeto está deployado em:
- [Frontend (Vercel)](https://frontend-app-boleto.vercel.app)
- [Backend (Railway)](https://app-boleto-production.up.railway.app)

## 🛠️ Tecnologias

- React
- Vite
- TailwindCSS
- Axios
- React Router DOM

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/orotimaru2023/frontend-app-boleto.git
cd frontend-app-boleto
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://app-boleto-production.up.railway.app
VITE_APP_NAME=Sistema de Boletos
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## 🚀 Build e Deploy

Para gerar uma build de produção:
```bash
npm run build
```

O projeto está configurado para deploy automático no Vercel a cada push na branch main.

## 📦 Estrutura do Projeto

```
frontend-app-boleto/
├── src/
│   ├── components/     # Componentes React
│   ├── services/      # Serviços e configuração da API
│   ├── assets/        # Recursos estáticos
│   └── App.jsx        # Componente principal
├── public/            # Arquivos públicos
└── dist/             # Build de produção
```

## 🔗 Integração com Backend

O frontend se comunica com a API REST no Railway através do Axios. As principais funcionalidades incluem:

- Autenticação de usuários
- Gerenciamento de boletos
- Visualização de relatórios

## 👥 Autores

- [@orotimaru2023](https://github.com/orotimaru2023)

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes

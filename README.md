# 🛒 Products App

Aplicação web para gerenciamento de produtos, incluindo criação, edição, exclusão, paginação e visualização de métricas em gráfico.

---

## 🚀 Tecnologias Utilizadas

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FC6C1D?style=for-the-badge&logoColor=white)
![Heroui](https://img.shields.io/badge/Heroui-4F46E5?style=for-the-badge&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logoColor=white)

---

## ⚙️ Funcionalidades

- Cadastro de produtos com título, descrição e imagem (thumbnail)
- Edição de produtos (título, descrição e thumbnail separados)
- Exclusão de produtos
- Paginação de produtos (10 por página)
- Dashboard com gráfico de métricas (exemplo de vendas)
- Dark Mode com alternância pelo botão flutuante
- Redirecionamento automático para login se usuário não autenticado
- Validação de formulários com Zod e React Hook Form
- Pré-visualização de imagens antes do upload

---

## 📝 Pré-requisitos

- Node.js >= 18
- npm ou yarn
- API de produtos disponível e configurada

---

## 💻 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Daniel-san8/products.git
cd products
```

npm install

# ou

yarn

NEXT_PUBLIC_API=example

npm run dev

# ou

yarn dev

/app
/components
/services
/store
/public

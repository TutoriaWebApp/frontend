# TutoriaWeb - Frontend

Este repositório contém o Frontend da aplicação web TutoriaWeb, contendo todas as funções de requisiçãoa ao backend, paǵinas e demais componentes de UI.

## Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

*   **Next.js** - Framework principal;
*   **TailwindCSS** - Estilização;
*   **Fetch API** - Consumo de APIs;
*   **Context API** - Gerenciamento de estado global.

## Pré-requisitos

Para executar o projeto, é necessário a instalação das seguintes tecnologias:

*   [Node.js](https://nodejs.org/en/) (Versão 24.9.0);
*   [pnpm](https://pnpm.io/).

## Como executar o projeto

Siga os passos abaixo para rodar a aplicação no seu ambiente local:

```bash
# 1. Clone este repositório ou baixe esse repositório
$ git clone git@github.com:TutoriaWebApp/frontend.git

# 2. Acesse a pasta do projeto no terminal
$ cd frontend

# 3. Instale as dependências com PNPM
$ pnpm install

# 4. Preencha o arquivo next.config.js com as variáveis de ambiente (ou o arquivo docker-compose.yml) 

# 5. Execute a aplicação em modo de desenvolvimento ou com o docker-compose.yml
$ pnpm run dev
```

É preciso ter o backend em execução simultaneamente para se poder utilizar a aplicação.

A aplicação será aberta na porta padrão (`http://localhost:3000`).

## Estrutura de Pastas

O projeto foi criado com o Turborepo. A estrutura de arquivos do projeto segue a seguinte organização:

```text
/
├── apps/  
    ├── docs                # Arquivos da página de documentação (não são utilizados)
    ├── web/                # Arquivos da página da aplicação
        ├── app/            # Pastas e arquivos das páginas da aplicação
        ├── public          # Arquivos de ícones e sons utilizados na aplicação
        ├── middleware.ts   # Arquivo com funções middleware utilizadas na aplicação
        ├── next.config.js  # Arquivo com variáveis de ambiente e outras configurações utilizadas na aplicação
├── packages/
    ├── config              # Arquivos de configurações da aplicação
    ├── lib/                # Arquivos com funções auxiliares utilizadas na aplicação
    ├── services/           # Arquivos de interfaces e funções de backend utilizadas na aplicação
        ├── actions/        # Arquivos de Server Actions
        ├── types/          # Arquivos de interfaces de dados
    ├── ui/                 # Arquivos de componentes visuais reutilizados no aplicação
        ├── contexts/       # Arquivos de contextos utilizados na aplicação
├── .gitignore              # Arquivo com a lista de arquivos a se ignorar no repositório
├── docker-compose.yml      # Arquivo Docker para execução em contêiner
├── Dockerfile              # Arquivo de Docker do Frontend
├── package.json            # Arquivo com as dependências e scripts do projeto
├── pnpm-lock.yaml          # Arquivo de configuração do PNPM
├── pnpm-workspace.yaml     # Arquivo de configuração do PNPM
├── README.md               # Arquivo de descrição do repositório
├── turbo.json              # Arquivo de configuração do Turborepo
```

## Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos:

*   `pnpm run dev`: Executa a aplicação em modo de desenvolvimento;
*   `pnpm run build`: Gera a versão de produção da aplicação.
*   `pnpm run lint`: Executa o linter para encontrar e corrigir problemas no código.

## Como contribuir

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`
5. Abra um **Pull Request**.
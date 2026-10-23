# TutoriaWebApp Frontend

## Visão Geral do Projeto
- Este é um frontend baseado em Next.js para a Aplicação Web Tutoria Web.
- Ele utiliza Docker e Docker Compose para containerização e gerenciamento de ambiente.
- A lógica principal da aplicação reside em `webapi-django/project/`.
- Utilize .editorconfig para estilo de código
- Não utilize .gitignore para ignorar arquivos
- Priorize a execução via Docker e os arquivos .env do projeto

## Padrões de Código
- **Estilo Python:** Adira estritamente ao **PEP 8**.
- **Django/DRF:** Siga as convenções do Django Rest Framework para ViewSets, Serializers e URLs.
- **Nomenclatura de Arquivos:** Mantenha a convenção específica do projeto para nomenclatura de arquivos (ex: `NomeDoModeloModel.py`, `NomeDoSerializerSerializer.py`, `NomeDoViewSetViewSet.py`).
- **Tipagem Explícita:** Use type hints para argumentos de funções e valores de retorno onde for possível.

## Funcionalidades Avançadas
- **Test-Driven Development (TDD):** Todo Model, Serializer e ViewSet deve ser testado primeiro e depois implementado.
- **Sistema de Recomendação:** Um motor híbrido implementado em `SistemaRecomendacaoViewSet.py` utilizando **Pandas** e **Scikit-learn**.
    - **Baseado em Conteúdo:** Similaridade de cossenos nas especialidades dos tutores e localização geográfica.
    - **Filtragem Colaborativa:** Matriz Usuário-Item para previsão de avaliação com base na similaridade de usuários.
    - **Dependências:** Requer `pandas` e `scikit-learn` (adicionados ao `requirements.txt`).

## Fluxo de Trabalho e Comandos
- **Ambiente Virtual:** Use o diretório `venv/` para desenvolvimento local em Python.
- **Docker:** Use `docker-compose --env-file ./env/.env up` para rodar a aplicação e suas dependências (PostgreSQL/MySQL, etc.).
- **Migrations:** Sempre gere e verifique as migrações (`makemigrations`) após modificar modelos em `webapi-django/project/models/`.
- **Testes:** 
    - Rode os testes usando `python webapi-django/manage.py test`.
    - **Nota:** O projeto está configurado para utilizar automaticamente um banco de dados **SQLite** em memória durante os testes (definido em `settings.py`) para evitar problemas com dependências externas, mantendo o **MySQL** como o banco principal.
    - Novas funcionalidades ou correções de bugs DEVEM incluir testes correspondentes em `webapi-django/test/`.
    - Mantenha a estrutura existente dos arquivos `*Test.py`.

## Segurança e Configuração
- **Variáveis de Ambiente:** Todos os dados sensíveis (chaves SMTP, credenciais de Banco de Dados) devem permanecer em `env/.env`.
- **Credenciais:** Nunca logue, imprima ou faça commit de segredos (secrets). 
- **Documentação da API:** Garanta que quaisquer mudanças nos endpoints sejam refletidas na documentação gerada automaticamente acessível em `/v1/docs` (provida pelo `drf-spectacular`).

## Banco de Dados
- Banco de Dados Principal: MySQL (produção/desenvolvimento).
- Banco de Dados de Testes: SQLite (em memória).
- Consulte `webapi-django/data/` para scripts SQL relacionados ao modelo físico e população do banco de dados se necessário para referência, mas prefira o ORM do Django para todas as interações a nível de aplicação.


# TutoriaWeb - Frontend

Este repositório contém o Frontend da aplicação web TutoriaWeb, contendo todas as funções de requisiçãoa ao backend, paǵinas e demais componentes de UI.

## Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

*   **Next.js** - Framework principal;
*   **TailwindCSS** - Estilização;
*   **Fetch API** - Consumo de APIs;
*   **Context API** - Gerenciamento de estado global.

## Pré-requisitos

Para executar o projjeto, é necessário a instalação das seguintes tecnologias:

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
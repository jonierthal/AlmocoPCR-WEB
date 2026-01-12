# AlmocoPCR-WEB

Aplicação web em React/Vite para gerenciar reservas de almoço, departamentos e funcionários.
O front-end consome a API em `https://appalmoco-pcr.azurewebsites.net/` para listar, cadastrar,
atualizar e excluir dados. A navegação principal fica no cabeçalho e organiza o fluxo em
módulos de cadastro, manutenção e relatórios.

# Pré-requisitos e execução
- Node.js 20+ (use `nvm use` se já estiver configurado).
- Dependências: `npm install`.
- Desenvolvimento: `npm run dev` (servidor Vite).

## Scripts principais
- Build de produção: `npm run build` (gera `dist/`).
- Pré-visualização do build: `npm run preview`.

## Configuração local rápida
1. Instale as dependências com `npm install`.
2. Inicie o servidor de desenvolvimento com `npm run dev`.
3. Acesse a aplicação em `http://localhost:5173`.

## Estrutura do projeto
- `src/App.tsx` – Inicializa o tema global, React Router e registra o elemento raiz para modais.
- `src/Router.tsx` – Define as rotas da aplicação dentro do layout padrão.
- `src/layouts/DefaultLayout` – Renderiza o cabeçalho e um `<Outlet />` para as páginas.
- `src/components` – Componentes compartilhados como cabeçalho e botões.
- `src/lib/axios.ts` – Cliente Axios com `baseURL` da API.
- `src/pages` – Páginas agrupadas por funcionalidade (cadastros, manutenção e relatórios).

## Padrão de imports por feature
- Serviços de cada feature devem ser exportados por `src/features/<feature>/index.ts`.
- Ao consumir serviços, importe diretamente pela feature (ex.: `@features/departamentos`), evitando o índice global de `src/services`.

## Fluxo das páginas
### Cadastro de funcionários (`/`)
- Carrega setores com `GET /setores` ao montar o componente.
- Formulário validado com Yup e React Hook Form para código, nome e departamento.
- Envia `POST /cadastro_funcionario` para criar um registro e exibe mensagens de sucesso/erro.

### Manutenção de funcionários (`/ManutFuncionarios`)
- Lista funcionários via `GET /cad_fun_id` e permite filtro por nome ou código.
- Exclusão com confirmação modal usando `DELETE /cadastro/{id}`.
- Edição abre modal que valida códigos duplicados com `GET /verificar-id/{id}` e atualiza dados via
  `PUT /edita_cadastro/{id}` (incluindo setor associado).

### Cadastro de departamento (`/CadastroDepartamento`)
- Formulário simples com validação do nome via Yup.
- Envia `POST /cadastro_setor` e apresenta estados de carregamento e mensagens.

### Manutenção de departamentos (`/ManutDepartamentos`)
- Busca setores com `GET /setores` e permite filtragem por nome ou id.
- Exclusão confirmada com `DELETE /setores/{id}`.
- Edição direta no modal usando `PUT /edita_setor/{id}`.

### Relatórios (`/Relatorios`)
- Carrega reservas de almoço (`GET /almocos`), almoços extras (`GET /alm_ext`) e reservas de xis (`GET /reserva_xis`).
- Gera planilhas Excel:
  - "Reservar Almoço": exporta reservas e extras com totais agregados.
  - "Reserva Xis": exporta reservas de xis.
  - "Gerar Excel por período": consulta `GET /retorno_rel` com intervalo de datas selecionado e
    monta planilha combinando almoços, extras e xis.
- Tabelas exibem itens atuais com opção de remoção (`DELETE` específico para cada lista) e
  indicadores de carregamento enquanto as requisições são processadas.

## Configuração de API
O endpoint raiz da API pode ser ajustado em `src/lib/axios.ts`. Se precisar apontar para outro
ambiente, altere o `baseURL` e reinicie o servidor de desenvolvimento.

## Padrões do projeto
- Alias de imports são resolvidos pelo `tsconfig.json` (ex.: `@features`, `@components`).
- Rotas são centralizadas em `src/Router.tsx` e usam `DefaultLayout` como layout base.
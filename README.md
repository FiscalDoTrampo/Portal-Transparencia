# Portal de transparência das doações

Site estático para GitHub Pages, sem instalação, dependências ou banco de dados. Abra `index.html` para visualizar no computador. A aparência é adaptada para celular e impressão.

## Antes de publicar

Os sete lançamentos fornecidos são FICTÍCIOS e estão sinalizados no site. Substitua-os pelas apurações reais em `dados.js`. Depois altere `demonstracao` para `false`. Você também pode começar com `movimentos: []`.

## Publicar no GitHub Pages

1. O repositório público já existe: `Portal-Transparencia`. Um repositório público permite usar Pages no plano gratuito.
2. Extraia o ZIP. Envie o CONTEÚDO da pasta `transparencia-doacoes` ao repositório (não envie o ZIP). `index.html` deve ficar na raiz, ao lado de `style.css`, `dados.js` e `app.js`.
3. Salve os arquivos com um commit no branch `main`.
4. Acesse **Settings → Pages → Build and deployment → Source → Deploy from a branch**.
5. Selecione **main** e **/(root)**, depois **Save**.
6. Aguarde a publicação. O endereço é `https://fiscaldotrampo.github.io/Portal-Transparencia/`.

Documentação oficial consultada em 23/10/2026:
https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Atualizar as apurações

Edite `dados.js` pelo GitHub (ícone de lápis) ou pelo computador e faça um novo commit. A publicação será atualizada depois do processamento do Pages. Visitantes veem os dados publicados; não há painel administrativo nem alterações salvas pelo navegador.

- `nome`, `descricao`, `sobre`: identificação e apresentação do projeto.
- `email`: contato público do responsável; deixe vazio para não exibir link.
- `atualizadoEm`: data em que você revisou os dados, no formato `AAAA-MM-DD`.
- `saldoInicialCentavos`: saldo anterior ao primeiro lançamento, em centavos inteiros; use zero se não houver. Não repita esse saldo como uma doação.
- `movimentos`: todos os registros financeiros. Cada `id` deve ser único.
- `data`: `AAAA-MM-DD`.
- `tipo`: `entrada` (doação) ou `saida` (despesa).
- `descricao` e `categoria`: informações públicas do lançamento.
- `valorCentavos`: número inteiro positivo, sem separadores. R$ 150,75 = `15075`.
- `comprovante`: `""` para indisponível, `"comprovantes/recibo-001.pdf"` para arquivo local, ou URL `https://`.

Copie um dos objetos existentes para adicionar lançamentos. Separe objetos com vírgulas e mantenha a sintaxe JavaScript. O site sinaliza configuração inválida em vez de mostrar totais parciais.

## Publicar uma atualização pelo computador

Dê duplo clique em `Publicar.cmd`. Ele junta as alterações da pasta, cria o commit com data e hora e envia para o branch `main`. A janela mostra o que foi enviado e pode ser fechada depois da leitura.

Se preferir rodar sem o atalho, use `powershell -ExecutionPolicy Bypass -File publicar.ps1` dentro da pasta. Arquivos acima de 50 MB são recusados com aviso antes de qualquer envio.

## Saldo e filtros

As doações e despesas dos cartões respeitam o mês selecionado. O saldo é acumulado: saldo inicial + todas as entradas − todas as saídas até o fim do mês escolhido. Em “Todo o período”, ele inclui todos os lançamentos. Mantenha o histórico completo para preservar esse cálculo.

A busca e os botões Doações/Despesas filtram apenas a lista e o CSV; não alteram os cartões. O CSV usa ponto e vírgula e abre no Excel. A impressão respeita os filtros atuais e permite salvar em PDF pelo navegador.

As categorias mostram apenas despesas. O modelo registra dinheiro; doações de itens ou serviços precisam de uma seção própria para quantidades, sem misturá-las aos valores financeiros.

## Comprovantes

Coloque documentos em `comprovantes/` e informe o caminho em `dados.js`. Use nomes sem espaços ou acentos. A pasta contém apenas este guia; nenhum comprovante de exemplo foi inventado. Revise os documentos que serão públicos, removendo dados pessoais desnecessários, como CPF, endereço e dados bancários.

## Arquivos

- `index.html`: estrutura.
- `style.css`: visual e impressão.
- `dados.js`: conteúdo e lançamentos editáveis.
- `app.js`: cálculos, filtros e exportação.
- `.nojekyll`: publicação estática sem processamento Jekyll.

Não há coleta de doações, Pix, login ou pagamento nesta versão. O objetivo é apresentar a prestação de contas.

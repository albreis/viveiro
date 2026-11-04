# Lighthouse da versão0.46.0

Medição real pelo Lighthouse13.6.0 local, Chrome156.0.8078.80 e Node24.22.1.
URL pública versionada: https://viveiro.ersolucoesweb.com.br/releases/v0.46.0/?lang=en
Uma navegação inicial por perfil, em Chrome temporário, sem acessar o perfil ou
os saves do usuário. Nenhuma chamada à API PageSpeed, que continua sob sua cota.
O uso local é [suportado oficialmente](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).

| Perfil padrão | Acessibilidade | Desempenho |
| --- | --- | --- |
| Desktop |97/100|44/100|
| Móvel |100/100|33/100|

O aceite de Lighthouse de acessibilidade acima de90 foi atendido nos dois
perfis. Não se encerraram os critérios independentes de leitor de tela, zoom,
planilha ou conformidade WCAG. Foram medidas as telas iniciais; não todos os
estados do laboratório. Não foram omitidos testes individuais para obter notas.

No desktop restam alertas de contraste no texto auxiliar do botão de chuva e
inclusão do texto visual no nome acessível da marca. O perfil móvel não apontou
esses alertas nesta captura. São estados/amostras diferentes, não prova de
conformidade integral. As notas de desempenho são baixas: indicam trabalho de
carregamento, bloqueio da thread e mudança de layout. Não são a medição dos FPS
da simulação em movimento nem certificação de equipamento escolar.

## Reproduzir e conferir

Ferramenta instalada isoladamente em.runtime/lighthouse-tool, sem alterar as
dependências do produto. Chrome-launcher usa perfil temporário próprio. Com
Chrome disponível, a execução foi:

```powershell
npm install --prefix .runtime/lighthouse-tool --no-save --package-lock=false --no-audit --no-fund lighthouse@13.6.0
node .runtime/lighthouse-tool/node_modules/lighthouse/cli/index.js 'https://viveiro.ersolucoesweb.com.br/releases/v0.46.0/?lang=en' --preset=desktop --only-categories=accessibility,performance --chrome-flags='--headless=new' --output=json --output=html --output-path=.runtime/lighthouse-046-desktop --no-enable-error-reporting --quiet
```

No móvel, omitir --preset=desktop e mudar o caminho de saída. As configurações
efetivas, instantes, métricas e hashes estão no [resumo](validacoes/lighthouse-0.46.0/resumo.json).
Relatórios JSON integrais compactados ao lado; descompactar gzip para consultar
os itens e capturas. Os HTML completos também ficam em.runtime para leitura
local. Os bytes descompactados foram comparados aos originais por SHA256.
Não houve envio de relatório ao Viewer ou criação de novo depósito/tag/release.

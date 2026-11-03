# Revisão final dos P2 ativos

03/11/2026. Escopo técnico P2.1–P2.7 implementado e validado. P2.8 foi
explicitamente descartado. Esta revisão não encerra os aceites externos de P1/P3
nem apresenta os modelos como cientificamente calibrados.

| Item | Evidência técnica | Situação de integração |
| --- | --- | --- |
| P2.1 ODD | Estados, agenda, submodelos, sete vetores e referência independente do solver. validacoes/odd-0.38.0.json. | Entregue na main/publicação 0.38.0. |
| P2.2 CLI e paridade | Quatro cenários, 4.400 ticks por ambiente, CSV/manifesto exatos com política portátil. validacoes/paridade-0.40.0.json. | Entregue na main/publicação 0.40.0. |
| P2.3 Varreduras | 50 execuções, Workers, retomada CLI/navegador e arquivos idênticos. validacoes/varreduras-0.41.0.json. | Entregue na main/publicação 0.41.0. |
| P2.4 Morris | 104 execuções reais, 12 entradas, ranking/índices e dados brutos. validacoes/morris-0.42.0.json. | PR #65 → main, pronto e publicado no privado. |
| P2.5 Extensões | Interfaces tipadas, política em um arquivo, comparação pareada e restore. validacoes/extensoes-0.43.0.json. | PR #66 → #65, pronto e publicado no privado. |
| P2.6 Perfis | Editor de 12 entradas com faixas/fontes, versões imutáveis e reimportação. validacoes/perfis-0.44.0.json. | PR #67 → #66, pronto e publicado no privado. |
| P2.7 Idiomas | UI completa, documentos públicos e guias pt-BR/en; 320px, paridade e offline. validacoes/i18n-p27.json. | PR #68 → #67, entrega privada confirmada. |

A suíte completa na branch final passou **459/459 testes**. Depois, o ajuste
exclusivamente documental de links/downloads passou 30 testes dirigidos e mais 16
na revisão dos nomes de arquivo. TS estrito/builds aprovados; todos os hashes do
manifesto offline foram conferidos. Os módulos de tradução têm menos de 250 linhas.

QA nativa do bundle: 300 ticks, CSV/manifesto iguais à CLI/dev; trocar idioma não
recria o mundo ou altera campos/resultados. Terrário e laboratório ficaram com
305px de largura de documento na tela de 320 px. Os guias alternaram pt-BR/en com
o servidor 4190 desligado. Dev 4173 permanece rodando em G; saves do usuário não
foram restaurados nem apagados. O evento de download de texto estático expirou
no IAB, mas a fonte abre pelo endereço direto e seus bytes/links foram conferidos
nos testes; downloads reais de CSV/JSON foram concluídos e comparados.

## O que falta para a publicação pública consolidada

1. Integrar os PRs em ordem **#65 → #66 → #67 → #68**, ajustando cada base para
   main depois da integração anterior. Todos estavam abertos na conferência;
   nenhuma branch ou tag foi apagada. Não duplicar PRs.
2. Definir a versão consolidada e atualizar pacote, changelog, CFF e .zenodo.json
   **antes** de criar sua única tag/release. O DOI 0.36.0 não pertence à versão nova.
3. Rodar os checks da integração, publicar pelo workflow da main/GitHub Pages e
   acompanhar a integração automática com Zenodo, sem depósito manual/duplicado.

Não há outro mecanismo P2 ativo pendente no cronograma atual. A publicação
pública continua na 0.41.0 até essa integração. A numeração 0.44.0 mostrada no
privado/branch é de desenvolvimento e não criou tag ou GitHub Release.

## Limites preservados

Morris mede o cenário exploratório ensaiado: há cinco efeitos populacionais não
nulos; as outras posições empatadas em zero não são dez descobertas empíricas.
A API de extensão executa código local de confiança, sem sandbox de terceiros.
O editor cobre 12 entradas expostas, não todos os coeficientes internos. Paridade
exige a mesma versão/plano/política; a trajetória nativa do terrário é preservada.
Calibração por espécie, replicação externa, revisão docente e pilotos dependem
de dados/pessoas reais e pertencem a outros aceites.

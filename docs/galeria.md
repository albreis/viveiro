# Galeria de experimentos — P4.2A

Desenvolvimento 0.46.0, receitas versão 1. Abrir /galeria.html no dev ou build.
O código fica em src/modules/gallery e módulos pequenos de src/app; traduções
por idioma em gallery.json. Não há backend nem coleta de saves.

## Conteúdo e fluxo

Dez receitas da equipe em cinco pares: vento, ângulo de repouso, temperatura,
estratégia de fundação e reserva inicial. Cada par conserva a seed. Os pares de
parâmetros isolam a entrada declarada; a comparação de fundação muda o perfil e
não representa duas espécies calibradas.

Buscar por pergunta/seed e filtrar tema/autoria. A troca de idioma conserva os
filtros. Créditos distinguem equipe e comunidade; atualmente são 10 da equipe e
zero externas. Nenhuma autoria externa foi inventada.

Abrir experimento carrega uma cópia no laboratório isolado, sem executar ou
alterar o terrário salvo. IDs usam id@versão; versões antigas não devem ser
reescritas. O plano JSON funciona na CLI da mesma versão/política numérica.
Requisições desconhecidas não buscam JSON remoto: mostram aviso e conservam a
configuração padrão. Links internos passam pelo registro de rotas permitido.

## Verificação

25 testes dirigidos, TS estrito e build 446 módulos. Os testes executaram dez
receitas no modelo portátil por 300 ticks e repetiram uma, sem alterar o catálogo.
A QA nativa confirmou filtros, autoria vazia, idioma e reflow 320 px/305 px.
Receita solo-deslizante@1 baixada da UI e executada no Worker produziu CSV e
manifesto idênticos à CLI; brutos em tests/fixtures/gallery-046 e evidência em
validacoes/galeria-0.46.0.json. Cache público inclui galeria.html.

P4.2B permanece aberto: total 20 receitas, dez de contribuições externas reais
revisadas. O formulário de experimento e o guia CONTRIBUTING explicam a entrada.
Não se garante uma diferença de resultado entre condições; o modelo é exploratório.

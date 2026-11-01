# Reservas maternas e custos da fundação

## Etapa 10A — 0.19.0

A revisão biológica 2 separa os créditos disponíveis em lipídio (L), proteína (P) e músculo (M). É um orçamento demonstrativo de fundação, não massa corporal em gramas, calorimetria ou porcentagem do indicador visual de energia. A revisão 1 e saves legados mantêm a reserva escalar e a dinâmica anterior. Referências são fixadas por identificador e versão; replay não troca a revisão. Novos terrários oferecem a revisão mais recente, e as anteriores continuam selecionáveis.

A referência qualitativa é a [pesquisa de Kurihara et al., 2022](https://doi.org/10.1016/j.asd.2022.101169) sobre histólise muscular e desenvolvimento do papo torácico em Lasius japonicus. Ela não calibra as frações, taxas ou cronologia adotadas aqui. O preset climático de outra espécie não transforma esta contabilidade genérica em fisiologia validada.

## Balanço

Para R₀ créditos existentes, L₀ = 3R₀/8, P₀ = 3R₀/8 e M₀ = 2R₀/8. A primeira fundadora continua com 8 créditos; filhas usam o orçamento já pago na coorte reprodutiva. Dividir esse orçamento não acrescenta energia. Antes da perda das asas, o músculo não está disponível para consumo. Depois, durante escavação ou claustro:

Δ = min(M, 0,001 · Δpassos), M ← M − Δ, P ← P + Δ.

A transferência preserva créditos. A proporção 1:1 expressa unidades equivalentes disponíveis, não rendimento fisiológico de 100%. Não há conversão inversa nem retirada direta de músculo. Manutenção e escavação usam lipídio primeiro, depois proteína; ovos e larvas exigem proteína disponível. O débito retorna somente o que foi pago e acumula pedidos não atendidos separadamente. Pedidos repetidos não representam dívida material e não entram no balanço.

As invariantes são L₀ = L + Sᴸ, P₀ + H = P + Sᴾ, M₀ = M + H e R₀ = L + P + M + Sᴸ + Sᴾ. A reserva escalar espelha a soma das reservas; não há dois saques do mesmo orçamento. O resumo por uso continua em founding.spent. A restauração valida valores não negativos, esquema, componentes, resumos e compatibilidade com o perfil, com tolerância numérica de 1e−7.

## Ações pagas

- Manutenção: 0,001 u./passo, preservando a taxa demonstrativa anterior.
- Ovos: 0,21 u. proteica por ovo; quantidade limitada pela proteína acessível antes de criar a prole.
- Larvas: 0,0012 u. proteica por larva/passo; falta de pagamento impede desenvolvimento larval nesse passo.
- Escavação: 0,15 u. por unidade volumétrica aproximada. A revisão 2 autoriza o débito antes de mudar a geometria, inclusive a cavidade numérica inicial. Sem reserva acessível, não cria solo transportado nem avanço da frente.

Os coeficientes aparecem como aproximações no catálogo. A estimativa volumétrica continua sendo o modelo geométrico reduzido existente, não DEM calibrado ou massa bioquímica. Transporte e deposição usam o mesmo balanço de terra. Depois da primeira geração, a alimentação usa a rede e o estoque existentes; a manutenção da rainha ainda pode recorrer ao saldo materno pela regra de fallback já existente. O registro resume esse orçamento de origem, não a dieta adulta completa; esta entrega não modela toda a dieta adulta, reposição lipídica ou cadáveres.

## Validação

A suíte completa passou: 183/183 testes em 1.228.964 ms. Depois da proteção adicional contra reservas incompatíveis com perfis escalares, os 14 testes dirigidos passaram novamente. TypeScript e Vite finais aprovados. Há ensaios de milhares de transferências e débitos sem crédito novo, músculo indisponível antes da conversão, impossibilidade de produzir ovos só com lipídio, estados inconsistentes rejeitados, recuperação exata e cavidade não paga bloqueada.

Integração com seed a e 68% de umidade do ar na revisão 2: quatro naníticas no passo 2194, 4,3956548418 u. restantes, erro de reserva de −3,69e−13 e de terra de −2,22e−15. São passos do relógio demonstrativo, não prazo real calibrado. Não se inferem 12–24 horas de escavação desse ensaio.

No navegador, RESERVAS-QA com revisão 2 do preset de laboratório fundou a colônia: quatro naníticas e 16 viagens de terra. O registro terminou com L = 0, P = 3,682 e M = 0,009 u., 4,309 u. consumidas e 1,991 u. convertidas, com balanço fechado. O perfil e as reservas persistiram após recarga; um checkpoint nomeado foi preservado. O experimento original do dia 267 foi recuperado em pausa, mantendo 97 adultos, 14 crias e os contadores de aprendizado (4719 escolhas, 4607 ajustes). O catálogo exibe os cinco coeficientes maternos da revisão 2.

## Continuação 10B

Tampão, isolamento ambiental e reabertura física ainda não estão nesta entrega. Precisam debitar material existente, incluir a reserva sólida no balanço de terra, afetar campo físico, navegação e condutância de gases e permitir remoção pelas primeiras operárias. Cronologia por temperatura, genética e calibração por espécie continuam dependências próprias.

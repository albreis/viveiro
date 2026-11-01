# Reservas maternas e custos da fundação

## Etapa10A — 0.19.0

A revisão biológica2 separa os créditos disponíveis em lipídioL,proteínaP e músculoM. É um orçamento demonstrativo de fundação, não massa corporal em gramas, calorimetria ou porcentagem do indicador visual ant.energy. A revisão1 e saves legados mantêm a reserva escalar e a dinâmica anterior. Referências são fixadas por id+versão; replay não troca a revisão. Novos terrários oferecem a revisão mais recente, e as anteriores continuam selecionáveis.

A referência qualitativa é a [pesquisa de Kurihara et al.,2022](https://doi.org/10.1016/j.asd.2022.101169) sobre histólise muscular e desenvolvimento do papo torácico em Lasius japonicus. Ela não calibra as frações, taxas ou cronologia adotadas aqui. O preset climático de outra espécie não transforma esta contabilidade genérica em fisiologia validada.

## Balanço

Para R₀ créditos existentes, L₀=3R₀/8,P₀=3R₀/8,M₀=2R₀/8. A primeira fundadora continua com8créditos; filhas usam o orçamento já pago na coorte reprodutiva. Dividir esse orçamento não acrescenta energia. Antes da perda das asas, o músculo não está disponível para consumo. Após a perda das asas, durante escavação/claustro:

Δ=min(M,0,001·Δpassos), M←M−Δ, P←P+Δ.

A transferência preserva créditos;1:1 expressa unidades equivalentes disponíveis, não rendimento fisiológico de100%. Não há conversão inversa nem retirada direta de músculo. Manutenção e escavação usam lipídio primeiro, depois proteína; ovos e larvas exigem proteína disponível. O débito retorna somente o que foi pago e acumula pedidos não atendidos separadamente. Pedidos repetidos não representam uma dívida material e não entram no balanço.

As invariantes verificadas são L₀=L+Sᴸ, P₀+H=P+Sᴾ, M₀=M+H e R₀=L+P+M+Sᴸ+Sᴾ. A reserva escalar é só espelho da soma das lojas; não há dois saques do mesmo orçamento. O resumo por uso continua em founding.spent. Restauração valida valores não negativos, esquema, cada componente e os resumos, com tolerância numérica1e−7.

## Ações pagas

- Manutenção:0,001u./passo, preservando a taxa demonstrativa anterior.
- Ovos:0,21u. proteica por ovo; quantidade limitada pela proteína acessível antes de criar a prole.
- Larvas:0,0012u. proteica por larva/passo; falta de pagamento impede desenvolvimento larval nesse passo.
- Escavação:0,15u. por unidade volumétrica do ledger aproximado. A revisão2 autoriza o débito antes de mudar a geometria, inclusive a cavidade numérica inicial. Se não há reserva acessível, não se cria solo transportado nem avanço da frente.

Os coeficientes aparecem como aproximações no catálogo. A estimativa volumétrica da fundação continua sendo o modelo geométrico reduzido existente, não DEM calibrado ou massa bioquímica. Transporte/deposição usam o mesmo ledger de terra. Depois da primeira geração, o registro materno fica histórico e a alimentação retorna à rede/estoque já existente; esta entrega não modela toda a dieta adulta, reposição lipídica ou cadáveres.

## Validação

14testes dirigidos passaram (7de perfil e7maternos), TypeScript/Vite aprovados. Há ensaios de milhares de transferências/débitos sem crédito novo, músculo indisponível antes de convertido, incapacidade de produzir ovos só com lipídio, dados inconsistentes rejeitados, recuperação exata e cavidade não paga bloqueada.

Integração por seed a/68%RH na revisão2:4naníticas no passo2194,4,3956548418u. restantes, erro de reserva−3,69e−13 e de terra−2,22e−15. Esse passo corresponde ao relógio demonstrativo, não a prazo real calibrado de uma espécie. Não se inferem12–24h de escavação desse ensaio.

Suíte completa em andamento no log local .runtime/maternal-suite.log. QA final, recuperação do original e publicação pendentes.

## Continuação10B

Tampão, isolamento ambiental e reabertura física ainda não estão nesta entrega. Precisam debitar material existente, incluir a reserva sólida no balanço de terra, afetar campo físico/navegação e condutância de gases e permitir remoção pelas primeiras operárias. Não equivalem a esconder a entrada. Cronologia por temperatura/genética e calibração por espécie continuam dependências próprias.

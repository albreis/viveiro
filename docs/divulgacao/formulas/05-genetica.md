# Herança haplodiploide digital

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/genetics/` · [índice das fórmulas](README.md)

## As regras

$$
\text{fêmea} = \text{recombinação}(\text{mãe}_1,\ \text{mãe}_2) + \text{pai}
\qquad
\text{macho} = \text{uma cópia materna}
$$

$$
g = \text{média das cópias do locus}
\qquad
\text{velocidade} \times (0{,}94 + 0{,}12\,g)
$$

| Elemento                    | Como funciona                                                                                                    | Valor no Viveiro                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Locos                       | locomoção, tamanho, antenas, mandíbulas, eficiência, atividade, coragem, exploração, cuidado, limpeza, escavação | 11 locos, valores de 0 a 1        |
| Fundadores                  | valores sorteados pela seed                                                                                      | entre 0,2 e 0,8                   |
| Fêmeas (rainhas, operárias) | duas cópias: uma materna recombinada, uma paterna                                                                | diploides                         |
| Machos                      | uma cópia, vinda só da mãe                                                                                       | haploides                         |
| Recombinação                | ao passar de um locus ao seguinte, a cópia materna usada pode trocar                                             | 18% de chance por locus           |
| Mutação                     | pequena alteração aleatória numa cópia                                                                           | 1,5% por locus e cópia, até ±0,05 |
| Valor expresso $g$          | média das cópias                                                                                                 | —                                 |

**Efeitos no corpo e no comportamento:**

| Gene       | Efeito                      | Fórmula                                       |
| ---------- | --------------------------- | --------------------------------------------- |
| locomoção  | velocidade                  | × $(0{,}94 + 0{,}12\,g)$                      |
| tamanho    | escala do corpo             | × $(0{,}96 + 0{,}08\,g)$                      |
| mandíbulas | cabeça e força de escavação | × $(0{,}94 + 0{,}12\,g)$ e $0{,}9 + 0{,}2\,g$ |
| antenas    | sensibilidade ao feromônio  | $0{,}8 + 0{,}4\,g$                            |
| eficiência | custo metabólico            | $1{,}1 - 0{,}2\,g$                            |

## Em palavras

Em formigas, abelhas e vespas, as fêmeas nascem de ovos fecundados e têm dois conjuntos de cromossomos. Os machos nascem de ovos não fecundados e têm só um. Isso se chama haplodiploidia, e o Viveiro reproduz essa estrutura com um genoma digital.

Cada gene vale entre 0 e 1. O corpo e o comportamento usam a média das cópias, com efeitos pequenos, de poucos por cento. Cada ovo guarda mãe, pai, geração e as mutações sofridas, com o valor antes e depois.

## Exemplo resolvido

A rainha tem as cópias 0,3 e 0,7 para locomoção. O macho com quem acasalou tem 0,6.

1. **Filha que herdou a cópia 0,3:** $g = (0{,}3 + 0{,}6)/2 = 0{,}45$. Velocidade × 0,994.
2. **Filha que herdou a cópia 0,7:** $g = (0{,}7 + 0{,}6)/2 = 0{,}65$. Velocidade × 1,018.
3. **Filho macho:** recebe só 0,3 ou só 0,7. Velocidade × 0,976 ou × 1,024.
4. **Antenas, se uma filha tem $g = 0{,}65$:** sensibilidade ao feromônio $0{,}8 + 0{,}4 \times 0{,}65 = 1{,}06$.

**Parentesco entre irmãs.** Quando a rainha acasala com um único macho, como no modelo, todas as filhas recebem do pai exatamente a mesma cópia. Da mãe, cada uma recebe metade dos genes maternos. Em média, duas irmãs compartilham $\tfrac{1}{2} \times 1 + \tfrac{1}{2} \times \tfrac{1}{2} = 0{,}75$ dos genes, mais do que compartilhariam com as próprias filhas (0,5). Hamilton usou esse número para explicar por que operárias ajudam a criar irmãs em vez de se reproduzir.

## Na vida real

- **Abelhas e formigas.** A haplodiploidia e a seleção de parentesco estão no centro do estudo da vida social de insetos.
- **Melhoramento genético.** Criadores de plantas e animais usam a mesma lógica de herança, recombinação e seleção para obter variedades mais produtivas ou resistentes.
- **Algoritmos genéticos.** Engenharia usa "genomas" digitais com cruzamento e mutação para buscar soluções. A NASA testou antenas desenhadas assim na missão Space Technology 5.
- **Medicina.** Árvores genealógicas com herança de cópias ajudam a calcular o risco de doenças hereditárias.

## Atividade prática

1. Cada grupo recebe duas moedas para a "mãe" (cara = 0,3; coroa = 0,7) e um cartão fixo para o "pai" (0,6).
2. Para cada filha, lance uma moeda da mãe e some com o pai; para cada filho, use só a moeda.
3. Gere 20 filhas e 20 filhos e faça um histograma da velocidade de cada grupo.
4. Discuta por que os machos variam mais, e calcule o parentesco médio entre irmãs.
5. No Viveiro, selecione uma operária e veja pais, geração e mutações no painel.

## Limites

Os 11 locos são abstratos e não correspondem a genes moleculares identificados. Taxas de mutação, recombinação e tamanhos de efeito são parâmetros experimentais, não medidas biológicas. Rainhas reais de muitas espécies acasalam com vários machos, o que reduz o parentesco entre irmãs.

## Referências

- Hamilton, W. D. The genetical evolution of social behaviour. _Journal of Theoretical Biology_ 7, 1–52 (1964).
- Hughes, W. O. H.; Boomsma, J. J. Genetic royal cheats in leaf-cutting ant societies. _PNAS_ 105, 5150–5153 (2008).
- Hornby, G. S. et al. Automated antenna design with evolutionary algorithms. _AIAA Space 2006_.
- Documentação do projeto: [genetica.md](../../genetica.md).

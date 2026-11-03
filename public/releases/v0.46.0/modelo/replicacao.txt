# Vetores e replicação

A [especificação do campo](reacao-difusao.md) é suficiente para escrever outro
solver. Estes casos verificam fronteiras, índices, sentido do vento, subpassos
e evaporação. Não são observações de laboratório.

## Downloads e execução

- [Referência autônoma em TypeScript](referencia.txt): salvar como reference-field.ts.
- [Vetores de entrada e saída](vetores.json): JSON com schema e tolerância.
- [Verificador de referência](verificador.txt): fonte do pequeno runner do repositório.

Na fonte completa, com Node 24 e sem dependências adicionais:

```text
node scripts/check-odd-reference.ts
node --test tests/odd.test.mjs tests/odd-pages.test.mjs
```

O primeiro comando importa apenas a referência e os vetores; não o solver
químico de produção. O segundo compara os dois por caminhos de cálculo distintos,
além de conferir exemplos analíticos e páginas. O runner mostra o erro real por
caso. Não foram criados resultados de um reimplementador externo fictício.

## Casos calculáveis à mão

Os parâmetros comuns abaixo são h=1, T=1, lambda=0 e vento zero, salvo indicação.

1. Grade 3×1, C=[0,1,0], D=0,1: N=1; saída [0,1;0,8;0,1] (ponto e vírgula separa
   componentes para não confundir vírgula decimal). JSON usa ponto decimal.
2. Grade 2×1, C=[1,0], D=0, vx=0,25: saída [0,75;0,25]. Com C=[0,1] e vx=−0,25,
   a saída é[0,25;0,75]. A fronteira fechada não perde massa por advecção.
3. Grade 1×1, C=[2], D=0, lambda=ln(2): saída [1]. Não há faces internas.
4. Grade 2×2, C=[1,0,0,0] por linhas, D=0,1: saída [0,8;0,1;0,1;0]. A célula
   diagonal não recebe fluxo direto naquele subpasso.
5. Grade 2×1, C=[1,0], D=0,5, vx=1: R=3, N=4, delta=0,25. A matriz por subpasso é:

```text
[ 0.625  0.125 ]
[ 0.375  0.875 ]
```

Aplicada quatro vezes, produz [0,296875;0,703125]. Com lambda=ln(2), a saída
final é metade disso: [0,1484375;0,3515625], pois cada subpasso aplica o mesmo
fator exponencial. Estes sete casos (contando sentidos e evaporação separados)
estão fixados no JSON, sem gerar esperados usando o solver de produção.

## Tolerância e limites da evidência

Usar erro absoluto por componente≤1e-12 nesses vetores pequenos. Não exigir
bytes idênticos entre duas somas de ponto flutuante com ordens diferentes.
Identidade de CSV/replay da mesma implementação é outro critério, da CLI.

Testes adicionais variam dimensões retangulares, sinais do vento, espaçamento,
difusão e duração; conferem preservação da entrada, conservação e não negatividade.
Referência e comparação foram escritas pelo mesmo projeto: são verificação
interna de consistência com o ODD. Auditoria científica/replicação externa,
escala física e calibração com medições permanecem abertas.

Páginas/documentos têm a mesma fonte Markdown. Equações/código são texto escapado,
sem executar o conteúdo. O pacote de fonte inclui explicitamente esses documentos
públicos; checkpoints e documentos operacionais não são expostos pelo gerador.

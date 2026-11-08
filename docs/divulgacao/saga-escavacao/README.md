# Carrossel — a saga da escavação

12 imagens PNG em **1080 × 1350 (4:5)**, numeradas na ordem de postagem.
A legenda está em [legenda.txt](legenda.txt). O arquivo
`carrossel-viveiro-12-imagens.zip` contém os PNGs e a legenda.
Não foi feita postagem em rede social.

## Ordem

1. Mais detalhe, menos terra: a pergunta que abriu a investigação.
2. O experimento de referência de Buhl.
3. Excesso sem fadiga e resultado parcial da fadiga de escavação.
4. Fadiga por ações e triagem ambiental.
5. Morfologia, queda de volume e decisão de preservá-la.
6. Teste de velocidade/carga com efeito pequeno no volume.
7. Hipótese do filtro extra de acesso.
8. Resultado mais promissor na arena.
9. Ganho medido e limites da leitura de Buhl.
10. Integração do princípio no World 3D.
11. Diferença entre escavar e entregar, com transporte por investigar.
12. Estado atual e próximos testes.

## Evidência e linguagem

O melhor cenário citado é o da **arena**, com morfologia, fadiga de
escavação e retirada do filtro adicional de acesso. A interpretação é
exploratória e de desenvolvimento. Não declara calibração ou validação
empírica independente concluída. Os dois pontos fora da faixa, as tentativas
que pioraram o ajuste e as limitações da integração 3D permanecem visíveis.

As séries de fadiga/morfologia/locomoção/acesso usam as médias já arquivadas.
Nas linhas da arena são desenhados os pontos de 0 a 72 h em intervalos de
12 h, ligados por segmentos. Não há novas execuções, suavização ou correção
por fator de produtividade. A ação usa três seeds; os demais lotes longos
citados usam cinco. A triagem de 48 execuções durou 2 h e não foi apresentada
como um teste de 72 h. A curva de 2001 não foi confundida com a tabela de 2005.

O arquivo [dados.json](dados.json) inclui os números e os hashes das fontes.
A comparação de ações que estava em `.runtime` foi preservada em
[evidencias/fadiga-acao-72h.json](evidencias/fadiga-acao-72h.json).
As capturas em `assets/` vêm do renderizador real, usando um mundo preparado,
sem saves pessoais. A visibilidade interna é um recurso de observação.
Não são fotografias de um formigueiro real.

## Arquivos editáveis e reprodução

[carrossel.html](carrossel.html) é um documento editável com os gráficos
vetoriais e as imagens, que abre localmente sem dependências externas.
Roteiro, gráficos e estilos estão separados em arquivos pequenos em
`scripts/divulgacao/saga/`. O modelo da simulação não foi alterado.

```powershell
node scripts/divulgacao/saga/create.ts
node scripts/divulgacao/saga/package.ts
python scripts/divulgacao/saga/pack.py
```

O comando usa Playwright/Chrome e produz 12 PNGs, conferindo imagens ausentes,
dimensões, cortes e sobreposições com o rodapé. `qa-layout.json` registra a
conferência. As capturas podem ser reproduzidas com o dev rodando:

```powershell
node scripts/divulgacao/saga/capture.ts
```

Dados usados: `buhl-fadiga-comparacao-72h.json`,
`buhl-narbonne-operarias-comparacao.json`, o relatório de acesso e o ensaio de
locomoção da revisão `41691a9`, e `escavacao-acesso-viveiro.json` do PR #131.
As capturas e o carrossel não modificam o RNG ou os resultados desses lotes.

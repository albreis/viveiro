# Cenário controlado com o motor real do Viveiro

Atualizado para a 0.48.0 em 08/11/2026. A integração efetiva do princípio de
acesso físico está no [relatório do World](escavacao-acesso-viveiro.md).
A réplica física do experimento de Buhl ainda precisa de implementação.

## O que entra na release

- Narbonne v3: contato com solo, apoio, alcance e espaço corporal nas frentes.
- [Ensaio de integração](../validacoes/escavacao-acesso-viveiro.json): 12 execuções,
  50/100/200 operárias, duas seeds, pares v2/v3 e 2.000 ticks do World.
- Balanços, movimento contínuo, persistência e paridade CLI/navegador conferidos.
- Comparação de formato/proporções explicitamente normalizada. Não são 72 h
  físicas nem volumes em cm³ comparáveis aos do laboratório.

A integração não transfere a fadiga de escavação da arena para o perfil
Narbonne. A posição inicial das operárias, o transporte e o alargamento
precisam ser controlados antes de interpretar a escala com o tamanho do grupo.

## Rascunho preservado, fora do pacote ativo

O PR #128 criou um piloto de infraestrutura. Seu fechamento na organização
da release não elimina a branch nem transforma sua tarefa em concluída.
A fonte original continua no [commit 8aa0bcc](https://github.com/albreis/viveiro/tree/8aa0bcc094205ccc15f5ddde2b7599be846c3e1f)
e na branch `codex/cenario-buhl-motor-viveiro`.

Naquela fonte, `scripts/run-terrarium-study.ts` e a fábrica
`src/modules/benchmarks/terrarium-study/baseline.ts` usavam World.step e
marcavam `buhlComparable: false`. Dois testes, build e um piloto de 100 passos
haviam passado. Esse piloto não era uma execução de 72 horas do estudo.
A release usa o ensaio de integração do PR #131, sem acrescentar esse runner
inicial paralelo ao motor ativo.

## Próximos passos concretos

Seguir [K0–K6](buhl-parametrizacao.md) e o [registro TRACE](buhl-trace.md):

1. Separar tempo físico e relógio biológico acelerado. Hoje 100 ticks formam
   um dia do modelo; a normalização visual não resolve essa conversão.
2. Representar dimensões, substrato e condições iniciais do experimento,
   sem galerias pré-existentes nem empilhamento artificial de operárias.
3. Conferir espaço, volume, carga, taxa de escavação e tempo de entrega com
   o motor real. Separar fontes medidas e hipóteses.
4. Definir um protocolo de esforço/fadiga apropriado ao relógio escolhido.
   Não adicionar custos só para aproximar volumes agregados de Buhl.
5. Só depois executar as 72 h físicas e arquivar todos os resultados,
   inclusive desfavoráveis, junto dos balanços e do plano fixado previamente.

B7/P3.3 continuam dependentes de observações empíricas elegíveis para
avaliação independente. Preservar o histórico dos motores separados.

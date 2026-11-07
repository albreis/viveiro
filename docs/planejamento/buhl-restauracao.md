# Retorno à fadiga apenas de escavação

07/11/2026. O mantenedor pediu retirar a integração de morfologia que
reduziu os volumes e voltar à configuração anterior da arena de Buhl.

A implementação da arena foi restaurada ao estado de `26d1eaf`, anterior
ao PR #126. A configuração principal volta a ser o
[plano de fadiga de escavação](../validacoes/buhl-fadiga-local-plano.json):
seguimento de parede, acesso 0,35, carga e tempo por pelota anteriores e
`digFatigue: "work-recovery"`, sem perfil corporal nem microclima adicionais.
Os planos sem fadiga e a hipótese de fadiga por ação continuam preservados.

| Operárias | Média em 72 h da configuração restaurada |
| --- | ---: |
| 50 | 19,92 cm³ |
| 100 | 36,15 cm³ |
| 200 | 64,46 cm³ |

Esses valores são do lote arquivado dessa configuração. O retorno de código
não é apresentado como um novo lote de 72 horas. A proximidade observada
orienta a preferência operacional do mantenedor e não encerra B7.

O [ensaio com morfologia](buhl-narbonne-operarias.md), seus dados, PNGs,
planos e fonte permanecem como histórico desfavorável. Não reativar essa
integração ou planejar sua ablação sem novo pedido. Para reproduzir a
dinâmica retirada, usar a fonte identificada no relatório histórico.

## Alcance da restauração

A retirada afeta a integração das operárias à arena. Os perfis e saves
versionados do terrário 3D continuam preservados. Foram removidos os
módulos de projeção corporal da arena e restauradas as funções anteriores
de movimento e contato.

A arena atual é um modelo plano separado, com regras próprias. Ela não
é apenas outro cenário do motor do terrário. Seus resultados verificam
esse modelo de escavação e não validam diretamente a navegação e a
escavação 3D do terrário. Para avaliar estas últimas, permanece necessária
uma implementação de cenário controlado usando o mesmo motor dos agentes,
com unidades e condições comparáveis ao experimento.

Validação da restauração: 538 testes aprovados, TypeScript/Vite, Chrome 157
e reprodução exata dos controles antigos. Todo o código matemático do modelo
foi comparado ao estado anterior ao PR #126. O pedido seguinte do mantenedor
é desenvolver, em outra branch da main, o cenário com o motor real do Viveiro.

# Perfil leve de apresentação

P1.1A, versão 0.31.0. O aceite de desempenho em hardware escolar continua
pendente de ensaio real. Não há mudança do modelo, população, seed ou replay.

## Uso

Em “Desempenho”, escolha “Leve · escola”. A preferência fica neste navegador,
se o armazenamento estiver disponível; não faz parte do save do experimento.
“Completo” restaura o desenho detalhado.

O modo leve limita o desenho a 80 operárias, priorizando a selecionada e as
mais próximas da câmera. A lista continua permitindo acompanhar qualquer
formiga em primeira pessoa. O corpo acompanhado fica oculto; cargas e crias
transportadas não aparecem sozinhas se sua portadora não está desenhada.

Densidade de pixels limitada a1, sombras desligadas, malha visual64×24×44
em vez de96×34×64, com refinamentos das entradas mantidos. Os vértices continuam
projetados no mesmo campo contínuo do solo. Colisão, túneis, escavação e
quantidade de agentes simulados não usam o detalhe da malha visual.

O perfil escolhe inicialmente previsão por contagem/histórico, explicitamente
aproximada. O aluno pode mudar para estado completo no painel de previsão.
Trocar de perfil cancela o cálculo anterior e atualiza esse método.
Não se apresenta a previsão aproximada como equivalente à de estado completo.

“Medir por10 segundos” informa média de quadros/s, P95 do intervalo entre
quadros, chamadas e triângulos por quadro. Ocultar a aba ou trocar o perfil
cancela a amostra. Sem telemetria ou envio de informações do aparelho.

## Conferência local em02/11/2026

Windows, Intel Core i5-1135G7, controlador Intel Iris Xe disponível.
Há também um controlador SMI USB Display; não foi identificado qual saída
física participa da composição. Não é um Chromebook ou equipamento escolar
certificado. Duas janelas de10 segundos na mesma página, câmera e seed:
SEMENTE-50088/D62,5,14 adultos/13 operárias, simulação pausada.
Viewport571×465 pixels CSS, devicePixelRatio1,25. A amostra leve final
foi repetida após refinar as bordas das entradas; o modo completo é inalterado.

| Perfil | Quadros/s | P95 (ms) | Chamadas/quadro | Triângulos/quadro |
| --- | ---: | ---: | ---: | ---: |
| Completo | 58,7 | 16,9 | 1026 | 300344 |
| Leve | 60,0 | 16,9 | 1026 | 206120 |

Não é benchmark estatístico, teste sob carga grande ou comparação de GPUs.
O limite do monitor pode dominar a taxa de quadros. As chamadas não caíram
neste cenário; há espaço para otimizar a vegetação em entregas posteriores.

Seleção/primeira pessoa e retorno funcionaram; perfil leve persistiu após
reload, com previsão por contagem e D62,5 preservado. Console sem erros.
24/24 testes dirigidos e build316 módulos passaram. Testes verificam limite visual e seleção sem mutação dos agentes,
malha leve no mesmo campo, invariância do mundo, entradas pequenas e bordas
nos dois detalhes, medição/cancelamento e descarte de resposta antiga do Worker.

## Aceite restante

Ensaiar em Chromebook ou notebook de entrada identificado, com mesma seed,
save, câmera, ritmo, quantidade de agentes e intervenções nos dois modos.
Registrar navegador, resolução, bateria/energia, atividade dos Workers e
distribuição dos tempos; executar em movimento e com ninho mais populoso.
A meta de30 quadros/s e a revisão por escola não estão certificadas.

Publicado nos Sites privado original e público separado. Tag/fonte1a5fa67038c8fe244844136257f5328becbf5e4e.\n[Versão pública](https://viveiro.ersolucoesweb.com.br/releases/v0.31.0/).\nQA pública: leve/contagem, primeira pessoa, retorno e reload emD2,6; console\nlimpo. Onze assets com hashes exatos sem cookies/Authorization. Evidência\nem docs/validacoes/publicacao-0.31.0.json. IDs em docs/CONTINUAR.md.

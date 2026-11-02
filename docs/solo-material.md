# Composição e compactação relativas do solo

Etapa 12C, versão 0.26.0. Perfil opcional generic-microclimate-demo@3 (revisão 9). Os perfis anteriores mantêm suas regras. Código em src/modules/soil-material; os dois índices pertencem ao habitat compartilhado, não a cada colônia.

## O que os controles representam

Argila relativa e compactação relativa são índices de 0 a 100. Referências 35 e 50 reproduzem exatamente os multiplicadores anteriores. Não representam uma análise granulométrica, densidade medida ou resistência geotécnica. Mudanças são intervenções registradas e persistentes; não criam água, calor, alimento ou terra.

Com c = argila/100 − 0,35 e p = compactação/100 − 0,5:

- Redistribuição capilar: exp(0,6c − 0,8p).
- Drenagem: exp(−1,5c − 1,2p).
- Condução térmica: exp(0,25p).
- Carga relativa do teto: 1 + 0,4p.
- Coesão relativa: exp(0,8c + 0,6p), multiplicada pelo amolecimento relativo em alta saturação.

Os fatores hidráulicos são limitados a 0,15–3. O fator de coesão é limitado a 0,1–3. Acima de 80% dos poros preenchidos, o amolecimento usa w = clamp((água − 0,8)/0,2, 0, 1) e razão (1 − 0,6 × argila/100 × w)/(1 − 0,6 × 0,35 × w). Esse denominador conserva a referência antiga inclusive em solo saturado. Todas as constantes são escolhas demonstrativas visíveis no catálogo, sem ajuste experimental.

A água e o calor continuam sendo transferidos em pares conservativos. A aceitação da chuva superficial é multiplicada pelo menor valor entre 1 e o fator de drenagem; somente água aceita entra no balanço. O integrador mantém seus subpassos limitados. Carga e coesão alimentam o cálculo existente de dano e desprendimento do teto, sem deslocar agentes ou alterar instantaneamente o terreno. Uma compactação maior aumenta tanto a carga quanto parte da resistência; estabilidade continua dependente da geometria, água e dano.

## Limites e fontes

O volume dos poros e o volume de terra permanecem fixos. Não há adensamento físico, expulsão de água por compressão, curva de retenção, mudança espacial da mineralogia ou solução calibrada de Richards/Mohr–Coulomb. O índice de carga não reescreve a massa dos grãos. Composição uniforme e multiplicadores qualitativos não substituem dados de solo.

O [guia NRCS de densidade, água e aeração (2019)](https://www.nrcs.usda.gov/sites/default/files/2022-10/Soil%20Bulk%20Density%20Moisture%20Aeration.pdf) e a [nota NRCS 16A sobre compactação](https://www.nrcs.usda.gov/state-offices/illinois/soil-tech-note-16a-compacted-zone-in-soil) dão contexto qualitativo sobre textura, compactação e transporte. Na matéria real, a compactação altera a porosidade; esta versão ainda não reproduz esse efeito. Nenhum coeficiente acima foi estimado dessas fontes. Calibrar exige granulometria, densidade, retenção, condutividade e resistência com incerteza e condições de medição.

## Verificação

- 240/240 testes completos; nove novos cobrem neutralidade, extremos, conservação, teto, intervenções, validação de saves e habitat compartilhado. Log local .runtime/material-suite.log, 236.938 ms.
- Comparação numérica de 250 passos entre o perfil anterior e a referência neutra; recuperação e continuação de 150 passos idênticas. Água/calor conservados em nove misturas extremas, inclusive passo grande subdividido.
- Build TypeScript/Vite de 278 módulos aprovado. Sem dependências novas.
- Navegador: MATERIAIS-QA-2, argila 100/compactação 0, capilaridade 2,2×, drenagem 0,69×, calor 0,88×. Chuva aceita 0,4 u. em D0,5. Outra semente mantém os índices; recuperação preserva os mesmos valores. Checkpoint manual-927f197c-1627-4baa-8f73-ed88ece6a7f4, Material e transporte · QA. Onze registros próprios no catálogo.
- Seu terrário SEMENTE-50088/D62,5/labv5 foi recuperado em pausa e recarregado. Nenhum erro novo na QA; um erro de montagem transitório anterior ao painel completo permanece no histórico do console. Perfil anterior inicia com controles de material ocultos.

O aceite implementável da etapa 12 fica coberto pelos protótipos 12A–12C. Calibração externa e revisão docente do roteiro continuam abertas. Próximas etapas: 13, 14 e então P0–P5, conforme a ordem do usuário.

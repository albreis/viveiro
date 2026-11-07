# Perfis e proveniência biológica

## Entrega9 — 0.18.0

O catálogo separa aproximações usadas no motor, hipóteses recebidas, condições de laboratório e medidas de um estudo. Cada registro possui identificador/versão, valor ou faixa, unidade, fonte, amostra quando disponível, contexto, incerteza e uso. Não é catálogo exaustivo de todos os coeficientes físicos/biológicos do projeto. Os primeiros 14 registros cobrem relógio/progresso demonstrativo, reserva inicial, propostas de fundação/desenvolvimento e referências do estudo.

O perfil genérico mantém as regras aceleradas atuais. Não recebe nome de espécie validada. O perfil Ar de referência usa só condições iniciais de ar atribuídas a [Majidifar et al.,2024](https://doi.org/10.1111/1365-2435.14536); o restante continua genérico. O painel distingue condição experimental de ótimo, medição ou timer biológico. A observação amostral aparece com seu denominador/contexto, sem virar lei da simulação. A amostra específica das condições gerais não foi extraída; consultar a TabelaS1. Nenhuma licença de dados brutos ou incerteza ausente foi inventada.

Selecionar um perfil prepara o próximo terrário. Novo começo e iniciar uma semente aplicam o preset de clima somente nessa criação. O experimento existente não é alterado pela consulta. Depois da criação, os controles ambientais podem divergir da referência; o painel mostra sempre o ar atual. A biologia, solo, castas e ecologia combinados não passam a reproduzir uma espécie ou o experimento citado.

## Versionamento e replay

O mundo guarda biologicalProfile com schema,id,version. Valores não reconhecidos falham explicitamente, sem reinterpretar silenciosamente a versão. Novos experimentos guardam os parâmetros iniciais completos; replay usa esses parâmetros e a referência preservada, sem reaplicar o preset sobre intervenções. Filhas herdam uma cópia da referência da colônia de origem, compartilhando apenas o habitat previsto pela arquitetura.

Saves legados sem referência continuam com comportamento numérico anterior. Consultar o catálogo não adiciona metadados nem reescreve o mundo legado. A reserva e os limiares demonstrativos foram extraídos como constantes comuns sem mudar seus valores. Teste pareado mostra igualdade exata do futuro com/sem a referência genérica, removendo somente o metadado da comparação.

Se um checkpoint atual usa perfil/schema/versão desconhecidos, a gravação automática fica protegida. Havendo cópia anterior compatível, ela abre pausada com aviso, e o original permanece preservado. Recuperar/importar explicitamente um checkpoint conhecido ou criar outro experimento são ações distintas disponíveis na interface. Isso não cria suporte a uma versão futura: é preciso a versão compatível do motor para reconstruí-la.

## População de referência

Novas sessões do terrário usam [Messor de Narbonne](planejamento/messor-narbonne.md)
por padrão. O perfil `messor-narbonne@1` separa as âncoras de tamanho e
locomoção das estratégias de dieta e desenvolvimento. A atribuição a
*Messor bouvieri* é provisória e os perfis genéricos continuam selecionáveis.

## Estratégias e dados ainda necessários

O contrato distingue fundação claustral/semiclaustral/desconhecida, casulo presente/ausente/não especificado e sazonalidade. Nesta entrega os perfis executáveis ainda usam a fundação claustral genérica; casulos e diapausa não são calibrados. As etapas 10/11 implementarão os mecanismos e novos perfis apropriados, sem inferir espécie a partir do nome de uma referência climática.

As faixas recebidas de outraIA continuam classificadas como hipóteses não aplicadas. Perfis de espécies calibradas exigem dados primários de escavação, primeira postura, nutrição, desenvolvimento térmico, reservas, sazonalidade, fertilidade e sobrevivência, com amostras/incerteza/condições e licença. Condições de incubadora não determinam umidade dentro da câmara, água do solo ou temperatura ótima.

## Validação

21 testes dirigidos aprovados:7 novos e 14 de checkpoints/sessão. Cobrem catálogo, fonte/unidade/amostra, preset limitado ao clima, entrada intacta, legado numericamente idêntico, herança privada, save/restore/replay e proteção de perfil futuro com checksum válido. TypeScript/Vite aprovados. Suíte completa:176/176 testes aprovados em307760ms (log local .runtime/biology-suite.log). O ajuste posterior foi apenas de apresentação: catálogo em diálogo e marcação separada em módulo TypeScript. Build final aprovado.

Browser: checkpoint manual Antes de validar perfis · dia267 criado e confirmado antes do teste. Escolher referência não mudou o ar original35°C/92%. Novo terrário iniciou21°C/80% e recarga preservou perfilv1 no dia0,7. Original recuperado em pausa no dia267:97adultos/14crias/duas colônias,35°C/92%,4719escolhas e4607ajustes preservados, confirmado após recarga. O teste novo também ficou num checkpoint anterior à recuperação. Fontes, hipóteses inativas e quatro classes de evidência foram conferidas. Catálogo em diálogo evita alongar a página; marcação em módulo separado. Nenhum erro novo; logs antigos deHMR14:44:57 são anteriores à QA. Screenshot viveiro-0.18.0-catalogo.png. DevG PID17752mantido; nenhum arquivo de save excluído.

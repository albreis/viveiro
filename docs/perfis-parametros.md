# Perfis de parâmetros versionados

O editor do laboratório de experimentos mostra as 12 entradas do catálogo v1 com unidade, faixa permitida, fonte do código e classificação como hipótese ou aproximação. Esses limites são regras do protótipo, não intervalos de confiança calibrados por espécie.

## Criar e repetir

Abra **Experimentos**, depois **Editar e guardar um perfil de parâmetros**. Informe identificador, nome e versão; escolha uma revisão biológica existente e ajuste as entradas. As cinco entradas opcionais podem ficar desmarcadas: nesse caso, conservam o comportamento original do modelo.

**Aplicar ao experimento** muda os parâmetros e o perfil biológico do plano isolado. Seed, duração, modo inicial e política de decisão permanecem os do plano. Nenhum save do terrário 3D ou registro do IndexedDB é alterado. **Usar na varredura** altera somente a base da varredura; os valores do eixo continuam definidos na configuração dela.

Exporte o perfil JSON e guarde também a seed, a configuração executada, a versão do Viveiro e a política aritmética do manifesto. Importe o mesmo perfil no outro navegador, aplique ao experimento com a mesma seed e rode. O arquivo do perfil não é, sozinho, um snapshot do formigueiro nem um registro de todos os fatores de uma execução.

## Versões imutáveis e armazenamento

O JSON usa `viveiro-parameter-profile-v1`, `catalogVersion: 1`, identificador, versão positiva, nome, referência biológica explícita e parâmetros canônicos. Na biblioteca local, um mesmo `id@version` só pode ser reutilizado com o mesmo conteúdo. Para guardar alterações, aumente a versão ou use outro identificador. Importações que conflitam com uma versão existente são recusadas; nada é sobrescrito.

A biblioteca usa a chave independente `viveiro.parameter-profiles.v1` do localStorage, com até 100 versões e 256KiB. O importador aceita arquivos de até 64KiB. Erros de quota, corrupção ou formato são visíveis e preservam os dados anteriores. A biblioteca não é sincronizada pela rede: o arquivo exportado é a forma de transferência entre origens e navegadores. Não se migram ou apagam saves existentes.

## Proveniência e variações

O plano e o manifesto guardam o perfil **de origem** completo em `parameterProfile`, além dos parâmetros e perfil biológico **efetivamente executados**. Essa distinção permite que uma varredura registre de qual perfil partiu e, ao mesmo tempo, execute valores diferentes no eixo escolhido. Editar o JSON do plano também pode produzir variações: os valores executados são os de `parameters`, e não os do perfil de origem.

Aplicar um perfil pelo editor copia seus valores integralmente, incluindo a presença ou ausência das entradas opcionais. Não existe preenchimento invisível das cinco opcionais no arquivo exportado. Reimportar e aplicar a mesma configuração, versão do modelo e seed conserva a execução; importar um perfil não promete paridade entre versões diferentes do simulador.

O editor cobre o catálogo de entradas do experimento, não todos os coeficientes internos da física e biologia. Os perfis biológicos publicados são referências imutáveis; este editor não cria uma espécie calibrada nem substitui os dados e revisões de P3.

## Evidência de reprodução

O perfil qa-perfis-44@1 foi exportado, alterado no editor e reimportado no navegador. Com a mesma seed PROFILE-BROWSER-44 e três dias, CSV e manifesto foram idênticos byte a byte na primeira execução, na reimportação, na CLI e no bundle compilado. O ensaio também recusou conteúdo diferente na versão guardada e conferiu a aplicação à base da varredura.

[Perfil exportado](../experimentos/profile-044/profile.json), [plano executado](../experimentos/profile-044/plan.json) e [arquivos brutos e hashes](../experimentos/profile-044/arquivos.json). Isso verifica os cenários ensaiados, não calibração biológica ou compatibilidade entre versões diferentes do modelo.

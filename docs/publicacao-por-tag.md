# Publicação por tag

P0.3, versão0.30.1; entregue no [Site público](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/). O Site de testes conserva sua identidade e audiência privada. O build público usa um espelho separado de artefatos, sem copiar o histórico Git, docs privados, credenciais ou saves do checkout.

## Fonte e artefato

Com a fonte revisada e commitada, execute no checkout principal:

node scripts/build-public-release.ts --mirror G:\Projetos\viveiro-publico

O comando usa o Vite instalado com base /releases/vVERSAO/, gera arquivos em uma pasta temporária ignorada e instala somente os assets compilados. Não altera dist manualmente. No espelho, public/releases/vVERSAO/ guarda os arquivos e release.json com SHA de origem e SHA-256 de cada arquivo. A raiz public/ contém índice e catálogo para abrir a versão mais recente ou uma anterior. O espelho não reutiliza o project_id do Site privado.

Uma tentativa idêntica pode ser repetida. Alterar arquivos, origem ou inventário de uma tag existente causa falha. Publicar outra versão acrescenta uma pasta; não apaga versões anteriores. Esses hashes detectam alterações/acidentes, não são assinaturas nem tornam o administrador incapaz de modificar o servidor.

O script exige caminho absoluto e fonte Git limpa; rejeita pastas desconhecidas, caminhos de saída com junctions, arquivos ocultos, mapas de fonte e padrões procurados de credenciais. Esse filtro não substitui revisão do conteúdo. Staging e destino são verificados dentro do espelho antes do rename atômico. Não há exclusão recursiva de releases.

## Hospedagem

O espelho é um Site estático independente, registrado uma única vez com seu próprio .openai/hosting.json, static.directory=dist. O exportador copia build-static.ts para o espelho; node build-static.ts gera dist/ por cópia exata dos artefatos de public/, sem editar bundles. Dist é ignorado no Git; public/ guarda as releases e a fonte do espelho. O helper oficial recebe commands:[["node","build-static.ts"]]. Diretórios estáticos fora da lista suportada não devem ser usados: a tentativa inicial com public foi recusada e sua fonte e3641fd foi preservada, sem versão salva/deploy. A correção usa dist e mantém as verificações do serviço intactas. O fluxo Sites deve abrir/puxar esse repositório antes de acrescentar versões quando for retomado em outra máquina. Nunca copiar o manifesto privado para ele. Fonte/arquivo/deploy usam o SHA devolvido pelo helper oficial. O acesso público foi aplicado somente ao Site separado, conforme P0.3, após salvar e revisar o artefato. A origem privada continua servindo para testes e saves independentes.

As duas URLs por tag foram verificadas no navegador e por requisições sem cookies ou Authorization. O catálogo escolhe a maior versão numérica, sem rebaixar o link principal por exportar uma versão antiga. A versão da aplicação é lida de package.json, substituindo o rótulo estático desatualizado. Links de download/licenças e Workers devem funcionar sob a base da release.

## Persistência e limites

Saves são locais à origem. Nenhum dado do terrário privado é distribuído no build. Exportar/importar JSON permite levar uma cópia explicitamente para outra origem. As versões públicas na mesma origem compartilham o armazenamento do navegador; versões antigas recusam perfis não suportados e preservam a proteção de escrita existente. Não se deve abrir versões diferentes simultaneamente para gravar o mesmo experimento.

Não há backend contínuo, PWA/cache offline completo, DOI ou calibração por espécie nesta entrega. Retenção de artefatos antigos depende do espelho e da hospedagem; limites reais de armazenamento devem ser respeitados sem apagar tags silenciosamente.

## Validação em andamento

Onze testes novos conferem manifestos, origem, repetição idêntica, recusa de reescrita, preservação de tags, ordem semver, adulteração/arquivos ausentes, caminhos desconhecidos, credenciais sintéticas e junctions reais no Windows. Dezoito testes combinados com codec/sessão passaram em1.893 ms; build privado310 módulos aprovado. Modelo biológico inalterado. QA do bundle sob subpasta concluída: localhost4174/releases/v0.30.0/, versão correta, nova seed independente, primeira pessoa, malha e previsão/avanço em Workers. Avanço de1 dia terminou emD1,1 e permaneceu pausado após reload; checkpoint nomeado criado. Relatório reservado carregado e download com base correta; links de licença e retorno resolvem dentro da tag. Console sem erros. Não houve alteração do experimento na porta4173. Publicação e conferência sem login concluídas.

O catálogo também recusa o desaparecimento de uma release que constava no índice anterior. O adaptador recusa CWD desconhecido, junctions e arquivos extras de saída, preservando-os ao falhar. A0.30.0 privada/tag a8c95f9 permanece preservada; a correção de empacotamento integra0.30.1.

## Publicação real

[Entrada pública](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/), [v0.30.0](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/releases/v0.30.0/) e [v0.30.1](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/releases/v0.30.1/) disponíveis. O laboratório original mantém audiência custom, somente proprietário e zero externos. O GitHub original não foi tornado público.

Verificação em02/11/2026: raiz, tags e manifestos retornaram200 sem Cookie/Authorization.22 arquivos não HTML têm hashes exatos; quatro HTML mantêm integralmente o conteúdo do build e recebem um script de [JavaScript Detections da Cloudflare](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/). Não foram removidas ou alteradas proteções. O host usa307 canônico para index.html/licencas.html; as URLs finais não pedem login. O manifesto identifica o build, não os bytes adicionais da infraestrutura. [Relatório bruto](validacoes/publicacao-0.30.1.json).

QA real: cena3D, primeira pessoa, avanço1dia em Worker atéD2,6 em pausa e console limpo. Licenças e retorno preservam a base da tag após canonicalização. Sem nova validação biológica, medição de FPS escolar ou infraestrutura contínua.

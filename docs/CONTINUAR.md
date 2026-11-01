# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. O usuário autorizou continuar o cronograma com retomada horária nesta conversa após limites legítimos. Automação continuar-cronograma-do-viveiro ativa; não iniciar executor concorrente nem contornar cotas/aprovações.

## Entrega em preparação — 7A

Branch codex/solo-granular, base codex/simbioses-e-mimetismo. Versão 0.10.0 preparada, ainda NÃO publicada. Dinâmica de agregados de terra solta em granular: gravidade, atrito de Coulomb, contato dissipativo e grade espacial. Modelo compacto ainda implícito; depósitos externos visuais. Não é solo inteiro discretizado nem cadeias de força. Controles de repouso da terra, replay, renderização móvel e docs/granular.md implementados.

Seis testes granulares aprovados. O primeiro full teve 102/103: a reparadora perdia apoio ao cair/encolher o agregado e demorava no retorno. Corrigido com settleSupport também na fase repair. O caso agora limpa tudo em 1688 ticks; 14 testes dirigidos de granular/solo/apoio passaram, incluindo nova asserção de apoio durante o reparo. A suíte completa final passou: 103/103 testes em 367449 ms, com concorrência 2. Build TypeScript/Vite final aprovado.

Navegador: seed a preservada, intervenção no dia 171 criou 0,047 u³. Um agregado foi observado em movimento; no dia 172,6 estava acomodado, e uma operária já retirou parte, restando 0,025 u³. Controle alterado para 20°, registrado no replay. IAB local tab 2 pausada, duas colônias e 115 formigas; interior ligado, vista esquerda. Screenshot viveiro-0.10.0-terra.png. Dev G PID 17752.

Próximo passo imediato: coletar suíte completa, retomada por recarga e controle salvos conferidos, sem novos erros após a correção do carregamento parcial HMR; prova do painel em viveiro-0.10.0-bloqueio.png; commit/push restrito da branch, PR #13 se ainda não existir com base codex/simbioses-e-mimetismo, publicar 0.10.0 no Site privado com source helper atual, tag v0.10.0 e registrar IDs. Depois 7B umidade/capilaridade/calor/gases e 7C suporte estrutural.

## Última entrega publicada

- Branch codex/simbioses-e-mimetismo; base codex/cronograma-biologia-fundacao. Versão 0.9.0.
- Fonte 526d7ded6c0f531bbbd7677add22269e0c92524d, tag v0.9.0.
- PR #12 https://github.com/albreis/viveiro/pull/12. Base documental PR #11 https://github.com/albreis/viveiro/pull/11, que depende do PR #10. PRs #1–#12 abertos e encadeados; não duplicar nem mesclar main sem instrução.
- Deploy appgdep_6ae6f7a6ab9881918ecf7ac1e80276ef, succeeded em 01/11/2026 08:26:27 UTC.
- Site privado https://viveiro-caos-formigueiro.everaldodev.chatgpt.site ; projeto appgprj_6ae6364bc4488191b2757449ed3f7e94. Acesso só do proprietário e zero visitantes externos confirmados antes de publicar.
- Preservar versões anteriores: 0.8.0 fonte 35296be9bc4d89b4fef1c9d9eabaad8e4ca50faa; 0.7.0 e6e4790185fab8788cccdaf35dcc8f243e397c35; 0.6.0 0aec356a9a9d3ef8cbce227dae5577dd9874a34d; 0.5.0 e149fe8944b315bbff078a4f1be7a471c3297145. Tags correspondentes preservadas.

## Implementado

5B/5C: fundação física de alados com orçamento materno, naníticas, coortes reprodutivas pagas e filhas no mesmo habitat com estoques/genética/parentesco independentes. Limites: quatro registros de colônia, 450 adultos/crias, duas frentes operárias. Documentos fundacao.md e colonias-filhas.md.

6A: perfis químicos abstratos, máscaras temporárias, reconhecimento local pelo ar, postura/recuo/dano e território conservativo. Revestimento pelo solo e infiltração exploratória com transporte de estoque real. docs/odores-e-territorio.md.

6B: pulgões por seed associados a plantas, seiva debitada, melaço/assimilação/perdas contabilizados, coleta e defesa locais. Lagartas cuco de odor compatível, transporte com apoio até o berçário, deposição e alimento debitado de doadoras próximas. Snapshot conserva estados e liga habitat comum no restore. UI com instâncias e aproximação da câmera. docs/simbioses.md. Limites: pulgões agregados, população inicial de até três lagartas; sem pupa/borboleta adulta, sem calibração por espécie. Não tratar essas estratégias combinadas como universais.

## Verificação da 0.9.0

- Suíte completa: 96 testes aprovados em 366956 ms.
- Depois: 19 testes químicos/ecológicos após ajustes de saúde/normal/carga e dez ecológicos após impedir crescimento sem seiva. Um teste novo cobre a planta esgotada; total no repositório agora 97 casos, sem alegar uma execução completa de 97.
- TypeScript e Vite finais aprovados. Módulos novos do modelo com 9–64 linhas, renderer separado.
- Transporte integrado da lagarta: 125 ticks, maior passo 0,081991 e erro máximo de apoio 0,000296.
- Navegador: seed a pausada no dia 171, duas colônias, 115 formigas; 99 pulgões em seis plantas, 16,41 u. de melaço coletadas, duas adoções e 1,51 u. cedidas às lagartas. População inicial de lagartas já terminou a vida; contadores são acumulados. Zoom, corpos/gotas e console sem erros conferidos.
- Screenshots viveiro-0.9.0-pulgoes.png e viveiro-0.9.0-relacoes.png no diretório autorizado do Codex. Chrome do usuário intocado; IAB local tab 2, Site tab 1.
- Dev foi religado no G: HTTP 200; PID atual em .runtime/dev.pid. Deixar rodando. Nenhum teste pendente.

## Cronograma ampliado pelo usuário

Material de outra IA foi registrado ao final do cronograma como etapas 9–14: perfis por espécie, fundação/selamento, desenvolvimento e diapausa, clima espacial, espermateca/longevidade e relógios de anos. Detalhes em docs/biologia-planejada.md. Commit documental 46e9d8f enviado na branch codex/cronograma-biologia-fundacao, PR #11. A 6B recebeu esse commit por fast-forward, sem colocar código 6B no PR documental.

Faixas de 12–24 h, 1–7 d, 35–60 d, 15–30 anos e alegações derivadas de 52%/68% permanecem hipóteses a validar, não timers novos. Distinguir umidade relativa de água no solo e irradiância de temperatura. Longevidade, número de parceiros e trade-offs não são universais. As referências primárias e dependências estão no documento.

## Próximo passo concreto

Criar codex/solo-granular a partir desta branch para 7A: acomodação dinâmica de terra solta com massa, gravidade, atrito/ângulo de repouso e colisão no mesmo campo implícito. Reutilizar balanço de solo e reparo sem perder volume ou introduzir saltos nos agentes. Módulos pequenos e testes conservativos; não chamar aproximação granular de geotecnia calibrada. Depois 7B umidade/capilaridade/temperatura/gases, 8 RL/persistência/avaliação e novas 9–14 em ordem das dependências.

Dados reais continuam necessários para calibração. O Site avança no navegador; não há executor contínuo em nuvem. JSON das colônias ainda repete habitat; persistência longa/compactação é etapa 8. Previsões de populações maiores são computacionalmente caras, a medir na etapa 8.

## Ambiente e publicação

Escritas atômicas e já formatadas; normalizar CRLF antes de substituições multilinha. Código em src e dist gerado pelo Vite. Usuário pediu dev ligado no G: não encerrar. Logs .runtime/ ignorados.

Push apenas da ref da entrega e tag específica: push --all já foi rejeitado por escopo amplo. Não enviar branches alheias nem mesclar main. Cada etapa tem testes, navegador, commit/push e PR sobre a base anterior.

Sites: get_site e credencial, helper de abertura no HEAD corrente antes de empacotar. Credenciais só em memória/stdin. Arquivo tar fora do checkout; G:\Projetos\viveiro-0.9.0.tar.gz já publicado. Guardar literalmente project_id/commit_sha/archive retornados. Fonte publicada é a tag, enquanto o checkpoint posterior contém os IDs do deploy.

# Continuação — entrega0.46.0 encerrada

03/11/2026. Repositório G:\Projetos\viveiro. Ler AGENTS.md/cronograma.md e
conferir Git/PRs antes de agir. Preservar saves, branches e tags.

## Concluído e publicado

PRs76–80 integrados em ordem: comunidade(CONTRIBUTING pt/en, formulários,
Discussions e tarefas73–75), galeria(dez receitas internas, filtros/idiomas/seed),
auditoria nativa(contraste A/B corrigido) e migração dos13JS de UI/renderer para
TS estrito. Não há JS restante nessas duas pastas; a simulação legada fora delas
não foi declarada convertida. Controller136linhas, scene208, módulos focados.

Suíte final474/474, nenhuma falha. Build460módulos,3 regressões novas de renderer,
4 de UI,15dirigidos e QA real de save/reset/checkpoint/restore/A-B/aula/idioma/
câmera/avanço/exportação. Manifestos Morris preservam os104hashes canônicos.
CodeQL PR80 verde, sem suprimir regra. Detalhes em arquitetura-interface.md e
validacoes/typescript-0.46.0.json.

Uma única tag/release **v0.46.0**, fonte7f4d20674206916ea443ef2f359097da5ca18731.
CFF/Zenodo preparados antes da tag; autoria/ORCID preservados. Pacote real da tag
reproduzível e verificado antes de enviá-la. Nenhum depósito manual/duplicado.
Integração GitHub–Zenodo automática; DOI da versão nova ainda não conferido.
https://github.com/albreis/viveiro/releases/tag/v0.46.0

Pages publicado pelos workflows41732963037(tag) e41733035201(main), ambos verdes:
https://viveiro.ersolucoesweb.com.br/releases/v0.46.0/
Galeria pública com10receitas;3D v0.46.0 carregado e console sem erros. Receita
solo-deslizante@1 executou300ticks; CSV/manifesto baixados iguais à CLI, em
 tests/fixtures/gallery-046/public. Recibo validacoes/release-0.46.0.json.

Site privado original atualizado, fonte2ad7611(árvore equivalente à tag); save
pausado existente carregou, sem substituir pelo cenário de QA. Audiência custom/
revisão1/um proprietário/zero externos preservada. Não atualizar Site público
antigo do ChatGPT. Público é GitHub Pages. Dev4173(PID15348) continua ativo em G.
Preview4189 preservado; não restaurar snapshots de teste sobre saves do usuário.

## Próximo passo e limites

Não há implementação pendente dentre as quatro entregas autorizadas nesta rodada.
Aguardar feedback ou dados/participação externos reais. Não fabricar contribuições,
pareceres, pilotos, métricas ou calibração para fechar o cronograma.

P4.1B exige primeira contribuição externa; P4.2B precisa de dez receitas externas
para atingir20. Docentes, participantes, hardware escolar, leitor de tela, zoom,
planilha, dados licenciados/parceria, calibração e publicação científica continuam
pendentes. PageSpeed oficial429 em03/11 21:53UTC: nenhuma nota, sem contornar a cota;
nova tentativa somente permitida após04/11 21:53:59UTC. DOI23891981 é só0.36.0.
P2.1–P2.7 publicados desde0.45.0. P2.8/P5 descartados. PR69 do usuário preservado;
PR70 consta MERGED e sua branch permanece. Não duplicar/reabrir tarefas concluídas.

Automação continuar-cronograma-do-viveiro **PAUSED**, confirmada no fechamento.
Não iniciar executor concorrente nem retomar dependências externas sem novo pedido.
Antes de3% restante da janela real de5h, push/checkpoint e parar se houver nova
execução ativa. Não contornar limites ou aprovações.


## Fechamento Lighthouse solicitado depois da0.46.0

Branch codex/lighthouse-auditoria. Lighthouse13.6.0 local oficial em Chrome156,
perfil temporário, sem API PageSpeed:97a11y/44performance desktop e100/33 móvel.
Aceite P1.6B2-L concluído. Relatórios integrais gzip e hashes em
validacoes/lighthouse-0.46.0; instruções em lighthouse.md. Sem código de produto,
sem nova tag/release/Zenodo. Dev4173 e saves preservados. Permanecem alertas
desktop(contraste do texto auxiliar de chuva e nome da marca) e otimização de
carregamento(TBT/CLS); não confundir nota Lighthouse com FPS. Antes de novos
consertos, seguir branch/PR e orçamento; esta rodada concluiu a medição pedida.

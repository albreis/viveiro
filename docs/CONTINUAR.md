# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. O usuário autorizou continuar o cronograma com retomada horária nesta conversa após limites legítimos. Automação continuar-cronograma-do-viveiro ativa; não iniciar executor concorrente nem contornar cotas/aprovações.

## Última entrega publicada — 0.10.0

- Branch codex/solo-granular; base codex/simbioses-e-mimetismo.
- Fonte d4648b88506c3fe4e9a2cd2dfe60ddb291eaacb8, tag v0.10.0.
- PR #13 https://github.com/albreis/viveiro/pull/13. PRs #1–#13 preservados e encadeados; não duplicar.
- Deploy appgdep_6ae70061e5008191bdb9dbfee64c9ffa, succeeded em 01/11/2026 09:03:43 UTC. Mesmo Site privado, acesso só do proprietário confirmado.
- Granular: agregados de terra solta com gravidade, atrito de Coulomb, contato dissipativo, grade espacial e controle/replay do repouso. Solo compacto continua implícito; depósitos externos visuais; nada calibrado. docs/granular.md.
- Suíte final completa: 103/103 em 367449 ms; TypeScript/Vite aprovados. Uma regressão de retorno foi corrigida com settleSupport também no reparo. Limpeza integral em 1688 ticks e asserção adicional de apoio dinâmico passou.
- Navegador: seed a, queda no dia 171 (0,047 u³); no dia 172,6 material acomodado e parcialmente retirado (0,025 u³). Ajuste para 20° e recarga preservaram o estado. Sem novos erros após corrigir o carregamento parcial HMR; não confundir o erro antigo de null/oninput em 08:37 com estado atual.
- Screenshots viveiro-0.10.0-terra.png e viveiro-0.10.0-bloqueio.png. IAB local tab 2 pausada no dia 172,6, duas colônias/115 formigas; view foi resetada para perspectiva pela recarga. Dev G PID 17752, porta 4173. Nenhum teste pendente.

## Entrega anterior — 0.9.0

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

Criar codex/agua-e-calor a partir da 7A para 7B1: campo tridimensional coarse de água nos poros e temperatura, independente da umidade relativa do ar. Proposta ainda NÃO implementada: grade de cerca de 20x8x13 amostras sob o relevo, fluxos conservativos locais de água (diferença de saturação/capilaridade reduzida + gravidade), chuva/infiltração e evaporação com balanço explícito, condução de calor e fonte solar exploratória. Novo controle independente de temperatura do ar; umidade atual passa a ser rotulada como relativa do ar. Amostrar o entorno das plantas e das formigas para leitura/resposta local. Evitar apresentar água nos poros como umidade do ar da câmara ou resolver inundação sem modelo.

Executar o campo global uma vez por tick/família, preferencialmente com subpassos e frequência reduzida para não tornar o ABM caro; conservar água e calor nos testes fechados, contabilizar fronteiras e manter valores finitos. Coeficientes exploratórios e perfil inicial explícitos, sem deduzir estado do solo de 52% de RH. Medir custo e incluir snapshots/replay e visualização observável. Não reexecutar 6/7A já publicadas.

Depois 7B2 gases O2/CO2 e ventilação no grafo com condutância dependente de geometria, respiração e balanços; 7C suporte estrutural; 8 RL/persistência/avaliação; novas 9–14 conforme dependências. Referências primárias já localizadas: Richards 1931 DOI 10.1063/1.1745010 (capilaridade/gravitacional, não confundir aproximação com solver completo); PMC8611346 (experimentos de ventilação/CO2 em Acromyrmex, efeitos de difusão, vento e convecção dependentes de arquitetura). Modelos e taxas precisam de dados para calibrar.

Dados reais continuam necessários para calibração. O Site avança no navegador; não há executor contínuo em nuvem. JSON das colônias ainda repete habitat; persistência longa/compactação é etapa 8. Previsões de populações maiores são computacionalmente caras, a medir na etapa 8.

## Ambiente e publicação

Escritas atômicas e já formatadas; normalizar CRLF antes de substituições multilinha. Código em src e dist gerado pelo Vite. Usuário pediu dev ligado no G: não encerrar. Logs .runtime/ ignorados.

Push apenas da ref da entrega e tag específica: push --all já foi rejeitado por escopo amplo. Não enviar branches alheias nem mesclar main. Cada etapa tem testes, navegador, commit/push e PR sobre a base anterior.

Sites: get_site e credencial, helper de abertura no HEAD corrente antes de empacotar. Credenciais só em memória/stdin. Arquivo tar fora do checkout; G:\Projetos\viveiro-0.9.0.tar.gz e G:\Projetos\viveiro-0.10.0.tar.gz já publicados. Guardar literalmente project_id/commit_sha/archive retornados. Fonte publicada é a tag, enquanto o checkpoint posterior contém os IDs do deploy.

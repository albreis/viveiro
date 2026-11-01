# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. O usuário autorizou continuar o cronograma, com retomada horária nesta conversa após limites legítimos. Automação continuar-cronograma-do-viveiro ativa; não criar executores concorrentes ou contornar cotas/aprovações.

## Última entrega publicada

- Branch codex/odores-e-territorio, base codex/colonias-filhas; versão 0.8.0.
- Fonte 35296be9bc4d89b4fef1c9d9eabaad8e4ca50faa, tag v0.8.0.
- PR #10 https://github.com/albreis/viveiro/pull/10. PRs #1–#10 abertos e encadeados, sem merge na main. Não duplicar.
- Deploy appgdep_6ae6d368c2c0819198961f76f4086562, succeeded em 01/11/2026 05:51:49 UTC.
- Site privado https://viveiro-caos-formigueiro.everaldodev.chatgpt.site ; projeto appgprj_6ae6364bc4488191b2757449ed3f7e94. Acesso só do proprietário, zero visitantes externos confirmado antes de publicar.
- Versões anteriores preservadas: 0.7.0 fonte e6e4790185fab8788cccdaf35dcc8f243e397c35; 0.6.0 fonte 0aec356a9a9d3ef8cbce227dae5577dd9874a34d; 0.5.0 fonte e149fe8944b315bbff078a4f1be7a471c3297145. Tags correspondentes preservadas.

## Implementado e validado

5B/5C: fundação física a partir de alados com orçamento materno finito; naníticas; alados pagos pelo estoque de colônias maduras; filhas no habitat compartilhado com parentesco, reservas e estoques próprios. Saída física e novas gerações conferidas. Limites: quatro registros de colônia, 450 adultos/crias e duas frentes operárias. Documentos fundacao.md e colonias-filhas.md.

6A: perfis químicos abstratos, máscaras temporárias, reconhecimento local pelo ar; intimidação, recuo apoiado e ferimentos; marca territorial conservativa; revestimento pelo solo e infiltração experimental com transferência física de alimento existente. Tratamento Odor estranho pelo usuário, anéis e legenda. Detalhes, equações e dados externos necessários em docs/odores-e-territorio.md. Não declarar química ou políticas calibradas por espécie.

- Suíte completa: 87/87 testes em 435617 ms; dez testes químicos/infiltração após ajuste final de reconhecimento também passaram.
- TypeScript e Vite aprovados; novos módulos do modelo com 29–108 linhas. Overlay não desenha células sem concentração.
- Navegador: seed a, duas colônias, dia 107,9; 20 intimidações, 14 recuos e 14 ataques espontâneos. Tratamento na operária #305 visível e registrado, primeira pessoa e retorno conferidos, console sem erros.
- Screenshot viveiro-0.8.0-encontros.png no diretório de visualizações autorizado do Codex.
- QA local pausada; dev continua ativo no G, PID 13196, porta 4173. Perfil Chrome do usuário intocado. Nenhum processo de testes pendente.

## Próximo passo concreto

Criar codex/simbioses-e-mimetismo a partir desta branch para 6B: pulgões por seed associados às plantas, produção de melaço com custo vegetal, coleta e proteção por encontros locais, lagartas com compatibilidade química, transporte real ao berçário e alimentação conservativa. Primeiro ler a biologia/transporte existentes para reutilizar apoio e rotas. Não repetir 5A/5B/5C/6A.

Referências primárias já localizadas: Herbert e Horn 2008 (PMID 19036205) mostra proteção dependente do sistema; Schifani et al. 2023 DOI 10.1111/een.13226 mostra que atendimento não garante proteção; Akino et al. 1999 PMC1690087 mostra adoção e mimetismo especializado em Maculinea rebeli/Myrmica. Não misturar estratégias de espécies como um modelo universal; documentar limites.

Depois: 7 granular/capilaridade/gases e 8 RL/persistência/avaliação. Calibração real depende de espécie e dados externos. Snapshots ainda repetem habitat no JSON das subcolônias; compactação longa é etapa 8.

## Ambiente, Git e publicação

Escritas atômicas já formatadas; normalizar CRLF antes de substituições multilinha. Módulos pequenos em src, TypeScript estrito nos novos. O usuário pediu dev continuamente ligado: não encerrar. Logs locais .runtime/ ignorados.

Push só da ref da entrega e tag específica: push --all foi rejeitado por escopo amplo. Não enviar outra branch nem mesclar main sem instrução. Cada etapa exige testes, navegador, commit/push, PR na base anterior e publicação privada.

Sites: obter get_site/credencial sem expor tokens, abrir helper no HEAD corrente antes de empacotar. Credenciais só na memória/stdin. Tar fora do checkout; 0.8.0 em G:\Projetos\viveiro-0.8.0.tar.gz já publicado. Guardar literalmente project_id/commit_sha/archive retornados. Só marcar publicada após succeeded.

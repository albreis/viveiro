# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Em implementação — P0.3/publicação por tag (0.30.0)

Branch codex/publicacao-por-tag sobre5fe41a4/#40. Main remota continua15781d2, nenhum merge novo no
fetch inicial; PRs32–40 abertos. Fonte editada apenas para rótulo real de versão, links com base de
release e pipeline de artefatos; biologia/saves/audiência inalterados.

Módulos pequenos: src/app/release-label.ts, src/modules/publication/release.ts,
scripts/build-public-release.ts e scripts/lib/release-{files,index}/public-index.ts. JSON module
habilitado no tsconfig, sem dependências novas. Exportador exige fonte limpa e path absoluto, não
aceita identidade privada, usa base /releases/v0.30.0/, espelho com marker e artefatos apenas.
Manifesto SHA de origem+hashes; tag não pode ser reescrita, releases anteriores preservadas.
Junctions/escapes/arquivos ocultos/source maps/padrões de tokens rejeitados. Sem exclusão recursiva;
staging/rename dentro do espelho. docs/publicacao-por-tag.md descreve o processo.

8 testes novos passaram (incluindo junctions sem skip);15 combinados finais em1.574 ms
(.runtime/publication-final-target.log), build310 módulos aprovado. Rótulo PROTÓTIPO v0.30.0
confirmado na IABtab4, original SEMENTE-50088/D62,5/labv5 pausado; dev G PID17752 preservado. Houve
reset do cua por browser.user indisponível; devTab foi reconectada à aba4 pelo iab. Nenhum Site
público criado/registrado, nenhum project_id novo ainda. Não alterar project_id/audiência privada.

WIP e15bd653139674e348b80f680ed64f33ac38df7b enviado. Candidato
.runtime/public-candidate-030/public gerado com310 módulos; fonte e15bd65. Vite
preview temporário4174 na sessão98236 ainda rodando. QA nativa IABtab7 concluiu versão/tag,
cena/primeira pessoa, Workers (inclusive avanço1dia), relatório e download, licenças relativas e
checkpoint/reload emD1,1 pausado. Console limpo. Tab7 está na página de licenças. Tab4
preservaoriginal62,5.

Próximo imediato: commit final/PR sobre #40, build definitivo e registrar hashes iguais ao
candidato. Publicar0.30 no Site privado e tag primeiro, antes dos metadados do Site público. Gerar
espelho definitivo ../viveiro-publico da fonte final limpa. Só depois registrar um Site
separado (manifesto ausente nesse espelho), persistir ID imediatamente, helper oficial com
credencial via stdin, salvar/publicar inicialmente privado e validar. Tornar PÚBLICO apenas o Site
novo como último passo nativo deP0.3, conforme autorização do cronograma; usar aprovações nativas
sem contorno. Verificar acesso sem login e URL por tag. Publicar também a entrega validada no mesmo
Site privado. Tag exata/metadados/cronograma só após sucesso. Reutilizar qualquer ID novo
registrado, nunca duplicar.

P0.4/CITATION/DOI externo depois, P1–P5; P5 último. Nenhum executor concorrente. Sem teste/helper em
execução, só o dev.


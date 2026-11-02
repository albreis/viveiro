# Regras deste projeto

- Cada etapa funcional deve começar em uma branch própria com prefixo codex/.
- Assim que concluir uma etapa, faça commit, push e crie ou atualize seu PR automaticamente, conforme pedido do usuário.
- Abra os PRs em ordem de dependência. Em branches encadeadas, compare com a etapa anterior para isolar o diff; após integrar a anterior, ajuste a base do próximo PR para main.
- Não duplique PRs, não crie PR para branch vazia e preserve as branches já publicadas.
- Faça commits descritivos, testes do modelo e verificação no navegador antes de integrar à main e publicar.
- Preserve as branches e tags das versões publicadas. Envie a main e a branch ao origin.
- Publique etapas concluídas no mesmo Site privado e informe ao usuário o que mudou e o que ainda falta.
- Não trate modelos simplificados como biologia ou engenharia cientificamente validadas.
- Nunca armazene tokens ou credenciais no repositório.
- Código editável em src; dist é gerado pelo Vite e não deve ser editado.
- Prefira módulos focados com aproximadamente 150–250 linhas; divida responsabilidades antes de crescer um arquivo.
- Formate TypeScript, JavaScript e CSS. Não compacte código de origem em linhas enormes.
- A navegação usa TypeScript estrito; migre módulos legados gradualmente, sem ts-nocheck.

- Nesta máquina, use G:\Projetos\viveiro como pasta de trabalho. O usuário solicitou manter o dev rodando; não encerre o servidor ao terminar uma etapa. Logs locais ficam em .runtime/, ignorado pelo Git.

## Releases e Zenodo

- Toda release publicada no GitHub dispara o webhook do Zenodo, que arquiva a tag e emite um DOI. Ele lê `.zenodo.json` (e, na falta dele, `CITATION.cff`) de dentro da tag.
- Antes de `gh release create`, confira os arquivos na tag, não na pasta: `git show vX.Y.Z:.zenodo.json` e `git show vX.Y.Z:CITATION.cff` devem trazer a versão, o commit e o link `/releases/vX.Y.Z/` dessa release. Um DOI emitido não pode ser apagado.
- Cada release pelo webhook vira nova versão do mesmo conceito (DOI de todas as versões: 10.5281/zenodo.23897336). O Zenodo cria sozinho os vínculos entre versões; não adicione `isNewVersionOf`/`isPreviousVersionOf` à mão.
- Exceção: a 0.36.0 (10.5281/zenodo.23891981) foi depositada manualmente, fora desse conceito, e está ligada à 0.40.1 (10.5281/zenodo.23897337) por relações explícitas.
- Autoria: "Viveiro contributors" com o ORCID 0009-0008-0719-8722, igual em `.zenodo.json` e `CITATION.cff`.

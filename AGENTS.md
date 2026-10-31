# Regras deste projeto

- Cada etapa funcional deve começar em uma branch própria com prefixo codex/.
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

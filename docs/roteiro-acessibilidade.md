# Roteiro de teclado e leitor de tela

Use um navegador e um leitor de tela identificados no registro. Abra o
[terrário](https://viveiro.ersolucoesweb.com.br/releases/v0.46.0/) ou a versão
indicada para o ensaio. Para ações que alterem o experimento, comece em um perfil
de navegador de teste ou exporte um checkpoint antes de iniciar.

| Percurso | O que observar |
| --- | --- |
| Tab desde o topo | Atalhos levam ao conteúdo, câmera, ambiente e dados. O foco fica visível e a ordem acompanha a leitura. |
| Ajuda e catálogo biológico | O leitor anuncia o nome do diálogo. Tab percorre seus controles. Escape fecha o diálogo e o foco volta ao acionador. |
| Tour e câmera | O título do passo é anunciado. O foco chega ao seletor de agente. Entre em primeira pessoa, use setas, saia e confira o retorno do foco. |
| Pausa, ambiente e A/B | Confira os nomes de reprodução, velocidade e intervenções. Alterne A/B e escute qual cenário ficou pressionado. Os dados do gráfico também aparecem em texto. |
| Laboratório, perfis e galeria | Abra o editor, percorra os campos e suas instruções, filtre a galeria e confira a mensagem quando a busca não retorna itens. |

Repita no idioma desejado. Registre navegador, versão, sistema, leitor,
idioma, percurso, anúncio observado, anúncio esperado e reprodução. Faça uma
passagem visual pelos ícones de câmera e pausa e pelo texto sobre a cena. O
relatório do axe reúne os seletores em `incomplete` para orientar a conferência.

A auditoria automatizada pode ser repetida com `npm run build` e
`npm run qa:a11y`. Ela usa um perfil temporário de Chrome e salva
`violations` e `incomplete` em `.runtime/axe/report.json`. Use
`VIVEIRO_QA_CHROME` para indicar outro executável Chrome e
`VIVEIRO_QA_OUTPUT` para guardar relatórios de revisões distintas.
[Documentação do axe com Playwright](https://playwright.dev/docs/accessibility-testing).

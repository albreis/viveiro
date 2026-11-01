# Persistência e recuperação — etapa 8B

A página usa carregamento e gravação assíncronos com checkpoints versionados. A versão 0.15.0 está na validação final antes da publicação. O save antigo é preservado; importação e recuperação constroem os modelos antes de trocar o estado em uso.

## Formato e estado

Checkpoint v2 guarda metadados, soma CRC e payload da sessão. Sessão lógica continua v1, compatível com saves e exportações anteriores. O payload conserva mundo, comparação, configuração inicial, intervenções e posição de replay. Metadados derivados de exportação, como a previsão apresentada, não fazem parte do estado restaurado e serão recalculados.

O habitat compartilhado é guardado uma vez por cenário quando os campos das colônias são equivalentes. Recursos, genomas, RNG, cérebros e transições individuais permanecem por colônia/agente. Campos inesperadamente diferentes são preservados. Referências só podem apontar para a lista explícita do contrato de habitat; não viram acesso arbitrário a propriedades.

CRC detecta corrupção acidental, sem autenticação ou criptografia. Validação rejeita números não finitos, estruturas excessivas, versões não suportadas, métodos importados como estado e chaves de protótipo. Arquivos de importação têm limite de 20 MB. O modelo é construído somente depois da validação.

## Banco e gravação

IndexedDB próprio da origem: stores records, index e meta. Registro, índice e ponteiro atual são gravados numa única transação; a confirmação ocorre no complete da transação. Oito registros automáticos são mantidos por rotação. Checkpoints nomeados não entram na rotação. Escritas antigas não substituem o ponteiro mais recente por ordem de criação/sequência. Isso não é um mecanismo de colaboração simultânea entre abas.

A fila serial combina apenas autosaves pendentes e conserva pedidos manuais. Estados pausados idênticos não geram novas gravações após um save confirmado. Falha do banco usa uma cópia compacta em localStorage, com status explícito. O save legado viveiro-v1 fica intocado; o fallback novo usa viveiro-v2-fallback. Dados locais ilegíveis não são apagados para criar uma sessão nova silenciosamente.

Recuperação compara banco e cópia local, tenta checkpoints anteriores e depois o legado. Quando só há dados inválidos, gravação automática fica protegida até ação explícita. A cópia de fechamento é uma tentativa síncrona de emergência; encerramento abrupto e quotas do navegador continuam limitações reais. Não executa a simulação quando a página está fechada.

## Verificação atual

Quatorze testes dirigidos passaram: compactação/futuro exato, campos pessoais e cenários, arquivos antigos, corrupção/protótipos, fila, deduplicação, fallback, recuperação, bloqueio e emergência. TypeScript/Vite aprovados. Suíte completa: 153/153 aprovados em250853ms. O driver IndexedDB real foi conferido pela interface: criação de ponto nomeado, alteração de umidade92→91 e restauração92, cópia automática do estado anterior, importação do JSON antigo e recarga. Dia267, dois formigueiros, pesos/cérebros e38ajustes da formiga selecionada foram preservados. Console sem erros. Screenshot viveiro-0.15.0-checkpoints.png.

Exportação real da seed a, tick26701, duas colônias foi preservada em .runtime/before-checkpoints-dia-267.json (ignorada pelo Git) e na pasta Downloads. O novo formato recuperou a sessão normalizada exatamente; o arquivo original permanece intacto. O original exportado tem 1.847.316 bytes e o checkpoint compacto 806.285; parte da diferença vem da formatação e de metadados derivados, além de eliminar a duplicação do habitat.

## Interface e recuperação

Criar checkpoint guarda uma cópia nomeada. A lista inclui os oito automáticos recentes e os nomeados preservados. Antes de recuperar/importar, o estado atual ganha uma cópia nomeada confirmada no banco; sem essa confirmação a recuperação não é aplicada. Um estado inicial protegido por corrupção não é tratado como um experimento válido a sobrescrever.

Importação aceita o JSON exportado anteriormente e o formato v2. A sessão recuperada inicia pausada, mantendo semente, recursos, cérebros, comparação e posição de replay. O relatório de previsão é recalculado. Datas da lista são exibidas em São Paulo.

A API síncrona anterior em state-store.ts continua intacta para compatibilidade; o controller usa session-store.ts. A ativação foi feita numa única troca de controller para evitar mistura de APIs durante HMR. Abertura lenta, indisponibilidade, quota e versões incompatíveis têm caminhos de erro. Fechamento abrupto do navegador e limpeza do perfil não possuem garantia de recuperação. Checkpoints não são uma cópia fora do dispositivo.

O fallback salva uma cópia corrente quando IndexedDB está indisponível, sem oferecer todo o histórico nomeado. O serviço serial não é um sistema de colaboração entre abas; usar várias abas com o mesmo experimento não cria edição conjunta. Execução offline continuada da simulação pertence à etapa14 e não é implementada aqui.

Próximo: atualizar o PR#18 e publicar0.15.0 no mesmo Site privado e seguir para8C (previsões, observações e desempenho).

Referência: [Mozilla — Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). O histórico local ajuda na recuperação, mas exportações continuam necessárias contra limpeza do navegador ou falha do dispositivo.

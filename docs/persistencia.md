# Persistência e recuperação — etapa 8B em andamento

O núcleo está validado, mas ainda não substitui os controles de save da página. A última entrega publicada permanece 0.14.0. A integração de abertura assíncrona, gravação, checkpoints nomeados e importação está pendente.

## Formato e estado

Checkpoint v2 guarda metadados, soma CRC e payload da sessão. Sessão lógica continua v1, compatível com saves e exportações anteriores. O payload conserva mundo, comparação, configuração inicial, intervenções e posição de replay. Metadados derivados de exportação, como a previsão apresentada, não fazem parte do estado restaurado e serão recalculados.

O habitat compartilhado é guardado uma vez por cenário quando os campos das colônias são equivalentes. Recursos, genomas, RNG, cérebros e transições individuais permanecem por colônia/agente. Campos inesperadamente diferentes são preservados. Referências só podem apontar para a lista explícita do contrato de habitat; não viram acesso arbitrário a propriedades.

CRC detecta corrupção acidental, sem autenticação ou criptografia. Validação rejeita números não finitos, estruturas excessivas, versões não suportadas, métodos importados como estado e chaves de protótipo. Arquivos de importação têm limite de 20 MB. O modelo é construído somente depois da validação.

## Banco e gravação

IndexedDB próprio da origem: stores records, index e meta. Registro, índice e ponteiro atual são gravados numa única transação; a confirmação ocorre no complete da transação. Oito registros automáticos são mantidos por rotação. Checkpoints nomeados não entram na rotação. Escritas antigas não substituem o ponteiro mais recente por ordem de criação/sequência. Isso não é um mecanismo de colaboração simultânea entre abas.

A fila serial combina apenas autosaves pendentes e conserva pedidos manuais. Estados pausados idênticos não geram novas gravações após um save confirmado. Falha do banco usa uma cópia compacta em localStorage, com status explícito. O save legado viveiro-v1 fica intocado; o fallback novo usa viveiro-v2-fallback. Dados locais ilegíveis não são apagados para criar uma sessão nova silenciosamente.

Recuperação compara banco e cópia local, tenta checkpoints anteriores e depois o legado. Quando só há dados inválidos, gravação automática fica protegida até ação explícita. A cópia de fechamento é uma tentativa síncrona de emergência; encerramento abrupto e quotas do navegador continuam limitações reais. Não executa a simulação quando a página está fechada.

## Verificação atual

Treze testes passaram: compactação/futuro exato, campos pessoais e cenários, arquivos antigos, corrupção/protótipos, fila, deduplicação, fallback, recuperação, bloqueio e emergência. TypeScript/Vite aprovados para os módulos; o driver IndexedDB ainda precisa da conferência funcional no navegador após conectar a interface.

Exportação real da seed a, tick26701, duas colônias foi preservada em .runtime/before-checkpoints-dia-267.json (ignorada pelo Git) e na pasta Downloads. O novo formato recuperou a sessão normalizada exatamente; o arquivo original permanece intacto. O original exportado tem 1.847.316 bytes e o checkpoint compacto 806.285; parte da diferença vem da formatação e de metadados derivados, além de eliminar a duplicação do habitat.

## Próximo passo

Ligar o serviço ao controller sem sobrescrever o legado, tratar carregamento assíncrono, expor criação/listagem/restauração e importação validada, testar IndexedDB real e a recuperação pela interface. Só então concluir a versão 0.15.0, tirar o PR do rascunho e publicar no Site privado.

Referência: [Mozilla — Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). O histórico local ajuda na recuperação, mas exportações continuam necessárias contra limpeza do navegador ou falha do dispositivo.

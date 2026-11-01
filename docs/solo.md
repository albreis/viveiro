# Túneis vivos — modelo exploratório

A etapa usa cápsulas de raio definido para abrir galerias gradualmente.
Operárias próximas a câmaras iniciam uma frente quando há reservas; o número
de escavadoras é limitado. Ao encher a carga, caminham até uma entrada,
atravessam a borda apoiadas e depositam a terra antes de retornar.

O balanço é: removido + erodido = carregado + depositado + solto.
As unidades são volumes internos aproximados da simulação. Sobreposições
entre cápsulas e a forma dos depósitos não são medições de mecânica dos solos.

Umidade elevada, secura e largura reduzem a integridade de forma simplificada.
O material que cai vem de uma cavidade no teto e forma uma obstrução física.
Operárias que detectam material solto o transportam para fora em várias viagens.
A intervenção "Abalar uma galeria vazia" permite reproduzir esse ciclo.
O modelo evita iniciar um colapso sobre agentes; soterramento ainda não é modelado.

A malha é atualizada em Worker e pode ficar brevemente atrás do estado físico.
As consultas de apoio usam o mesmo campo implícito. Sacudir a cabeça representa
escavação; as cargas acompanham as mandíbulas. Depósitos externos são visuais.

Testes cobrem conservação, escavação, transporte sem saltos, retorno,
recuperação completa de um bloqueio e continuidade de snapshots.
A fundação inicial permanece pré-construída nesta entrega. O primeiro buraco
será integrado à fundação claustral de novas rainhas na etapa 5.

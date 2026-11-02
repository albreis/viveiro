# Espermateca, viabilidade e parentesco

Etapa 13A, versão0.27.0. Perfil opcional generic-fertility-demo@1, revisão10, com os mecanismos da12C. Os perfis anteriores não recebem espermatecas retroativas. Núcleo em src/modules/fertility, painel próprio e quatro parâmetros no catálogo. Não é um modelo calibrado para uma espécie.

## Estado e balanços

Cada colônia possui um reservatório independente com lotes por macho. Na fundação normal ele começa vazio. O acasalamento no ar exige os dois corpos presentes na colônia, vivos, alados em voo e a menos de0,3 u.; registra o ID e uma cópia do genoma haploide do parceiro. O mesmo macho não deposita duas vezes. Depois do pouso não há recarga. Um cenário iniciado já estabelecido declara explicitamente uma suposição inicial, marcada scenario, sem inventar uma trajetória de acasalamento anterior.

Por lote: recebido = viável + usado + perdido. O modelo atribui80 créditos abstratos por acasalamento, utiliza1 por ovo fecundado e transfere a perda de viabilidade para o contador perdido. A cada intervalo, V(t+Δt) = V(t) exp(−0,0005 Δt), com Δt em dias do modelo. Não são células contadas, nem concentração, nem expectativa de vida. Alterar o reservatório não adiciona alimento ou reservas maternas.

O saldo elegível precisa ter pelo menos1 crédito num único lote. Frações residuais não são combinadas entre pais para fecundar um ovo. Os lotes elegíveis participam de uma escolha ponderada por sua capacidade viável; o sorteio usa seed e ID do embrião, sem consumir o gerador global de decisões. Só o lote escolhido é debitado.

O estado admite até8 machos realmente encontrados na mesma ocasião; os testes exercitam dois parceiros distintos em contato. O gerador atual oferece um par por coorte: não há escolha de parceiros entre colônias ou garantia de poliandria espontânea. Essa limitação não deve ser divulgada como comportamento de acasalamento completo.

## Prole e desfechos

Fêmeas herdam recombinação materna e uma cópia do macho escolhido, com as mutações limitadas já existentes. Cada ovo registra a intenção de casta, instante e pai quando fecundado. Machos intencionais não usam o reservatório. Sem capacidade elegível, a intenção de produzir uma operária ou princesa resulta em macho haploide sem cópia paterna, dentro da hipótese haplodiploide deste perfil.

Esses ovos continuam pagando o custo alimentar normal e não são marcados como naníticas. O estoque reprodutivo reservado para uma futura coorte é devolvido uma única vez quando não é possível gerar princesa. Não se atribui reserva de fundadora a um macho. Falta de novas operárias pode comprometer a colônia posteriormente, mas esgotar a espermateca não reduz imediatamente a saúde da rainha.

Colônias filhas não copiam o reservatório da mãe. Seus alados continuam sendo corpos e recursos já pagos; a nova rainha recebe o próprio estoque após seu acasalamento físico. Saves guardam lotes, genomas, perdas e contadores. Guardas conferem saldos, limites, ID paterno/ploidia, posição da prole e metadados, sem reconstruir ovos inválidos como novas fecundações.

## Fontes e limites

[Den Boer et al. (2009)](https://pubmed.ncbi.nlm.nih.gov/19710057/) investigaram uso espermático e envelhecimento em Atta colombica. Foi lido o resumo no PubMed; o texto PMC exigiu CAPTCHA e não foi acessado. [Chérasse e Aron (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6304054/) mediram viabilidade após desafio imune em Lasius niger, com resposta dependente da fase da colônia. Servem como fundamento qualitativo; não fornecem ajuste para os créditos ou a perda exponencial usados aqui.

Faltam contagens/curvas por espécie, mecanismos de manutenção/remoção de células, custo fisiológico da espermateca, armazenamento e depleção do lado dos machos, competição espermática, escolha de parceiros, regras de determinação sexual específicas e calibração evolutiva. Esta13A não implementa curvas de sobrevivência da rainha: saúde, doença, dano e longevidade ficam na13B. Relógio e longas durações ficam na14.

## Verificação

Onze testes reprodutivos cobrem contato real, recebimento único, estoque vazio antes do voo, esgotamento e prole haploide, machos intencionais, reembolso único, dois pais, conservação, perdas temporais, rejeição de dados incoerentes, custo da postura e independência de filhas. Uma geração fértil preserva o futuro numérico do perfil anterior após remover apenas identidade e novos registros explícitos; recuperação reproduz a mesma continuação.

Após incorporar as correções0.26.1/0.26.2,20/20 testes dirigidos de fertilidade, aranhas e entradas passaram. Build TypeScript/Vite de288 módulos aprovado. 260/260 testes completos em235.592 ms, log .runtime/fertility-final-suite.log. Sem dependências novas.

QA FERTILIDADE-QA,25°C/68% no ar, D17,5: um macho registrado,75,332 créditos viáveis,4 usados e0,668 perdidos; quatro ovos fecundados e saldo fechado. Tampão fechado,14 viagens de terra e176 leituras locais anteriores. Checkpoint manual-c5862e9c-4db7-43a9-81a5-9ddd931ebb10, Espermateca · primeira postura QA. Catálogo com quatro registros demonstrativos. Esses dias são do modelo, não duração natural medida. Recuperação confirmou os mesmos saldos; console sem erros. Screenshot viveiro-0.27.0-espermateca.png preservado. SEMENTE-50088/D62,5/labv5 recuperado em pausa e confirmado.

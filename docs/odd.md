# ODD do Viveiro

Especificação do contrato observado na versão 0.38.0. O terrário é um modelo
exploratório em unidades próprias, sem calibração biológica por espécie.
Esta documentação segue os sete elementos do protocolo
[ODD, atualização de 2020](https://www.jasss.org/23/2/7.html).
As páginas curtas abaixo detalham o modelo atual; propostas futuras não são
apresentadas como mecanismos já implementados.

## 1. Propósito e padrões

Explorar como decisões locais, recursos finitos e alterações ambientais produzem
trajetórias coletivas e como a informação observada afeta previsões. Permite
experimentos didáticos pela mesma seed e intervenções em ticks conhecidos.
Não estima o futuro de uma colônia real, não demonstra caos matemático pela mera
divergência e não mistura características de várias espécies como se fossem uma.

Padrões de verificação internos: conservação com fontes/saídas explícitas,
apoio dos corpos no terreno, conectividade dos túneis, persistência/replay,
resposta probabilística e diferença entre previsão e observação. Não são padrões
empíricos usados para calibração. POM, dados reservados e validação externa
continuam dependências da fase de pesquisa do cronograma.

A morfologia permanece no terrário, com lacunas quantitativas identificadas.
A parametrização individual segue o [plano K0–K6](planejamento/buhl-parametrizacao.md)
e o [registro TRACE](planejamento/buhl-trace.md). Buhl já orientou a seleção
de variantes e continua referência de desenvolvimento. Uma nova abordagem
não torna esses dados independentes, e o resultado da arena não valida o World.

## 2. Entidades, variáveis de estado e escalas

[Estados e unidades](odd/estados.md) distingue agentes, prole, colônias,
habitat compartilhado, campos e sessão. O limite atual é 450 adultos/crias no
conjunto de colônias; não se propõe representar uma população ilimitada.
Um dia do modelo tem 100 ticks. Não equivale a um dia biológico calibrado.

## 3. Visão dos processos e agendamento

[Agendamento](odd/agendamento.md) registra a ordem exata dos sistemas e o que é
atualizado sequencialmente. Intervenções registradas precedem o passo seguinte.
A renderização e a velocidade da interface não mudam o passo biológico.

## 4. Conceitos de desenho

[Conceitos](odd/conceitos.md) descreve emergência, adaptação, objetivos,
aprendizado, previsão, percepção, interação, estocasticidade, coletivos,
observação e princípios adotados. O motor conhece o habitat para fazer física;
isso não é conhecimento global liberado aos agentes.

## 5. Inicialização

[Inicialização](odd/inicializacao.md) separa fundação, ninho estabelecido,
experimento didático e restore. Perfil ausente em saves/uso legado mantém o
contrato antigo; o padrão atual da interface é explicitamente escolhido.

## 6. Dados de entrada

A mesma [página de entradas](odd/inicializacao.md) registra seed, parâmetros,
perfil versionado, receita e intervenções. Não há consulta de clima real por
tick. Referências de ar de laboratório não calibram fisiologia ou solo.

## 7. Submodelos

[Mapa de submodelos](odd/submodelos.md) reúne equações centrais, acoplamentos e
limites. A [reação-difusão](odd/reacao-difusao.md) tem domínio, discretização,
fronteiras, fontes, ordem, precisão e vetores suficientes para reimplementação
sem consultar o solver principal.

[Replicação e vetores](odd/replicacao.md) oferece uma referência autônoma por
balanços de entrada/saída em cada célula. Ela não importa a química de produção.
Comparar duas implementações pelo mesmo projeto é verificação interna, não
replicação externa ou validação científica.

## Escopo da entrega

O mapa descreve todos os blocos principais; a especificação numérica completa
nesta entrega é do campo superficial. As notas dos outros submodelos não bastam
para reconstruir todo o Viveiro sem o código. A ordem, os perfis e as constantes
fazem parte da versão: mudanças futuras precisam revisar este ODD.

Fontes editáveis ficam em docs/odd.md e docs/odd/. Páginas e downloads são
produzidos pelo Vite a partir desses mesmos arquivos, sem editar dist.

Na0.40.0, experimentos isolados adotam uma [política aritmética portátil](aritmetica-portatil.md).
O contrato nativo descrito acima permanece para o terrário e saves existentes.

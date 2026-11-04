# Medição do carregamento e da simulação

O Lighthouse mede a abertura. O ensaio de quadros mede o terrário em execução.
Os resultados e o equipamento estão no [registro de T3](validacoes/desempenho-t3.json).

## Abertura

O perfil inicial indicou uma tarefa longa após a leitura do save e mudanças
de posição no espaço do terrário. A primeira malha usa agora o worker que já
atualizava os túneis. Se o worker falhar, o cálculo local entrega a mesma
geometria. A tradução da interface começa antes da criação da cena.

As medianas abaixo vêm de três navegações frias por perfil e variante.
Os builds foram servidos localmente com o mesmo Lighthouse e Chrome,
alternando as variantes. O protocolo local está em [Lighthouse](lighthouse.md).

| Perfil | Bloqueio anterior → atual | CLS anterior → atual | LCP anterior → atual |
| --- | --- | --- | --- |
| Desktop | 3.009 → 1.207 ms | 0,118 → 0,012 | 2.405 → 1.516 ms |
| Móvel | 4.141 → 3.850 ms | 0,004 → 0,017 | 5.308 → 5.368 ms |

Os três resultados por variante mostram a variação entre navegações. O CLS
e o LCP móveis subiram na mediana. Os valores de TBT permanecem altos,
especialmente sob a configuração móvel do Lighthouse.

## Quadros durante a simulação

Use um checkout da versão que deseja medir, com Chrome instalado.

```text
npm ci
npm run build
npm run qa:motion
```

O ensaio abre um perfil temporário de navegador. Carrega Feromônios e vento,
seed AULA-v2-trilhas-vento, com 16 operárias e uma rainha no cenário A, dois
cenários em simulação e velocidade de 10×. Mede por pelo menos dez segundos
em cada perfil de desenho e registra FPS, P95 do intervalo entre quadros,
chamadas de desenho, triângulos, evolução do dia e identificação do
equipamento. Passe `-- --headed` se precisar acompanhar a execução na tela.

No Windows local, com i5-1135G7, 16 GiB e Iris Xe, a medição foi 58,6 FPS no
perfil completo e 59,7 FPS no leve. O perfil leve passou de 310.210 para
210.439 triângulos por quadro. O resultado cobre este cenário e esta máquina.
O aceite P1.1B continua ligado ao ensaio no equipamento escolar identificado.

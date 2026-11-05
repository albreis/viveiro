# Fadiga por esforço no terrário 3D

Para experimentar, selecione **Fadiga · esforço no terrário** em
**Perfil biológico** e inicie outro terrário. Ao selecionar uma operária
que já se moveu ou escavou, sua ficha mostra a prontidão para escavar.
O perfil `generic-effort-demo@1` deriva de Solo · composição e suporte
e mantém as hipóteses de material e clima dessa base. A referência do
perfil e o débito de cada operária acompanham o save e o replay.

## Regra no relógio acelerado

Um passo aceito com distância 3D `d`, desnível `Δy`, componente
vertical da normal de apoio `nᵧ` e carga normalizada `L` tem custo

```text
E_mov = 0,05 (d / 0,05) (1 + L) (1 + rampa + apoio + vento + desvio)
rampa = [1,5 max(Δy, 0) + 0,35 max(−Δy, 0)] / d
apoio = 0,35 (1 − nᵧ)
vento = 0,5 clamp(−(Δx Wₓ + Δz W𝓏) / (4d), 0, 1)
desvio = 0,35 quando a navegação desvia ou vence pressão de trânsito
```

A carga vai de zero a um, normalizada pelas capacidades de transporte.
Alimento, terra, prole, mímico e resíduos entram no cálculo. A força de
vento entra quando a operária está na superfície ou a até 0,06 unidade
abaixo dela. Só a componente contrária ao passo aumenta o custo. A
ventilação da galeria continua atuando pelo modelo separado de gases.
Uma tentativa bloqueada tem custo de 20% do passo plano de referência,
ajustado por carga e apoio. Espera sem tentativa permite recuperação.
Mudanças de nó e reposicionamentos de apoio ficam fora da conta.

Cada mordida de referência na frente, remoção de entulho ou alargamento
soma 0,3 unidade de esforço, proporcional à ação. A temperatura do ar
na superfície, a temperatura do solo próximo à galeria e a água nos poros
aos pés da formiga entram por um multiplicador:

```text
M = 1 + 0,35 clamp(|T − 24| / 16, 0, 1) + 0,35 clamp(|w − 0,45| / 0,55, 0, 1)
D_novo = min(20, D_anterior exp(−ln(2) Δticks / 150) + M E)
prontidão = 1 / (1 + D / 8)
```

A cada oportunidade normal de morder a frente, a prontidão define a
probabilidade de trabalhar. Transporte, fuga e reparo urgente continuam
disponíveis. O débito pode cair durante pausas e a rotina usa o gerador
determinístico da colônia. O custo é separado das reservas alimentares e
da saúde do agente.

## Evidência e limites

Experimentos com formigas cortadeiras mediram efeitos da inclinação no
custo de locomoção. Ensaios com outra formiga coletora mediram custo com e
sem carga. Esses estudos orientam os mecanismos, e os coeficientes acima
são hipóteses explícitas para o terrário genérico. [Holt e Askew, 2012](https://pubmed.ncbi.nlm.nih.gov/22786630/) ·
[Lighton et al., 1993](https://www.sciencedirect.com/science/article/pii/002219109400114V).

As unidades são próprias do relógio acelerado do Viveiro. Para calibrar
o modelo, são necessárias séries de esforço e repouso por indivíduo
e condições controladas de carga, inclinação, temperatura, água e ar.
A [arena plana de Buhl](buhl-microclima.md) usa um protocolo separado e
mantém seus resultados anteriores reproduzíveis.

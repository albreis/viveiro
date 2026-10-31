# Viveiro

Protótipo de terrário 3D feito em Three.js, JavaScript e HTML/CSS. Interface em português, sem servidor de dados ou chave de IA.

## Executar

Com Node.js instalado, execute `npm start` nesta pasta e abra http://127.0.0.1:4173.
Os arquivos publicados estão em `dist/`, incluindo a cópia local do Three.js 0.170.0 e sua licença. Não é necessário instalar dependências para executar. Para atualizar a biblioteca, use `npm install` e copie o build e o OrbitControls para `dist/vendor/`.

## Comportamentos

- Fundação com rainha e macho; postura, ovos, larvas, pupas e operárias.
- Exploração local, coleta, transporte de alimento, feromônios e fuga.
- Reprodução limitada por alimento e por 450 formigas e crias.
- Plantas e alimento renovável influenciados por luz e umidade.
- Aranhas caçam fora da zona de abrigo do ninho e gastam energia.
- Intervenções no solo, chuva, câmera orbital e vista superior.
- Pausa, velocidades 1×/3×/10×, persistência local e exportação JSON.
- Mesma semente e sequência de ações produzem o mesmo estado.
- Repetição reaplica as intervenções registradas no mesmo passo.
- Cenário B parte do estado atual com +1 ponto percentual de umidade.
- Previsão em Web Worker: 18 cenários, horizonte de 3 dias, intervalo P10–P90, com pequenas incertezas na luz/umidade e novas sequências aleatórias.

## Limites do modelo

100 passos = 1 dia simulado; 1× executa 10 passos por segundo. Os ciclos são intencionalmente acelerados e não correspondem aos tempos biológicos de uma espécie real. Vegetação, presas como fontes renováveis de alimento, solo e clima são simplificados. A reprodução dos predadores, genética, doenças e nutrientes completos ainda não são modelados. Comparar cenários não constitui demonstração formal de caos. As previsões referem-se ao próprio modelo; não foram calibradas contra ecossistemas reais.

## Verificação

`npm test` verifica reprodução de cenários, ciclo de vida, restauração, previsão sem efeitos sobre o estado, limites ecológicos e predação.

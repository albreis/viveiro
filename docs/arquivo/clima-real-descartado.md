# Ideia arquivada: clima real da localização (P5)

Descartada por enquanto pelo usuário em 02/11/2026. Este registro é histórico,
fora do escopo ativo e dos critérios de conclusão. Não implementar nem retomar
automaticamente; somente uma nova solicitação explícita pode reativar a ideia.

Usar o clima de um lugar e de uma data reais como cenário do terrário. O ganho é didático (estação, hemisfério, fotoperíodo e diapausa) e de engajamento. Não torna a biologia mais realista: os parâmetros das formigas continuam genéricos e devem ser apresentados como "terrário ao ar livre na sua cidade", não como simulação das formigas daquele lugar.

| Parâmetro do modelo | Dado do serviço de clima      | Conversão                                 |
| ------------------- | ----------------------------- | ----------------------------------------- |
| humidity            | umidade relativa              | direta                                    |
| temperatureC        | temperatura do ar a 2 m       | direta                                    |
| windX, windZ        | velocidade e direção do vento | decomposição nos eixos e escala do modelo |
| light               | radiação solar (W/m²)         | aproximação registrada no catálogo        |
| photoperiodHours    | duração do dia                | direta                                    |
| pulso de chuva      | precipitação                  | escala do modelo, registrada no catálogo  |

Serviço sugerido: Open-Meteo, sem chave e com arquivo histórico; conferir os termos de uso antes de qualquer uso comercial.

- P5.1 Clima inicial: ao criar o terrário, escolher "minha localização", "escolher cidade" ou "padrão"; os valores do dia viram condições iniciais, como o perfil de ar de referência. Aceite: valores brutos, convertidos, fonte, data e localização arredondada gravados no experimento.
- P5.2 Reprodutibilidade: buscar uma vez e guardar o dado, nunca o pedido; o replay usa os valores gravados e não consulta o serviço. Aceite: mesma seed e mesmos dados gravados produzem o mesmo futuro, sem rede.
- P5.3 Privacidade e acesso: permissão explícita de localização, coordenadas arredondadas ao nível de cidade, escolha manual obrigatória (navegadores escolares bloqueiam localização) e queda para o padrão sem internet, com aviso. Aceite: nenhuma coordenada exata salva ou exportada.
- P5.4 Conversões no catálogo de parâmetros como aproximações, com unidade, fonte e limites. Aceite: cada conversão visível no catálogo.
- P5.5 Série diária com dados históricos de um período fixo, seguindo o clima dia a dia. Depende da etapa 14. Aceite: série gravada no experimento e replay idêntico.
- P5.6 Temperatura e umidade do solo do serviço para inicializar a grade de água e calor. Aceite: inicialização conservativa e documentada.
- P5.7 Experimento de aula pronto: mesma seed em cidades e hemisférios diferentes na mesma data. Aceite: roteiro no guia do professor (P1.4).

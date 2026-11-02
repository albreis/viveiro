export const performanceMarkup = `
  <span class="eyebrow">DESEMPENHO</span>
  <label for="render-profile">Qualidade do desenho</label>
  <select id="render-profile">
    <option value="full">Completo</option>
    <option value="light">Leve · escola</option>
  </select>
  <p id="render-profile-note"></p>
  <p id="render-count"></p>
  <button id="measure-frames" type="button">Medir por 10 segundos</button>
  <p id="frame-report" role="status">
    Medição local; o desempenho depende do aparelho e do experimento.
  </p>
`;

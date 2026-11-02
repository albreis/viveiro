export const survivalMarkup = `<p id="survival-status" class="field-note"></p>
<label for="survival-caste">Curva de envelhecimento do modelo</label>
<select id="survival-caste">
  <option value="queen">Rainha</option>
  <option value="worker">Operária</option>
  <option value="male">Macho</option>
</select>
<svg id="survival-curve" viewBox="0 0 300 120" role="img"
  aria-label="Sobrevivência teórica condicionada somente ao envelhecimento"></svg>
<p class="field-note">Curva teórica, com alimento e sem outros riscos.
  Não é dado de campo nem previsão individual.</p>
<button id="survival-challenge" class="text-button">
  Desafio de infecção na formiga selecionada
</button>
<p class="field-note">Experimento artificial na habitante escolhida para acompanhar;
  carga e taxas sem calibração por espécie.</p>`;

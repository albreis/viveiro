export const timeMarkup = `
<div class="section-label"><span>TEMPO DO EXPERIMENTO</span><span>◷</span></div>
<label for="day-pace">Duração real de um dia a 1×</label>
<select id="day-pace">
 <option value="10">10 segundos · ritmo anterior</option>
 <option value="60">1 minuto</option>
 <option value="300">5 minutos</option>
 <option value="3600">1 hora</option>
</select>
<p id="clock-status" class="field-note"></p>
<details id="advance-details"><summary>Avançar sem renderização</summary>
 <p class="field-note">O navegador calcula os próximos dias em segundo plano. Ao fechar a página, o cálculo para. O cálculo ocorre neste dispositivo.</p>
 <label for="advance-days">Dias a avançar</label>
 <input id="advance-days" type="number" min="1" max="365" step="1" value="1"/>
 <label for="advance-budget">Limite de processamento por tentativa</label>
 <select id="advance-budget"><option value="10000">10 segundos</option><option value="30000">30 segundos</option><option value="120000">2 minutos</option></select>
 <button id="advance-start" class="text-button">Avançar dias</button>
 <button id="advance-cancel" class="text-button" disabled>Cancelar avanço</button>
 <progress id="advance-progress" value="0" max="1" aria-label="Progresso do avanço"></progress>
 <p id="advance-status" role="status" aria-live="polite">O terrário fica em pausa. Um checkpoint nomeado preserva o estado anterior. Cancelar descarta o cálculo ainda não aplicado.</p>
 <p class="field-note">Ao atingir o limite, apenas os passos concluídos são aplicados e salvos. Use Retomar para chegar ao dia solicitado. Sem avanço automático enquanto a página está fechada.</p>
</details>`;

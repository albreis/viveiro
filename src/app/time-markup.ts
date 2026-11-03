export const timeMarkup = `
<div class="section-label"><span data-i18n="interface.time.title"></span><span>◷</span></div>
<label for="day-pace" data-i18n="interface.time.duration"></label>
<select id="day-pace">
 <option value="10" data-i18n="interface.time.legacy"></option>
 <option value="60" data-i18n="interface.time.minute"></option>
 <option value="300" data-i18n="interface.time.fiveMinutes"></option>
 <option value="3600" data-i18n="interface.time.hour"></option>
</select>
<p id="clock-status" class="field-note"></p>
<details id="advance-details"><summary data-i18n="interface.advance.title"></summary>
 <p class="field-note" data-i18n="interface.advance.description"></p>
 <label for="advance-days" data-i18n="interface.advance.days"></label>
 <input id="advance-days" type="number" min="1" max="365" step="1" value="1"/>
 <label for="advance-budget" data-i18n="interface.advance.budget"></label>
 <select id="advance-budget"><option value="10000" data-i18n="interface.advance.ten"></option><option value="30000" data-i18n="interface.advance.thirty"></option><option value="120000" data-i18n="interface.advance.twoMinutes"></option></select>
 <button id="advance-start" class="text-button" data-i18n="interface.advance.run"></button>
 <button id="advance-cancel" class="text-button" disabled data-i18n="interface.advance.cancel"></button>
 <progress id="advance-progress" value="0" max="1" data-i18n-aria-label="interface.advance.progress"></progress>
 <p id="advance-status" role="status" aria-live="polite" data-i18n="interface.advance.status"></p>
 <p class="field-note" data-i18n="interface.advance.note"></p>
</details>`;

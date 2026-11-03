export const performanceMarkup = `
  <span class="eyebrow" data-i18n="interface.performance.title"></span>
  <label for="render-profile" data-i18n="interface.performance.quality"></label>
  <select id="render-profile">
    <option value="full" data-i18n="terrarium.benchmark.full"></option>
    <option value="light" data-i18n="interface.performance.light"></option>
  </select>
  <p id="render-profile-note"></p>
  <p id="render-count"></p>
  <button id="measure-frames" type="button" data-i18n="interface.performance.measure"></button>
  <p id="frame-report" role="status" data-i18n="interface.performance.note"></p>
`;

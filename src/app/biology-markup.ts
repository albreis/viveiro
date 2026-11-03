export const biologyMarkup = `<div class="section-label"><span data-i18n="interface.biology.title"></span><span>⌘</span></div>
<h2 data-i18n="interface.biology.heading"></h2>
<p id="biology-active" class="field-note"></p>
<p id="maternal-status" class="field-note" hidden></p>
<label for="biology-profile" data-i18n="interface.biology.profile"></label>
<select id="biology-profile"></select>
<p id="biology-preview" class="field-note"></p>
<p class="field-note" data-i18n="interface.biology.help"></p>
<button id="biology-open" class="text-button" data-i18n="interface.biology.open"></button>
<dialog id="biology-catalog" class="biology-catalog" aria-labelledby="biology-title">
 <div class="biology-heading"><h2 id="biology-title" data-i18n="interface.biology.catalog"></h2><button id="biology-close" data-i18n-aria-label="interface.biology.close">×</button></div>
 <p class="field-note" data-i18n="interface.biology.note"></p>
 <p id="biology-catalog-profile" class="field-note"></p>
 <p id="maternal-catalog-status" class="field-note" hidden></p>
 <label for="biology-topic" data-i18n="interface.biology.group"></label>
 <select id="biology-topic"><option value="model" data-i18n="interface.biology.model"></option><option value="maternal" data-i18n="interface.biology.maternal"></option><option value="founding" data-i18n="interface.biology.founding"></option><option value="development" data-i18n="interface.biology.development"></option><option value="seasonal" data-i18n="interface.biology.seasonal"></option><option value="survival" data-i18n="interface.biology.survival"></option><option value="fertility" data-i18n="interface.biology.fertility"></option><option value="materials" data-i18n="interface.biology.materials"></option><option value="chambers" data-i18n="interface.biology.chambers"></option><option value="semiclaustral" data-i18n="interface.biology.semiclaustral"></option><option value="study" data-i18n="interface.biology.study"></option></select>
 <ul id="biology-records"></ul>
</dialog>`;

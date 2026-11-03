export const profileEditorTemplate = `
<details id="parameter-editor"><summary><span data-i18n="profiles.title"></span></summary>
<p><span data-i18n="profiles.description"></span></p>
<form id="parameter-profile-form">
<div class="parameter-identity">
<label><span data-i18n="profiles.id"></span> <input id="profile-id" pattern="[a-z][a-z0-9-]{0,47}" value="meu-perfil" maxlength="48" required></label>
<label><span data-i18n="profiles.version"></span> <input id="profile-version" type="number" min="1" max="1000000" step="1" value="1" required></label>
<label><span data-i18n="profiles.name"></span> <input id="profile-label" value="Meu perfil de pesquisa" maxlength="80" required></label>
<label><span data-i18n="profiles.biology"></span> <select id="profile-biology"></select></label>
</div><div id="parameter-fields" class="parameter-fields"></div>
<div class="experiment-actions">
<button id="profile-from-plan" type="button"><span data-i18n="profiles.read"></span></button>
<button id="profile-apply" type="button"><span data-i18n="profiles.apply"></span></button>
<button id="profile-sweep" type="button"><span data-i18n="profiles.sweep"></span></button>
<button id="profile-save" type="button"><span data-i18n="profiles.save"></span></button>
<button id="profile-export" type="button"><span data-i18n="profiles.export"></span></button>
</div></form>
<label><span data-i18n="profiles.import"></span> <input id="profile-import" type="file" accept="application/json,.json"></label>
<label><span data-i18n="profiles.library"></span> <select id="profile-library"><option value="" data-i18n="profiles.choose"></option></select></label>
<p id="profile-status" role="status"><span data-i18n="profiles.empty"></span></p><p id="profile-error" role="alert" tabindex="-1"></p>
<p><span data-i18n="profiles.help"></span> <a href="./modelo/perfis.html" data-i18n-href="./modelo/perfis.html"><span data-i18n="profiles.link"></span></a>.</p>
</details>`;

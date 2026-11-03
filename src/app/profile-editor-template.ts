export const profileEditorTemplate = `
<details id="parameter-editor"><summary>Editar e guardar um perfil de parâmetros</summary>
<p>Catálogo de entradas v1: unidades, faixas e fontes do modelo. Somente o experimento isolado é alterado. As entradas opcionais preservam os padrões originais quando desmarcadas.</p>
<form id="parameter-profile-form">
<div class="parameter-identity">
<label>Identificador do perfil <input id="profile-id" pattern="[a-z][a-z0-9-]{0,47}" value="meu-perfil" maxlength="48" required></label>
<label>Versão do perfil <input id="profile-version" type="number" min="1" max="1000000" step="1" value="1" required></label>
<label>Nome do perfil <input id="profile-label" value="Meu perfil de pesquisa" maxlength="80" required></label>
<label>Perfil biológico <select id="profile-biology"></select></label>
</div><div id="parameter-fields" class="parameter-fields"></div>
<div class="experiment-actions">
<button id="profile-from-plan" type="button">Ler valores do plano</button>
<button id="profile-apply" type="button">Aplicar ao experimento</button>
<button id="profile-sweep" type="button">Usar na varredura</button>
<button id="profile-save" type="button">Guardar versão local</button>
<button id="profile-export" type="button">Exportar perfil</button>
</div></form>
<label>Importar perfil JSON <input id="profile-import" type="file" accept="application/json,.json"></label>
<label>Versões guardadas neste navegador <select id="profile-library"><option value="">Escolha uma versão</option></select></label>
<p id="profile-status" role="status">Nenhum perfil aplicado.</p><p id="profile-error" role="alert" tabindex="-1"></p>
<p>Uma versão guardada não é sobrescrita por outros valores. Aumente a versão para editar. Exporte um arquivo para transferir entre navegadores. <a href="./modelo/perfis.html">Reprodução e limites dos perfis</a>.</p>
</details>`;

export const biologyMarkup = `<div class="section-label"><span>PERFIL BIOLÓGICO</span><span>⌘</span></div>
<h2>De onde vêm os parâmetros.</h2>
<p id="biology-active" class="field-note"></p>
<p id="maternal-status" class="field-note" hidden></p>
<label for="biology-profile">Perfil do próximo terrário</label>
<select id="biology-profile"></select>
<p id="biology-preview" class="field-note"></p>
<p class="field-note">A escolha será usada ao criar outro terrário ou iniciar uma semente. O experimento atual continua com seu perfil.</p>
<button id="biology-open" class="text-button">Consultar parâmetros e fontes</button>
<dialog id="biology-catalog" class="biology-catalog" aria-labelledby="biology-title">
 <div class="biology-heading"><h2 id="biology-title">Parâmetros e fontes</h2><button id="biology-close" aria-label="Fechar catálogo biológico">×</button></div>
 <p class="field-note">Aproximações, hipóteses e dados de estudo têm usos diferentes. Consulte o contexto e a amostra.</p>
 <p id="biology-catalog-profile" class="field-note"></p>
 <p id="maternal-catalog-status" class="field-note" hidden></p>
 <label for="biology-topic">Grupo de parâmetros</label>
 <select id="biology-topic"><option value="model">Usados no modelo</option><option value="maternal">Reservas por nutrientes · v2+</option><option value="founding">Hipóteses de fundação</option><option value="development">Hipóteses de desenvolvimento</option><option value="seasonal">Estações e casulos</option><option value="materials">Material e compactação</option><option value="chambers">Escolha local da câmara</option><option value="semiclaustral">Coleta na fundação semiclaustral</option><option value="study">Referência de laboratório</option></select>
 <ul id="biology-records"></ul>
</dialog>`;

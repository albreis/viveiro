interface Entry {
  tag: string;
  sourceSha: string;
  url: string;
}
export function publicIndex(entries: Entry[]) {
  const latest = entries[0];
  return `<!doctype html>
<html lang="pt-BR">
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width,initial-scale=1">
 <title>Viveiro — laboratório público</title>
 <style>
 body {margin:0;background:#f1f3e9;color:#293c31;font:16px/1.6 system-ui,sans-serif}
 main {max-width:760px;margin:8vh auto;padding:28px}
 h1 {font-size:44px;letter-spacing:-2px}
 a {color:#466b36}
 .open {display:inline-block;background:#344e36;color:#f1f3e9;padding:14px 24px;border-radius:8px;text-decoration:none}
 small {display:block;color:#64735e;margin:22px 0}
 li {margin:10px 0}
 </style>
</head>
<body><main>
 <p>UM PEQUENO MUNDO</p><h1>Viveiro.</h1>
 <p>Observe um terrário de formigas, acompanhe uma habitante e experimente como pequenas mudanças alteram o futuro.</p>
 <p><a class="open" id="latest-release" href="${latest.url}">Abrir o laboratório · ${latest.tag}</a></p>
 <small>Modelo exploratório. Os parâmetros biológicos não estão calibrados por espécie.</small>
 <h2>Versões publicadas</h2>
 <ul>${entries.map((e) => '<li><a href="' + e.url + '">' + e.tag + "</a> · origem " + e.sourceSha.slice(0, 12) + "</li>").join("\n")}</ul>
 <p><a href="release-index.json">Manifestos e versões</a> · <a href="${latest.url}licencas.html">Licenças</a></p>
 <small>Os experimentos são salvos neste navegador. Para levar um experimento para outra origem, exporte e importe o JSON.</small>
</main></body></html>`;
}

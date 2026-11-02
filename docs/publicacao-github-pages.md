# Site público no GitHub Pages

Proposta para tirar o laboratório público do Sites do ChatGPT e servi-lo pelo GitHub Pages, sem depender da conta do ChatGPT. O processo de [publicação por tag](publicacao-por-tag.md) continua o mesmo: releases imutáveis em `/releases/vVERSAO/`, catálogo na raiz e manifesto `release.json` com SHA-256 de cada arquivo.

## Como funciona

- O branch `site-publico` deste repositório é o espelho (`mirror.json`, `build-static.ts` e `public/`). Ele substitui a pasta `G:\Projetos\viveiro-publico` como fonte da hospedagem.
- O workflow [`pages.yml`](../.github/workflows/pages.yml) roda ao enviar uma tag `v*` (ou manualmente, com a tag como entrada). Ele faz checkout da tag, roda `node scripts/build-public-release.ts --mirror` contra o espelho, grava a nova release no branch e publica `public/` no Pages.
- Rodar de novo a mesma tag não muda nada; tentar alterar uma tag já publicada falha, como hoje.
- Rodar manualmente com a tag vazia só republica o espelho existente.

## Requisitos

1. **Domínio próprio na raiz.** Os builds usam base absoluta `/releases/vVERSAO/`, inclusive o service worker offline. No endereço padrão `albreis.github.io/viveiro/` tudo ficaria sob `/viveiro/` e os links quebrariam. O domínio escolhido é `viveiro.ersolucoesweb.com.br`: no DNS de `ersolucoesweb.com.br`, crie o registro `CNAME viveiro → albreis.github.io`.
2. **Configurar o Pages** em Settings → Pages: origem "GitHub Actions" e Custom domain `viveiro.ersolucoesweb.com.br`, com "Enforce HTTPS" assim que o certificado sair. Para evitar que outra conta reivindique o subdomínio, verifique `ersolucoesweb.com.br` em Settings → Pages da sua conta (registro TXT).
3. **Permitir tags no ambiente** em Settings → Environments → `github-pages`: acrescente a regra de tag `v*`, senão o deploy disparado por tag é recusado. O disparo manual a partir da `main` funciona sem isso.

## Importação inicial (uma vez, no Windows)

As releases já publicadas foram geradas no Windows e têm quebras de linha CRLF nos arquivos de texto. Um rebuild no Linux produz arquivos equivalentes, mas com hashes diferentes dos manifestos publicados. Por isso a importação copia o espelho atual byte a byte, sem conversão de fim de linha:

```powershell
$espelho = "G:\Projetos\viveiro-publico"
$tmp = Join-Path $env:TEMP "viveiro-site-publico"
git clone --no-checkout https://github.com/albreis/viveiro.git $tmp
Set-Location $tmp
git checkout --orphan site-publico
git rm -rf -q .
Get-ChildItem -Force | Where-Object Name -ne ".git" | Remove-Item -Recurse -Force
Set-Content .gitattributes "* -text" -NoNewline
Copy-Item "$espelho\public" . -Recurse
Copy-Item "$espelho\mirror.json", "$espelho\build-static.ts" .
git -c core.autocrlf=false add -A
git commit -m "Importa espelho público publicado no Sites"
git ls-files  # só .gitattributes, build-static.ts, mirror.json e public/...
git push -u origin site-publico
```

Não copie `.openai/` nem `dist/` do espelho. Depois do push, rode o workflow manualmente com a tag vazia para publicar.

## Conferência antes de trocar os links

- `release-index.json`, `/releases/v0.40.1/` e `/releases/v0.40.1/release.json` respondem 200 em `https://viveiro.ersolucoesweb.com.br/`.
- O `release.json` de cada versão é idêntico ao publicado no Sites.
- Cena 3D, primeira pessoa, avanço em Worker e cache offline funcionam sob a base da tag.

Conferido em 02/11/2026: as 13 releases (v0.30.0 a v0.40.1) têm `release.json` idêntico ao do Sites, e todos os arquivos servidos no domínio novo batem com o SHA-256 do manifesto. HTTP redireciona para HTTPS.

Só depois disso troque os links em README, docs, `CITATION.cff` e `.zenodo.json`. Os registros já publicados no Zenodo citam o endereço antigo; a correção é editar os metadados lá. Mantenha o site no Sites no ar até a troca terminar.

## Diferenças em relação ao Sites

- O Pages não injeta script de detecção da Cloudflare, então os HTML servidos ficam idênticos aos do manifesto.
- As novas releases passam a ser geradas no Linux, com LF. O manifesto continua conferindo os bytes servidos, mas não reproduz bytes de uma release gerada no Windows.
- Limites do Pages: site de até 1 GB e cerca de 100 GB de tráfego por mês. Cada release ocupa cerca de 3 MB.

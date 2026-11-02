import { modelDocumentSources } from "../model-documentation/catalog.ts";
import { teachingGuides } from "../teaching/catalog.ts";
import { releaseTag, validateSourceSha } from "./release.ts";

export interface CitationMetadata {
  "cff-version": string;
  title: string;
  version: string;
  commit: string;
  "date-released": string;
  url: string;
  authors: { name: string }[];
}

// Repository-publication tests contain deliberate credential markers and local fixtures.
// The model source package retains model tests; these tooling tests stay in GitHub.
export const excludedOperationalTests = [
  "tests/deposit.test.mjs",
  "tests/deposit-archive.test.mjs",
  "tests/publication-files.test.mjs",
  "tests/publication-manifest.test.mjs",
  "tests/publication-static.test.mjs",
  "tests/fixtures/public-release.mjs",
];
export const sourceRoots = ["src", "public", "scripts", "tests"];
export const sourceFiles = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "index.html",
  "experimentos.html",
  "docs/cli.md",
  "LICENSE",
  "LICENSE-DOCS.md",
  ...modelDocumentSources,
  "docs/ensino/README.md",
  "docs/ensino/microclima-local.md",
  "docs/ensino/revisao-docente.md",
  ...teachingGuides.map((g) => "docs/ensino/" + g.slug + ".md"),
];

export function permittedSourcePath(path: string): boolean {
  if (excludedOperationalTests.includes(path)) return false;
  const parts = path.split("/");
  if (
    parts.some(
      (part) => !part || part === "." || part === ".." || part.startsWith("."),
    ) ||
    /[\\:\0\r\n]/.test(path) ||
    parts.some((part) => /^(node_modules|dist|saves?)$/i.test(part))
  )
    return false;
  return (
    sourceFiles.includes(path) ||
    (parts.length > 1 && sourceRoots.includes(parts[0]))
  );
}

/** Local consistency checks; the CFF schema is validated separately. */
export function citationMetadata(value: unknown): CitationMetadata {
  const c = value as Partial<CitationMetadata> | null;
  if (!c || c["cff-version"] !== "1.2.0" || !c.title || !c.version || !c.commit)
    throw Error("Citação incompleta.");
  releaseTag(c.version);
  validateSourceSha(c.commit);
  if (!c["date-released"] || !/^\d{4}-\d{2}-\d{2}$/.test(c["date-released"]))
    throw Error("Data da release inválida.");
  if (!c.url || !c.url.endsWith("/releases/" + releaseTag(c.version) + "/"))
    throw Error("URL não corresponde à versão citada.");
  if (!c.authors?.length || c.authors.some((author) => !author.name?.trim()))
    throw Error("Autoria verificável ausente.");
  return c as CitationMetadata;
}

export function checkDepositMetadata(
  citation: CitationMetadata,
  zenodo: Record<string, unknown>,
) {
  if (
    zenodo.version !== citation.version ||
    zenodo.title !== citation.title ||
    zenodo.upload_type !== "software" ||
    zenodo.publication_date !== citation["date-released"] ||
    JSON.stringify(zenodo.creators) !== JSON.stringify(citation.authors)
  )
    throw Error("Citação e metadados de depósito divergem.");
}

export function checkDepositBytes(bytes: Uint8Array) {
  const text = new TextDecoder().decode(bytes);
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{30,}|\bsk-proj-[A-Za-z0-9_-]{30,}/.test(
      text,
    )
  )
    throw Error("Padrão de credencial no pacote; revisar antes de gerar.");
}

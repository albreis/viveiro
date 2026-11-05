import { modelDocumentSources } from "../model-documentation/catalog.ts";
import { teachingGuides } from "../teaching/catalog.ts";
import { releaseTag, validateSourceSha } from "./release.ts";

/** CFF person: Zenodo, DataCite and ORCID match the author by these names. */
export interface CitationPerson {
  "given-names": string;
  "family-names": string;
  orcid?: string;
}
/** CFF entity, such as a group. An ORCID identifies a person, never an entity. */
export interface CitationEntity {
  name: string;
}
export type CitationAuthor = CitationPerson | CitationEntity;

export interface CitationMetadata {
  "cff-version": string;
  title: string;
  version: string;
  commit?: string;
  "date-released": string;
  url: string;
  authors: CitationAuthor[];
}

const ORCID_URL = /^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
const isPerson = (author: CitationAuthor): author is CitationPerson =>
  "family-names" in author;

function checkAuthor(value: unknown): void {
  const a = value as Record<string, unknown> | null;
  if (!a || typeof a !== "object") throw Error("Autoria verificável ausente.");
  if ("family-names" in a || "given-names" in a) {
    if (
      typeof a["given-names"] !== "string" ||
      !a["given-names"].trim() ||
      typeof a["family-names"] !== "string" ||
      !a["family-names"].trim()
    )
      throw Error("Pessoa autora precisa de prenome e sobrenome.");
    if (a.orcid !== undefined && !ORCID_URL.test(String(a.orcid)))
      throw Error(
        "ORCID deve ser a URL https://orcid.org/0000-0000-0000-0000.",
      );
    return;
  }
  if (typeof a.name !== "string" || !a.name.trim())
    throw Error("Autoria verificável ausente.");
  if ("orcid" in a)
    throw Error("ORCID identifica uma pessoa; não use em autoria coletiva.");
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
  "galeria.html",
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
  if (!c || c["cff-version"] !== "1.2.0" || !c.title || !c.version)
    throw Error("Citação incompleta.");
  releaseTag(c.version);
  if (c.commit !== undefined) validateSourceSha(c.commit);
  if (!c["date-released"] || !/^\d{4}-\d{2}-\d{2}$/.test(c["date-released"]))
    throw Error("Data da release inválida.");
  if (!c.url || !c.url.endsWith("/releases/" + releaseTag(c.version) + "/"))
    throw Error("URL não corresponde à versão citada.");
  if (!c.authors?.length) throw Error("Autoria verificável ausente.");
  c.authors.forEach(checkAuthor);
  return c as CitationMetadata;
}

// Zenodo splits "Family, Given" into a person; CFF carries the ORCID as a URL
// and Zenodo expects the bare identifier.
export function zenodoCreators(citation: CitationMetadata) {
  return citation.authors.map((author) => {
    if (!isPerson(author)) return { name: author.name };
    const name = author["family-names"] + ", " + author["given-names"];
    return author.orcid
      ? { name, orcid: author.orcid.replace("https://orcid.org/", "") }
      : { name };
  });
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
    JSON.stringify(zenodo.creators) !== JSON.stringify(zenodoCreators(citation))
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

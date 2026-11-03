import { defaultLocale, isLocale, type Locale } from "./catalogs.ts";
import { modelDocuments } from "../modules/model-documentation/catalog.ts";
import { teachingGuides } from "../modules/teaching/catalog.ts";

// Values come from owned source catalogs, never from the DOM lookup key.
const pages = [
  { path: "galeria.html", languageQuery: true, translated: false },
  { path: "index.html", languageQuery: true, translated: false },
  { path: "experimentos.html", languageQuery: true, translated: false },
  { path: "licencas.html", languageQuery: false, translated: true },
  { path: "ensino/index.html", languageQuery: false, translated: true },
  ...modelDocuments.map(({ slug }) => ({
    path: "modelo/" + slug + ".html",
    languageQuery: false,
    translated: true,
  })),
  ...teachingGuides.map(({ slug }) => ({
    path: "ensino/" + slug + ".html",
    languageQuery: false,
    translated: true,
  })),
];
const routes = new Map(pages.map((page) => [page.path, page]));
const component = (value: string) =>
  encodeURIComponent(value).replaceAll("'", "%27");

/** Only owned navigation routes may replace an href. Rejected values leave it alone. */
export function localizedLink(href: string, locale: Locale): string | null {
  if (!isLocale(locale)) return null;
  const hashAt = href.indexOf("#"),
    resource = hashAt < 0 ? href : href.slice(0, hashAt),
    questionAt = resource.indexOf("?"),
    path = questionAt < 0 ? resource : resource.slice(0, questionAt),
    route = routes.get(path.replace(/^\.\//, ""));
  if (!route) return null;

  const parameters = new URLSearchParams(
    questionAt < 0 ? "" : resource.slice(questionAt + 1),
  );
  if (route.languageQuery) parameters.set("lang", locale);
  // Encode every untrusted component; never append raw DOM query/fragment text.
  const query = [...parameters]
    .map(([name, value]) => component(name) + "=" + component(value))
    .join("&");
  let fragment = "";
  if (hashAt >= 0) {
    try {
      fragment = "#" + component(decodeURIComponent(href.slice(hashAt + 1)));
    } catch {
      return null;
    }
  }
  return (
    (href.startsWith("./") ? "./" : "") +
    (route.translated && locale !== defaultLocale ? locale + "/" : "") +
    route.path +
    (query ? "?" + query : "") +
    fragment
  );
}

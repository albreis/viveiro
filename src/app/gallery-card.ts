import { locale, t } from "../i18n/runtime.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import type { GalleryEntry, GalleryTopic } from "../modules/gallery/types.ts";
import { galleryKey, galleryPlan } from "../modules/gallery/catalog.ts";
import { resolveBiologicalProfile } from "../modules/biology/catalog.ts";
import { profileLabel } from "../i18n/biology.ts";
export const topicText = (topic: GalleryTopic) =>
  t(("gallery.topic." + topic) as MessageKey);
export const entryText = (
  item: GalleryEntry,
  field: "title" | "question" | "condition",
) => t(("gallery.entry." + item.id + "." + field) as MessageKey);
function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className = "",
) {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = className;
  return element;
}
export function galleryCard(item: GalleryEntry, urls: string[]): HTMLElement {
  const card = document.createElement("article");
  card.className = "gallery-card";
  const title = node("h2", entryText(item, "title"));
  title.id = "recipe-" + item.id + "-v" + item.version;
  card.setAttribute("aria-labelledby", title.id);
  card.append(node("p", topicText(item.topic), "gallery-topic"), title);
  card.append(node("p", entryText(item, "question"), "gallery-question"));
  card.append(node("p", entryText(item, "condition"), "gallery-condition"));
  const facts = document.createElement("dl");
  for (const [label, value] of [
    [t("gallery.seed"), item.plan.seed],
    [
      t("gallery.profile"),
      profileLabel(resolveBiologicalProfile(item.plan.biologicalProfile)),
    ],
  ])
    facts.append(node("dt", label), node("dd", value));
  card.append(
    facts,
    node(
      "p",
      t("gallery.duration", { days: item.plan.days, version: item.version }),
      "gallery-duration",
    ),
  );
  const actions = node("div", "", "gallery-actions");
  const open = node("a", t("gallery.open"));
  const parameters = new URLSearchParams({
    gallery: galleryKey(item),
    lang: locale.locale,
  });
  const destination = "./experimentos.html?" + parameters.toString();
  open.href = destination;
  open.setAttribute("data-i18n-href", destination);
  open.className = "gallery-open";
  const download = node("a", t("gallery.download"));
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(galleryPlan(item), null, 2) + "\n"], {
      type: "application/json;charset=utf-8",
    }),
  );
  urls.push(url);
  download.href = url;
  download.download = "viveiro-" + item.id + "-v" + item.version + ".json";
  actions.append(open, download);
  card.append(actions);
  const credit = node(
    "p",
    t(
      item.credit.origin === "team"
        ? "gallery.origin.team"
        : "gallery.origin.external",
    ) +
      " · " +
      item.credit.name,
    "gallery-credit",
  );
  if (item.credit.origin === "external") {
    const review = node(
      "a",
      t("gallery.review", { number: item.credit.reviewPullRequest }),
    );
    review.href =
      "https://github.com/albreis/viveiro/pull/" +
      encodeURIComponent(String(item.credit.reviewPullRequest));
    credit.append(" · ", review);
  }
  card.append(credit);
  return card;
}

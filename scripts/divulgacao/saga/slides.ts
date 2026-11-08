import { introCards } from "./intro-cards.ts";
import { resultCards } from "./result-cards.ts";
import type { Facts, Card } from "./types.ts";
export const cards = (facts: Facts): Card[] => [
  ...introCards(facts),
  ...resultCards(facts),
];

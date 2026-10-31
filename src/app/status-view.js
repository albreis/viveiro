import { drawChart as renderChart } from "./chart-view.js";
const $ = (id) => document.getElementById(id);
const format = (n) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(n);
export function renderStatus(context, updateAntCamera) {
  const { world, comparison, scenario, forecastCache, current } = context;
  const w = current,
    workers = w.workers.length,
    queen = w.ants.some((a) => a.kind === "queen"),
    male = w.ants.some((a) => a.kind === "male");
  for (const key of ["humidity", "light", "randomness"])
    if (document.activeElement !== $(key)) {
      $(key).value = world.params[key];
      $(key + "-value").textContent = world.params[key] + "%";
      $(key).style.setProperty("--range", world.params[key] + "%");
    }
  $("population").textContent = w.population;
  $("population-detail").textContent =
    (queen ? "1 rainha" : "Sem rainha") +
    (workers ? " · " + workers + " operárias" : male ? " · 1 macho" : "");
  $("brood").textContent = w.brood.length;
  $("food").replaceChildren(
    document.createTextNode(format(w.food)),
    Object.assign(document.createElement("span"), { textContent: " u." }),
  );
  $("vegetation").replaceChildren(
    document.createTextNode(w.plants.length),
    Object.assign(document.createElement("span"), { textContent: " plantas" }),
  );
  $("predators").textContent = w.predators.length;
  $("day").textContent = "Dia " + format(w.day);
  $("time-of-day").textContent =
    w.day < 1
      ? "A fundação"
      : w.workers.length === 0
        ? "O começo da colônia"
        : scenario === "b"
          ? "Cenário B · alterado"
          : "O ritmo da colônia";
  $("chart-days").textContent = format(w.day) + " DIAS";
  const list = $("events");
  list.replaceChildren();
  for (const event of w.events.slice(0, 7)) {
    const li = document.createElement("li"),
      time = document.createElement("time"),
      dot = document.createElement("span"),
      text = document.createElement("span");
    time.textContent = "D " + format(event.day);
    dot.className = "event-dot " + event.type;
    text.textContent = event.text;
    li.append(time, dot, text);
    list.append(li);
  }
  let observation;
  if (!queen)
    observation =
      "A colônia perdeu a rainha. Observe quanto tempo as operárias conseguem sobreviver.";
  else if (w.food < 2)
    observation =
      "As reservas estão baixas. Novas crias dependem do alimento que as operárias conseguirem trazer.";
  else if (w.workers.length === 0 && w.brood.length)
    observation =
      "As primeiras crias estão no ninho: " +
      w.brood.filter((b) => b.age < 0.35).length +
      " ovos, " +
      w.brood.filter((b) => b.age >= 0.35 && b.age < 0.9).length +
      " larvas e " +
      w.brood.filter((b) => b.age >= 0.9).length +
      " pupas.";
  else if (w.workers.some((a) => a.carrying))
    observation =
      "Há operárias trazendo alimento. O caminho de volta deixa pistas de feromônios para a colônia.";
  else if (w.workers.length)
    observation =
      "As operárias exploram o ambiente. Um encontro com alimento ou perigo pode mudar sua próxima decisão.";
  else
    observation =
      "A rainha prepara o ninho. O primeiro ciclo de vida está começando.";
  $("observation").textContent = observation;
  if (comparison)
    $("comparison-text").textContent =
      "B começou com +1 ponto de umidade. Agora: A " +
      world.population +
      " · B " +
      comparison.population +
      " formigas.";
  updateAntCamera(w);
  if (forecastCache && forecastCache.scenario === scenario) {
    const f = forecastCache.result;
    $("forecast-value").replaceChildren(
      document.createTextNode(
        f.low === f.high ? String(f.low) : f.low + "–" + f.high,
      ),
      Object.assign(document.createElement("span"), {
        textContent: " formigas",
      }),
    );
    $("forecast-note").textContent =
      "Intervalo P10–P90 · " +
      f.runs +
      " cenários · a partir do dia " +
      format(f.tick / 100) +
      ".";
  } else {
    $("forecast-value").innerHTML = "— <span>formigas</span>";
    $("forecast-note").textContent = "Calculando 18 futuros possíveis…";
  }
  renderChart(world, comparison);
}

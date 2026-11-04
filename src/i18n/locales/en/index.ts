import roadmap from "./roadmap.json" with { type: "json" };
import gallery from "./gallery.json" with { type: "json" };
import services from "./services.json" with { type: "json" };
import documents from "./documents.json" with { type: "json" };
import enCommon from "./common.json" with { type: "json" };
import enExperiments from "./experiments.json" with { type: "json" };
import enSweeps from "./sweeps.json" with { type: "json" };
import enProfiles from "./profiles.json" with { type: "json" };
import enValidation from "./validation.json" with { type: "json" };
import enBiology from "./biological-profiles.json" with { type: "json" };
import enTerrarium from "./terrarium.json" with { type: "json" };
import enStatus from "./status.json" with { type: "json" };
import enControls from "./controls.json" with { type: "json" };
import enPanels from "./panels.json" with { type: "json" };
import enInterface from "./interface.json" with { type: "json" };
import enExecution from "./execution.json" with { type: "json" };
import enTour from "./tour.json" with { type: "json" };
import enData from "./data-controls.json" with { type: "json" };
import enForecast from "./forecast.json" with { type: "json" };
import enCheckpoints from "./checkpoints.json" with { type: "json" };
import enLessons from "./lessons.json" with { type: "json" };
import enBiologicalParameters from "./biological-parameters.json" with { type: "json" };
import enBiologicalTerms from "./biological-terms.json" with { type: "json" };
import enStates from "./agent-states.json" with { type: "json" };
import enEvents from "./events.json" with { type: "json" };
import enScene from "./scene.json" with { type: "json" };

const messages = {
  ...roadmap,
  ...gallery,
  ...services,
  ...documents,
  ...enCommon,
  ...enExperiments,
  ...enSweeps,
  ...enProfiles,
  ...enValidation,
  ...enBiology,
  ...enTerrarium,
  ...enStatus,
  ...enControls,
  ...enPanels,
  ...enInterface,
  ...enExecution,
  ...enTour,
  ...enData,
  ...enForecast,
  ...enCheckpoints,
  ...enLessons,
  ...enBiologicalParameters,
  ...enBiologicalTerms,
  ...enStates,
  ...enEvents,
  ...enScene,
};
export default messages;

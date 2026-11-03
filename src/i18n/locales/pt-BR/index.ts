import gallery from "./gallery.json" with { type: "json" };
import services from "./services.json" with { type: "json" };
import documents from "./documents.json" with { type: "json" };
import ptCommon from "./common.json" with { type: "json" };
import ptExperiments from "./experiments.json" with { type: "json" };
import ptSweeps from "./sweeps.json" with { type: "json" };
import ptProfiles from "./profiles.json" with { type: "json" };
import ptValidation from "./validation.json" with { type: "json" };
import ptBiology from "./biological-profiles.json" with { type: "json" };
import ptTerrarium from "./terrarium.json" with { type: "json" };
import ptStatus from "./status.json" with { type: "json" };
import ptControls from "./controls.json" with { type: "json" };
import ptPanels from "./panels.json" with { type: "json" };
import ptInterface from "./interface.json" with { type: "json" };
import ptExecution from "./execution.json" with { type: "json" };
import ptTour from "./tour.json" with { type: "json" };
import ptData from "./data-controls.json" with { type: "json" };
import ptForecast from "./forecast.json" with { type: "json" };
import ptCheckpoints from "./checkpoints.json" with { type: "json" };
import ptLessons from "./lessons.json" with { type: "json" };
import ptBiologicalParameters from "./biological-parameters.json" with { type: "json" };
import ptBiologicalTerms from "./biological-terms.json" with { type: "json" };
import ptStates from "./agent-states.json" with { type: "json" };
import ptEvents from "./events.json" with { type: "json" };
import ptScene from "./scene.json" with { type: "json" };

const messages = {
  ...gallery,
  ...services,
  ...documents,
  ...ptCommon,
  ...ptExperiments,
  ...ptSweeps,
  ...ptProfiles,
  ...ptValidation,
  ...ptBiology,
  ...ptTerrarium,
  ...ptStatus,
  ...ptControls,
  ...ptPanels,
  ...ptInterface,
  ...ptExecution,
  ...ptTour,
  ...ptData,
  ...ptForecast,
  ...ptCheckpoints,
  ...ptLessons,
  ...ptBiologicalParameters,
  ...ptBiologicalTerms,
  ...ptStates,
  ...ptEvents,
  ...ptScene,
};
export default messages;

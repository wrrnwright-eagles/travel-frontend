import apiClient from "./services";

export default {
  getItinerarySteps() {
    return apiClient.get("itinerarySteps");
  },
  getItineraryStepsForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itinerarySteps");
  },
  getItineraryStepsForItineraryWithActivities(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryStepsWithActivities");
  },
  getItineraryStep(itineraryStep) {
    return apiClient.get(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id
    );
  },
  addItineraryStep(itineraryStep) {
    return apiClient.post(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps",
      itineraryStep
    );
  },
  updateItineraryStep(itineraryStep) {
    return apiClient.put(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id,
      itineraryStep
    );
  },
  deleteItineraryStep(itineraryStep) {
    return apiClient.delete(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id
    );
  },
};

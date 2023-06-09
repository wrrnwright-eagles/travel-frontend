import apiClient from "./services";

export default {
  getItineraryFlights() {
    return apiClient.get("itineraryFlights");
  },
  getItineraryFlightsForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryFlights");
  },
  getItineraryFlightsForItineraryStep(itineraryId, itineraryStepId) {
    return apiClient.get(
      "itineraries/" +
        itineraryId +
        "/itinerarySteps/" +
        itineraryStepId +
        "/itineraryFlightsWithFlights"
    );
  },
  getItineraryFlight(itineraryFlight) {
    return apiClient.get(
      "itineraries/" +
        itineraryFlight.itineraryId +
        "/itineraryFlights/" +
        itineraryFlight.id
    );
  },
  addItineraryFlight(itineraryFlight) {
    return apiClient.post(
      "itineraries/" + itineraryFlight.itineraryId + "/itineraryFlights",
      itineraryFlight
    );
  },
  updateItineraryFlight(itineraryFlight) {
    return apiClient.put(
      "itineraries/" +
        itineraryFlight.itineraryId +
        "/itineraryFlights/" +
        itineraryFlight.id,
      itineraryFlight
    );
  },
  deleteItineraryFlight(itineraryFlight) {
    return apiClient.delete(
      "itineraries/" +
        itineraryFlight.itineraryId +
        "/itineraryFlights/" +
        itineraryFlight.id
    );
  },
};
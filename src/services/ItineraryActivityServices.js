import apiClient from "./services";

export default {
  getItineraryActivities() {
    return apiClient.get("itineraryActivities");
  },
  getItineraryActivitiesForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryActivities");
  },
  getItineraryActivity(itineraryActivity) {
    return apiClient.get(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id
    );
  },
  addItineraryActivity(itineraryActivity) {
    return apiClient.post(
      "itineraries/" + itineraryActivity.itineraryId + "/itineraryActivities",
      itineraryActivity
    );
  },
  updateItineraryActivity(itineraryActivity) {
    return apiClient.put(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id,
      itineraryActivity
    );
  },
  deleteItineraryActivity(itineraryActivity) {
    return apiClient.delete(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id
    );
  },
};

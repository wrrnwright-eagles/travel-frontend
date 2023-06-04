import apiClient from "./services";

export default {
  getItineraryActivities() {
    return apiClient.get("itineraryActivities")
      .catch(error => {
        console.error('There was an error!', error.message);
      });
  },

  getItineraryActivity(itineraryActivity) {
    return apiClient.get(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id
    )
    .catch(error => {
      console.error('There was an error!', error.message);
    });
  },

getItineraryActivitiesForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryActivities")
      .catch(error => {
        console.error('There was an error!', error.message);
      });
  },

  addItineraryActivity(itineraryActivity) {
    return apiClient.post(
      "itineraries/" + itineraryActivity.itineraryId + "/itineraryActivities",
      itineraryActivity
    )
    .catch(error => {
      console.error('There was an error!', error.message);
    });
  },
  updateItineraryActivity(itineraryActivity) {
    return apiClient.put(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id,
      itineraryActivity
    )
    .catch(error => {
      console.error('There was an error!', error.message);
    });
  },
  deleteItineraryActivity(itineraryActivity) {
    return apiClient.delete(
      "itineraries/" +
        itineraryActivity.itineraryId +
        "/itineraryActivities/" +
        itineraryActivity.id
    )
    .catch(error => {
      console.error('There was an error!', error.message);
    });
  },
};


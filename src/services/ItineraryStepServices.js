import apiClient from "./services";

export default {
  getItinerarySteps() {
    return apiClient.get("itinerarySteps")
      .catch(error => {
        console.error('There was an error!', error);
      });
  },
  getItineraryStepsForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itinerarySteps/")
      .catch(error => {
        console.error('There was an error!', error);
      });
  },
  getItineraryStepsForItineraryWithActivities(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryStepsWithActivities")
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error!', error);
      throw error;
    });
  },
  getItineraryStepsForItineraryWithFlights(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryStepsWithFlights")
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error!', error);
      throw error;
    });
  },
  getItineraryStepsForItineraryWithHotels(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryStepsWithHotels")
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error!', error);
      throw error;
    });
  },
  getItineraryStep(itineraryStep) {
    return apiClient.get(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id
    )
    .catch(error => {
      console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
      console.error('There was an error!', error);
    });
  },
  addItineraryStep(itineraryStep) {
    return apiClient.post(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps",
      itineraryStep
    )
    .catch(error => {
      console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
      console.error('There was an error!', error);
    });
  },
  updateItineraryStep(itineraryStep) {
    return apiClient.put(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id,
      itineraryStep
    )
    .catch(error => {
      console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
      console.error('There was an error!', error);
    });
  },
  deleteItineraryStep(itineraryStep) {
    return apiClient.delete(
      "itineraries/" + itineraryStep.itineraryId + "/itinerarySteps/" + itineraryStep.id
    )
    .catch(error => {
      console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
      console.error('There was an error!', error);
    });
  },
};

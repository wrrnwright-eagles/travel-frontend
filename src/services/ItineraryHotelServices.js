import apiClient from "./services";

export default {
  getItineraryHotels() {
    return apiClient.get("itineraryHotels");
  },
  getItineraryHotelsForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/itineraryHotels");
  },
  getItineraryHotelsForItineraryStep(itineraryId, itineraryStepId) {
    return apiClient.get(
      "itineraries/" +
        itineraryId +
        "/itinerarySteps/" +
        itineraryStepId +
        "/itineraryHotelsWithHotels"
    );
  },
  getItineraryHotel(itineraryHotel) {
    return apiClient.get(
      "itineraries/" +
        itineraryHotel.itineraryId +
        "/itineraryHotels/" +
        itineraryHotel.id
    );
  },
  addItineraryHotel(itineraryHotel) {
    return apiClient.post(
      "itineraries/" + itineraryHotel.itineraryId + "/itineraryHotels",
      itineraryHotel
    );
  },
  updateItineraryHotel(itineraryHotel) {
    return apiClient.put(
      "itineraries/" +
        itineraryHotel.itineraryId +
        "/itineraryHotels/" +
        itineraryHotel.id,
      itineraryHotel
    );
  },
  deleteItineraryHotel(itineraryHotel) {
    return apiClient.delete(
      "itineraries/" +
        itineraryHotel.itineraryId +
        "/itineraryHotels/" +
        itineraryHotel.id
    );
  },
};

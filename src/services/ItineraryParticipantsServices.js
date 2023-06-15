import apiClient from "./services";

export default {
  getParticipants() {
    return apiClient.get("participants");
  },
  getParticipant(id) {
    return apiClient.get("participants/" + id);
  },
  addParticipant(participant) {
    return apiClient.post("participants", participant);
  },
  updateParticipant(participant) {
    return apiClient.put("participants/" + participant.id, participant);
  },
  deleteParticipant(participantId) {
    return apiClient.delete("participants/" + participantId);
  },
  getItineraryParticipantsForItinerary(itineraryId) {
    return apiClient.get("itineraries/" + itineraryId + "/participants");
  },

  
};

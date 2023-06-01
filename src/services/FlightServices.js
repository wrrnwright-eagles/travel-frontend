import apiClient from "./services";

export default {
  getFlights() {
    return apiClient.get("flights");
  },
  getFlight(id) {
    return apiClient.get("flights/" + id);
  },
  addFlight(flight) {
    return apiClient.post("flights", flight);
  },
  updateFlight(flight) {
    return apiClient.put("flights/" + flight.id, flight);
  },
  deleteFlight(flightId) {
    return apiClient.delete("flights/" + flightId);
  },
};

// test
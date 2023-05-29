import apiClient from "./services";

export default {
  getActivities() {
    return apiClient.get("activities");
  },
  getActivity(id) {
    return apiClient.get("activities/" + id);
  },
  addActivity(activity) {
    return apiClient.post("activities", activity);
  },
  updateActivity(activity) {
    return apiClient.put("activities/" + activity.id, activity);
  },
  deleteActivity(activityId) {
    return apiClient.delete("activities/" + activityId);
  },
};

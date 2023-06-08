import apiClient from "./services";

async function getUser() {
  return apiClient.get("users");
}

async function addUser(user) {
  return apiClient.post("users", user);
}

async function loginUser(user) {
  console.log(user.value); // Access the value property

  return apiClient.post("login", user.value, { // Pass user.value instead of user
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      crossDomain: true,
      Authorization: "Basic " + btoa(user.value.email + ":" + user.value.password),
    },
  });
}

async function logoutUser() {
  return apiClient.post("logout");
}

async function forgotPassword(email) {
  return apiClient.post("forgot-password", { email });
}

async function subscribeToItinerary(email, itineraryId) {
  const payload = {
    email: email,
    itineraryId: itineraryId,
  };
}

export default {
  getUser,
  addUser,
  loginUser,
  logoutUser,
  forgotPassword,
  subscribeToItinerary,
};

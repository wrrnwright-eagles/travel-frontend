<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ActivityServices from "../services/ActivityServices";
import ItineraryActivityServices from "../services/ItineraryActivityServices";
import ItineraryStepServices from "../services/ItineraryStepServices";
import ItineraryServices from "../services/ItineraryServices";
import HotelServices from "../services/HotelServices";
import FlightServices from "../services/FlightServices";
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const route = useRoute();

const itinerary = ref({});
const hotels = ref([]);
const flights = ref([]);
const isAddHotel = ref(false);
const isEditHotel = ref(false);
const isAddFlight = ref(false); // Added for Flights
const isEditFlight = ref(false);
const newHotel = ref({
  checkInDate: undefined,
  checkOutDate: undefined,
  location: undefined,
  itineraryId: undefined,
});

const newFlight = ref({ // Added for Flights
  departureDate: undefined,
  arrivalDate: undefined,
  location: undefined,
  itineraryId: undefined,
});
const activities = ref([]);
const selectedActivity = ref({});
const itineraryActivities = ref([]);
const itinerarySteps = ref([]);
const isAddActivity = ref(false);
const isEditActivity = ref(false);
const isAddStep = ref(false);
const isEditStep = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newStep = ref({
  id: undefined,
  stepNumber: undefined,
  instruction: undefined,
  itineraryId: undefined,
  itineraryActivity: [],
});
const newActivity = ref({
  id: undefined,
  quantity: undefined,
  itineraryId: undefined,
  itineraryStepId: undefined,
  activityId: undefined,
});

onMounted(async () => {
  await getItinerary();
  await getItineraryActivities();
  await getActivities();
  await getItinerarySteps();
  await getHotels();
  await getFlights();
});

async function getItinerary() {
  try {
    const response = await ItineraryServices.getItinerary(route.params.id);
    console.log(response.data);
    itinerary.value = response.data[0];
  } catch (error) {
    console.log(error);
  }
}

async function getFlights() {
  if (itinerary.value) {
    try {
      const response = await FlightServices.getFlightsForItinerary(itinerary.value.id);
      flights.value = response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

watch(itinerary, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== undefined) {
    await getItineraryActivities();
    await getItinerarySteps();
  }
}, { immediate: true });

async function updateItinerary() {
  try {
    await ItineraryServices.updateItinerary(itinerary.value.id, itinerary.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${itinerary.value.name} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getItinerary();
}

async function getActivities() {
  try {
    const response = await ActivityServices.getActivities();
    activities.value = response.data;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
}

async function getItineraryActivities() {
  console.log(itinerary.value);
  if (itinerary.value) {
    try {
      const response = await ItineraryActivityServices.getItineraryActivitiesForItinerary(itinerary.value.id);
      console.log(response.data);
      itineraryActivities.value = response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

async function addActivity() {
  isAddActivity.value = false;
  newActivity.value.itineraryId = itinerary.value.id;
  newActivity.value.activityId = selectedActivity.value.id;
  delete newActivity.value.id;
  try {
    await ItineraryActivityServices.addItineraryActivity(newActivity.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `Activity added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getItineraryActivities();
}
async function getHotels() {
  if (itinerary.value) {
    try {
      const response = await HotelServices.getHotelsForItinerary(itinerary.value.id);
      hotels.value = response.data.map((hotel) => ({
        text: hotel.location,
        value: hotel.id,
      }));
    } catch (error) {
      console.log(error);
    }
  }
}

async function updateActivity() {
  isEditActivity.value = false;
  newActivity.value.itineraryId = itinerary.value.id;
  newActivity.value.activityId = selectedActivity.value.id;
  console.log(newActivity);

  try {
    await ItineraryActivityServices.updateItineraryActivity(newActivity.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${selectedActivity.value.name} updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getItineraryActivities();
}

async function deleteActivity(activity) {
  try {
    await ItineraryActivityServices.deleteItineraryActivity(activity);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${activity.activity.name} deleted successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getItineraryActivities();
}

async function checkUpdateActivity() {
  if (newStep.value.itineraryActivity.length > 0) {
    console.log(newStep.value.itineraryActivity);
    for (let i = 0; i < newStep.value.itineraryActivity.length; i++) {
      newActivity.value.id = newStep.value.itineraryActivity[i].id;
      newActivity.value.quantity = newStep.value.itineraryActivity[i].quantity;
      newActivity.value.itineraryStepId = newStep.value.id;
      selectedActivity.value.id = newStep.value.itineraryActivity[i].activityId;
      await updateActivity();
    }
  }
}

async function getItinerarySteps() {
  try {
    const response = await ItineraryStepServices.getItineraryStepsForItineraryWithActivities(route.params.id);
    itinerarySteps.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function addHotel() {
  isAddHotel.value = false;
  newHotel.value.itineraryId = itinerary.value.id;

  await HotelServices.addHotel(newHotel.value)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Hotel added successfully!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });

  await getHotels();
}

async function addStep() {
  isAddStep.value = false;
  newStep.value.itineraryId = itinerary.value.id;
  delete newStep.value.id;
  try {
    const data = await ItineraryStepServices.addItineraryStep(newStep.value);
    newStep.value.id = data.data.id;
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `Step added successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }

  await checkUpdateActivity();
  await getItinerarySteps();
}

async function updateHotel() {
  isEditHotel.value = false;

  await HotelServices.updateHotel(newHotel.value)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Hotel updated successfully!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });

  await getHotels();
}

async function deleteHotel(hotel) {
  await HotelServices.deleteHotel(hotel)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Hotel deleted successfully!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });

  await getHotels();
}

async function updateStep() {
  isEditStep.value = false;
  try {
    await ItineraryStepServices.updateItineraryStep(newStep.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `Step updated successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }

  await checkUpdateActivity();
  await getItinerarySteps();
}

async function deleteStep(step) {
  try {
    await ItineraryStepServices.deleteItineraryStep(step);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `Step deleted successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }

  await getItinerarySteps();
}

async function deleteFlight(flight) {
  try {
    await FlightServices.deleteFlight(flight);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${flight.location} flight deleted successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }

  await getFlights();
}

async function addFlight() {
  isAddFlight.value = false;
  newFlight.value.itineraryId = itinerary.value.id;

  await FlightServices.addFlight(newFlight.value)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Flight added successfully!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });

  await getFlights();
}

async function subscribe() {
  const email = prompt("Enter your email address:");
  
  if (email) {
    try {
      // Make an API call to subscribe the user
      const response = await MySubscriptionService.subscribe(email);

      // Display a success message in the snackbar
      snackbar.value = {
        value: true,
        color: "green",
        text: response.data.message || "Subscribed successfully!",
      };
    } catch (error) {
      console.log(error);

      // Display an error message in the snackbar
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response?.data?.message || "Failed to subscribe!",
      };
    }
  }
}

async function updateFlight() {
  isEditFlight.value = false;

  await FlightServices.updateFlight(newFlight.value)
    .then(() => {
      snackbar.value = {
        value: true,
        color: "green",
        text: "Flight updated successfully!",
      };
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });

  await getFlights();
}
</script>


<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          {{ isAddStep || isEditStep ? "Edit Step" : "Edit Itinerary" }}
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="itinerary.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="itinerary.peopleToAdd"
                  label="People to Add to Trip"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="itinerary.location"
                  label="Location"
                ></v-text-field>
                <v-switch
                  v-model="itinerary.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${itinerary.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="itinerary.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="outlined" color="primary" @click="updateItinerary">
              Update Itinerary
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10">
                <v-card-title class="headline">Activities</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddActivity">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="itineraryActivity in itineraryActivities" :key="itineraryActivity.id">
                <b>{{ itineraryActivity.quantity }} {{ itineraryActivity.activity.unit }}{{ itineraryActivity.quantity > 1 ? 's' : '' }}</b>
                of {{ itineraryActivity.activity.name }} (${{ itineraryActivity.activity.pricePerUnit }}/{{ itineraryActivity.activity.unit }})
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      @click="openEditActivity(itineraryActivity)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      @click="deleteActivity(itineraryActivity)"
                    >
                      mdi-trash-can
                    </v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10">
                <v-card-title class="headline">Flights</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddFlight">Add Flight</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="flight in flights" :key="flight.id">
                <v-row>
                  <v-col>{{ flight.departureDate }}</v-col>
                  <v-col>{{ flight.arrivalDate }}</v-col>
                  <v-col>{{ flight.departureLocation }}</v-col>
                  <v-col>{{ flight.arrivalLocation }}</v-col>
                  <v-col>
                    <v-icon size="x-small" @click="openEditFlight(flight)">
                      mdi-pencil
                    </v-icon>
                  </v-col>
                  <v-col>
                    <v-icon size="x-small" @click="deleteFlight(flight)">
                      mdi-trash-can
                    </v-icon>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog persistent :model-value="isAddFlight || isEditFlight" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddFlight ? "Add Flight" : isEditFlight ? "Edit Flight" : "" }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="newFlight.departureDate"
                label="Departure Date"
                type="date"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newFlight.arrivalDate"
                label="Arrival Date"
                type="date"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="newFlight.departureLocation"
                label="Departure Location"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newFlight.arrivalLocation"
                label="Arrival Location"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="secondary"
            @click="isAddFlight ? closeAddFlight() : isEditFlight ? closeEditFlight() : false"
          >
            Close
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            @click="isAddFlight ? addFlight() : isEditFlight ? updateFlight() : false"
          >
            {{
              isAddFlight ? "Add Flight" : isEditFlight ? "Update Flight" : ""
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10">
                <v-card-title class="headline">Hotels</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddHotel">Add Hotel</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr v-for="hotel in hotels" :key="hotel.id">
                  <td>{{ hotel.checkInDate }}</td>
                  <td>{{ hotel.checkOutDate }}</td>
                  <td>{{ hotel.location }}</td>
                  <td>
                    <v-icon size="x-small" @click="openEditHotel(hotel)">
                      mdi-pencil
                    </v-icon>
                  </td>
                  <td>
                    <v-icon size="x-small" @click="deleteHotel(hotel)">
                      mdi-trash-can
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog persistent :model-value="isAddHotel || isEditHotel" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddHotel ? "Add Hotel" : isEditHotel ? "Edit Hotel" : "" }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="newHotel.checkInDate"
                label="Check-in Date"
                type="date"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newHotel.checkOutDate"
                label="Check-out Date"
                type="date"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="newHotel.location"
            label="Location"
            required
          ></v-text-field>
          <v-select
            v-model="newHotel.itineraryHotels"
            :items="hotels"
            item-text="name"
            item-value="id"
            label="Hotels"
            return-object
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="secondary"
            @click="isAddHotel ? closeAddHotel() : isEditHotel ? closeEditHotel() : false"
          >
            Close
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            @click="isAddHotel ? addHotel() : isEditHotel ? updateHotel() : false"
          >
            {{
              isAddHotel ? "Add Hotel" : isEditHotel ? "Update Hotel" : ""
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

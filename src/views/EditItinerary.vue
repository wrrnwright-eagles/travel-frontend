<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ActivityServices from "../services/ActivityServices.js";
import ItineraryActivityServices from "../services/ItineraryActivityServices.js";
import HotelServices from "../services/HotelServices.js";
import ItineraryHotelServices from "../services/ItineraryHotelServices.js";
import FlightServices from "../services/FlightServices.js";
import ItineraryFlightServices from "../services/ItineraryFlightServices.js";
import ItineraryStepServices from "../services/ItineraryStepServices.js";
import ItineraryServices from "../services/ItineraryServices.js";
import ItineraryParticipantsServices from "../services/ItineraryParticipantsServices";

const props = defineProps({
  itinerary: {
    type: Object,
    default: () => ({
      name: "",
      location: "",
      isPublished: false,
      description: "",
      participants: [],
    }),
    required: true
  },
});

const emit = defineEmits(['update:itinerary']);

const route = useRoute();
const itinerary = ref({
  name: "",
  location: "",
  isPublished: false,
  description: "",
  people: [],
});
const personToAdd = ref("");

const addParticipant = () => {
  if (personToAdd.value.trim() !== '') {
    // Ensuring 'people' is an array before pushing
    if (!Array.isArray(itinerary.value.people)) {
      itinerary.value.people = [];
    }
    itinerary.value.people.push(personToAdd.value.trim());
    personToAdd.value = '';
    emit('update:itinerary', itinerary.value);
  }
};


const activities = ref([]);
const selectedActivity = ref({});
const itineraryActivity = ref({});
const itineraryActivities = ref([]);
const isAddActivity = ref(false);
const isEditActivity = ref(false);
const flights = ref([]);
const selectedFlight = ref({});
const itineraryFlight = ref({});
const itineraryFlights = ref([]);
const isAddFlight = ref(false); // Added for Flights
const isEditFlight = ref(false);
const hotels = ref([]);
const selectedHotel = ref({});
const itineraryHotel = ref({});
const itineraryHotels = ref([]);
const isAddHotel = ref(false);
const isEditHotel = ref(false);
const itinerarySteps = ref([]);
const itineraryActivitySteps = ref([]);
const itineraryFlightSteps = ref([]);
const itineraryHotelSteps = ref([]);
const isAddStep = ref(false);
const isEditStep = ref(false);

const newHotel = ref({ // Added for Hotels
  id: undefined,
  quantity: undefined,
  itineraryId: undefined,
  itineraryStepId: undefined,
  hotelId: undefined
});

const newFlight = ref({ // Added for Flights
  id: undefined,
  quantity: undefined,
  itineraryId: undefined,
  itineraryStepId: undefined,
  flightId: undefined,
});

const newActivity = ref({ // Added for Activities
  id: undefined,
  quantity: undefined,
  itineraryId: undefined,
  activityId: undefined,
  itineraryStepId: undefined,
});

const newStep = ref({
  id: undefined,
  stepNumber: undefined,
  itineraryId: undefined,
  itineraryActivity: [],
  itineraryFlight: [],
  itineraryHotel: []
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getItinerary();
  await getActivities();
  await getFlights();
  await getHotels();
  await getItinerarySteps();
  await getItineraryActivities();
  await getItineraryFlights();
  await getItineraryHotels();
  await getItineraryActivitySteps();
  await getItineraryFlightSteps();
  await getItineraryHotelSteps();
  await getItineraryParticipants();
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

async function getItinerarySteps() {
  await ItineraryStepServices.getItinerarySteps()
  .then((response) => {
    itinerarySteps.value = response.data;
  }) 
  .catch((error) => {
    console.log(error);
  });
}

async function getItineraryActivitySteps() {
  try {
   
    const response = await ItineraryStepServices.getItineraryStepsForItineraryWithActivities(route.params.id);
    itineraryActivitySteps.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getItineraryFlightSteps() {
  try {
    
    const response = await ItineraryStepServices.getItineraryStepsForItineraryWithFlights(route.params.id);
    itineraryFlightSteps.value = response.data;
    
  } catch (error) {
    console.log(error);
  }
}

async function getItineraryHotelSteps() {
  try {
    const response = await ItineraryStepServices.getItineraryStepsForItineraryWithHotels(route.params.id);
    itineraryHotelSteps.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getItineraryParticipants() {
  try {
    const response = await ItineraryParticipantsServices.getItineraryParticipantsForItinerary(route.params.id);
    itineraryParticipants.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

// ACTIVITY FUNCTIONS
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
  await ItineraryActivityServices.getItineraryActivitiesForItinerary(route.params.id)
    .then((response) => {
      itineraryActivities.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addActivity(activity) {
  console.log("selectedActivity = " + activity.id);
  isAddActivity.value = false;
  newActivity.value.itineraryId = itinerary.value.id;
  newActivity.value.quantity = 1;
  newActivity.value.activityId = activity.id;
  console.log("newActivity = ", newActivity.value);
  delete newActivity.value.id;

  try {
    await ItineraryActivityServices.addItineraryActivity(newActivity.value)
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
    snackbar.value.text = `${itineraryActivity.activity.name} deleted successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }
  await getItineraryActivities();
}

async function checkUpdateActivity() {
  if (newStep.value.itineraryActivity) {
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

function openAddActivity() {
  newActivity.value = {
    id: undefined,
    quantity: 1,
    itineraryStepId: undefined,
    itineraryId: itinerary.value.id,
    activityId: undefined
  };
  selectedActivity.value = undefined;
  isAddActivity.value = true;
}

function openEditActivity(activity) {
  newActivity.value.id = activity.id;
  newActivity.value.quantity = activity.quantity;
  newActivity.value.itineraryStepId = activity.itineraryStepId;
  newActivity.value.activityId = activity.activityId;
  selectedActivity.value = activity.activity;
  isEditActivity.value = true;
}

function closeAddActivity() {
  isAddActivity.value = false;
}

function closeEditActivity() {
  isEditActivity.value = false;
}

// FLIGHT FUNCTIONS
async function getFlights() {
  await FlightServices.getFlights()
    .then((response) => {
      flights.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
//  if (itinerary.value) {
//    try {
//      const response = await FlightServices.getFlightsForItinerary(itinerary.value.id);
//      flights.value = response.data;
//    } catch (error) {
//      console.log(error);


async function deleteFlight(flight) {
  try {
    await FlightServices.deleteFlight(flight);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${itineraryFlight.flight.flightNumber} flight deleted successfully!`;
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  }

  await getFlights();
}

async function checkUpdateFlight() {
  if (newStep.value.itineraryFlight) {
    console.log(newStep.value.itineraryFlight);
    for (let i = 0; i < newStep.value.itineraryFlight.length; i++) {
      newFlight.value.id = newStep.value.itineraryFlight[i].id;
      newFlight.value.quantity = newStep.value.itineraryFlight[i].quantity;
      newFlight.value.itineraryStepId = newStep.value.id;
      selectedFlight.value.id = newStep.value.itineraryFlight[i].flightId;
      await updateFlight();
    }
  }
}

async function addFlight(flight) {
  console.log("selectedFlight = " + flight.id);
  isAddFlight.value = false;
  newFlight.value.quantity = 1;
  newFlight.value.itineraryId = itinerary.value.id;
  newFlight.value.flightId = flight.id;
  
  try {
    await ItineraryFlightServices.addItineraryFlight(newFlight.value);
    snackbar.value = {
      value: true,
      color: "green",
      text: "Flight added successfully!",
    };
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: error.response.data.message,
    };
  }

  await getItineraryFlights();
}

async function updateFlight() {
  isEditFlight.value = false;
  newFlight.value.itineraryId = itinerary.value.id;
  newFlight.value.flightId = selectedFlight.value.id;
  await ItineraryFlightServices.updateItineraryFlight(newFlight.value)
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

async function getItineraryFlights() {
  await ItineraryFlightServices.getItineraryFlightsForItinerary(route.params.id)
    .then((response) => {
      itineraryFlights.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function openAddFlight() {
  newFlight.value = {
    id: undefined,
    quantity: 1,
    itineraryId: itinerary.value.id,
    flightId: undefined,
    itineraryStepId: undefined
  };
  selectedFlight.value = undefined;
  isAddFlight.value = true;
}

function openEditFlight(flight) {
  newFlight.value.id = flight.id;
  newFlight.value.flightNumber = flight.flightNumber;
  newFlight.value.departureLocation = flight.departureLocation;
  newFlight.value.departureDateTime = flight.departureDateTime;
  newFlight.value.arrivalLocation = flight.arrivalLocation;
  newFlight.value.arrivalDateTime = flight.arrivalDateTime;
  newFlight.value.flightId = flight.flightId;
  selectedFlight.value = flight.flight;
  isEditFlight.value = true;
}

function closeAddFlight() {
  isAddFlight.value = false;
}


// HOTEL FUNCTIONS
async function getHotels() {
  await HotelServices.getHotels()
    .then((response) => {
      hotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
//  if (itinerary.value) {
//    try {
//      const response = await HotelServices.getHotelsForItinerary(itinerary.value.id);
//      hotels.value = response.data.map((hotel) => ({
//        text: hotel.location,
//        value: hotel.id,
//     }));
//    } catch (error) {
//      console.log(error);
//    }
//  }
}

async function addHotel(hotel) {
  console.log("selectedHotel = " + hotel.id);
  isAddHotel.value = false;
  newHotel.value.quantity = 1;
  newHotel.value.itineraryId = itinerary.value.id;
  newHotel.value.hotelId = hotel.id;
  delete newHotel.value.id;
  
  try {
    await ItineraryHotelServices.addItineraryHotel(newHotel.value);
    snackbar.value = {
      value: true,
      color: "green",
      text: "Hotel added to Itinerary successfully!",
    };
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: error.response.data.message,
    };
  }

  await getItineraryHotels();
}

async function updateHotel() {
  isEditHotel.value = false;
  newHotel.value.itineraryId = itinerary.value.id;
  newHotel.value.hotelId = selectedHotel.value.id;
  await ItineraryHotelServices.updateItineraryHotel(newHotel.value)
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
        text: `${itineraryHotel.hotel.name} deleted successfully!`,
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

async function checkUpdateHotel() {
  if (newStep.value.itineraryHotel) {
    console.log(newStep.value.itineraryHotel);
    for (let i = 0; i < newStep.value.itineraryHotel.length; i++) {
      newHotel.value.id = newStep.value.itineraryHotel[i].id;
      newHotel.value.quantity = newStep.value.itineraryHotel[i].quantity;
      newHotel.value.itineraryStepId = newStep.value.id;
      selectedHotel.value.id = newStep.value.itineraryHotel[i].hotelId;
      await updateHotel();
    }
  }
}

async function getItineraryHotels() {
  await ItineraryHotelServices.getItineraryHotelsForItinerary(route.params.id)
    .then((response) => {
      itineraryHotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function openAddHotel() {
  newHotel.value = {
    id: undefined, 
    quantity: 1, 
    itineraryStepId: undefined,
    itineraryId: itinerary.value.id,
    hotelId: undefined
  };
  selectedHotel.value = undefined;
  isAddHotel.value = true;
}

function openEditHotel(hotel) {
  newHotel.value.id = hotel.id;
  newHotel.value.name = hotel.name;
  newHotel.value.checkInDate = hotel.checkInDate;
  newHotel.value.checkOutDate = hotel.checkOutDate;
  newHotel.value.location = hotel.location;
}

function closeAddHotel() {
  isAddHotel.value = false;
}
async function addStep(step) {
  console.log("selectedStep = " + step.id);
  isAddStep.value = false;
  newStep.value.itineraryId = itinerary.value.id;
  delete newStep.value.id;
  
  try {
    const data = await ItineraryStepServices.addItineraryStep(newStep.value);
    newStep.value.id = data.data.id;
    snackbar.value = {
      value: true,
      color: "green",
      text: "Step added successfully!",
    };
  } catch (error) {
    console.log(error);
    snackbar.value = {
      value: true,
      color: "error",
      text: error.response.data.message,
    };
  }

  await checkUpdateActivity();
  await checkUpdateFlight();
  await checkUpdateHotel();
  await getItinerarySteps();
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

  try {
    await checkUpdateActivity();
  } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
  try {
  await checkUpdateFlight();
  } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
  try {
  await checkUpdateHotel();
  } catch (error) {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    }
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

function openAddStep() {
  newStep.value.id = undefined;
  newStep.value.stepNumber = undefined;
  newStep.value.itineraryActivity = [];
  newStep.value.itineraryFlight = [];
  newStep.value.itineraryHotel = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newStep.value.id = step.id;
  newStep.value.stepNumber = step.stepNumber;
  newStep.value.itineraryActivity = step.itineraryActivity;
  newStep.value.itineraryFlight = step.itineraryFlight;
  newStep.value.itineraryHotel = step.itineraryHotel;
  isEditStep.value = true;
}

function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

// SUBSCRIBE FUNCTION
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
// SNACKBAR FUNCTION
function closeSnackBar() {
  snackbar.value.value = false;
}
</script>


<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          Edit Itinerary
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
        v-model="personToAdd"
        label="People to Add to Trip"
        required
      ></v-text-field>
      <v-btn class="mb-1" color="primary" @click="addParticipant">Add</v-btn>
      <v-text-field
        v-model.number="itinerary.location"
        label="Location"
        class="mt-3"
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
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          People in Trip
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(person, index) in itinerary.people" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ person }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
            <v-table>
            </v-table>
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
            <v-card-title class="headline">Steps</v-card-title>
          </v-col>
          <v-col class="d-flex justify-end" cols="2">
            <v-btn color="accent" @click="openAddStep()">Add</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
                <tr>
                  <th class="text-left">Step number</th>
                  <th class="text-left">Step name</th>
                </tr>
            </thead>
          <tbody>
            <tr v-for="step in itinerarySteps" 
                :key="step.id" >
              <td>{{ step.stepNumber }}</td>
              <td>
                <template v-for="activityStep in itineraryActivitySteps">
                  <v-chip
                    size="small"
                    v-if="activityStep.stepNumber === step.stepNumber"
                    v-for="activity in activityStep.itineraryActivities"
                    :key="activity.id"
                  >
                    {{ activity.activity.name }}
                  </v-chip>
                </template>
                <v-chip
                  size="small"
                  v-for="flight in itineraryFlights"
                  :key="flight.id"
                  
                >
                  {{ flight.flight.flightNumber }}
                </v-chip>
                <v-chip
                  size="small"
                  v-for="hotel in itineraryHotels"
                  :key="hotel.id"
                >
                  {{ hotel.hotel.name }}
                </v-chip>
              </td>
              <td>
                <v-icon
                  size="x-small"
                  icon="mdi-pencil"
                  @click="openEditStep(step)"
                ></v-icon>
              </td>
              <td>
                <v-icon
                  size="x-small"
                  icon="mdi-trash-can"
                  @click="deleteStep(step)"
                ></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

    <v-dialog persistent :model-value="isAddStep || isEditStep" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddStep ? "Add Step" : isEditStep ? "Edit Step" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newStep.stepNumber"
            label="Number"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="newStep.itineraryActivity"
            :items="itineraryActivities"
            item-title="activity.name"
            label="Activities"
            return-object
            multiple
            chips
          ></v-select>
          <v-select
            v-model="newStep.itineraryFlight"
            :items="itineraryFlights"
            item-title="flight.flightNumber"
            label="Flights"
            return-object
            multiple
            chips
          ></v-select>
          <v-select
            v-model="newStep.itineraryHotel"
            :items="itineraryHotels"
            item-title="hotel.name"
            label="Hotels"
            return-object
            multiple
            chips
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddStep ? closeAddStep() : isEditStep ? closeEditStep() : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="isAddStep ? addStep() : isEditStep ? updateStep() : false"
            >{{
              isAddStep ? "Add Step" : isEditStep ? "Update Step" : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10">
                <v-card-title class="headline">Activities</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddActivity()">Add Activity</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Date & Time</th>
                  <th class="text-left">Location</th>
                  <th class="text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="activity in activities" :key="activity.id">
                  <td>{{ activity.name }}</td>
                  <td>{{ activity.dateTime }}</td>
                  <td>{{ activity.location }}</td>
                  <td>{{ activity.description }}</td>
                  <td>
                    <v-icon size="x-small" @click="addActivity(activity)">
                      mdi-plus
                    </v-icon>
                  </td>
                  <td>
                    <v-icon size="x-small" @click="openEditActivity(activity)">
                      mdi-pencil
                    </v-icon>
                  </td>
                  <td>
                    <v-icon size="x-small" @click="deleteActivity(activity)">
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

    <v-dialog persistent :model-value="isAddActivity || isEditActivity" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddActivity ? "Add Activity" : isEditActivity ? "Edit Activity" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newActivity.name"
            label="name"
          ></v-text-field>

          <v-text-field
            v-model="newActivity.dateTime"
            label="Date & Time"
            type="date"
          ></v-text-field>

          <v-text-field
            v-model="newActivity.location"
            label="Activity Location"
          ></v-text-field>

          <v-text-field
            v-model="newActivity.description"
            label="Description"
          ></v-text-field>
          <v-row>
            <v-select
              v-model="selectedActivity"
              :items="activities"
              item-title="name"
              label="Activities"
              return-object
              multiple
              chips
            ></v-select>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="secondary"
            @click="isAddActivity ? closeAddActivity() : isEditActivity ? closeEditActivity() : false"
          >
            Close
          </v-btn>
          <v-btn
            variant="outlined"
            color="primary"
            @click="isAddActivity ? addActivity() : isEditActivity ? updateActivity() : false"
          >
            {{
              isAddActivity ? "Add Activity" : isEditActivity ? "Update Activity" : ""
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
                <v-card-title class="headline">Flights</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddFlight">Add Flight</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Flight Number</th>
                  <th class="text-left">Depature Location</th>
                  <th class="text-left">Departure Date & Time</th>
                  <th class="text-left">Arrival Location</th>
                  <th class="text-left">Arrival Date & Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="flight in flights" :key="flight.id">
                  <td>{{ flight.flightNumber }}</td>
                  <td>{{ flight.departureLocation }}</td>
                  <td>{{ flight.departureDateTime }}</td>
                  <td>{{ flight.arrivalLocation }}</td>
                  <td>{{ flight.arrivalDateTime }}</td>
                  <td>
                    <v-icon 
                      size="x-small"
                      icon="mdi-plus"
                      @click="addFlight(flight)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon 
                      size="x-small"
                      icon="mdi-pencil" 
                      @click="openEditFlight(flight)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon 
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteFlight(flight)"
                    ></v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
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
                
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newFlight.arrivalDate"
                label="Arrival Date"
                type="date"
                
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
                
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-select
            v-model="selectedFlight"
            :items="flights"
            item-title="flightNumber"
            label="Flights"
            return-object
            multiple
            chips
          ></v-select>
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
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Check In Date</th>
                    <th class="text-left">Check Out Date</th>
                    <th class="text-left">Location</th>
                  </tr>
              </thead>
              <tbody>
                <tr v-for="hotel in hotels" :key="hotel.id">
                  <td>{{ hotel.name }}</td>
                  <td>{{ hotel.checkInDate }}</td>
                  <td>{{ hotel.checkOutDate }}</td>
                  <td>{{ hotel.location }}</td>
                  <td>
                    <v-icon size="x-small" @click="addHotel(hotel)">
                      mdi-plus
                    </v-icon>
                  </td>
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
                
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newHotel.checkOutDate"
                label="Check-out Date"
                type="date"
                
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="newHotel.location"
            label="Location"
            
          ></v-text-field>
          <v-select
            v-model="selectedHotel"
            :items="hotels"
            item-title="name"
            label="Hotels"
            return-object
            multiple
            chips
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
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

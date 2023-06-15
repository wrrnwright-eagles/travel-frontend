<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import ItineraryActivityServices from "../services/ItineraryActivityServices.js";
import ItineraryHotelServices from "../services/ItineraryHotelServices.js";
import ItineraryFlightServices from "../services/ItineraryFlightServices.js";
import ItineraryStepServices from "../services/ItineraryStepServices";
import ItineraryServices from "../services/ItineraryServices.js";
import UserServices from "../services/UserServices.js";
import DownloadCSV from "vue-json-csv";
import ItineraryParticipantsServices from "../services/ItineraryParticipantsServices.js";

const itineraryParticipants = ref([]);
const snackbar = ref(false);
const snackbarMessage = ref("");
const router = useRouter();
const showDetails = ref(false);
const itineraryActivities = ref([]);
const itineraryHotels = ref([]);
const itineraryFlights = ref([]);
const itinerarySteps = ref([]);
const user = ref(null);
const isSubscribed = ref(false);
const props = defineProps({
  itinerary: {
    required: true,
  },
});
const emit = defineEmits(['archivedItinerary']);
const csvData = ref([])

onMounted(async () => {
  await getItineraryActivities();
  await getItineraryHotels();
  await getItineraryFlights();
  await getItinerarySteps();
  await getItineraryParticipants();
  user.value = JSON.parse(localStorage.getItem("user"));
  const { itineraryActivity , ...restItenaryData } = props.itinerary;
  csvData.value = [restItenaryData]
});

async function getItineraryActivities() {
  await ItineraryActivityServices.getItineraryActivitiesForItinerary(props.itinerary.id)
    .then((response) => {
      itineraryActivities.value = response.data;
      console.log('Activities:', response.data); // Add this line
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getItineraryHotels() {
  await ItineraryHotelServices.getItineraryHotelsForItinerary(props.itinerary.id)
    .then((response) => {
      itineraryHotels.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getItineraryFlights() {
  await ItineraryFlightServices.getItineraryFlightsForItinerary(props.itinerary.id)
    .then((response) => {
      itineraryFlights.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getItineraryParticipants() {
  await ItineraryParticipantsServices.getItineraryParticipantsForItinerary(props.itinerary.id)
    .then((response) => {
      itineraryParticipants.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getItinerarySteps() {
  await ItineraryStepServices.getItineraryStepsForItinerary(props.itinerary.id)
    .then((response) => {
      itinerarySteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editItinerary", params: { id: props.itinerary.id } });
}

async function handleSubscribe() {
  try {
    if (isSubscribed.value) {
      // await UserServices.unsubscribeFromItinerary(user.value, props.itinerary.id);
      console.log('Unsubscribed from Itinerary!');
      snackbarMessage.value = 'Unsubscribed from Itinerary!';
    } else {
      await UserServices.subscribeToItinerary(user.value, props.itinerary.id);
      console.log('Subscribed to Itinerary!');
      snackbarMessage.value = 'Subscribed to Itinerary!';
    }
    isSubscribed.value = !isSubscribed.value;
    snackbar.value = true;
  } catch (error) {
    console.error(error);
    snackbarMessage.value = 'Failed to update subscription.';
    snackbar.value = true;
  }
}

async function handleArchive() {
  try {
    await ItineraryServices.archiveItinerary(props.itinerary.id);
    console.log('Archived Itinerary!');
    snackbarMessage.value = 'Archived Itinerary!';
    snackbar.value = true;
    emit('archivedItinerary', props.itinerary.id);
  } catch (error) {
    console.error(error);
    snackbarMessage.value = 'Failed to archive itinerary.';
    snackbar.value = true;
  }
}

defineExpose({ handleSubscribe, handleArchive, snackbar, snackbarMessage, isSubscribed });
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ itinerary && itinerary.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ itinerary && itinerary.subscribers }} Subscribers
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ itinerary && itinerary.location }} Location
          </v-chip>
        </v-col>
        <v-col class="d-flex flex-column align-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click.stop="navigateToEdit()"
          ></v-icon>
          <v-btn
            v-if="user !== null"
            color="primary"
            @click.stop="handleSubscribe()"
            class="mt-2"
          >
            {{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}
          </v-btn>
          <v-btn
            v-if="user !== null"
            color="primary"
            @click.stop="handleArchive()"
            class="mt-2"
          >
            Archive
          </v-btn>
            <div class="text-center" style="margin:10px 0">
        <v-btn
          append-icon="mdi-download"
          color="yellow"
        >
        <DownloadCSV :data="csvData" name="itenary-data.csv">
            Export
          </DownloadCSV>
        </v-btn>
      </div>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ itinerary && itinerary.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Activities</h3>
<v-list>
  <v-list-item
    v-for="activity in itineraryActivities"
    :key="activity.id"
  >
    {{ activity.activity.name }} - {{ activity.activity.date }} - {{ activity.activity.location }} - {{ activity.activity.description }}
  </v-list-item>
</v-list>
        <h3>Flights</h3>
<v-list>
  <v-list-item
    v-for="flight in itineraryFlights"
    :key="flight.id"
  >
    {{ flight.flight.flightNumber }}: {{ flight.flight.departureLocation }} - {{ flight.flight.departureDateTime }} to {{ flight.flight.arrivalLocation }} - {{ flight.flight.arrivalDateTime }}
  </v-list-item>
</v-list>

<h3>Hotels</h3>
<v-list>
  <v-list-item
    v-for="hotel in itineraryHotels"
    :key="hotel.id"
  >
    {{ hotel.hotel.name }} - Check-in: {{ hotel.hotel.checkInDate }} - Check-out: {{ hotel.hotel.checkOutDate }} - Location: {{ hotel.hotel.location }}
  </v-list-item>
</v-list>
<h3>Trip Details</h3>
<h4>Participants</h4>
<v-list>
  <v-list-item
    v-for="participant in itineraryParticipants"
    :key="participant.id"
  >
    {{ participant.name }}
  </v-list-item>
</v-list>
  <tbody>
    <tr v-for="step in itinerarySteps" :key="step.id">
      <td>{{ step.step.stepNumber }}</td>
      <td>{{ step.step.instruction }}</td>
      <td>
        <v-chip
          size="small"
          v-for="activity in step.step.itineraryActivity"
          :key="activity.id"
          pill
        >{{ activity.activity.name }}</v-chip
        >
      </td>
    </tr>
  </tbody>

      </v-card-text>
    </v-expand-transition>
  </v-card>
  
  <!-- Snackbar -->
  <v-snackbar
    v-model="snackbar"
    :color="isSubscribed ? 'success' : 'error'"
    top
  >
    {{ snackbarMessage }}
    <v-btn color="white" text @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>

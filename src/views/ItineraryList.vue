<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ItineraryCard from "../components/ItineraryCardComponent.vue";
import ItineraryServices from "../services/ItineraryServices.js";

const itineraries = ref([]);
const isAdd = ref(false);
const user = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newItinerary = ref({
  name: "",
  description: "",
  hotel: "",
  flight: "",
  startDate: "",
  endDate: "",
  isPublished: false,
});

onMounted(async () => {
  await getItineraries();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getItineraries() {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null) {
    await ItineraryServices.getItinerariesByUserId(user.value.id)
      .then((response) => {
        itineraries.value = response.data; // corrected here
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await ItineraryServices.getItineraries()
      .then((response) => {
        itineraries.value = response.data; // corrected here
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}


async function addItinerary() {
  isAdd.value = false;
  newItinerary.value.userId = user.value.id;
  await ItineraryServices.addItinerary(newItinerary.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newItinerary.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItineraries();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Itineraries
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="3">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            > Add Itinerary </v-btn>
        </v-col>
      </v-row>

      <ItineraryCard
        v-for="itinerary in itineraries"
        :key="itineraries.id"
        :itinerary="itinerary"
        @deletedList="getLists()"
      />

      <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add Itinerary </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newItinerary.name"
              label="Itinerary Name"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newItinerary.description"
              label="Description"
              required
            ></v-text-field>
            <v-switch
              v-model="newItinerary.isPublished"
              hide-details
              inset
              :label="`Publish? ${newItinerary.isPublished ? 'Yes' : 'No'}`"
            ></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addItinerary()"
              >Add Itinerary</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

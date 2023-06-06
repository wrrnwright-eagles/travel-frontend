<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ItineraryActivityServices from "../services/ItineraryActivityServices.js";
import ItineraryStepServices from "../services/ItineraryStepServices";
import UserServices from "../services/UserServices.js";


const router = useRouter();

const showDetails = ref(false);
const itineraryActivities = ref([]);
const itinerarySteps = ref([]);
const user = ref(null);

const props = defineProps({
  itinerary: {
    required: true,
  },
});

onMounted(async () => {
  await getItineraryActivities();
  await getItinerarySteps();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getItineraryActivities() {
  await ItineraryActivityServices.getItineraryActivitiesForItinerary(props.itinerary.id)
    .then((response) => {
      itineraryActivities.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}



async function getItinerarySteps() {
  await ItineraryStepServices.getItineraryStepsForItinerary(
    props.itinerary.id
  )
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
    await UserServices.subscribeToItinerary(user.value, props.itinerary.id);
    console.log('Subscribed to Itinerary!');
  } catch (error) {
    console.error(error);
  }
}

// Expose handleSubscribe to the template
defineExpose({ handleSubscribe });

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
      <!-- New subscribe button with mt-2 class for margin-top -->
      <v-btn
        v-if="user !== null"
        color="primary"
        @click.stop="handleSubscribe()"
        class="mt-2"
      >
        Subscribe
      </v-btn>
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
            v-for="itineraryActivity in itineraryActivities"
            :key="itineraryActivity.id"
          >
            <b
              >{{ itineraryActivity.quantity }}
              {{
                `${itineraryActivity.activity.unit}${
                  itineraryActivity.quantity > 1 ? "s" : ""
                }`
              }}</b
            >
            of {{ itineraryActivity.activity.name }} (${{
              itineraryActivity.activity.pricePerUnit
            }}/{{ itineraryActivity.activity.unit }})
          </v-list-item>
        </v-list>
        <h3>Trip Details</h3>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Location</th>
              <th class="text-left">Dates</th>
              <th class="text-left">Activities</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="step in itinerarySteps" :key="step.id">
              <td>{{ step.stepNumber }}</td>
              <td>{{ step.instruction }}</td>
              <td>
                <v-chip
                  size="small"
                  v-for="activity in step.itineraryActivity"
                  :key="activity.id"
                  pill
                  >{{ activity.activity.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

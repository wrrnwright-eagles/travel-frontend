<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ActivityServices from "../services/ActivityServices.js";
import ItineraryActivityServices from "../services/ItineraryActivityServices";
import ItineraryStepServices from "../services/ItineraryStepServices";
import ItineraryServices from "../services/ItineraryServices";
import { watch } from 'vue';
import { defineProps } from 'vue'


const route = useRoute();

const itinerary = ref({});
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
});

async function getItinerary() {
  await ItineraryServices.getItinerary(route.params.id)
    .then((response) => {
      console.log(response.data);
      itinerary.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

watch(itinerary, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== undefined) {
    await getItineraryActivities();
    await getItinerarySteps();
  }
}, { immediate: true });

async function updateItinerary() {
  await ItineraryServices.updateItinerary(itinerary.value.id, itinerary.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${itinerary.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItinerary();
}

async function getActivities() {
  await ActivityServices.getActivities()
    .then((response) => {
      activities.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getItineraryActivities() {
  console.log(itinerary.value);
  if (itinerary.value) {
    await ItineraryActivityServices.getItineraryActivitiesForItinerary(itinerary.value.id)
    .then((response) => {
      console.log(response.data);
      ItineraryActivities.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

async function addActivity() {
  isAddActivity.value = false;
  newActivity.value.itineraryId = itinerary.value.id;
  newActivity.value.activityId = selectedActivity.value.id;
  delete newActivity.value.id;
  await ItineraryActivityServices.addItineraryActivity(newActivity.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Activity added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItineraryActivities();
}

async function updateActivity() {
  isEditActivity.value = false;
  newActivity.value.itineraryId = itinerary.value.id;
  newActivity.value.ActivityId = selectedActivity.value.id;
  console.log(newActivity);

  await ItineraryActivityServices.updateItineraryActivity(newActivity.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedActivity.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItineraryActivities();
}

async function deleteActivity(activity) {
  await ItineraryActivityServices.deleteItineraryActivity(activity)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${activity.activity.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItineraryActivities();
}

async function checkUpdateActivity() {
  if (newStep.value.itineraryActivity.length > 0) {
    console.log(newStep.value.itineraryActivity);
    for (let i = 0; i < newStep.value.itineraryActivity.length; i++) {
      newActivity.value.id = newStep.value.itineraryActivity[i].id;
      newActivity.value.quantity = newStep.value.itineraryActivity[i].quantity;
      newActivity.value.itineraryStepId = newStep.value.id;
      selectedActivity.value.id =
        newStep.value.itineraryActivity[i].activityId;
      await updateActivity();
    }
  }
}

async function getItinerarySteps() {
  await ItineraryStepServices.getItineraryStepsForItineraryWithActivities(
    route.params.id
  )
    .then((response) => {
      itinerarySteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addStep() {
  isAddStep.value = false;
  newStep.value.itineraryId = itinerary.value.id;
  delete newStep.value.id;
  await ItineraryStepServices.addItineraryStep(newStep.value)
    .then((data) => {
      newStep.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateActivity();

  await getItinerarySteps();
}

async function updateStep() {
  isEditStep.value = false;
  await ItineraryStepServices.updateItineraryStep(newStep.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateActivity();

  await getItinerarySteps();
}

async function deleteStep(step) {
  await ItineraryStepServices.deleteItineraryStep(step)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getItinerarySteps();
}

function openAddActivity() {
  newActivity.value.id = undefined;
  newActivity.value.quantity = undefined;
  newActivity.value.itineraryStepId = undefined;
  newActivity.value.activityId = undefined;
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

function openAddStep() {
  newStep.value.id = undefined;
  newStep.value.stepNumber = undefined;
  newStep.value.instruction = undefined;
  newStep.value.itineraryActivity = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newStep.value.id = step.id;
  newStep.value.stepNumber = step.stepNumber;
  newStep.value.instruction = step.instruction;
  newStep.value.itineraryActivity = step.itineraryActivity;
  isEditStep.value = true;
}

function closeAddActivity() {
  isAddActivity.value = false;
}

function closeEditActivity() {
  isEditActivity.value = false;
}

function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Itinerary
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
                  v-model.number="itinerary.servings"
                  label="Number of Servings"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="itinerary.time"
                  label="Time to Make (in minutes)"
                  type="number"
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
            <v-btn variant="flat" color="primary" @click="updateItinerary()"
              >Update Itinerary</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Activities </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddActivity()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
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
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditActivity(itineraryActivity)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteActivity(itineraryActivity)"
                    ></v-icon>
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
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Steps </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddStep()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
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
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text> </v-card
      ></v-col>
    </v-row>

    <v-dialog
      persistent
      :model-value="isAddActivity || isEditActivity"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddActivity
            ? "Add Activity"
            : isEditActivity
            ? "Edit Activity"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newActivity.quantity"
                label="Quantity"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedActivity"
                :items="activities"
                item-title="name"
                item-value="unit"
                label="Activities"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedActivity && selectedActivity.unit
                        ? selectedActivity.unit
                        : ""
                    }${newActivity.quantity > 1 ? "s" : ""}`
                  }}
                  of
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddActivity
                ? closeAddActivity()
                : isEditActivity
                ? closeEditActivity()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddActivity
                ? addActivity()
                : isEditActivity
                ? updateActivity()
                : false
            "
            >{{
              isAddActivity
                ? "Add Activity"
                : isEditActivity
                ? "Update Activity"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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

          <v-textarea
            v-model="newStep.instruction"
            label="Instruction"
            required
          ></v-textarea>

          <v-select
            v-model="newStep.itineraryActivity"
            :items="itineraryActivities"
            item-title="activity.name"
            item-value="id"
            label="Activities"
            return-object
            multiple
            chips
            required
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

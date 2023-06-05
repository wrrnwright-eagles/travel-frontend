<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ActivityServices from "../services/ActivityServices.js";

const activities = ref([]);
const dateTime = ref([]);
const location = ref([]);
const description = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newActivity = ref({
  id: undefined,
  name: undefined,
  dateTime: undefined,
  location: undefined,
  description: undefined,
});

onMounted(async () => {
  await getActivities();
  user.value = JSON.parse(localStorage.getItem("user"));
});

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

async function addActivity() {
  isAdd.value = false;
  delete newActivity.id;
  await ActivityServices.addActivity(newActivity.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newActivity.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getActivities();
}

async function deleteActivity(item) {
  const activityId = item.id;
  await ActivityServices.deleteActivity(activityId)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${item.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getActivities();
}

async function updateActivity() {
  isEdit.value = false;
  await ActivityServices.updateActivity(newActivity.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newActivity.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getActivities();
}

function openAdd() {
  newActivity.value.name = undefined;
  newActivity.value.dateTime = undefined;
  newActivity.value.location = undefined;
  newActivity.value.description = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newActivity.value.id = item.id;
  newActivity.value.name = item.name;
  newActivity.value.dateTime = item.dateTime;
  newActivity.value.location = item.location;
  newActivity.value.description = item.description;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
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
            >Activities
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Date & Time</th>
            <th class="text-left">Location</th>
            <th class="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activities" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.dateTime }}</td>
            <td>${{ item.location }}</td>
            <td>${{ item.description }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
              <v-icon
                size="small"
                icon="mdi-trash-can"
                @click="deleteActivity(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Activity" : isEdit ? "Edit Activity" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newActivity.name"
              :items="name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newActivity.dateTime"
              :items="dateTime"
              label="Date Time"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model="newActivity.location"
              :items="location"
              label="Location"
              required
            ></v-text-field>
            <v-text-field
              v-model="newActivity.description"
              :items="description"
              label="Description"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addActivity() : isEdit ? updateActivity() : false
              "
              >{{
                isAdd ? "Add Activity" : isEdit ? "Update Activity" : ""
              }}</v-btn
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

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import FlightServices from "../services/FlightServices.js";

const flights = ref([]);
const departureLocation = ref([]);
const departureDateTime = ref([]);
const arrivalLocation = ref([]);
const arrivalDateTime = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newFlight = ref({
  id: undefined,
  flightNumber: undefined,
  departureLocation: undefined,
  departureDateTime: undefined,
  arrivalLocation: undefined,
  arrivalDateTime: undefined,
});

onMounted(async () => {
  await getFlights();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getFlights() {
  await FlightServices.getFlights()
    .then((response) => {
      flight.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addFlight() {
  isAdd.value = false;
  delete newFlight.id;
  await FlightServices.addFlight(newFlight.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newFlight.value.flightNumber} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getFlights();
}

async function updateFlight() {
  isEdit.value = false;
  await FlightServices.updateFlight(newFlight.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newFlight.flightNumber} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getFlights();
}

function openAdd() {
  newFlight.value.flightNumber = undefined;
  newFlight.value.departureLocation = undefined;
  newFlight.value.departureDateTime = undefined;
  newFlight.value.arrivalLocation = undefined;
  newFlight.value.arrivalDateTime = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newFlight.value.id = item.id;
  newFlight.value.flightNumber = item.flightNumber;
  newFlight.value.departureLocation = item.departureLocation;
  newFlight.value.departureDateTime = item.departureDateTime;
  newFlight.value.arrivalLocation = item.arrivalLocation;
  newFlight.value.arrivalDateTime = item.arrivalDateTime;
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
            >Flights
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()">Add</v-btn>
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Flight Number</th>
            <th class="text-left">Depature Date & Time</th>
            <th class="text-left">Departure Location</th>
            <th class="text-left">Arrival Date & Time</th>
            <th class="text-left">Arrival Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in flights" :key="item.flightNumber">
            <td>{{ item.flightNumber }}</td>
            <td>{{ item.departureDateTime }}</td>
            <td>${{ item.departureLocation }}</td>
            <td>${{ item.arrivalDateTime }}</td>
            <td>${{ item.arrivalLocation }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Flight" : isEdit ? "Edit Flight" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newFlight.flightNumber"
              :items="flightNumber"
              label="Flight Number"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newFlight.departureDateTime"
              :items="departureDateTime"
              label="Departure Date & Time"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model="newFlight.departureLocation"
              :items="departureLocation"
              label="Departure Location"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newFlight.arrivalDateTime"
              :items="arrivalDateTime"
              label="Arrival Date & Time"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model="newFlight.arrivalLocation"
              :items="arrivalLocation"
              label="Arrival Location"
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
                isAdd ? addFlight() : isEdit ? updateFlight() : false
              "
              >{{
                isAdd ? "Add Flight" : isEdit ? "Update Flight" : ""
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

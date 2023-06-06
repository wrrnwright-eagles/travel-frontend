<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import HotelServices from "../services/HotelServices.js";

const hotels = ref([]);
const checkInDate = ref([]);
const checkOutDate = ref([]);
const location = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newHotel = ref({
  id: undefined,
  name: undefined,
  checkInDate: undefined,
  checkOutDate: undefined,
  location: undefined,
});

onMounted(async () => {
  await getHotels();
  user.value = JSON.parse(localStorage.getItem("user"));
});

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
}

async function addHotel() {
  isAdd.value = false;
  delete newHotel.id;
  await HotelServices.addHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newHotel.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotels();
}

async function updateHotel() {
  isEdit.value = false;
  await HotelServices.updateHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newHotel.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotels();
}

async function deleteHotel(item) {
  const hotelId = item.id;
  await HotelServices.deleteHotel(hotelId)
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
  await getHotels();
}

function openAdd() {
  newHotel.value.name = undefined;
  newHotel.value.checkInDate = undefined;
  newHotel.value.checkOutDate = undefined;
  newHotel.value.location = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newHotel.value.id = item.id;
  newHotel.value.name = item.name;
  newHotel.value.checkInDate = item.checkInDate;
  newHotel.value.checkOutDate = item.checkOutDate;
  newHotel.value.location = item.location;
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
            >Hotels
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
            <th class="text-left">Check In Date</th>
            <th class="text-left">Check Out Date</th>
            <th class="text-left">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in hotels" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.checkInDate }}</td>
            <td>{{ item.checkOutDate }}</td>
            <td>${{ item.location }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
              <v-icon
                size="small"
                icon="mdi-trash-can"
                @click="deleteHotel(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Hotel" : isEdit ? "Edit Hotel" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newHotel.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newHotel.checkInDate"
              :items="checkInDate"
              label="Check In Date"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newHotel.checkOutDate"
              :items="checkOutDate"
              label="Check Out Date"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model="newHotel.location"
              :items="location"
              label="Location"
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
                isAdd ? addHotel() : isEdit ? updateHotel() : false
              "
              >{{
                isAdd ? "Add Hotel" : isEdit ? "Update Hotel" : ""
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

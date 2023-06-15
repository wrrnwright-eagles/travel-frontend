<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import ItineraryCard from '../components/ItineraryCardComponent.vue'
import ItineraryServices from '../services/ItineraryServices.js'

const archivedItineraries = ref([])
const user = ref(false)

onMounted(async () => {
  await getArchivedItineraries()
  user.value = JSON.parse(localStorage.getItem("user"))
})

async function getArchivedItineraries() {
  user.value = JSON.parse(localStorage.getItem("user"))
  if (user.value !== null && user.value.isAdmin) {
    await ItineraryServices.getArchivedItinerariesByUserId(user.value.id)
      .then((response) => {
        archivedItineraries.value = response.data
      })
      .catch(handleError)
  }
}

function handleError(error) {
  console.log(error)
}
</script>

<template>
    <v-container>
      <v-row align="center" class="mb-4">
        <v-col cols="12">
          <v-card-title class="pl-0 text-h4 font-weight-bold">Archived Itineraries</v-card-title>
        </v-col>
      </v-row>
  
      <ItineraryCard
        v-for="itinerary in archivedItineraries"
        :key="itinerary.id"
        :itinerary="itinerary"
        @deletedItinerary="getArchivedItineraries()"
      />
    </v-container>
  </template>
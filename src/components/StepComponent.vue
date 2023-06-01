<script setup>
import { onMounted } from "vue";

const props = defineProps({
  itineraryStep: {
    required: true,
  },
});

onMounted(() => {});

const emit = defineEmits(["updateStep", "deleteStep"]);

const handleUpdate = (event) => {
  console.log(event);
  emit("updateStep", event.target);
};

const handleDelete = (event) => {
  emit("deleteStep", event.target);
};
</script>

<template>
  <v-list-item>
    {{ itineraryStep.stepNumber }}

    {{ itineraryStep.instruction }}

    <template v-slot:append>
      <v-icon
        size="x-small"
        icon="mdi-pencil"
        @click="handleUpdate(itineraryStep)"
      ></v-icon>
      <v-icon
        size="x-small"
        icon="mdi-trash-can"
        @click="handleDelete(itineraryStep)"
      ></v-icon>
    </template>

    <v-row>
      </v-row> {{ itineraryStep.itineraryActivity }}>
  </v-list-item>
</template>

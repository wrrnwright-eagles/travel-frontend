import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/itineraries",
      name: "itineraries",
      component: () => import("./views/ItineraryList.vue"),
    },
    {
      path: "/itinerary/:id",
      name: "editItinerary",
      props: true,
      component: () => import("./views/EditItinerary.vue"),
    },
    {
      path: "/activities",
      name: "activities",
      component: () => import("./views/ActivityList.vue"),
    },
    {
      path: "/flights",
      name: "flights",
      component: () => import("./views/FlightList.vue"),
    },
    {
      path: "/hotels",
      name: "hotels",
      component: () => import("./views/HotelList.vue"),
    },
    {
      path: "/archived-itineraries",
      name: "archivedItineraries",
      component: () => import("./views/ArchivedItineraryList.vue"),
    },
    {
      path: "/past-trips",
      name: "pastTrips",
      component: () => import("./views/PastTrips.vue"),
    },
  ],
});

export default router;

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
      path: "/recipes",
      name: "recipes",
      component: () => import("./views/RecipeList.vue"),
    },
    {
      path: "/recipe/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/EditRecipe.vue"),
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
  ],
});

export default router;

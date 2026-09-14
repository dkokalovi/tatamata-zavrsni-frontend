<template>
  <nav class="navbar navbar-light bg-white border-bottom shadow-sm" v-if="isLoggedIn">
    <div class="container app-shell">
      <router-link class="navbar-brand" to="/pocetna">TataMata</router-link>
      <div class="d-flex align-items-center gap-2">
        <router-link class="btn btn-sm btn-outline-secondary" to="/profil">Profil</router-link>
        <router-link v-if="role === 'admin'" class="btn btn-sm btn-outline-secondary" to="/admin">
          Admin
        </router-link>
        <button class="btn btn-sm btn-outline-danger" @click="logout">Odjava</button>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => !!route.meta.requiresAuth);
const role = computed(() => localStorage.getItem("role"));

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  router.push("/");
}
</script>
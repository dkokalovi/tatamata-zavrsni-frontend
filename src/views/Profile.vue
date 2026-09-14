<template>
  <div class="container app-shell py-3">
    <h5 class="mb-3">Moj profil</h5>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h6 class="card-title">Osobni podaci</h6>
        <div v-if="profileError" class="alert alert-danger py-2">{{ profileError }}</div>
        <div v-if="profileSuccess" class="alert alert-success py-2">{{ profileSuccess }}</div>

        <form @submit.prevent="saveProfile">
          <div class="mb-2">
            <label class="form-label">Ime</label>
            <input v-model="profile.ime" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Prezime</label>
            <input v-model="profile.prezime" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Telefon</label>
            <input v-model="profile.telefon" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Adresa</label>
            <input v-model="profile.adresa" class="form-control" />
          </div>
          <button type="submit" class="btn btn-tm w-100">Spremi izmjene</button>
        </form>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h6 class="card-title">Promjena lozinke</h6>
        <div v-if="passwordError" class="alert alert-danger py-2">{{ passwordError }}</div>
        <div v-if="passwordSuccess" class="alert alert-success py-2">{{ passwordSuccess }}</div>

        <form @submit.prevent="changePassword">
          <div class="mb-2">
            <label class="form-label">Trenutna lozinka</label>
            <input v-model="trenutnaLozinka" type="password" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Nova lozinka</label>
            <input v-model="novaLozinka" type="password" class="form-control" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-outline-dark w-100">Promijeni lozinku</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api.js";

const profile = ref({ ime: "", prezime: "", telefon: "", adresa: "" });
const profileError = ref("");
const profileSuccess = ref("");

const trenutnaLozinka = ref("");
const novaLozinka = ref("");
const passwordError = ref("");
const passwordSuccess = ref("");

async function loadProfile() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  profile.value = {
    ime: stored.ime || "",
    prezime: stored.prezime || "",
    telefon: stored.telefon || "",
    adresa: stored.adresa || "",
  };
}

async function saveProfile() {
  profileError.value = "";
  profileSuccess.value = "";
  try {
    const { data } = await api.patch("/auth/me", profile.value);
    localStorage.setItem("user", JSON.stringify(data.user));
    profileSuccess.value = "Profil je azuriran.";
  } catch (err) {
    profileError.value = err.response?.data?.message || "Greska pri spremanju.";
  }
}

async function changePassword() {
  passwordError.value = "";
  passwordSuccess.value = "";
  try {
    await api.patch("/auth/me/lozinka", {
      trenutnaLozinka: trenutnaLozinka.value,
      novaLozinka: novaLozinka.value,
    });
    passwordSuccess.value = "Lozinka je promijenjena.";
    trenutnaLozinka.value = "";
    novaLozinka.value = "";
  } catch (err) {
    passwordError.value = err.response?.data?.message || "Greska pri promjeni lozinke.";
  }
}

onMounted(loadProfile);
</script>
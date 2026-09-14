<template>
  <div class="container app-shell">
    <div class="text-center my-4">
      <h1 class="fw-bold" style="color: var(--tm-orange)">TataMata</h1>
      <p class="text-muted">Uslikaj problem, dobij stručnu dijagnozu i preporuku majstora</p>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-4">
        <h4 class="card-title mb-3">
          {{ isLogin ? "Prijava" : "Registracija" }}
        </h4>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <form @submit.prevent="submit">
          <template v-if="!isLogin">
            <div class="mb-3">
              <label class="form-label">Ime</label>
              <input v-model="form.ime" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Prezime</label>
              <input v-model="form.prezime" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Telefon (opcionalno)</label>
              <input v-model="form.telefon" type="tel" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Adresa (opcionalno)</label>
              <input v-model="form.adresa" type="text" class="form-control" />
            </div>

            <div class="form-check mb-3">
              <input
                v-model="postajeObrtnik"
                class="form-check-input"
                type="checkbox"
                id="postajeObrtnik"
              />
              <label class="form-check-label" for="postajeObrtnik">
                Registriram se kao obrtnik (dodajem svoju firmu)
              </label>
            </div>

            <template v-if="postajeObrtnik">
              <hr />
              <h6>Podaci o obrtu</h6>
              <div class="mb-3">
                <label class="form-label">Naziv obrta</label>
                <input v-model="companyForm.naziv" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Telefon obrta</label>
                <input v-model="companyForm.telefon" type="tel" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Grad</label>
                <input v-model="companyForm.grad" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Kategorije rada</label>
                <select v-model="companyForm.kategorije" class="form-select" multiple size="6" required>
                  <option v-for="k in kategorije" :key="k" :value="k">{{ k }}</option>
                </select>
                <small class="text-muted">Drži Ctrl (Cmd na Macu) za odabir više kategorija.</small>
              </div>
              <hr />
            </template>
          </template>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Lozinka</label>
            <input v-model="form.password" type="password" class="form-control" required minlength="6" />
          </div>

          <button type="submit" class="btn btn-tm w-100" :disabled="loading">
            {{ loading ? "Molimo pričekajte..." : isLogin ? "Prijavi se" : "Registriraj se" }}
          </button>
        </form>

        <div class="text-center mt-3">
          <button class="btn btn-link" @click="toggleMode">
            {{ isLogin ? "Nemaš račun? Registriraj se" : "Već imaš račun? Prijavi se" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../api.js";
import { showSuccess } from "../toast.js";

const router = useRouter();

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");
const postajeObrtnik = ref(false);

const kategorije = [
  "vlaga_i_fleke", "pukotine", "krov", "vodoinstalacije", "elektroinstalacije",
  "fasada", "podovi_i_zidne_obloge", "izolacija", "plijesan", "stolarija", "ostalo",
];

const form = reactive({
  ime: "",
  prezime: "",
  telefon: "",
  adresa: "",
  email: "",
  password: "",
});

const companyForm = reactive({
  naziv: "",
  telefon: "",
  grad: "",
  kategorije: [],
});

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = "";
  postajeObrtnik.value = false;
}

async function submit() {
  error.value = "";
  loading.value = true;

  try {
    const url = isLogin.value ? "/auth/login" : "/auth/register";
    const payload = { ...form };

    if (!isLogin.value && postajeObrtnik.value) {
      payload.postajeObrtnik = true;
      payload.companyNaziv = companyForm.naziv;
      payload.companyTelefon = companyForm.telefon;
      payload.companyGrad = companyForm.grad;
      payload.companyKategorije = companyForm.kategorije;
    }

    const { data } = await api.post(url, payload);

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (!isLogin.value) showSuccess("Uspješna registracija!");
    router.push("/pocetna");
  } catch (err) {
    error.value = err.response?.data?.message || "Došlo je do greške.";
  } finally {
    loading.value = false;
  }
}
</script>
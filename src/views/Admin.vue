<template>
  <div class="container py-3" style="max-width: 700px">
    <h4>Admin panel</h4>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab">
        <button class="nav-link" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}
        </button>
      </li>
    </ul>

    <div v-if="activeTab === 'Statistika'">
      <div class="row g-2 mb-3">
        <div class="col-6 col-md-3">
          <div class="card text-center py-3">
            <div class="fs-4 fw-bold">{{ stats.brojKorisnika ?? "-" }}</div>
            <small class="text-muted">Korisnika</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center py-3">
            <div class="fs-4 fw-bold">{{ stats.brojAnaliza ?? "-" }}</div>
            <small class="text-muted">Analiza</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center py-3">
            <div class="fs-4 fw-bold">{{ stats.brojFirmi ?? "-" }}</div>
            <small class="text-muted">Firmi</small>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center py-3">
            <div class="fs-4 fw-bold">{{ stats.brojInteresa ?? "-" }}</div>
            <small class="text-muted">Interesa</small>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <h6 class="card-title">Analize po kategoriji</h6>
          <table class="table table-sm mb-0">
            <tbody>
              <tr v-for="k in stats.poKategoriji" :key="k._id">
                <td>{{ k._id }}</td>
                <td class="text-end">{{ k.broj }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <h6 class="card-title">Interesi po statusu</h6>
          <table class="table table-sm mb-0">
            <tbody>
              <tr v-for="s in stats.poStatusu" :key="s._id">
                <td>{{ s._id }}</td>
                <td class="text-end">{{ s.broj }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h6 class="card-title">Prosjecna ocjena firmi</h6>
          <p class="mb-0">
            <span v-if="stats.prosjecnaOcjena?.broj">
              {{ stats.prosjecnaOcjena.prosjek.toFixed(1) }} / 5 ({{ stats.prosjecnaOcjena.broj }} ocjena)
            </span>
            <span v-else class="text-muted">Jos nema ocjena.</span>
          </p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'Korisnici'">
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-secondary" @click="exportCsv(users, 'korisnici')">
          Export CSV
        </button>
      </div>
      <table class="table table-sm">
        <thead>
          <tr>
            <th role="button" @click="sortBy('users', 'ime')">Ime {{ sortIndicator('users', 'ime') }}</th>
            <th role="button" @click="sortBy('users', 'email')">Email {{ sortIndicator('users', 'email') }}</th>
            <th role="button" @click="sortBy('users', 'role')">Rola {{ sortIndicator('users', 'role') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in sortedUsers" :key="u._id">
            <td>{{ u.ime }} {{ u.prezime }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'Analize'">
      <div class="row g-2 mb-2 align-items-end">
        <div class="col-6 col-md-3">
          <label class="form-label small mb-1">Kategorija</label>
          <select v-model="analysisFilter.kategorija" class="form-select form-select-sm">
            <option value="">Sve kategorije</option>
            <option v-for="k in kategorije" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label small mb-1">Od datuma</label>
          <input v-model="analysisFilter.datumOd" type="date" class="form-control form-control-sm" />
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label small mb-1">Do datuma</label>
          <input v-model="analysisFilter.datumDo" type="date" class="form-control form-control-sm" />
        </div>
        <div class="col-6 col-md-3 text-end">
          <button class="btn btn-sm btn-outline-secondary" @click="exportCsv(filteredAnalyses, 'analize')">
            Export CSV
          </button>
        </div>
      </div>
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Korisnik</th>
            <th>Problem</th>
            <th role="button" @click="sortBy('analyses', 'kategorija')">
              Kategorija {{ sortIndicator('analyses', 'kategorija') }}
            </th>
            <th role="button" @click="sortBy('analyses', 'createdAt')">
              Datum {{ sortIndicator('analyses', 'createdAt') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in sortedFilteredAnalyses" :key="a._id">
            <td>{{ a.user?.ime }} {{ a.user?.prezime }}</td>
            <td>{{ a.naslovProblema }}</td>
            <td>{{ a.kategorija }}</td>
            <td>{{ new Date(a.createdAt).toLocaleDateString("hr-HR") }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="sortedFilteredAnalyses.length === 0" class="text-muted small">
        Nema analiza koje odgovaraju filteru.
      </p>
    </div>

    <div v-if="activeTab === 'Interesi'">
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-secondary" @click="exportCsv(interestsExportData, 'interesi')">
          Export CSV
        </button>
      </div>
      <table class="table table-sm">
        <thead>
          <tr>
            <th role="button" @click="sortBy('interests', 'korisnikIme')">
              Korisnik {{ sortIndicator('interests', 'korisnikIme') }}
            </th>
            <th role="button" @click="sortBy('interests', 'firmaNaziv')">
              Firma {{ sortIndicator('interests', 'firmaNaziv') }}
            </th>
            <th role="button" @click="sortBy('interests', 'ocjena')">
              Ocjena {{ sortIndicator('interests', 'ocjena') }}
            </th>
            <th role="button" @click="sortBy('interests', 'status')">
              Status {{ sortIndicator('interests', 'status') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in sortedInterests" :key="i._id">
            <td>{{ i.user?.ime }} {{ i.user?.prezime }}</td>
            <td>{{ i.company?.naziv }}</td>
            <td>{{ i.ocjena ? i.ocjena + " / 5" : "-" }}</td>
            <td>
              <select
                class="form-select form-select-sm"
                :value="i.status"
                @change="updateInterestStatus(i, $event.target.value)"
              >
                <option value="na_cekanju">na čekanju</option>
                <option value="kontaktirano">kontaktirano</option>
                <option value="zavrseno">završeno</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'Firme'">
      <div v-if="companyError" class="alert alert-danger py-2">{{ companyError }}</div>
      <div v-if="companySuccess" class="alert alert-success py-2">{{ companySuccess }}</div>

      <form class="card card-body mb-3" @submit.prevent="addCompany">
        <div class="row g-2">
          <div class="col-6"><input v-model="newCompany.naziv" class="form-control form-control-sm" placeholder="Naziv" required /></div>
          <div class="col-6"><input v-model="newCompany.grad" class="form-control form-control-sm" placeholder="Grad" /></div>
          <div class="col-6"><input v-model="newCompany.telefon" class="form-control form-control-sm" placeholder="Telefon" required /></div>
          <div class="col-6"><input v-model="newCompany.email" class="form-control form-control-sm" placeholder="Email" required /></div>
          <div class="col-12">
            <select v-model="newCompany.kategorije" class="form-select form-select-sm" multiple size="5">
              <option v-for="k in kategorije" :key="k" :value="k">{{ k }}</option>
            </select>
            <small class="text-muted">Drži Ctrl (Cmd na Macu) za odabir više kategorija.</small>
          </div>
        </div>
        <button class="btn btn-tm btn-sm mt-2" type="submit">Dodaj firmu</button>
      </form>

      <div class="d-flex gap-2 mb-2">
        <input
          v-model="companySearch"
          type="text"
          class="form-control form-control-sm"
          placeholder="Pretraži firme po nazivu ili gradu..."
        />
        <button class="btn btn-sm btn-outline-secondary text-nowrap" @click="exportCsv(filteredCompanies, 'firme')">
          Export CSV
        </button>
      </div>

      <table class="table table-sm">
        <thead>
          <tr>
            <th role="button" @click="sortBy('companies', 'naziv')">Naziv {{ sortIndicator('companies', 'naziv') }}</th>
            <th>Kategorije</th>
            <th role="button" @click="sortBy('companies', 'brojInteresa')">
              Interesa {{ sortIndicator('companies', 'brojInteresa') }}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in sortedFilteredCompanies" :key="c._id">
            <td>{{ c.naziv }}</td>
            <td><small>{{ c.kategorije.join(", ") }}</small></td>
            <td>{{ c.brojInteresa ?? 0 }}</td>
            <td><button class="btn btn-sm btn-outline-danger" @click="deleteCompany(c._id)">Obriši</button></td>
          </tr>
        </tbody>
      </table>
      <p v-if="companySearch && filteredCompanies.length === 0" class="text-muted small">
        Nema firmi koje odgovaraju pretrazi.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api.js";
import { showSuccess, showError } from "../toast.js";

const tabs = ["Statistika", "Korisnici", "Analize", "Interesi", "Firme"];
const activeTab = ref("Statistika");

const users = ref([]);
const analyses = ref([]);
const interests = ref([]);
const companies = ref([]);
const companySearch = ref("");
const stats = ref({});
const analysisFilter = ref({ kategorija: "", datumOd: "", datumDo: "" });

const sortState = ref({});

const kategorije = [
  "vlaga_i_fleke", "pukotine", "krov", "vodoinstalacije", "elektroinstalacije",
  "fasada", "podovi_i_zidne_obloge", "izolacija", "plijesan", "stolarija", "ostalo",
];

const newCompany = ref({ naziv: "", grad: "", telefon: "", email: "", kategorije: [] });
const companyError = ref("");
const companySuccess = ref("");

function sortBy(tableKey, field) {
  const current = sortState.value[tableKey];
  if (current && current.key === field) {
    sortState.value[tableKey] = { key: field, dir: current.dir * -1 };
  } else {
    sortState.value[tableKey] = { key: field, dir: 1 };
  }
}

function sortIndicator(tableKey, field) {
  const current = sortState.value[tableKey];
  if (!current || current.key !== field) return "";
  return current.dir === 1 ? "▲" : "▼";
}

function applySort(list, tableKey) {
  const state = sortState.value[tableKey];
  if (!state) return list;
  return [...list].sort((a, b) => {
    let va = a[state.key];
    let vb = b[state.key];
    if (state.key === "ime") { va = a.ime + a.prezime; vb = b.ime + b.prezime; }
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va === undefined || va === null) va = "";
    if (vb === undefined || vb === null) vb = "";
    if (va < vb) return -1 * state.dir;
    if (va > vb) return 1 * state.dir;
    return 0;
  });
}

const sortedUsers = computed(() => applySort(users.value, "users"));

const filteredAnalyses = computed(() => {
  return analyses.value.filter((a) => {
    if (analysisFilter.value.kategorija && a.kategorija !== analysisFilter.value.kategorija) {
      return false;
    }
    const datum = new Date(a.createdAt);
    if (analysisFilter.value.datumOd && datum < new Date(analysisFilter.value.datumOd)) {
      return false;
    }
    if (analysisFilter.value.datumDo) {
      const doDatuma = new Date(analysisFilter.value.datumDo);
      doDatuma.setHours(23, 59, 59, 999);
      if (datum > doDatuma) return false;
    }
    return true;
  });
});
const sortedFilteredAnalyses = computed(() => applySort(filteredAnalyses.value, "analyses"));

const filteredCompanies = computed(() => {
  const q = companySearch.value.trim().toLowerCase();
  if (!q) return companies.value;
  return companies.value.filter(
    (c) => c.naziv.toLowerCase().includes(q) || (c.grad || "").toLowerCase().includes(q)
  );
});
const sortedFilteredCompanies = computed(() => applySort(filteredCompanies.value, "companies"));

// Interesi imaju populirane objekte (user, company) - za sortiranje/export
// trebamo "spljostenu" verziju s ravnim, citljivim poljima.
const flatInterests = computed(() =>
  interests.value.map((i) => ({
    ...i,
    korisnikIme: `${i.user?.ime || ""} ${i.user?.prezime || ""}`.trim(),
    firmaNaziv: i.company?.naziv || "",
  }))
);
const sortedInterests = computed(() => applySort(flatInterests.value, "interests"));

const interestsExportData = computed(() =>
  flatInterests.value.map((i) => ({
    korisnik: i.korisnikIme,
    firma: i.firmaNaziv,
    status: i.status,
    ocjena: i.ocjena ?? "",
    komentar: i.komentar || "",
    datum: new Date(i.createdAt).toLocaleDateString("hr-HR"),
  }))
);

function exportCsv(list, imeDatoteke) {
  if (!list.length) {
    showError("Nema podataka za export.");
    return;
  }
  const keys = Object.keys(list[0]).filter((k) => typeof list[0][k] !== "object");
  const header = keys.join(",");
  const rows = list.map((item) =>
    keys.map((k) => `"${String(item[k] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${imeDatoteke}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showSuccess("CSV preuzet.");
}

async function loadAll() {
  const [u, a, i, c, s] = await Promise.all([
    api.get("/admin/users"),
    api.get("/admin/analyses"),
    api.get("/admin/interests"),
    api.get("/companies"),
    api.get("/admin/stats"),
  ]);
  users.value = u.data;
  analyses.value = a.data;
  interests.value = i.data;
  companies.value = c.data;
  stats.value = s.data;
}

async function addCompany() {
  companyError.value = "";
  companySuccess.value = "";
  try {
    await api.post("/companies", newCompany.value);
    companySuccess.value = "Firma dodana.";
    showSuccess("Firma dodana.");
    newCompany.value = { naziv: "", grad: "", telefon: "", email: "", kategorije: [] };
    await loadAll();
  } catch (err) {
    companyError.value = err.response?.data?.message || "Greška.";
  }
}

async function deleteCompany(id) {
  if (!confirm("Obrisati firmu?")) return;
  await api.delete(`/companies/${id}`);
  showSuccess("Firma obrisana.");
  await loadAll();
}

async function updateInterestStatus(interest, noviStatus) {
  try {
    await api.patch(`/interest/${interest._id}`, { status: noviStatus });
    interest.status = noviStatus;
    showSuccess("Status azuriran.");
  } catch (err) {
    showError(err.response?.data?.message || "Greška pri promjeni statusa.");
  }
}

onMounted(loadAll);
</script>
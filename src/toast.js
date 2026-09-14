import { reactive } from "vue";

// Jednostavan globalni spremnik toast poruka - reactive() cini ga
// "dijeljenim stanjem" koje bilo koja komponenta moze citati/mijenjati,
// bez potrebe za Pinia/Vuex za ovako mali opseg.
export const toasts = reactive([]);

let nextId = 1;

function push(message, type) {
  const id = nextId++;
  toasts.push({ id, message, type });
  setTimeout(() => remove(id), 4000);
}

export function showSuccess(message) {
  push(message, "success");
}

export function showError(message) {
  push(message, "error");
}

export function remove(id) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}
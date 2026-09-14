<template>
  <div
    v-if="toasts.length"
    class="position-fixed bottom-0 end-0 p-3"
    style="z-index: 1080"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast show align-items-center text-white border-0 mb-2"
      :class="t.type === 'error' ? 'bg-danger' : 'bg-success'"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">{{ t.message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="remove(t.id)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toasts, remove } from "../toast.js";
</script>
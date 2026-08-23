<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div 
        v-if="toastState.show" 
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#2D5A34]/95 text-white shadow-2xl backdrop-blur-md border border-[#78B890]/40 text-sm font-medium pointer-events-auto select-none"
      >
        <span class="text-base animate-bounce">🍃</span>
        <span>{{ toastState.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { toastState } from '../toast'
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.9);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px) scale(0.95);
}
</style>

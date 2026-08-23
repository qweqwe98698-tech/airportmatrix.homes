<template>
  <div class="firefly-container pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
    <div 
      v-for="firefly in fireflies" 
      :key="firefly.id"
      class="firefly absolute rounded-full bg-forest-amber"
      :style="{
        left: firefly.left + '%',
        top: firefly.top + '%',
        width: firefly.size + 'px',
        height: firefly.size + 'px',
        animationDelay: firefly.delay + 's',
        animationDuration: firefly.duration + 's',
        boxShadow: '0 0 12px #FFEAA7, 0 0 24px #78B890'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Firefly {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

const fireflies = ref<Firefly[]>([])

onMounted(() => {
  const count = 16
  const list: Firefly[] = []
  for (let i = 0; i < count; i++) {
    list.push({
      id: i,
      left: Math.random() * 95 + 2,
      top: Math.random() * 90 + 5,
      size: Math.random() * 3 + 3,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4
    })
  }
  fireflies.value = list
})
</script>

<style scoped>
.firefly {
  animation: firefly-float ease-in-out infinite alternate;
}

@keyframes firefly-float {
  0% {
    opacity: 0.1;
    transform: translate(0, 0) scale(0.8);
  }
  50% {
    opacity: 0.85;
    transform: translate(15px, -20px) scale(1.2);
  }
  100% {
    opacity: 0.2;
    transform: translate(-10px, -35px) scale(0.9);
  }
}
</style>

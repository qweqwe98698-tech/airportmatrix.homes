<template>
  <div class="leaves-container pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
    <div 
      v-for="leaf in leaves" 
      :key="leaf.id"
      class="leaf-particle absolute"
      :style="{
        left: leaf.left + '%',
        top: '-40px',
        animationDelay: leaf.delay + 's',
        animationDuration: leaf.duration + 's',
        opacity: leaf.opacity,
        transform: `scale(${leaf.scale})`
      }"
    >
      <svg 
        class="w-6 h-6 text-forest-primary/40 transform transition-transform" 
        :style="{ fill: leaf.color }"
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Leaf {
  id: number
  left: number
  delay: number
  duration: number
  scale: number
  opacity: number
  color: string
}

const leaves = ref<Leaf[]>([])
const colors = ['#78B890', '#A1CCA5', '#D9F2D9', '#5E9E76', '#C8E6C9']

onMounted(() => {
  const leafCount = 12
  const list: Leaf[] = []
  for (let i = 0; i < leafCount; i++) {
    list.push({
      id: i,
      left: Math.random() * 96 + 2,
      delay: Math.random() * 12,
      duration: Math.random() * 14 + 10,
      scale: Math.random() * 0.5 + 0.6,
      opacity: Math.random() * 0.4 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }
  leaves.value = list
})
</script>

<style scoped>
.leaf-particle {
  animation: leaf-fall linear infinite;
}

@keyframes leaf-fall {
  0% {
    transform: translateY(-20px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  15% {
    opacity: var(--tw-opacity, 0.4);
  }
  85% {
    opacity: var(--tw-opacity, 0.4);
  }
  100% {
    transform: translateY(105vh) rotate(540deg) translateX(80px);
    opacity: 0;
  }
}
</style>

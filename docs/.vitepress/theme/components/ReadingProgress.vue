<template>
  <div 
    class="reading-progress-bar fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none transition-all duration-150"
    :style="{ width: `${progress}%`, opacity: progress > 1 ? 1 : 0 }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) {
    progress.value = 0
    return
  }
  const current = (scrollTop / docHeight) * 100
  progress.value = Math.min(100, Math.max(0, current))
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress-bar {
  background: linear-gradient(90deg, #78B890 0%, #5E9E76 50%, #437857 100%);
  box-shadow: 0 1px 8px rgba(120, 184, 144, 0.6);
}
</style>

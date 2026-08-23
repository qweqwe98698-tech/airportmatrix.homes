<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-leaf transition-all duration-200 shadow-sm',
      variantClasses[variant] || variantClasses.primary
    ]"
  >
    <slot name="icon">
      <span class="text-sm">🍃</span>
    </slot>
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'wood' | 'amber' | 'accent' | 'soft'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const variantClasses: Record<string, string> = {
  primary: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
  wood: 'bg-[#F4ECE1] text-[#6B4423] border border-[#DEC8AF]',
  amber: 'bg-amber-100 text-amber-900 border border-amber-300',
  accent: 'bg-[#E5F3E4] text-[#233826] border border-[#78B890]',
  soft: 'bg-slate-100 text-slate-800 border border-slate-200'
}
</script>

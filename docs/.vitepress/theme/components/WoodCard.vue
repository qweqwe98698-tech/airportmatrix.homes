<template>
  <div class="wood-card-container relative my-6 rounded-2xl bg-[#FCFAF6] border border-[#DEC8AF]/80 p-6 shadow-wood transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#8C6239]/60">
    <!-- 顶部木质纹理装饰条 -->
    <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#A88054] via-[#78B890] to-[#A88054] rounded-t-2xl opacity-80" />
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEC8AF]/40 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#78B890] to-[#437857] flex items-center justify-center text-2xl shadow-md text-white font-bold">
          <slot name="icon">🌿</slot>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-xl font-bold text-[#2A1B0E] m-0">{{ title }}</h3>
            <span v-if="tag" class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
              {{ tag }}
            </span>
            <span v-if="priceType" :class="[
              'text-[10px] px-2 py-0.2 rounded font-semibold',
              priceType === '年付折算' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            ]">
              {{ priceType }}
            </span>
          </div>
          <p class="text-sm text-[#705335] mt-1 mb-0">{{ subtitle }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2 self-start md:self-auto">
        <div v-if="rating" class="flex items-center gap-1.5 bg-[#F4ECE1] px-3.5 py-1.5 rounded-xl border border-[#DEC8AF]">
          <span class="text-amber-500 font-bold text-base">★</span>
          <span class="text-base font-extrabold text-[#5C3B1E]">{{ rating }}</span>
          <span class="text-xs text-[#8C6239]/70">/ 10</span>
        </div>
      </div>
    </div>

    <!-- 卡片核心正文/亮点列表 -->
    <div class="py-4 text-[#38543B] text-sm leading-relaxed">
      <slot />
      
      <!-- 优惠码条块 -->
      <div v-if="promoCode" class="mt-3 flex items-center gap-2 bg-[#F2F9F2] p-2.5 rounded-xl border border-[#D8EADB] text-xs">
        <span class="font-bold text-[#233826]">🎟️ 独家优惠码：</span>
        <code class="px-2 py-0.5 bg-white font-mono font-bold text-[#2D5A34] rounded border border-[#78B890] text-xs">
          {{ promoCode }}
        </code>
        <button 
          @click="copyCode(promoCode)" 
          class="text-[11px] px-2 py-0.5 rounded bg-[#78B890] text-white hover:bg-[#5E9E76] cursor-pointer transition-colors"
        >
          {{ isCopied ? '已复制✓' : '一键复制' }}
        </button>
        <span v-if="promoDesc" class="text-[#705335] ml-1">({{ promoDesc }})</span>
      </div>
    </div>

    <!-- 底部特性标签与跳转动作 -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DEC8AF]/30">
      <div class="flex flex-wrap gap-1.5">
        <slot name="tags" />
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div v-if="price" class="text-right">
          <span class="text-xs text-[#705335]">入门价格</span>
          <div class="text-base font-extrabold text-[#2D5A34]">{{ price }}</div>
        </div>

        <button 
          v-if="speedtestImage" 
          @click="showModal = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-leaf bg-[#F4ECE1] hover:bg-[#E8DCCB] text-[#6B4423] border border-[#DEC8AF] text-xs font-semibold cursor-pointer transition-all"
        >
          <span>📸</span>
          <span>实测测速图</span>
        </button>

        <a 
          v-if="link" 
          :href="link" 
          target="_blank" 
          rel="nofollow sponsored noopener" 
          class="inline-flex items-center gap-2 px-5 py-2 rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline !text-white"
        >
          <span>{{ linkText || '直达官网注册' }}</span>
          <span class="text-xs">→</span>
        </a>
      </div>
    </div>

    <!-- 测速大图弹窗 -->
    <div 
      v-if="showModal && speedtestImage" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <h4 class="font-bold text-base text-[#233826] m-0">{{ title }} · 节点测速实测图</h4>
          <button 
            @click="showModal = false" 
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-auto rounded-xl bg-slate-900 flex items-center justify-center p-2">
          <img :src="speedtestImage" :alt="title + ' 测速图'" class="max-w-full max-h-[72vh] object-contain rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '../toast'

interface Props {
  title: string
  subtitle?: string
  tag?: string
  priceType?: '年付折算' | '真实月付'
  rating?: string | number
  price?: string
  link?: string
  linkText?: string
  promoCode?: string
  promoDesc?: string
  speedtestImage?: string
}

defineProps<Props>()

const showModal = ref(false)
const isCopied = ref(false)

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  isCopied.value = true
  showToast(`🍃 优惠码【${code}】已成功复制！`)
  setTimeout(() => {
    isCopied.value = false
  }, 2500)
}
</script>

<style scoped>
.wood-card-container {
  background-image: radial-gradient(rgba(140, 98, 57, 0.03) 1px, transparent 0);
  background-size: 16px 16px;
}
</style>

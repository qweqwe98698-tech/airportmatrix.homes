<template>
  <div class="home-hero-search my-6 max-w-3xl mx-auto">
    <!-- 搜索输入框容器 -->
    <div class="relative flex items-center rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#78B890]/60 p-2 shadow-lg shadow-emerald-900/5 transition-all focus-within:border-[#2563EB] focus-within:shadow-xl focus-within:ring-4 focus-within:ring-blue-500/10">
      <span class="pl-3 pr-2 text-xl text-[#5C785F]">🔍</span>
      <input
        v-model="query"
        type="text"
        placeholder="搜索机场、客户端教程、AI访问或网络问题 (如：ChatGPT打不开、Clash教程、7元专线)..."
        class="w-full bg-transparent text-[#0F172A] placeholder-[#5C785F]/70 text-sm md:text-base outline-none py-1.5 font-medium"
        @keyup.enter="triggerSearch"
      />
      <button
        @click="triggerSearch"
        class="shrink-0 px-5 py-2 rounded-xl bg-gradient-to-r from-[#246B45] to-[#2563EB] hover:from-[#1D5436] hover:to-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 select-none"
      >
        快速查找
      </button>
    </div>

    <!-- 高频热门搜索标签 -->
    <div class="flex items-center gap-1.5 flex-wrap mt-3 px-1 text-xs text-[#5C785F]">
      <span class="font-bold text-[#246B45] flex items-center gap-1">
        <span>🔥</span>
        <span>热搜：</span>
      </span>
      <a
        v-for="tag in hotTags"
        :key="tag.name"
        :href="tag.link"
        class="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-emerald-50 text-[#38543B] hover:text-[#2563EB] border border-[#DEC8AF]/50 font-medium transition-colors !no-underline shadow-xs"
      >
        {{ tag.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const query = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) query.value = q
  }
})

const hotTags = [
  { name: '🏆 2026机场推荐榜', link: '/ranking/' },
  { name: '💰 性价比机场推荐', link: '/ranking/budget' },
  { name: '🐱 飞猫云约7元实测', link: '/ranking/feimao' },
  { name: '⚡ 光速云5年老牌评测', link: '/ranking/guangsu' },
  { name: '🏝️ 星岛梦不限时按量', link: '/ranking/xingdao' },
  { name: '🚀 顶级IEPL专线榜', link: '/ranking/iepl-iplc' },
  { name: '🤖 ChatGPT访问指南', link: '/ai/chatgpt-access' },
  { name: '📱 Clash Verge教程', link: '/client/clash-verge' }
]

function triggerSearch() {
  if (typeof window === 'undefined') return
  // 模拟触发 VitePress Pagefind 搜索弹窗快捷键
  const searchBtn = document.querySelector('.DocSearch-Button, .VPNavBarSearch button, .pagefind-ui__search-input') as HTMLElement
  if (searchBtn) {
    searchBtn.click()
  } else {
    // 降级使用快捷键模拟
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }
}
</script>

<style scoped>
.home-hero-search {
  animation: fadeIn 0.4s ease-out;
}
</style>

<template>
  <nav
    v-if="showBreadcrumb"
    aria-label="面包屑导航"
    class="doc-breadcrumb mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F6FBF5] border border-[#D8EADB] px-3.5 py-2 text-xs text-[#5C785F]"
  >
    <ol class="flex flex-wrap items-center gap-1.5 list-none m-0 p-0">
      <li class="inline-flex items-center">
        <a href="/" class="text-[#2D5A34] hover:text-[#2563EB] font-semibold !no-underline">首页</a>
      </li>
      <li v-if="sectionInfo" class="inline-flex items-center gap-1.5">
        <span aria-hidden="true" class="text-[#9BB59E]">/</span>
        <a
          v-if="!isSectionIndex"
          :href="sectionInfo.link"
          class="text-[#2D5A34] hover:text-[#2563EB] font-medium !no-underline"
        >
          {{ sectionInfo.name }}
        </a>
        <span v-else class="text-[#233826] font-semibold">{{ sectionInfo.name }}</span>
      </li>
      <li v-if="!isSectionIndex" class="inline-flex items-center gap-1.5">
        <span aria-hidden="true" class="text-[#9BB59E]">/</span>
        <span class="text-[#233826] font-semibold truncate max-w-[260px] sm:max-w-md" :title="page.title">
          {{ shortTitle }}
        </span>
      </li>
    </ol>

    <div class="flex items-center gap-2 text-[11px] text-[#5C785F]">
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#D8EADB] text-[#2D5A34] font-medium">
        <span>🌿</span>
        <span>AirportMatrix 评测组</span>
      </span>
      <span v-if="formattedDate" class="hidden sm:inline">更新：{{ formattedDate }}</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const SECTION_MAP: Record<string, { name: string; link: string }> = {
  ranking: { name: '机场推荐排行榜', link: '/ranking/' },
  cheap: { name: '性价比与套餐指南', link: '/cheap/' },
  client: { name: '客户端配置教程', link: '/client/' },
  ai: { name: 'AI 与流媒体解锁', link: '/ai/' },
  tech: { name: '专线与协议技术', link: '/tech/' },
  faq: { name: '故障诊断中心', link: '/faq/' },
  website: { name: '海外网站访问指南', link: '/website/' },
  matrix: { name: '网络工程深度矩阵', link: '/matrix/' },
  free: { name: '试用与安全避坑', link: '/free/' }
}

const cleanPath = computed(() => (page.value.relativePath || '').replace(/\.md$/, ''))

const showBreadcrumb = computed(() => {
  if (page.value.isNotFound) return false
  if (frontmatter.value?.layout === 'home') return false
  if (!cleanPath.value || cleanPath.value === 'index') return false
  return true
})

const segments = computed(() => cleanPath.value.split('/').filter(Boolean))

const sectionInfo = computed(() => {
  if (segments.value.length === 0) return null
  return SECTION_MAP[segments.value[0]] || null
})

const isSectionIndex = computed(() => {
  return segments.value.length === 2 && segments.value[1] === 'index'
})

const shortTitle = computed(() => {
  const raw = page.value.title || ''
  return raw.split(/[·：:|]/)[0].trim() || raw
})

const formattedDate = computed(() => {
  if (!page.value.lastUpdated) return ''
  const d = new Date(page.value.lastUpdated)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})
</script>

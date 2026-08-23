<template>
  <div class="crystal-nodes-section my-10 rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#FAFDF9] via-[#F4FAF3] to-[#EDF7EE] border border-[#78B890]/40 shadow-wood relative overflow-hidden">
    <!-- 顶部装饰发光纹理 -->
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#FFEAA7]/30 to-[#78B890]/20 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-[#78B890]/20 to-[#38543B]/10 rounded-full blur-3xl pointer-events-none" />

    <!-- 标题与副标题 -->
    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#DEC8AF]/40 pb-5">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-bold text-[#2D5A34] mb-2 shadow-xs">
          <span class="animate-pulse">⚡</span>
          <span>金色专线光纤脉络 · 翡翠水晶节点拓扑</span>
        </div>
        <h3 class="text-2xl font-extrabold text-[#233826] m-0 tracking-tight flex items-center gap-2">
          <span>🌿 全球水晶节点与 24h 专线链路监控</span>
        </h3>
        <p class="text-sm text-[#5C785F] mt-1 mb-0">
          基于 MAI-TEST-BOT 自动化集群 24h 不间断拨测，实时呈现跨境内网专线（IEPL/IPLC）延迟、丢包率与 AI/流媒体解锁生态。
        </p>
      </div>

      <!-- 场景过滤标签 -->
      <div class="flex flex-wrap gap-1.5 self-start md:self-auto">
        <button
          v-for="scenario in scenarios"
          :key="scenario.id"
          @click="activeScenario = scenario.id"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
            activeScenario === scenario.id
              ? 'bg-[#2D5A34] text-white shadow-md shadow-emerald-900/20 scale-105'
              : 'bg-white/90 text-[#38543B] border border-[#DEC8AF]/60 hover:bg-emerald-50'
          ]"
        >
          <span>{{ scenario.icon }}</span>
          <span class="ml-1">{{ scenario.name }}</span>
        </button>
      </div>
    </div>

    <!-- 水晶节点卡片矩阵 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
      <div
        v-for="node in filteredNodes"
        :key="node.id"
        class="group relative rounded-2xl bg-white/90 backdrop-blur-sm border border-[#DEC8AF]/60 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#78B890] cursor-pointer"
        @click="selectedNode = node"
      >
        <!-- 顶部高光条 -->
        <div class="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-[#78B890] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ node.flag }}</span>
            <div>
              <div class="font-bold text-sm text-[#233826] leading-tight">{{ node.name }}</div>
              <div class="text-[10px] text-[#705335] font-mono">{{ node.code }} · {{ node.line }}</div>
            </div>
          </div>
          <span class="flex h-2.5 w-2.5 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <!-- 关键数据指标 -->
        <div class="grid grid-cols-3 gap-1.5 my-3 py-2 px-2.5 rounded-xl bg-[#F6FBF5] border border-[#E1EFE3] text-center">
          <div>
            <div class="text-[10px] text-[#5C785F]">平均延迟</div>
            <div class="text-xs font-extrabold text-[#2D5A34] font-mono">{{ node.ping }}ms</div>
          </div>
          <div>
            <div class="text-[10px] text-[#5C785F]">丢包率</div>
            <div class="text-xs font-extrabold text-emerald-600 font-mono">{{ node.packetLoss }}%</div>
          </div>
          <div>
            <div class="text-[10px] text-[#5C785F]">突发带宽</div>
            <div class="text-xs font-extrabold text-amber-700 font-mono">{{ node.speed }}</div>
          </div>
        </div>

        <!-- 解锁与特性标签 -->
        <div class="flex flex-wrap gap-1 mt-2">
          <span 
            v-for="tag in node.features" 
            :key="tag" 
            class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EDF7EE] text-[#2D5A34] font-medium"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 底部金色光纤流速汇总条 -->
    <div class="mt-6 pt-4 border-t border-[#DEC8AF]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C785F] relative z-10">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span><strong>金色光纤总带宽</strong>：全网智能调度 120Gbps+ 冗余带宽池</span>
        <span class="hidden md:inline text-slate-300">|</span>
        <span class="hidden md:inline"><strong>主推承载</strong>：<a href="/ranking/guangsu" class="text-emerald-800 font-bold hover:underline">光速云 (70+ 原生)</a>、<a href="/ranking/sujie" class="text-emerald-800 font-bold hover:underline">速界 (AI专精)</a></span>
      </div>
      <a 
        href="/ranking/" 
        class="inline-flex items-center gap-1 font-bold text-[#2D5A34] hover:text-[#5E9E76] no-underline"
      >
        <span>查看 2026 完整天梯榜</span>
        <span>→</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeScenario = ref('all')
const selectedNode = ref<any>(null)

const scenarios = [
  { id: 'all', name: '全节点拓扑', icon: '🌐' },
  { id: 'rush', name: '晚高峰极速', icon: '⚡' },
  { id: 'ai', name: 'ChatGPT/Claude', icon: '🤖' },
  { id: 'streaming', name: '4K/8K 影音', icon: '🍿' }
]

const nodes = [
  {
    id: 'hk-01',
    flag: '🇭🇰',
    name: '香港 IEPL 翡翠 01',
    code: 'HKG-IEPL-01',
    line: '广港千兆专线',
    ping: 28,
    packetLoss: 0.0,
    speed: '2.5Gbps',
    scenarios: ['all', 'rush', 'streaming', 'ai'],
    features: ['4K秒开', '0丢包', '双向IEPL']
  },
  {
    id: 'jp-01',
    flag: '🇯🇵',
    name: '东京 IPLC 翡翠 02',
    code: 'NRT-IPLC-02',
    line: '沪日海底光纤',
    ping: 62,
    packetLoss: 0.0,
    speed: '2.0Gbps',
    scenarios: ['all', 'rush', 'streaming', 'ai'],
    features: ['低抖动', 'AbemaTV', 'ChatGPT']
  },
  {
    id: 'sg-01',
    flag: '🇸🇬',
    name: '新加坡 BGP 翡翠 03',
    code: 'SIN-BGP-03',
    line: '广新企业专线',
    ping: 54,
    packetLoss: 0.1,
    speed: '1.8Gbps',
    scenarios: ['all', 'rush', 'ai'],
    features: ['Claude 3.5', 'Gemini', 'TikTok']
  },
  {
    id: 'us-01',
    flag: '🇺🇸',
    name: '洛杉矶 原生家宽 04',
    code: 'LAX-RES-04',
    line: '中美超快专线',
    ping: 138,
    packetLoss: 0.0,
    speed: '1.5Gbps',
    scenarios: ['all', 'ai', 'streaming'],
    features: ['纯净家宽IP', 'Claude防封', 'HBO Max']
  }
]

const filteredNodes = computed(() => {
  if (activeScenario.value === 'all') return nodes
  return nodes.filter(n => n.scenarios.includes(activeScenario.value))
})
</script>

<style scoped>
.shadow-wood {
  box-shadow: 0 10px 30px rgba(56, 84, 59, 0.07), 0 2px 8px rgba(56, 84, 59, 0.04);
}
</style>

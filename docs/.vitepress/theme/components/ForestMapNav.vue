<template>
  <div class="forest-map-nav my-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#EEF7ED] via-[#F6FBF5] to-[#E5F3E4] border border-[#CDE5D0] shadow-forest-md">
    <div class="text-center max-w-2xl mx-auto mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#78B890]/40 text-xs font-semibold text-[#2D5A34] mb-3 shadow-sm">
        <span>🗺️</span>
        <span>森林全景知识地图</span>
      </div>
      <h2 class="text-2xl md:text-3xl font-extrabold text-[#233826] border-none m-0 pb-0">
        探索全球机场自然知识屋
      </h2>
      <p class="text-sm text-[#5C785F] mt-2 mb-0">
        点击森林中的知识路标，直达 2026 机场评测、客户端图文教程、AI 解锁与故障排查站
      </p>
    </div>

    <!-- 地图知识路标网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <a 
        v-for="node in mapNodes" 
        :key="node.link"
        :href="node.link"
        class="forest-node group relative block p-5 rounded-2xl bg-white/90 border border-[#D8EADB] hover:border-[#78B890] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg no-underline"
      >
        <div class="flex items-start gap-3.5">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-[#EBF5EB] group-hover:bg-[#78B890] transition-colors group-hover:scale-105 duration-300 shadow-sm">
            {{ node.icon }}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-[#233826] group-hover:text-[#437857] transition-colors m-0 border-none">
                {{ node.title }}
              </h3>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F4ECE1] text-[#705335]">
                {{ node.badge }}
              </span>
            </div>
            <p class="text-xs text-[#5C785F] mt-1.5 line-clamp-2 mb-0 leading-relaxed">
              {{ node.desc }}
            </p>
          </div>
        </div>

        <div class="mt-3 pt-2.5 border-t border-[#E1EFE3] flex items-center justify-between text-xs text-[#78B890] font-medium group-hover:text-[#437857]">
          <span>探索该区域知识</span>
          <span class="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapNodes = [
  {
    icon: '🏆',
    title: '机场天梯排行榜',
    badge: 'P1 核心',
    link: '/ranking/',
    desc: '2026 年度稳定专线、老牌机场与高性价比梯队综合量化测速横评。'
  },
  {
    icon: '💰',
    title: '性价比与省钱专区',
    badge: '高性价比',
    link: '/ranking/budget',
    desc: '14.9~20元真实月付与约7元/月年付专线横评，附按量不限时与优惠码。'
  },
  {
    icon: '📱',
    title: '全平台客户端配置',
    badge: 'P3 图文',
    link: '/client/',
    desc: 'Clash Verge Rev、Shadowrocket (小火箭)、v2rayN、sing-box 保姆级教程。'
  },
  {
    icon: '🤖',
    title: 'AI与流媒体解锁',
    badge: 'P4 场景',
    link: '/ai/',
    desc: 'ChatGPT / Claude / Gemini 原生 IP 解锁与 Netflix / Disney+ 4K 测速。'
  },
  {
    icon: '⚡',
    title: '顶级 IEPL 专线与技术',
    badge: '顶级专线',
    link: '/ranking/iepl-iplc',
    desc: '物理内网专线横评，深入解析 IEPL vs IPLC 与现代加密协议性能。'
  },
  {
    icon: '🚨',
    title: '网络故障急救诊断',
    badge: '长尾 FAQ',
    link: '/faq/',
    desc: '节点全红/超时、TIMEOUT、订阅更新失败、本地代理异常一键排查。'
  },
  {
    icon: '🛡️',
    title: '低门槛试用与避坑',
    badge: '安全选型',
    link: '/free/trial',
    desc: '对比注册试用、1元尝鲜与公共节点风险，安全验证晚高峰真实速度。'
  },
  {
    icon: '🌐',
    title: '海外网站急救手册',
    badge: '小白入口',
    link: '/website/',
    desc: '国外网站打不开、Google / YouTube / 学术搜索进不去排查指南。'
  },
  {
    icon: '🌲',
    title: '森林自然知识屋',
    badge: '站长寄语',
    link: '/',
    desc: '秉持客观、透明、科学的测速态度，为你守护全天候稳定高速的网络体验。'
  }
]
</script>

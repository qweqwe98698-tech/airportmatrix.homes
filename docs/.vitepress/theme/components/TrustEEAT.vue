<template>
  <div class="trust-eeat-section my-12 rounded-3xl p-6 md:p-8 bg-white border border-[#DEC8AF]/70 shadow-sm">
    <div class="max-w-3xl mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#246B45] text-xs font-bold mb-2 border border-emerald-200">
        <span>🛡️</span>
        <span>E-E-A-T 独立评测与安全审计标准</span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold text-[#0F172A] m-0 tracking-tight">
        为什么选择 AirportMatrix 作为你的决策向导？
      </h3>
      <p class="text-sm text-[#5C785F] mt-2 mb-0 leading-relaxed">
        我们深知网络访问工具的稳定性与安全性对你的生产力至关重要。AirportMatrix 坚守 5 项严苛评测原则，拒绝任何形式的“云测评”与虚假宣传。
      </p>
    </div>

    <!-- 5 大信任指标卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="item in trustPoints"
        :key="item.title"
        class="p-4 rounded-2xl bg-[#FAFDF9] border border-[#E1EFE3] hover:border-[#246B45] transition-colors"
      >
        <div class="text-2xl mb-2">{{ item.icon }}</div>
        <h4 class="text-sm font-bold text-[#0F172A] m-0 mb-1.5">{{ item.title }}</h4>
        <p class="text-xs text-[#5C785F] m-0 leading-relaxed">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const trustPoints = [
  {
    icon: '⚡',
    title: '24h 自动化真机压测',
    desc: '基于 MAI-TEST-BOT 集群在电信/联通/移动三网 24h 持续压测，记录晚高峰真实丢包与延迟。'
  },
  {
    icon: '💰',
    title: '透明换算真实月付',
    desc: '拒绝年付低价障眼法，严谨拆解真实月付成本与不限时按量资费，避免预算踩坑。'
  },
  {
    icon: '🤖',
    title: '100% 原生住宅 IP 验证',
    desc: '对 ChatGPT、Claude、Netflix 等平台实施全节点 ASN 溯源，标记真实解锁能力。'
  },
  {
    icon: '🚨',
    title: '跑路与风险预警数据库',
    desc: '建立服务商生命周期监控模型，对经营异常、虚标超售、失联风险第一时间发布黄牌预警。'
  },
  {
    icon: '📱',
    title: '真机保姆级实操图文',
    desc: '涵盖 Windows、Mac、iOS、Android 全平台客户端配置 step-by-step 教程，新手 3 分钟上手。'
  }
]
</script>

<template>
  <div class="top-podium-section my-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <span>🏆</span>
          <span>年度核心评测精选</span>
        </div>
        <h3 class="text-2xl md:text-3xl font-extrabold text-[#0F172A] m-0 tracking-tight">
          2026 机场综合实力天梯榜 (TOP 4 旗舰)
        </h3>
        <p class="text-sm text-[#5C785F] mt-1.5 mb-0">
          从 42 家收录机场数据库甄选前四旗舰：兼顾 2020 老牌信誉、IEPL 物理专线稳定性、测速实测快照与透明价格区间。
        </p>
      </div>

      <a
        href="/ranking/"
        class="inline-flex items-center gap-1 font-bold text-[#246B45] hover:text-[#2563EB] text-sm !no-underline group"
      >
        <span>查看完整 42 家天梯矩阵</span>
        <span class="group-hover:translate-x-1 transition-transform">→</span>
      </a>
    </div>

    <!-- 4 大旗舰卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="item in topAirports"
        :key="item.id"
        class="relative rounded-2xl bg-white border p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
        :class="item.borderClass"
      >
        <!-- 冠亚季军角标 -->
        <div class="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-extrabold shadow-sm" :class="item.badgeClass">
          {{ item.rankBadge }}
        </div>

        <div class="pt-2">
          <div class="flex items-center justify-between mt-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ item.icon }}</span>
              <div>
                <h4 class="text-lg font-bold text-[#0F172A] m-0">{{ item.name }}</h4>
                <div class="text-[11px] text-[#5C785F]">{{ item.opened }} · {{ item.lineType }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-base font-black text-amber-600 font-mono">★ {{ item.score }}</div>
              <div class="text-[10px] text-slate-400 font-medium">综合评级</div>
            </div>
          </div>

          <!-- 价格与流量 -->
          <div class="bg-[#F8FAF9] p-3 rounded-xl border border-slate-100 mb-3 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500">入门资费：</span>
              <span class="font-extrabold text-[#246B45] text-sm">{{ item.price }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500">基础流量：</span>
              <span class="font-semibold text-slate-700">{{ item.traffic }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500">专属优惠：</span>
              <span class="font-bold text-amber-700 font-mono bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">{{ item.promo }}</span>
            </div>
          </div>

          <!-- 亮点清单 -->
          <ul class="text-xs text-[#38543B] space-y-1.5 pl-0 list-none my-3">
            <li v-for="point in item.highlights" :key="point" class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold shrink-0">✔</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center gap-2">
          <a
            :href="item.reviewUrl"
            class="flex-1 text-center py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#246B45] font-bold text-xs border border-emerald-300 transition-colors !no-underline"
          >
            📖 深度评测
          </a>
          <a
            :href="item.affUrl"
            target="_blank"
            rel="nofollow sponsored noopener"
            class="flex-1 text-center py-2 px-2.5 rounded-xl bg-[#246B45] hover:bg-[#1D5436] text-white font-bold text-xs shadow-sm transition-all !no-underline !text-white"
          >
            直达官网 →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const topAirports = [
  {
    id: 'guangsu',
    name: '光速云',
    icon: '⚡',
    opened: '2020年老牌',
    lineType: 'IEPL 内网专线',
    score: '9.9',
    price: '约 ¥7.5 / 月',
    traffic: '59 GB / 月起',
    promo: 'AMM (8折)',
    rankBadge: '🥇 综合第一 · 全能旗舰',
    badgeClass: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    borderClass: 'border-amber-400 ring-2 ring-amber-400/20',
    highlights: [
      '5年老牌高信誉，物理专线不过墙',
      'VLESS 协议，晚高峰 4K/8K 秒开',
      '70+ 节点全流媒体与 AI 原生解锁'
    ],
    reviewUrl: '/ranking/guangsu',
    affUrl: 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y'
  },
  {
    id: 'feimao',
    name: '飞猫云',
    icon: '🐱',
    opened: '2023年运营',
    lineType: 'IEPL 专线',
    score: '9.8',
    price: '约 ¥7.0 / 月',
    traffic: '50 GB / 月起',
    promo: 'flycat888 (88折)',
    rankBadge: '🥈 最佳性价比 · 平价专线',
    badgeClass: 'bg-slate-700 text-white',
    borderClass: 'border-slate-200',
    highlights: [
      '个位数月均成本，入门无负担',
      '自研客户端，新手 1 分钟开箱即用',
      '主流 Google/学术/流媒体顺畅'
    ],
    reviewUrl: '/ranking/feimao',
    affUrl: 'https://guangs.flycataff.com/#/?code=6uq0Xe9y'
  },
  {
    id: 'weifeng',
    name: '微风网络',
    icon: '🍃',
    opened: '2023年运营',
    lineType: 'IEPL 专线',
    score: '9.8',
    price: '约 ¥7.0 / 月',
    traffic: '50 GB / 月起',
    promo: 'flat888 (9折)',
    rankBadge: '🥉 小而美轻量 · 稳定低丢包',
    badgeClass: 'bg-amber-800 text-white',
    borderClass: 'border-slate-200',
    highlights: [
      '小而美轻量专线，平均丢包 < 0.2%',
      '适合外贸邮件与学术文献科研',
      '提供 Windows/Mac/Android 自研 App'
    ],
    reviewUrl: '/ranking/weifeng',
    affUrl: 'https://edp01.breezenetaff.com/#/?code=t3huofyI'
  },
  {
    id: 'xingdao',
    name: '星岛梦',
    icon: '🏝️',
    opened: '2020年老牌',
    lineType: '企业内网专线',
    score: '9.7',
    price: '约 ¥8.0 / 月',
    traffic: '60GB / 不限时',
    promo: 'nmw888 (85折)',
    rankBadge: '🏅 5年老牌 · 不限时按量',
    badgeClass: 'bg-emerald-700 text-white',
    borderClass: 'border-slate-200',
    highlights: [
      '提供不限时按量包，流量永不过期',
      '5年老牌抗封锁，最佳灾备选择',
      '支持全平台第三方客户端一键导入'
    ],
    reviewUrl: '/ranking/xingdao',
    affUrl: 'https://sahude.nmdmyaff.com/#/?code=372F5u6j'
  }
]
</script>

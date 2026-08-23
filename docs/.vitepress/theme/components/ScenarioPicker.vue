<template>
  <div id="scenario-picker" class="scenario-picker-section my-12 rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#FAFDF9] to-[#F1F8F0] border border-[#78B890]/40 shadow-wood">
    <div class="text-center max-w-2xl mx-auto mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#246B45] text-xs font-bold mb-2">
        <span>🧭</span>
        <span>智能决策向导</span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold text-[#0F172A] m-0 tracking-tight">
        你需要什么网络场景？按需精准选型
      </h3>
      <p class="text-sm text-[#5C785F] mt-2 mb-0">
        告别无脑盲选与踩坑。根据你最核心的使用诉求，一键锁定经过严格实测的专属机场解决方案。
      </p>
    </div>

    <!-- 四大核心场景卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="item in scenarios"
        :key="item.title"
        class="group relative rounded-2xl bg-white p-5 border border-[#DEC8AF]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#246B45] flex flex-col justify-between"
      >
        <div>
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-xs" :class="item.bgClass">
            {{ item.icon }}
          </div>
          <h4 class="text-lg font-bold text-[#0F172A] m-0 group-hover:text-[#246B45] transition-colors">
            {{ item.title }}
          </h4>
          <p class="text-xs text-[#5C785F] mt-1.5 mb-3 leading-relaxed">
            {{ item.desc }}
          </p>
          
          <div class="space-y-1.5 pt-2 border-t border-slate-100 mb-4">
            <div v-for="feature in item.features" :key="feature" class="flex items-center gap-1.5 text-xs text-[#38543B]">
              <span class="text-emerald-500 font-bold">✓</span>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="text-[11px] text-[#705335] font-semibold mb-2 bg-[#F6FBF5] px-2.5 py-1 rounded-lg border border-[#E1EFE3]">
            🎯 首选推荐：<span class="font-bold text-[#246B45]">{{ item.recommended }}</span>
          </div>
          <a
            :href="item.link"
            class="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#246B45] hover:bg-[#1D5436] text-white font-bold text-xs shadow-sm transition-all !no-underline !text-white"
          >
            <span>{{ item.btnText }}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scenarios = [
  {
    icon: '🤖',
    title: 'AI 大模型专精',
    bgClass: 'bg-blue-50 text-blue-700',
    desc: '专为 ChatGPT、Claude 3.5 Sonnet、Gemini、Perplexity 打造，杜绝地区限制与 IP 封号。',
    features: ['100% 纯净原生住宅 IP', '0 Access Denied 报错', '长对话低延迟不中断'],
    recommended: '光速云 (70+ 原生) · 速界 (AI专精)',
    btnText: '查看 AI 专精评测',
    link: '/ai/chatgpt-access'
  },
  {
    icon: '🎬',
    title: '4K / 8K 流媒体影音',
    bgClass: 'bg-amber-50 text-amber-700',
    desc: '面向 Netflix 奈飞、YouTube 4K/8K、Disney+、HBO Max 重度追剧与大带宽吞吐用户。',
    features: ['800+ Mbps 瞬时下行', '全区片库原生解锁', '晚高峰 0 丢包不降速'],
    recommended: '一翻云 (150G月付) · 光速云',
    btnText: '查看流媒体大流量榜',
    link: '/ranking/yifanyun'
  },
  {
    icon: '💻',
    title: '外贸办公与科研查阅',
    bgClass: 'bg-emerald-50 text-emerald-700',
    desc: '面向 Google 学术、GitHub 代码加速、Gmail 邮件收发与日常海外社交，低预算高稳定。',
    features: ['约 7 元/月极低门槛', 'IEPL 企业级专线', '自研轻量客户端开箱即用'],
    recommended: '飞猫云 (约7元) · 微风网络',
    btnText: '查看平价轻量专线',
    link: '/cheap/10-yuan'
  },
  {
    icon: '🏝️',
    title: '低频使用与应急备用',
    bgClass: 'bg-purple-50 text-purple-700',
    desc: '偶尔查资料、差旅出行或主力线路受损时的抗封锁灾备神器，流量永久不过期。',
    features: ['不限时按量计费包', '5 年老牌抗封锁沉淀', '流量永不清零不过期'],
    recommended: '星岛梦 (不限时按量包)',
    btnText: '查看不限时备用方案',
    link: '/ranking/xingdao'
  }
]
</script>

<style scoped>
.shadow-wood {
  box-shadow: 0 12px 32px rgba(36, 107, 69, 0.08), 0 2px 6px rgba(36, 107, 69, 0.04);
}
</style>

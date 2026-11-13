<template>
  <aside
    v-if="showCluster"
    aria-label="相关专题与上下游导航"
    class="doc-related-cluster mt-10 mb-4 rounded-2xl bg-gradient-to-br from-[#F6FBF5] to-[#FCFAF6] border border-[#D8EADB] p-5 shadow-sm"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#D8EADB]/80">
      <div>
        <div class="text-xs font-bold text-[#2D5A34] flex items-center gap-1.5">
          <span>🧭</span>
          <span>延伸阅读与专题枢纽导航</span>
        </div>
        <p class="text-xs text-[#5C785F] m-0 mt-0.5">
          基于当前主题为您串联上下游评测、选型对比与实操配置指南
        </p>
      </div>
      <a
        href="/methodology"
        class="text-[11px] text-[#5C785F] hover:text-[#246B45] !no-underline shrink-0"
      >
        📊 查看独立评测方法论与商业披露 →
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <a
        v-for="item in relatedLinks"
        :key="item.link"
        :href="item.link"
        class="group block p-3.5 rounded-xl bg-white border border-[#D8EADB] hover:border-[#78B890] transition-all !no-underline shadow-xs"
      >
        <div class="text-[11px] font-semibold text-[#705335] mb-1">{{ item.badge }}</div>
        <div class="text-sm font-bold text-[#233826] group-hover:text-[#246B45] transition-colors">
          {{ item.title }}
        </div>
        <div class="text-xs text-[#5C785F] mt-1 leading-relaxed">{{ item.desc }}</div>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface ClusterLink {
  badge: string
  title: string
  link: string
  desc: string
}

const { page, frontmatter } = useData()

const cleanPath = computed(() => (page.value.relativePath || '').replace(/\.md$/, ''))

const showCluster = computed(() => {
  if (page.value.isNotFound) return false
  if (frontmatter.value?.layout === 'home') return false
  const p = cleanPath.value
  if (!p || p === 'index' || ['about', 'privacy', 'disclosure', 'methodology'].includes(p)) {
    return false
  }
  return true
})

const CLUSTER_MAP: Record<string, ClusterLink[]> = {
  ranking: [
    { badge: '上级总榜', title: '2026 42家机场推荐天梯榜', link: '/ranking/', desc: '42家收录品牌全参数对比、18家实测/解锁图与价格类型区分' },
    { badge: '高性价比', title: '2026 性价比机场精选', link: '/ranking/budget', desc: '覆盖 5.6~8 元年付折算与 14.9~20 元真实月付横向对比' },
    { badge: '优惠总表', title: '42家机场优惠码与入口大全', link: '/cheap/coupon', desc: '一键复制全站独家折扣码并直达核实入口' }
  ],
  cheap: [
    { badge: '核心榜单', title: '2026 性价比机场推荐榜', link: '/ranking/budget', desc: '15~20 元真实月付与 7 元年付专线客观对比' },
    { badge: '深度实测', title: '飞猫云约 7 元专线评测', link: '/ranking/feimao', desc: '50GB 轻量年付折算实测、自研客户端与优惠码' },
    { badge: '按量备选', title: '星岛梦不限时按量评测', link: '/ranking/xingdao', desc: '5 年老牌永久不过期流量包与备用容灾指南' }
  ],
  client: [
    { badge: '选机决策', title: '2026 机场推荐排行榜', link: '/ranking/', desc: '查看兼容 Clash / 小火箭 / sing-box 的稳定专线' },
    { badge: 'AI 场景', title: 'ChatGPT 访问与原生 IP 指南', link: '/ai/chatgpt-access', desc: '解决地区不可用、1020 报错与分流规则配置' },
    { badge: '故障排查', title: '节点超时与全红修复手册', link: '/faq/timeout-troubleshoot', desc: '系统时间、订阅失败与端口冲突 30 秒自检' }
  ],
  ai: [
    { badge: 'AI 专精评测', title: '速界原生双 ISP 专线评测', link: '/ranking/sujie', desc: '面向 ChatGPT / Claude 低风控环境的专线实测' },
    { badge: '旗舰全解锁', title: '光速云 70 节点解锁实测', link: '/ranking/guangsu', desc: '5 年老牌 IEPL 专线与全区流媒体/AI 测试报告' },
    { badge: '底层原理', title: '原生 IP 与住宅家宽解析', link: '/tech/native-residential-ip', desc: '识别数据中心 ASN 与纯净住宅出口的核心指标' }
  ],
  tech: [
    { badge: '顶级专线榜', title: '顶级 IEPL / IPLC 专线横评', link: '/ranking/iepl-iplc', desc: '物理内网不过 GFW 的低延迟、零丢包机场榜单' },
    { badge: '稳定老牌', title: '2026 稳定抗封锁机场榜', link: '/ranking/stable', desc: '5 年老牌多入口容灾与敏感期可用率考察' },
    { badge: '工程矩阵', title: 'SEO / GEO 网络工程长文库', link: '/matrix/', desc: 'BGP 收敛、BBRv3 与 DoH/DoT 硬化分布式探针实测' }
  ],
  faq: [
    { badge: '客户端教程', title: '全平台客户端选型与下载', link: '/client/', desc: 'Windows / macOS / iOS / Android 官方开源客户端' },
    { badge: '备用防失联', title: '按量计费不限时流量包', link: '/cheap/pay-as-you-go', desc: '配置星岛梦等按量备用订阅，防止主力维护断网' },
    { badge: '网站急救', title: '国外网站打不开排查', link: '/website/cannot-open-websites', desc: 'DNS 污染、代理端口与分流规则逐项定位' }
  ],
  website: [
    { badge: '核心推荐', title: '2026 稳定机场推荐总榜', link: '/ranking/', desc: '挑选晚高峰低丢包、支持智能分流的专线服务' },
    { badge: '平价入门', title: '10 元左右入门机场评测', link: '/cheap/10-yuan', desc: '低门槛查阅学术文献、Google 与 GitHub 加速' },
    { badge: '故障诊断', title: '订阅链接更新失败修复', link: '/faq/subscription-error', desc: '解决 Fetch Failed 与客户端网络接管异常' }
  ],
  matrix: [
    { badge: '榜单落地', title: '2026 机场推荐排行榜', link: '/ranking/', desc: '将 BGP/IEPL 工程参数落地到 42 家实测与归档品牌选型' },
    { badge: '顶级专线', title: '顶级 IEPL / IPLC 专线横评', link: '/ranking/iepl-iplc', desc: '对比主流 IEPL 物理专线延迟与三网吞吐表现' },
    { badge: '技术词典', title: '专线技术与协议科普专区', link: '/tech/', desc: '快速掌握 IEPL/IPLC、原生 IP 与 SS2022/VLESS 基础' }
  ],
  free: [
    { badge: '安全低价替代', title: '2026 性价比机场推荐榜', link: '/ranking/budget', desc: '告别公共节点窃密风险，7~15 元月享独立专线' },
    { badge: '轻量入门', title: '飞猫云 约 7 元专线实测', link: '/ranking/feimao', desc: '低门槛 IEPL 专线与 50GB 轻度日常使用评测' },
    { badge: '老牌按量', title: '星岛梦不限时按量评测', link: '/ranking/xingdao', desc: '一次充值长期不过期，适合低频与应急备用' }
  ]
}

const relatedLinks = computed(() => {
  const seg = cleanPath.value.split('/')[0]
  const currentUrl = '/' + cleanPath.value.replace(/\/index$/, '/')
  const candidates = CLUSTER_MAP[seg] || CLUSTER_MAP.ranking
  return candidates.filter(c => c.link !== currentUrl).slice(0, 3)
})
</script>

<template>
  <div class="airport-compare-container my-8 rounded-2xl bg-white border border-[#D8EADB] p-5 shadow-forest-md">
    <!-- 顶部标题与搜索框 -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E1EFE3]">
      <div>
        <h3 class="text-lg font-bold text-[#233826] flex flex-wrap items-center gap-2 m-0">
          <span>🌿 2026 全球 {{ totalCount }} 家机场全参数横评罗盘</span>
          <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">18家实测/解锁图 · 42家完整清单</span>
        </h3>
        <p class="text-xs text-[#5C785F] mt-1 mb-0">
          严格区分【年付折算】、【真实月付】与【待核实/历史归档】 · 含独家优惠码与实测截图档案
        </p>
      </div>

      <!-- 实时检索框 -->
      <div class="relative w-full lg:w-64 shrink-0">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 搜品牌/优惠码/协议（如 无忧 / VLESS）"
          class="w-full px-3 py-1.5 pr-8 text-xs rounded-xl border border-[#C7DFCB] bg-[#F7FBF7] text-[#233826] focus:outline-none focus:border-[#78B890]"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
          aria-label="清空搜索"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 分类筛选器 -->
    <div class="flex flex-wrap gap-1.5 mb-5">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-2.5 py-1.2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer',
          activeTab === tab.id
            ? 'bg-[#78B890] text-white shadow-sm font-semibold'
            : 'bg-[#F2F9F2] text-[#38543B] hover:bg-[#E2F0E3]'
        ]"
      >
        {{ tab.name }} ({{ getCategoryCount(tab.id) }})
      </button>
    </div>

    <!-- 横评表格滑动容器 -->
    <div class="table-scroll-wrapper overflow-x-auto w-full pb-1">
      <table class="w-full text-left text-sm min-w-[760px]">
        <thead>
          <tr class="bg-[#EEF7ED] text-[#233826] text-xs uppercase">
            <th class="p-3 pl-4 rounded-l-xl font-bold whitespace-nowrap min-w-[140px]">机场品牌 / 状态</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[105px]">价格 / 类型</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[140px]">月流量 / 线路</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[90px]">协议</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[125px]">优惠码</th>
            <th class="p-3 font-bold text-center whitespace-nowrap min-w-[95px]">实测 / 参考</th>
            <th class="p-3 pr-4 rounded-r-xl font-bold text-center whitespace-nowrap min-w-[100px]">官网入口</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1EFE3]">
          <tr
            v-for="item in filteredAirports"
            :key="item.id"
            :class="[
              'transition-colors',
              item.tierGroup === 'legacy' ? 'bg-slate-50/60 hover:bg-slate-100/70' : 'hover:bg-[#F8FCF8]'
            ]"
          >
            <!-- 品牌与开业/状态 -->
            <td class="p-3 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span class="text-lg shrink-0">{{ item.icon }}</span>
                <div>
                  <div class="flex items-center gap-1.5">
                    <a
                      v-if="item.reviewUrl"
                      :href="item.reviewUrl"
                      class="font-bold text-[#233826] hover:text-[#5E9E76] text-sm !no-underline flex items-center gap-1 group"
                      title="点击阅读深度测评文章"
                    >
                      <span class="group-hover:underline underline-offset-2">{{ item.name }}</span>
                      <span class="text-[10px] text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.2 rounded font-medium border border-emerald-300">评测</span>
                    </a>
                    <span v-else class="font-bold text-[#233826] text-sm">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-[10px] text-[#5C785F]">{{ item.opened }}</span>
                    <span
                      :class="[
                        'text-[9px] px-1 py-0 rounded font-medium',
                        item.dataStatus === 'measured'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.dataStatus === 'vendor'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                      ]"
                    >
                      {{ statusLabel(item.dataStatus) }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- 价格与价格类型 -->
            <td class="p-3 whitespace-nowrap">
              <div class="font-extrabold text-[#2D5A34] text-sm leading-none">{{ item.price }}</div>
              <span
                :class="[
                  'inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold mt-1',
                  item.priceType === '年付折算' || item.priceType === '季付折算'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : item.priceType === '待核实'
                      ? 'bg-slate-200 text-slate-700 border border-slate-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                ]"
              >
                {{ item.priceType }}
              </span>
            </td>

            <!-- 流量与线路 -->
            <td class="p-3 max-w-[210px]">
              <div class="font-semibold text-xs text-[#233826] truncate" :title="item.traffic">{{ item.traffic }}</div>
              <div class="text-[10px] text-[#5C785F] mt-0.5 truncate" :title="item.lineType">{{ item.lineType }}</div>
            </td>

            <!-- 协议 -->
            <td class="p-3 whitespace-nowrap">
              <div class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E5F3E4] text-[#2D5A34]">
                {{ item.protocols }}
              </div>
            </td>

            <!-- 优惠码 -->
            <td class="p-3 whitespace-nowrap">
              <div class="flex items-center gap-1">
                <code class="text-xs bg-[#F4ECE1] text-[#8C6239] px-1.5 py-0.5 rounded font-mono font-bold border border-[#DEC8AF]">
                  {{ item.promoCode }}
                </code>
                <button
                  v-if="item.promoCode && !['待核实', '无公开优惠码'].includes(item.promoCode)"
                  @click="copyCode(item.promoCode)"
                  class="text-[10px] px-1 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors whitespace-nowrap"
                  title="点击复制优惠码"
                >
                  {{ copiedCode === item.promoCode ? '✓' : '复制' }}
                </button>
              </div>
              <div class="text-[10px] text-[#705335] mt-0.5 max-w-[160px] truncate" :title="item.promoDesc">{{ item.promoDesc }}</div>
            </td>

            <!-- 实测图 / 参数档案弹窗 -->
            <td class="p-3 text-center whitespace-nowrap">
              <button
                v-if="item.speedtestImage"
                @click="openModal(item)"
                class="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2D5A34] border border-emerald-300 font-semibold cursor-pointer transition-colors whitespace-nowrap shadow-xs"
              >
                <span>📸</span>
                <span class="whitespace-nowrap">实测图</span>
              </button>
              <button
                v-else
                @click="openModal(item)"
                class="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium cursor-pointer transition-colors whitespace-nowrap"
              >
                <span>📋</span>
                <span class="whitespace-nowrap">{{ item.nonPeakRef ? '参考表' : '待实测' }}</span>
              </button>
            </td>

            <!-- 直达链接 -->
            <td class="p-3 pr-4 text-center whitespace-nowrap">
              <a
                v-if="item.affUrl"
                :href="item.affUrl"
                target="_blank"
                rel="nofollow sponsored noopener"
                class="inline-flex items-center justify-center gap-1 px-3 py-1.2 text-xs rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white font-bold shadow-sm transition-all !text-white !no-underline hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                style="text-decoration: none !important;"
              >
                <span class="whitespace-nowrap">直达官网</span>
                <span class="text-[10px]">→</span>
              </a>
              <span
                v-else
                class="inline-flex items-center justify-center px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap"
                title="历史清单暂未提供独立推广入口，请核实官方渠道"
              >
                入口待核实
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredAirports.length === 0" class="text-center py-8 text-sm text-[#5C785F]">
        未找到匹配「{{ searchQuery }}」的品牌记录，请尝试清空筛选条件或更换关键词。
      </div>
    </div>

    <!-- 底部保障说明 -->
    <div class="mt-4 pt-3 border-t border-[#E1EFE3] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#5C785F] gap-2">
      <div>
        <span>🌱 数据声明：实测图源自 2026-08-11 MAI-TEST-BOT / 2026-07-18 MiaoKo 当次快照，仅代表测试当时线路与环境，不代表长期表现；后排 13 家标注历史/待核实。</span>
      </div>
      <div class="shrink-0">
        <span class="text-amber-700 font-semibold">⚠️ 含推广链接，通过链接注册可能为本站带来佣金，不影响用户支付价格。</span>
      </div>
    </div>

    <!-- 实测图 & 品牌详情 Lightbox 弹窗 -->
    <transition name="fade">
      <div
        v-if="modalBrand"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ modalBrand.icon }}</span>
              <div>
                <h4 class="font-bold text-base text-[#233826] m-0">
                  {{ modalBrand.name }} · {{ modalImage ? '节点测速与解锁实测图' : '品牌资料与参考参数档案' }}
                </h4>
                <p class="text-xs text-[#5C785F] m-0">
                  {{ modalBrand.lineType }} · {{ modalBrand.protocols }} · {{ statusLabel(modalBrand.dataStatus) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a
                v-if="modalBrand.reviewUrl"
                :href="modalBrand.reviewUrl"
                class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold !no-underline flex items-center gap-1 cursor-pointer"
              >
                <span>📖</span>
                <span>深度测评</span>
              </a>
              <a
                v-if="modalBrand.affUrl"
                :href="modalBrand.affUrl"
                target="_blank"
                rel="nofollow sponsored noopener"
                class="px-3.5 py-1.5 rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white text-xs font-semibold !text-white no-underline"
              >
                前往 {{ modalBrand.name }} 官网
              </a>
              <button
                @click="closeModal"
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- 多图切换标签（光速云 6 张 / 无忧链接 2 张） -->
          <div v-if="modalBrand.unlockImages && modalBrand.unlockImages.length > 0" class="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-gray-100">
            <button
              v-for="img in modalBrand.unlockImages"
              :key="img.src"
              @click="modalImage = img.src"
              :class="[
                'px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all',
                modalImage === img.src
                  ? 'bg-[#78B890] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
              ]"
            >
              {{ img.title }}
            </button>
          </div>

          <div class="flex-1 overflow-auto space-y-3">
            <!-- 结构化背景信息栏 -->
            <div class="rounded-xl bg-[#F6FBF6] border border-[#D8EADB] p-3 text-xs text-[#233826] space-y-1.5">
              <div v-if="modalBrand.measuredInfo">
                <strong>🔬 截图测速条件：</strong>{{ modalBrand.measuredInfo.testedAt }} · {{ modalBrand.measuredInfo.tool }}（{{ modalBrand.measuredInfo.summary }}）
              </div>
              <div v-if="modalBrand.nonPeakRef">
                <strong>📊 参考基准记录：</strong>{{ modalBrand.nonPeakRef }}
              </div>
              <div v-if="modalBrand.packagesSummary">
                <strong>💰 套餐清单摘要：</strong>{{ modalBrand.packagesSummary }}
              </div>
              <div v-if="modalBrand.altPromoCode || modalBrand.urlNote" class="text-amber-800">
                <span v-if="modalBrand.altPromoCode">🎟️ 备选/正文优惠码：{{ modalBrand.altPromoCode }} · </span>
                <span v-if="modalBrand.urlNote">⚠️ 链接/状态说明：{{ modalBrand.urlNote }}</span>
              </div>
            </div>

            <!-- 实测图展示区 -->
            <div v-if="modalImage" class="rounded-xl bg-slate-950 flex items-center justify-center p-2">
              <img
                :src="modalImage"
                :alt="modalBrand.name + ' 节点测速或流媒体解锁实测截图'"
                class="max-w-full max-h-[58vh] object-contain rounded shadow-lg"
              />
            </div>
            <div v-else class="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-6 text-center text-xs text-slate-600">
              <p class="font-semibold text-sm text-slate-800 mb-1">📋 该品牌当前暂无独立测速截图归档（Not Tested / Vendor Data）</p>
              <p class="m-0">站点严格遵守不伪造测速图原则：以上套餐与特点源自品牌方公开资料或历史归档，选购高价周期前请优先购买月付实测。</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AIRPORTS_DATA, TOTAL_AIRPORTS_COUNT, AirportItem } from '../../data/airports'
import { showToast } from '../toast'

const totalCount = TOTAL_AIRPORTS_COUNT
const activeTab = ref('all')
const searchQuery = ref('')

onMounted(() => {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) searchQuery.value = q
  }
})
const modalImage = ref<string | null>(null)
const modalBrand = ref<AirportItem | null>(null)
const copiedCode = ref<string | null>(null)

const filterTabs = [
  { id: 'all', name: '全部' },
  { id: 'top10', name: '核心精选 Top 10' },
  { id: 'measured', name: '有实测/解锁图' },
  { id: 'budget_annual', name: '10元内年付' },
  { id: '15yuan', name: '15元内月付' },
  { id: '20yuan', name: '18~20元月付' },
  { id: '25yuan', name: '24元+ 150GB' },
  { id: 'payg', name: '不限时流量包' },
  { id: 'ai', name: 'AI 场景支持' },
  { id: 'legacy', name: '后排历史参考' }
]

function statusLabel(status: AirportItem['dataStatus']) {
  if (status === 'measured') return '有图实测'
  if (status === 'vendor') return '品牌资料'
  if (status === 'historical') return '历史参考'
  return '待核实'
}

function getCategoryCount(catId: string) {
  if (catId === 'all') return AIRPORTS_DATA.length
  return AIRPORTS_DATA.filter(item => item.categories.includes(catId)).length
}

const filteredAirports = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return AIRPORTS_DATA.filter(item => {
    const matchesTab = activeTab.value === 'all' || item.categories.includes(activeTab.value)
    if (!matchesTab) return false
    if (!q) return true
    const haystack = [
      item.name,
      item.promoCode,
      item.altPromoCode || '',
      item.protocols,
      item.lineType,
      item.tagline,
      item.packagesSummary || '',
      ...item.tags
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

function openModal(item: AirportItem) {
  modalBrand.value = item
  modalImage.value = item.speedtestImage || null
}

function closeModal() {
  modalBrand.value = null
  modalImage.value = null
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  copiedCode.value = code
  showToast(`🍃 优惠码【${code}】已成功复制！`)
  setTimeout(() => {
    if (copiedCode.value === code) {
      copiedCode.value = null
    }
  }, 2500)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

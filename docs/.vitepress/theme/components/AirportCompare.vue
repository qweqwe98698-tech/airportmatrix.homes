<template>
  <div class="airport-compare-container my-8 rounded-2xl bg-white border border-[#D8EADB] p-5 shadow-forest-md">
    <!-- 过滤器与快捷筛选 -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E1EFE3]">
      <div>
        <h3 class="text-lg font-bold text-[#233826] flex items-center gap-2 m-0">
          <span>🌿 2026 全球 17 家机场全参数横评罗盘</span>
          <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">17家实测数据源</span>
        </h3>
        <p class="text-xs text-[#5C785F] mt-1 mb-0">严格区分【年付折算价】与【真实月付价】 · 附 2026 最新节点测速图与独家优惠码</p>
      </div>

      <!-- 分类筛选器 -->
      <div class="flex flex-wrap gap-1.5">
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
    </div>

    <!-- 横评表格滑动容器 -->
    <div class="table-scroll-wrapper overflow-x-auto w-full pb-1">
      <table class="w-full text-left text-sm min-w-[720px]">
        <thead>
          <tr class="bg-[#EEF7ED] text-[#233826] text-xs uppercase">
            <th class="p-3 pl-4 rounded-l-xl font-bold whitespace-nowrap min-w-[110px]">机场品牌</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[95px]">价格 / 类型</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[120px]">月流量 / 线路</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[85px]">协议</th>
            <th class="p-3 font-bold whitespace-nowrap min-w-[110px]">独家优惠码</th>
            <th class="p-3 font-bold text-center whitespace-nowrap min-w-[85px]">实测图</th>
            <th class="p-3 pr-4 rounded-r-xl font-bold text-center whitespace-nowrap min-w-[95px]">直达官网</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1EFE3]">
          <tr 
            v-for="item in filteredAirports" 
            :key="item.id"
            class="hover:bg-[#F8FCF8] transition-colors"
          >
            <!-- 品牌与开业 -->
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
                  <div class="text-[10px] text-[#5C785F]">{{ item.opened }}</div>
                </div>
              </div>
            </td>

            <!-- 价格与价格类型 -->
            <td class="p-3 whitespace-nowrap">
              <div class="font-extrabold text-[#2D5A34] text-sm leading-none">{{ item.price }}</div>
              <span 
                :class="[
                  'inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold mt-0.5',
                  item.priceType === '年付折算' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                ]"
              >
                {{ item.priceType }}
              </span>
            </td>

            <!-- 流量与线路 -->
            <td class="p-3 whitespace-nowrap">
              <div class="font-semibold text-xs text-[#233826]">{{ item.traffic }}</div>
              <div class="text-[10px] text-[#5C785F] mt-0.5">{{ item.lineType }}</div>
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
                  @click="copyCode(item.promoCode)" 
                  class="text-[10px] px-1 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors whitespace-nowrap"
                  title="点击复制优惠码"
                >
                  {{ copiedCode === item.promoCode ? '✓' : '复制' }}
                </button>
              </div>
              <div class="text-[10px] text-[#705335] mt-0.5">{{ item.promoDesc }}</div>
            </td>

            <!-- 实测测速图 -->
            <td class="p-3 text-center whitespace-nowrap">
              <button 
                @click="openImage(item)"
                class="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2D5A34] border border-emerald-300 font-semibold cursor-pointer transition-colors whitespace-nowrap shadow-xs"
              >
                <span>📸</span>
                <span class="whitespace-nowrap">实测图</span>
              </button>
            </td>

            <!-- 直达链接 -->
            <td class="p-3 pr-4 text-center whitespace-nowrap">
              <a 
                :href="item.affUrl" 
                target="_blank" 
                rel="nofollow sponsored noopener" 
                class="inline-flex items-center justify-center gap-1 px-3 py-1.2 text-xs rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white font-bold shadow-sm transition-all !text-white !no-underline hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                style="text-decoration: none !important;"
              >
                <span class="whitespace-nowrap">直达官网</span>
                <span class="text-[10px]">→</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部保障说明 -->
    <div class="mt-4 pt-3 border-t border-[#E1EFE3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C785F] gap-2">
      <div>
        <span>🌱 真实性声明：17 家品牌均为独立运营服务商，测速图源自 MAI-TEST-BOT 实测节点快照。</span>
      </div>
      <div>
        <span class="text-amber-700 font-semibold">⚠️ 年付折算价非直接月付价，购买请按需选择付款周期。</span>
      </div>
    </div>

    <!-- 测速图大图 Lightbox 弹窗 -->
    <transition name="fade">
      <div 
        v-if="modalImage" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="modalImage = null"
      >
        <div class="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ modalBrand?.icon }}</span>
              <div>
                <h4 class="font-bold text-base text-[#233826] m-0">{{ modalBrand?.name }} · 节点测速与解锁实测图</h4>
                <p class="text-xs text-[#5C785F] m-0">{{ modalBrand?.lineType }} · {{ modalBrand?.protocols }} · 真实压测与流媒体/AI解锁数据</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a 
                v-if="modalBrand?.reviewUrl"
                :href="modalBrand.reviewUrl" 
                class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold !no-underline flex items-center gap-1 cursor-pointer"
              >
                <span>📖</span>
                <span>深度测评文章</span>
              </a>
              <a 
                :href="modalBrand?.affUrl" 
                target="_blank" 
                rel="nofollow sponsored noopener" 
                class="px-3.5 py-1.5 rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white text-xs font-semibold !text-white no-underline"
              >
                前往 {{ modalBrand?.name }} 官网
              </a>
              <button 
                @click="modalImage = null" 
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- 若有多张解锁/测速实测图，显示切换标签 -->
          <div v-if="modalBrand?.unlockImages && modalBrand.unlockImages.length > 0" class="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-gray-100">
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

          <div class="flex-1 overflow-auto rounded-xl bg-slate-950 flex items-center justify-center p-2">
            <img 
              :src="modalImage" 
              :alt="modalBrand?.name + ' 实测图'" 
              class="max-w-full max-h-[68vh] object-contain rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AIRPORTS_DATA, AirportItem } from '../../data/airports'
import { showToast } from '../toast'

const activeTab = ref('all')
const modalImage = ref<string | null>(null)
const modalBrand = ref<AirportItem | null>(null)
const copiedCode = ref<string | null>(null)

const filterTabs = [
  { id: 'all', name: '全部 17 家' },
  { id: 'veteran', name: '2020 老牌' },
  { id: 'budget_annual', name: '10元内年付' },
  { id: '15yuan', name: '15元左右月付' },
  { id: '20yuan', name: '20元主流月付' },
  { id: '25yuan', name: '25元 150GB 档' },
  { id: 'ai', name: 'AI 重点场景' },
  { id: 'vless', name: 'VLESS + IEPL' }
]

function getCategoryCount(catId: string) {
  if (catId === 'all') return AIRPORTS_DATA.length
  return AIRPORTS_DATA.filter(item => item.categories.includes(catId)).length
}

const filteredAirports = computed(() => {
  if (activeTab.value === 'all') return AIRPORTS_DATA
  return AIRPORTS_DATA.filter(item => item.categories.includes(activeTab.value))
})

function openImage(item: AirportItem) {
  modalBrand.value = item
  modalImage.value = item.speedtestImage
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

<template>
  <div class="fairy-assistant-root">
    <!-- 右下角悬浮治愈精灵球 -->
    <div 
      class="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      @click="isOpen = !isOpen"
    >
      <!-- 气泡提示语（非展开状态下定时提示） -->
      <transition name="fade">
        <div 
          v-if="!isOpen && showBubble" 
          class="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-[#78B890] shadow-lg text-xs font-bold text-[#246B45] animate-bounce"
        >
          <span>🧭</span>
          <span>不知道怎么选机场？输入你的场景需求，30秒为你匹配最佳方案 →</span>
          <button @click.stop="showBubble = false" class="text-gray-400 hover:text-gray-600 text-xs ml-1">✕</button>
        </div>
      </transition>

      <!-- 精灵触发圆形按钮 -->
      <button 
        class="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5E9E76] via-[#78B890] to-[#A1CCA5] p-0.5 shadow-forest-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white group"
        aria-label="召唤森之精灵芽芽"
      >
        <div class="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
          🧚
        </div>
        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white animate-ping"></span>
        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white"></span>
      </button>
    </div>

    <!-- 精灵交互弹窗对话框 -->
    <transition name="modal-pop">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs"
        @click.self="isOpen = false"
      >
        <div class="w-full max-w-lg rounded-3xl bg-[#F6FBF5] border-2 border-[#78B890] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <!-- 弹窗顶部精灵头部 -->
          <div class="bg-gradient-to-r from-[#78B890] to-[#5E9E76] p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                🧚
              </div>
              <div>
                <h3 class="font-bold text-base m-0 text-white">森之精灵 · 芽芽</h3>
                <p class="text-xs text-emerald-100 m-0">你的全天候网络与选机伴侣</p>
              </div>
            </div>
            <button 
              @click="isOpen = false" 
              class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- 弹窗主体内容 -->
          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <!-- 场景 1：30秒智能选机匹配 -->
            <div class="bg-white rounded-2xl p-4 border border-[#D8EADB] shadow-sm">
              <h4 class="text-sm font-bold text-[#233826] flex items-center gap-1.5 m-0 mb-2">
                <span>🎯</span>
                <span>30 秒新手需求极速导航</span>
              </h4>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <a 
                  href="/ranking/stable" 
                  @click="isOpen = false"
                  class="p-2.5 rounded-xl bg-[#F2F9F2] hover:bg-[#78B890] hover:text-white text-[#38543B] font-medium transition-colors text-center no-underline block"
                >
                  🛡️ 晚高峰稳定不卡顿
                </a>
                <a 
                  href="/cheap/10-yuan" 
                  @click="isOpen = false"
                  class="p-2.5 rounded-xl bg-[#F2F9F2] hover:bg-[#78B890] hover:text-white text-[#38543B] font-medium transition-colors text-center no-underline block"
                >
                  💰 学生党 / 10元平价
                </a>
                <a 
                  href="/ai/chatgpt-access" 
                  @click="isOpen = false"
                  class="p-2.5 rounded-xl bg-[#F2F9F2] hover:bg-[#78B890] hover:text-white text-[#38543B] font-medium transition-colors text-center no-underline block"
                >
                  🤖 ChatGPT/Claude 原生IP
                </a>
                <a 
                  href="/cheap/pay-as-you-go" 
                  @click="isOpen = false"
                  class="p-2.5 rounded-xl bg-[#F2F9F2] hover:bg-[#78B890] hover:text-white text-[#38543B] font-medium transition-colors text-center no-underline block"
                >
                  ⏱️ 不限时按量计费
                </a>
              </div>
            </div>

            <!-- 场景 2：故障快速急救直达 -->
            <div class="bg-white rounded-2xl p-4 border border-[#D8EADB] shadow-sm">
              <h4 class="text-sm font-bold text-[#233826] flex items-center gap-1.5 m-0 mb-2">
                <span>🚨</span>
                <span>网络故障速查</span>
              </h4>
              <div class="space-y-1.5 text-xs">
                <a 
                  href="/faq/timeout-troubleshoot" 
                  @click="isOpen = false"
                  class="flex items-center justify-between p-2 rounded-lg hover:bg-[#EEF7ED] text-[#38543B] no-underline"
                >
                  <span>🔴 节点测速全红 / 全部超时 TIMEOUT</span>
                  <span class="text-[#78B890]">解决 →</span>
                </a>
                <a 
                  href="/faq/subscription-error" 
                  @click="isOpen = false"
                  class="flex items-center justify-between p-2 rounded-lg hover:bg-[#EEF7ED] text-[#38543B] no-underline"
                >
                  <span>⚠️ 订阅链接更新失败 / 导入错误</span>
                  <span class="text-[#78B890]">解决 →</span>
                </a>
                <a 
                  href="/website/cannot-open-websites" 
                  @click="isOpen = false"
                  class="flex items-center justify-between p-2 rounded-lg hover:bg-[#EEF7ED] text-[#38543B] no-underline"
                >
                  <span>🌐 国外网站打不开 / Google 进不去</span>
                  <span class="text-[#78B890]">解决 →</span>
                </a>
              </div>
            </div>

            <!-- 场景 3：客户端保姆教程直达 -->
            <div class="bg-white rounded-2xl p-4 border border-[#D8EADB] shadow-sm">
              <h4 class="text-sm font-bold text-[#233826] flex items-center gap-1.5 m-0 mb-2">
                <span>📱</span>
                <span>全平台客户端小白教程</span>
              </h4>
              <div class="flex flex-wrap gap-2 text-xs">
                <a href="/client/clash-verge" @click="isOpen = false" class="px-2.5 py-1 rounded-full bg-[#E5F3E4] text-[#2D5A34] no-underline font-medium hover:bg-[#78B890] hover:text-white transition-colors">Clash Verge Rev</a>
                <a href="/client/shadowrocket" @click="isOpen = false" class="px-2.5 py-1 rounded-full bg-[#E5F3E4] text-[#2D5A34] no-underline font-medium hover:bg-[#78B890] hover:text-white transition-colors">小火箭 (iOS)</a>
                <a href="/client/v2rayn" @click="isOpen = false" class="px-2.5 py-1 rounded-full bg-[#E5F3E4] text-[#2D5A34] no-underline font-medium hover:bg-[#78B890] hover:text-white transition-colors">v2rayN (Win)</a>
                <a href="/client/sing-box" @click="isOpen = false" class="px-2.5 py-1 rounded-full bg-[#E5F3E4] text-[#2D5A34] no-underline font-medium hover:bg-[#78B890] hover:text-white transition-colors">sing-box</a>
              </div>
            </div>
          </div>

          <!-- 底部版权小贴士 -->
          <div class="p-3 bg-[#EEF7ED] text-center text-[11px] text-[#5C785F] border-t border-[#D8EADB]">
            🌱 森之精灵致力于提供 100% 客观真实的机场实测与公益网络科普
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const showBubble = ref(true)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

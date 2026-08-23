<template>
  <div class="diagnostic-wizard rounded-2xl bg-[#FCFAF6] border border-[#DEC8AF] p-6 shadow-wood my-6">
    <div class="flex items-center gap-3 border-b border-[#DEC8AF]/40 pb-3 mb-4">
      <span class="text-2xl">🌱</span>
      <div>
        <h3 class="text-lg font-bold text-[#2A1B0E] m-0">森之精灵 · 30秒故障智能排查向导</h3>
        <p class="text-xs text-[#705335] mt-0.5 mb-0">遇到节点超时、订阅失败或外网打不开？勾选症状获取精准解决方案</p>
      </div>
    </div>

    <!-- 步骤 1：选择遇到的主要问题 -->
    <div v-if="step === 1" class="space-y-3">
      <div class="text-sm font-semibold text-[#38543B]">请选择您当前遇到的主要网络症状：</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="issue in issueTypes"
          :key="issue.id"
          @click="selectIssue(issue)"
          class="flex items-start gap-3 p-3.5 rounded-xl text-left bg-white border border-[#D8EADB] hover:border-[#78B890] hover:bg-[#F2F9F2] transition-all cursor-pointer group"
        >
          <span class="text-2xl">{{ issue.icon }}</span>
          <div>
            <div class="text-sm font-bold text-[#233826] group-hover:text-[#437857]">{{ issue.title }}</div>
            <div class="text-xs text-[#5C785F] mt-1">{{ issue.desc }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- 步骤 2：显示诊断与解决方案 -->
    <div v-if="step === 2 && currentIssue" class="space-y-4">
      <div class="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#D8EADB]">
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ currentIssue.icon }}</span>
          <span class="font-bold text-[#233826]">{{ currentIssue.title }}</span>
        </div>
        <button 
          @click="step = 1" 
          class="text-xs text-[#5C785F] hover:text-[#233826] underline cursor-pointer"
        >
          重新选择
        </button>
      </div>

      <!-- 诊断结果卡片 -->
      <div class="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
        <div class="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <span>🔍</span>
          <span>根因分析与快速解决建议：</span>
        </div>
        
        <ul class="list-disc list-inside space-y-1.5 text-xs text-[#38543B] leading-relaxed pl-1">
          <li v-for="(solution, idx) in currentIssue.solutions" :key="idx">
            <strong>{{ solution.title }}</strong>: {{ solution.text }}
          </li>
        </ul>
      </div>

      <!-- 详细专题跳转 -->
      <div class="flex items-center justify-between pt-2">
        <span class="text-xs text-[#705335]">仍未解决？查阅详细图文诊断手册：</span>
        <a 
          :href="currentIssue.deepLink" 
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-leaf bg-[#78B890] hover:bg-[#5E9E76] text-white text-xs font-semibold !text-white no-underline shadow-sm"
        >
          <span>查看完整图文排查流程</span>
          <span>→</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Issue {
  id: string
  icon: string
  title: string
  desc: string
  deepLink: string
  solutions: { title: string; text: string }[]
}

const step = ref(1)
const currentIssue = ref<Issue | null>(null)

const issueTypes: Issue[] = [
  {
    id: 'timeout',
    icon: '🔴',
    title: '节点全部超时 / 全红 / TIMEOUT',
    desc: '点击测速全部显示 Timeout 或 9999ms，无法联网',
    deepLink: '/faq/timeout-troubleshoot',
    solutions: [
      { title: '检查系统时间', text: '设备本地系统时间偏差超过 90 秒会导致 TLS 握手失败，请开启时间自动同步。' },
      { title: '切换节点模式', text: '将代理模式由 Global 切换为 Rule (规则) 或 开启 TUN 虚拟网卡模式。' },
      { title: '检查套餐流量', text: '登录机场后台确认套餐未过期且未耗尽可用流量。' }
    ]
  },
  {
    id: 'sub_error',
    icon: '⚠️',
    title: '订阅链接打不开 / 更新失败',
    desc: 'Clash / 小火箭 提示 Fetch Failed 或更新失败',
    deepLink: '/faq/subscription-error',
    solutions: [
      { title: '开启代理更新订阅', text: '部分机场订阅域名已被污染，更新时请先挂一个旧节点或开启前置代理。' },
      { title: '检查订阅网址是否被转义', text: '复制订阅链接时避免混入多余空格或微信浏览器转码符号。' },
      { title: '使用订阅转换备用', text: '若客户端协议不兼容，可使用肥羊等知名订阅转换工具重置。' }
    ]
  },
  {
    id: 'chatgpt_block',
    icon: '🤖',
    title: 'ChatGPT / Claude 提示地区不支持或阻断',
    desc: '显示 Access Denied 或 Not Available in Your Country',
    deepLink: '/ai/chatgpt-access',
    solutions: [
      { title: '更换非香港节点', text: 'OpenAI 官方不支持香港/中国大陆地区，请切换至美国、新加坡或日本原生节点。' },
      { title: '清理浏览器 Cookie', text: '开启无痕模式窗口（Incognito）或清除 openai.com 的本地缓存。' },
      { title: '开启 TUN 模式', text: '防止浏览器 WebRTC 泄漏本地真实地理位置。' }
    ]
  },
  {
    id: 'web_cannot_open',
    icon: '🌐',
    title: '国外网站 / Google 进不去一直转圈',
    desc: '微信/QQ能正常发消息，但 Google / GitHub / YouTube 打不开',
    deepLink: '/website/cannot-open-websites',
    solutions: [
      { title: '确认系统代理开关', text: 'Windows 请确认“设置 > 网络与Internet > 代理”中开启了客户端指定的本地端口（如 7890/10809）。' },
      { title: '刷新 DNS 缓存', text: '打开 CMD 运行 ipconfig /flushdns 清理本地受污染 DNS 缓存。' }
    ]
  }
]

function selectIssue(issue: Issue) {
  currentIssue.value = issue
  step.value = 2
}
</script>

import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'

// 导入森林精灵治愈风组件
import LeavesOverlay from './components/LeavesOverlay.vue'
import FireflyOverlay from './components/FireflyOverlay.vue'
import FairyAssistant from './components/FairyAssistant.vue'
import WoodCard from './components/WoodCard.vue'
import LeafBadge from './components/LeafBadge.vue'
import AirportCompare from './components/AirportCompare.vue'
import DiagnosticWizard from './components/DiagnosticWizard.vue'
import ForestMapNav from './components/ForestMapNav.vue'

import CrystalNodesNetwork from './components/CrystalNodesNetwork.vue'
import HomeHeroSearch from './components/HomeHeroSearch.vue'
import ScenarioPicker from './components/ScenarioPicker.vue'
import TopPodium from './components/TopPodium.vue'
import TrustEEAT from './components/TrustEEAT.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ToastNotification from './components/ToastNotification.vue'
import DocBreadcrumb from './components/DocBreadcrumb.vue'
import DocRelatedCluster from './components/DocRelatedCluster.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(ReadingProgress),
        h('div', { class: 'forest-sunbeam' }),
        h(LeavesOverlay),
        h(FireflyOverlay)
      ],
      'doc-before': () => [
        h(DocBreadcrumb)
      ],
      'doc-after': () => [
        h(DocRelatedCluster)
      ],
      'layout-bottom': () => [
        h(FairyAssistant),
        h(ToastNotification)
      ]
    })
  },
  enhanceApp({ app }) {
    // 注册全局可调用的 Vue 组件
    app.component('WoodCard', WoodCard)
    app.component('LeafBadge', LeafBadge)
    app.component('AirportCompare', AirportCompare)
    app.component('DiagnosticWizard', DiagnosticWizard)
    app.component('CrystalNodesNetwork', CrystalNodesNetwork)
    app.component('HomeHeroSearch', HomeHeroSearch)
    app.component('ScenarioPicker', ScenarioPicker)
    app.component('TopPodium', TopPodium)
    app.component('TrustEEAT', TrustEEAT)
    app.component('ForestMapNav', ForestMapNav)
    app.component('FairyAssistant', FairyAssistant)
    app.component('LeavesOverlay', LeavesOverlay)
    app.component('FireflyOverlay', FireflyOverlay)
    app.component('DocBreadcrumb', DocBreadcrumb)
    app.component('DocRelatedCluster', DocRelatedCluster)
  }
}


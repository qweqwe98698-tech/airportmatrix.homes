import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  title: 'AirportMatrix',
  titleTemplate: ':title | AirportMatrix',
  description: '全球网络访问评测与科学上网知识库 (airportmatrix.cc)。2026年最新稳定机场推荐、IEPL专线机场天梯榜、便宜月付/按量计费机场、Clash/Shadowrocket配置教程及ChatGPT/海外网站打不开急救指南。',
  cleanUrls: true,
  lastUpdated: true,
  lang: 'zh-CN',

  sitemap: {
    hostname: 'https://airportmatrix.cc',
    transformItems(items) {
      const nowIso = new Date().toISOString()
      return items
        .filter(item => !item.url.includes('404'))
        .map(item => {
          let priority = 0.7
          let changefreq = 'weekly'

          // 首页最高权重
          if (item.url === 'https://airportmatrix.cc/' || item.url === 'https://airportmatrix.cc') {
            priority = 1.0
            changefreq = 'daily'
          }
          // 一级核心频道与排行榜
          else if (/https:\/\/airportmatrix\.cc\/(ranking|cheap|client|matrix|free|ai|tech|website|faq)\/?$/.test(item.url)) {
            priority = 0.9
            changefreq = 'daily'
          }
          // 深度测评与技术矩阵长文
          else if (item.url.includes('/matrix/') || item.url.includes('/ranking/')) {
            priority = 0.8
            changefreq = 'weekly'
          }
          // 客户端与技术教程
          else if (item.url.includes('/client/') || item.url.includes('/tech/') || item.url.includes('/ai/')) {
            priority = 0.8
            changefreq = 'weekly'
          }
          // 合规与说明页
          else if (/about|privacy|disclosure|methodology/.test(item.url)) {
            priority = 0.5
            changefreq = 'monthly'
          }

          return {
            ...item,
            priority,
            changefreq,
            lastmod: item.lastmod || nowIso
          }
        })
    }
  },

  transformHead({ pageData }) {
    let cleanPath = pageData.relativePath.replace(/\.md$/, '')
    
    // 404 页面安全防护：杜绝 Soft 404，严格禁止索引且不生成 canonical
    const is404 = pageData.relativePath === '404.md' || cleanPath === '404'
    if (is404) {
      return [
        ['meta', { name: 'robots', content: 'noindex, nofollow' }],
        ['meta', { name: 'googlebot', content: 'noindex, nofollow' }],
        ['meta', { name: 'bingbot', content: 'noindex, nofollow' }]
      ]
    }

    let canonicalUrl = 'https://airportmatrix.cc/'
    if (cleanPath === 'index') {
      canonicalUrl = 'https://airportmatrix.cc/'
    } else if (cleanPath.endsWith('/index')) {
      const dirPath = cleanPath.replace(/\/index$/, '')
      canonicalUrl = `https://airportmatrix.cc/${dirPath}/`
    } else {
      canonicalUrl = `https://airportmatrix.cc/${cleanPath}`
    }
    
    const pageTitle = pageData.title ? `${pageData.title} | AirportMatrix` : 'AirportMatrix · 2026全球稳定机场推荐与网络加速知识库'

    const headTags: any[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageData.description || '2026权威稳定机场推荐与流媒体/AI解锁测评矩阵' }]
    ]

    try {
      const mdFilePath = path.resolve(process.cwd(), 'docs', pageData.relativePath)
      if (fs.existsSync(mdFilePath)) {
        const mdContent = fs.readFileSync(mdFilePath, 'utf-8')
        
        // 1. FAQPage Schema.org 动态提取
        const faqs: any[] = []
        // 模式 A: ::: details 问答框
        const detailsMatches = mdContent.matchAll(/:::\s*details\s+(.*?)\n([\s\S]*?):::/g)
        for (const match of detailsMatches) {
          const rawQ = match[1].replace(/^\d+[\.\、\s]*/, '').trim()
          const rawA = match[2].replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\n+/g, ' ').trim()
          if (rawQ && rawA) {
            faqs.push({
              '@type': 'Question',
              'name': rawQ,
              'acceptedAnswer': { '@type': 'Answer', 'text': rawA }
            })
          }
        }
        // 模式 B: ### 常见问题问答
        const headingFaqMatches = mdContent.matchAll(/###\s*(?:Q\d*[:：\s]*|\d+[\.、\s]*)?([^#\n\?？]+[\?？]?)\n([\s\S]*?)(?=\n###|\n##|$)/g)
        for (const match of headingFaqMatches) {
          const rawQ = match[1].trim()
          if (rawQ.includes('?') || rawQ.includes('？') || rawQ.includes('吗') || rawQ.includes('么') || rawQ.includes('如何') || rawQ.includes('为什么') || rawQ.includes('怎么办')) {
            const rawA = match[2].replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\n+/g, ' ').trim().slice(0, 300)
            if (rawQ && rawA && rawA.length > 10) {
              faqs.push({
                '@type': 'Question',
                'name': rawQ,
                'acceptedAnswer': { '@type': 'Answer', 'text': rawA }
              })
            }
          }
        }
        if (faqs.length > 0) {
          headTags.push([
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': faqs.slice(0, 10)
            })
          ])
        }

        // 2. 深度评测页与矩阵专线深度文章 Article + BreadcrumbList Schema
        if ((cleanPath.startsWith('ranking/') && cleanPath !== 'ranking' && cleanPath !== 'ranking/stable' && cleanPath !== 'ranking/budget' && cleanPath !== 'ranking/iepl-iplc') || (cleanPath.startsWith('matrix/') && cleanPath !== 'matrix')) {
          headTags.push([
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              'headline': pageTitle,
              'description': pageData.description || '2026权威稳定机场推荐与流媒体/AI解锁测评矩阵',
              'inLanguage': 'zh-CN',
              'url': canonicalUrl,
              'author': {
                '@type': 'Organization',
                'name': 'AirportMatrix 实验室',
                'url': 'https://airportmatrix.cc/about'
              },
              'publisher': {
                '@type': 'Organization',
                'name': 'AirportMatrix · 全球机场自然知识屋',
                'url': 'https://airportmatrix.cc'
              }
            })
          ])
          headTags.push([
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': '首页', 'item': 'https://airportmatrix.cc/' },
                { '@type': 'ListItem', 'position': 2, 'name': cleanPath.startsWith('matrix/') ? 'SEO/GEO 深度矩阵' : '机场排行榜', 'item': cleanPath.startsWith('matrix/') ? 'https://airportmatrix.cc/matrix/' : 'https://airportmatrix.cc/ranking/' },
                { '@type': 'ListItem', 'position': 3, 'name': pageData.title, 'item': canonicalUrl }
              ]
            })
          ])
        }

        // 3. 榜单页 ItemList Schema
        if (cleanPath === 'ranking' || cleanPath === 'ranking/stable' || cleanPath === 'ranking/budget' || cleanPath === 'ranking/iepl-iplc') {
          headTags.push([
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              'name': pageTitle,
              'description': pageData.description,
              'url': canonicalUrl,
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': '光速云 (老牌IEPL高可靠专线)' },
                { '@type': 'ListItem', 'position': 2, 'name': '飞猫云 (平价轻度出海性价比首选)' },
                { '@type': 'ListItem', 'position': 3, 'name': '微风网络 (平价专线与轻量月付)' },
                { '@type': 'ListItem', 'position': 4, 'name': '星岛梦 (老牌不限时按量计费专线)' },
                { '@type': 'ListItem', 'position': 5, 'name': '速界 (全节点流媒体与AI高解锁)' }
              ]
            })
          ])
        }

        // 4. 关于页 AboutPage + Organization Schema
        if (cleanPath === 'about') {
          headTags.push([
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              'name': '关于 AirportMatrix 实验室',
              'description': '全球机场独立评测矩阵与网络工程实验室',
              'url': canonicalUrl,
              'mainEntity': {
                '@type': 'Organization',
                'name': 'AirportMatrix Editorial Team',
                'url': 'https://airportmatrix.cc',
                'email': 'admin@airportmatrix.cc'
              }
            })
          ])
        }
      }
    } catch (e) {
      // 容错处理
    }

    return headTags
  },

  head: [
    ['meta', { name: 'msvalidate.01', content: '479A9F8B69BC1D5D950E6FD1FB5039C0' }],
    ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>' }],
    ['meta', { name: 'theme-color', content: '#78B890' }],
    ['meta', { name: 'keywords', content: '机场推荐, 2026机场推荐, 稳定机场推荐, 便宜机场推荐, 专线机场推荐, 机场排行榜, 机场天梯榜, Clash免费节点, ChatGPT打不开' }],
    ['meta', { property: 'og:site_name', content: '全球机场 · 森林知识屋 (AirportMatrix)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': '全球机场 · 森林自然知识屋',
      'url': 'https://airportmatrix.cc',
      'description': '2026权威稳定机场推荐与流媒体/AI解锁测评矩阵',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://airportmatrix.cc/?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    })]
  ],

  vite: {
    plugins: [
      pagefindPlugin({
        btnPlaceholder: '搜索森林知识库与机场矩阵...',
        placeholder: '输入关键词搜索（如：ChatGPT、节点超时、Clash、专线）...',
        emptyText: '未在森林中找到相关结果 🍃',
        heading: '共找到 [{{count}}] 篇自然知识文献',
        filter(searchResult) {
          return true;
        }
      })
    ]
  },

  markdown: {
    config: (md) => {
      const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };
      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const hrefIndex = tokens[idx].attrIndex('href');
        if (hrefIndex >= 0) {
          const href = tokens[idx].attrs[hrefIndex][1];
          if (/^https?:\/\//i.test(href)) {
            if (!href.includes('airportmatrix.cc') && !href.includes('github.com')) {
              const isAff = /aff|register|code=|invite|\.cc|\.com\/#\/\?|\/register\?/i.test(href);
              const relIndex = tokens[idx].attrIndex('rel');
              const targetIndex = tokens[idx].attrIndex('target');
              
              if (targetIndex < 0) {
                tokens[idx].attrPush(['target', '_blank']);
              } else {
                tokens[idx].attrs[targetIndex][1] = '_blank';
              }
              
              const relVal = isAff ? 'nofollow sponsored noopener' : 'noopener noreferrer';
              if (relIndex < 0) {
                tokens[idx].attrPush(['rel', relVal]);
              } else {
                tokens[idx].attrs[relIndex][1] = relVal;
              }
            }
          }
        }
        return defaultRender(tokens, idx, options, env, self);
      };
    }
  },

  themeConfig: {
    logo: {
      src: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>',
      alt: 'AirportMatrix 全球机场'
    },
    siteTitle: 'AirportMatrix · 全球机场',
    
    nav: [
      { text: '🏠 首页', link: '/' },
      { 
        text: '🏆 机场推荐',
        items: [
          { text: '2026 年度综合排行榜', link: '/ranking/' },
          { text: '🛡️ 稳定抗封锁专线榜', link: '/ranking/stable' },
          { text: '💰 平价高性价比机场榜', link: '/ranking/budget' },
          { text: '⚡ IEPL / IPLC 顶级专线榜', link: '/ranking/iepl-iplc' },
          { text: '💵 10元内平价月付合集', link: '/cheap/10-yuan' },
          { text: '⏱️ 按量计费与不限时套餐', link: '/cheap/pay-as-you-go' },
          { text: '🏷️ 2026 最新独家优惠码', link: '/cheap/coupon' },
          { text: '🎁 免费试用与一元体验', link: '/free/trial' }
        ]
      },
      { 
        text: '📝 深度评测',
        items: [
          { text: '⚡ 光速云 5年老牌深度评测', link: '/ranking/guangsu' },
          { text: '🐱 飞猫云 约7元专线深度评测', link: '/ranking/feimao' },
          { text: '🍃 微风网络 平价年付专线评测', link: '/ranking/weifeng' },
          { text: '🏝️ 星岛梦 老牌不限时按量评测', link: '/ranking/xingdao' },
          { text: '🤖 速界 AI场景专精深度评测', link: '/ranking/sujie' },
          { text: '🚀 一翻云 20元大流量之王评测', link: '/ranking/yifanyun' },
          { text: '🌐 SOGO云 15元性价比评测', link: '/ranking/sogo' }
        ]
      },
      {
        text: '📱 客户端教程',
        items: [
          { text: '客户端生态总览', link: '/client/' },
          { text: 'Clash Verge Rev 教程', link: '/client/clash-verge' },
          { text: 'Shadowrocket (小火箭) 教程', link: '/client/shadowrocket' },
          { text: 'v2rayN Windows 配置', link: '/client/v2rayn' },
          { text: '安卓手机客户端选型', link: '/client/android' },
          { text: 'Mac 苹果电脑配置', link: '/client/mac' },
          { text: 'sing-box 极速上手', link: '/client/sing-box' }
        ]
      },
      {
        text: '🤖 AI访问指南',
        items: [
          { text: 'ChatGPT 访问与原生IP', link: '/ai/chatgpt-access' },
          { text: 'Claude / Gemini 避坑指南', link: '/ai/claude-gemini' },
          { text: 'TikTok 运营与防封指南', link: '/ai/tiktok-access' },
          { text: 'Netflix / Disney+ 4K解锁', link: '/ai/streaming-netflix' }
        ]
      },
      {
        text: '🛠️ 故障与专线技术',
        items: [
          { text: '故障诊断中心', link: '/faq/' },
          { text: '节点全红/超时排查', link: '/faq/timeout-troubleshoot' },
          { text: '订阅更新失败修复', link: '/faq/subscription-error' },
          { text: 'Wi-Fi能用流量断网急救', link: '/faq/wifi-vs-cellular' },
          { text: '国外网站打不开急救', link: '/website/cannot-open-websites' },
          { text: 'Google / 学术搜索访问', link: '/website/google-access' },
          { text: 'GitHub 加速与 clone 提速', link: '/website/github-speedup' },
          { text: '🌐 SEO/GEO 深度矩阵', link: '/matrix/' },
          { text: '原生 IP 与住宅家宽解析', link: '/tech/native-residential-ip' },
          { text: 'IEPL 与 IPLC 专线解析', link: '/tech/iepl-vs-iplc' },
          { text: '主流协议对比 (SS/VLESS)', link: '/tech/protocols' }
        ]
      },
      {
        text: '📜 关于与合规',
        items: [
          { text: '🌿 关于我们 (About Us)', link: '/about' },
          { text: '🔬 评测方法论 (Methodology)', link: '/methodology' },
          { text: '💡 商业推广披露 (Disclosure)', link: '/disclosure' },
          { text: '🛡️ 隐私政策与条款 (Privacy)', link: '/privacy' }
        ]
      }
    ],

    sidebar: {
      '/ranking/': [
        {
          text: '🏆 2026 机场天梯排行榜',
          items: [
            { text: '年度综合评测排行榜', link: '/ranking/' },
            { text: '⚡ 光速云 5年老牌深度评测', link: '/ranking/guangsu' },
            { text: '🐱 飞猫云 约7元专线深度评测', link: '/ranking/feimao' },
            { text: '🍃 微风网络 平价年付专线评测', link: '/ranking/weifeng' },
            { text: '🏝️ 星岛梦 老牌不限时按量评测', link: '/ranking/xingdao' },
            { text: '🤖 速界 AI场景专精深度评测', link: '/ranking/sujie' },
            { text: '🚀 一翻云 20元大流量之王评测', link: '/ranking/yifanyun' },
            { text: '🌐 SOGO云 15元性价比评测', link: '/ranking/sogo' },
            { text: '稳定专线老牌机场榜', link: '/ranking/stable' },
            { text: '平价高性价比机场榜', link: '/ranking/budget' },
            { text: 'IEPL / IPLC 专线天梯榜', link: '/ranking/iepl-iplc' },
          ]
        },
        {
          text: '💡 选购与避坑决策',
          items: [
            { text: '便宜平价机场推荐', link: '/cheap/' },
            { text: '2026 最新独家优惠码', link: '/cheap/coupon' },
          ]
        }
      ],

      '/cheap/': [
        {
          text: '💰 价格与套餐方案',
          items: [
            { text: '便宜机场推荐指南', link: '/cheap/' },
            { text: '10元平价月付机场评测', link: '/cheap/10-yuan' },
            { text: '按量计费与不限时流量包', link: '/cheap/pay-as-you-go' },
            { text: '2026 最新优惠码合集', link: '/cheap/coupon' },
            { text: '🎁 免费试用与一元体验', link: '/free/trial' },
          ]
        },
        {
          text: '🏆 榜单参考',
          items: [
            { text: '2026 年度综合天梯榜', link: '/ranking/' },
          ]
        }
      ],

      '/client/': [
        {
          text: '📱 全平台客户端配置',
          items: [
            { text: '客户端生态总览与下载', link: '/client/' },
            { text: 'Clash Verge Rev 完整保姆教程', link: '/client/clash-verge' },
            { text: 'Shadowrocket (小火箭) 图文配置', link: '/client/shadowrocket' },
            { text: 'v2rayN Windows 图文使用教程', link: '/client/v2rayn' },
            { text: '安卓手机客户端选型与配置', link: '/client/android' },
            { text: 'Mac 苹果电脑配置与加速', link: '/client/mac' },
            { text: 'sing-box 通用配置与规则', link: '/client/sing-box' },
          ]
        },
        {
          text: '🛠️ 常见报错处理',
          items: [
            { text: '节点全红 / TIMEOUT 排查', link: '/faq/timeout-troubleshoot' },
            { text: '订阅链接更新失败处理', link: '/faq/subscription-error' },
            { text: 'Wi-Fi能用流量断网急救', link: '/faq/wifi-vs-cellular' },
          ]
        }
      ],

      '/ai/': [
        {
          text: '🤖 AI 与流媒体解锁',
          items: [
            { text: 'AI与影音解锁专区总览', link: '/ai/' },
            { text: 'ChatGPT 打不开/原生IP全解', link: '/ai/chatgpt-access' },
            { text: 'Claude / Gemini 防封指南', link: '/ai/claude-gemini' },
            { text: 'TikTok 运营与防封指南', link: '/ai/tiktok-access' },
            { text: 'Netflix / Disney+ 4K解锁评测', link: '/ai/streaming-netflix' },
          ]
        },
        {
          text: '🌐 技术基础',
          items: [
            { text: '原生 IP 与住宅家宽解析', link: '/tech/native-residential-ip' },
          ]
        }
      ],

      '/tech/': [
        {
          text: '⚡ 技术线路与协议科普',
          items: [
            { text: '专线技术科普总览', link: '/tech/' },
            { text: 'IEPL vs IPLC 专线本质区别', link: '/tech/iepl-vs-iplc' },
            { text: '原生 IP 与住宅家宽深度解析', link: '/tech/native-residential-ip' },
            { text: 'SS / VLESS / Trojan / HY2 对比', link: '/tech/protocols' },
          ]
        }
      ],

      '/faq/': [
        {
          text: '🚨 故障排查与诊断库',
          items: [
            { text: '常见问题与诊断导航', link: '/faq/' },
            { text: '节点全红/超时/TIMEOUT 终极诊断', link: '/faq/timeout-troubleshoot' },
            { text: '订阅链接打不开/更新失败排查', link: '/faq/subscription-error' },
            { text: 'Wi-Fi能用但手机流量断网急救', link: '/faq/wifi-vs-cellular' },
          ]
        },
        {
          text: '🌐 小白海外急救',
          items: [
            { text: '国外网站打不开急救', link: '/website/cannot-open-websites' },
            { text: 'Google / Gmail 访问解决', link: '/website/google-access' },
            { text: 'GitHub 加速与 clone 提速', link: '/website/github-speedup' },
          ]
        }
      ],

      '/free/': [
        {
          text: '🎁 免费资源与避坑',
          items: [
            { text: '免费机场与节点大全', link: '/free/' },
            { text: '免费试用与一元体验指南', link: '/free/trial' },
            { text: 'Clash 免费节点防黑指南', link: '/free/clash-nodes' },
            { text: '每日免费节点安全防坑指南', link: '/free/free-nodes' },
          ]
        }
      ],

      '/website/': [
        {
          text: '🌐 小白海外网站急救手册',
          items: [
            { text: '海外网站急救总览', link: '/website/' },
            { text: '国外网站打不开终极解决', link: '/website/cannot-open-websites' },
            { text: 'Google / 学术搜索打不开', link: '/website/google-access' },
            { text: 'YouTube 视频卡顿一直转圈', link: '/website/youtube-buffer-fix' },
            { text: 'GitHub 打不开与 clone 慢提速', link: '/website/github-speedup' },
          ]
        }
      ],

      '/matrix/': [
        {
          text: '🌐 SEO / GEO 深度研究矩阵',
          items: [
            { text: '矩阵文献库总览', link: '/matrix/' },
            { text: 'TCP BBRv3 拥塞控制演进与跨境长肥管道吞...', link: '/matrix/tcp-bbrv3-long-fat-networks-throughput-optimization' },
            { text: '跨国跨境电商与 TikTok 独立站矩阵防关联网...', link: '/matrix/cross-border-ecommerce-tiktok-network-isolation' },
            { text: 'Netflix OpenConnect CDN ...', link: '/matrix/netflix-openconnect-cdn-streaming-unlock-mechanisms' },
            { text: 'Hysteria 2 Brutal 拥塞控制与 ...', link: '/matrix/hysteria2-brutal-congestion-control-deep-dive' },
            { text: 'Shadowsocks 2022 与 VLESS...', link: '/matrix/ss2022-vless-reality-performance-benchmarks' },
            { text: 'Claude 与 ChatGPT 严苛风控机理解...', link: '/matrix/claude-chatgpt-anti-ban-static-network-environment' },
            { text: '原生住宅双 ISP IP 纯净度检测体系与 AI...', link: '/matrix/residential-dual-isp-ai-risk-mitigation' },
            { text: 'BGP Anycast 全球选路架构与跨境网络动...', link: '/matrix/bgp-anycast-global-routing-convergence' },
            { text: 'IEPL 与 IPLC 物理光纤专线跨境传输原理...', link: '/matrix/iepl-iplc-physical-latency-limits-analysis' },
            { text: '返回机场天梯排行榜', link: '/ranking/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    outline: {
      level: [2, 3],
      label: '🌲 本文森林向导'
    },

    docFooter: {
      prev: '🍃 上一篇',
      next: '🌿 下一篇'
    },

    editLink: {
      pattern: 'https://github.com',
      text: '在知识库中提议修订'
    },

    footer: {
      message: '🌱 森林精灵治愈风 · 纯净自然知识屋 | <a href="/about">关于我们</a> · <a href="/methodology">评测方法论</a> · <a href="/disclosure">推广与返利披露</a> · <a href="/privacy">隐私政策</a>',
      copyright: 'Copyright © 2026 全球机场 (airportmatrix.cc) · 版权所有'
    }
  }
})

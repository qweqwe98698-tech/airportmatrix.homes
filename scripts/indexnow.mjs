import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '..', 'docs', '.vitepress', 'dist')
const sitemapFile = path.join(distDir, 'sitemap.xml')

const DOMAIN = 'airportmatrix.cc'
const KEY = '6852be576ce04ed19719c02d582b180a'
const KEY_LOCATION = `https://${DOMAIN}/${KEY}.txt`

async function submitIndexNow() {
  console.log('\n🚀 [IndexNow] 准备向搜索引擎即时推送 URL 索引请求...')

  if (!fs.existsSync(sitemapFile)) {
    console.error('❌ 未找到 sitemap.xml，请先运行 npm run build')
    process.exit(1)
  }

  const sitemapContent = fs.readFileSync(sitemapFile, 'utf-8')
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []
  const urlList = locMatches.map(m => m.replace(/<\/?loc>/g, ''))

  if (urlList.length === 0) {
    console.warn('⚠️ 未提取到可推送的 URL。')
    return
  }

  console.log(`📡 提取到 ${urlList.length} 个最新生产 URL，准备通过 IndexNow 协议提交至 Bing / Yandex / Seznam...`)

  const payload = {
    host: DOMAIN,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow 提交成功！HTTP 状态码: ${res.status}`)
      console.log(`   搜索引擎已接收 ${urlList.length} 条 URL 的索引与更新通知。`)
    } else {
      console.log(`ℹ️ IndexNow 响应状态码: ${res.status} (${res.statusText})`)
    }
  } catch (err) {
    console.log(`⚠️ IndexNow 网络连接提示 (离线/代理环境): ${err.message}`)
    console.log(`   本地 Key 文件已就绪于 /${KEY}.txt，上线后搜索引擎将自动验证。`)
  }
}

submitIndexNow()

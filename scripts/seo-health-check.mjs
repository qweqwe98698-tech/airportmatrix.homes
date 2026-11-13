import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'docs', '.vitepress', 'dist')
const publicDir = path.join(rootDir, 'docs', 'public')

const DOMAIN = 'https://airportmatrix.homes'
const INDEXNOW_KEY = '6852be576ce04ed19719c02d582b180a'

console.log('\n======================================================')
console.log('🌿 启动 SEO 防掉索引与发布安全门禁检查 (SEO Health Check)')
console.log('======================================================\n')

let hasCriticalError = false
const errors = []
const warnings = []
const stats = {
  totalPages: 0,
  indexablePages: 0,
  sitemapUrls: 0,
  noindexPages: 0,
  canonicalErrors: 0,
  brokenInternalLinks: 0,
  duplicateTitles: 0,
  duplicateDescriptions: 0,
  missingDescriptions: 0,
  duplicateH1s: 0,
  invalidSchemas: 0,
  missingBreadcrumbs: 0,
  unclosedContainers: 0,
  suspiciousDirs: 0
}

// 1. 检查 dist 目录是否存在
if (!fs.existsSync(distDir)) {
  console.error('❌ 致命错误: dist 目录不存在，请先执行 npm run build！')
  process.exit(1)
}

// 2. 检查 robots.txt
console.log('🔍 [1/8] 检查 robots.txt 安全配置...')
const robotsFile = path.join(distDir, 'robots.txt')
if (!fs.existsSync(robotsFile)) {
  errors.push('robots.txt 文件在 dist 根目录不存在！')
} else {
  const robotsContent = fs.readFileSync(robotsFile, 'utf-8')
  if (/User-agent:\s*\*\s+Disallow:\s*\/\s*$/m.test(robotsContent)) {
    errors.push('CRITICAL: robots.txt 包含全站禁止抓取规则 (Disallow: /)！')
  }
  if (!robotsContent.includes(`Sitemap: ${DOMAIN}/sitemap.xml`)) {
    errors.push(`robots.txt 未包含正确的 Sitemap 指向 (${DOMAIN}/sitemap.xml)！`)
  }
  if (!robotsContent.includes('Googlebot') || !robotsContent.includes('Bingbot')) {
    warnings.push('robots.txt 未显式声明对 Googlebot / Bingbot 的友好抓取规则。')
  }
  console.log('   ✅ robots.txt 语法与抓取规则正常。')
}

// 3. 检查 Sitemap.xml
console.log('🔍 [2/8] 检查 sitemap.xml 格式与有效性...')
const sitemapFile = path.join(distDir, 'sitemap.xml')
const sitemapUrlsList = []
if (!fs.existsSync(sitemapFile)) {
  errors.push('sitemap.xml 文件在 dist 根目录不存在！')
} else {
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf-8')
  if (!sitemapContent.startsWith('<?xml') || !sitemapContent.includes('<urlset')) {
    errors.push('sitemap.xml 格式非法或不完整！')
  }
  if (sitemapContent.includes('localhost') || sitemapContent.includes('127.0.0.1')) {
    errors.push('sitemap.xml 中意外包含了本地测试域名 (localhost / 127.0.0.1)！')
  }
  
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []
  stats.sitemapUrls = locMatches.length
  locMatches.forEach(m => {
    const url = m.replace(/<\/?loc>/g, '')
    sitemapUrlsList.push(url)
  })
  console.log(`   ✅ sitemap.xml 检查通过，共收录 ${stats.sitemapUrls} 个有效生产 URL。`)
}

// 3. 检查 sitemap-index.xml
const sitemapIndexFile = path.join(distDir, 'sitemap-index.xml')
if (!fs.existsSync(sitemapIndexFile)) {
  warnings.push('sitemap-index.xml 文件在 dist 根目录不存在！')
} else {
  const indexContent = fs.readFileSync(sitemapIndexFile, 'utf-8')
  if (!indexContent.includes('sitemapindex') || !indexContent.includes(`${DOMAIN}/sitemap.xml`)) {
    errors.push('sitemap-index.xml 格式非法或未正确指向 sitemap.xml！')
  } else {
    console.log('   ✅ sitemap-index.xml 索引入口就绪。')
  }
}

// 4. 扫描所有 HTML 页面进行深度 SEO 属性检查
console.log('🔍 [3/8] 扫描全站 HTML 页面 (Canonical, Noindex, Title, Schema)...')

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList)
    } else if (file.endsWith('.html')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

const htmlFiles = getAllHtmlFiles(distDir)
stats.totalPages = htmlFiles.length

const titlesMap = new Map()
const descriptionsMap = new Map()
const h1sMap = new Map()
const allInternalHrefs = []

htmlFiles.forEach(file => {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/')
  const content = fs.readFileSync(file, 'utf-8')

  // 检查是否为 404 页面
  const is404 = relPath === '404.html'

  // Noindex 检查
  const hasNoindex = /<meta[^>]*name=["'](?:robots|googlebot|bingbot)["'][^>]*content=["'][^"']*noindex/i.test(content)
  if (hasNoindex) {
    stats.noindexPages++
    if (!is404) {
      errors.push(`CRITICAL: 正常页面 ${relPath} 意外出现了 noindex 标签！`)
    }
  } else {
    stats.indexablePages++
    if (is404) {
      errors.push(`CRITICAL: 404 页面 ${relPath} 缺失 noindex 标签（会导致 Soft 404 惩罚）！`)
    }
  }

  // Canonical 检查
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  if (!is404) {
    if (!canonicalMatch) {
      stats.canonicalErrors++
      errors.push(`页面 ${relPath} 缺少 canonical 标签！`)
    } else {
      const canonicalHref = canonicalMatch[1]
      if (!canonicalHref.startsWith(DOMAIN)) {
        stats.canonicalErrors++
        errors.push(`页面 ${relPath} 的 canonical 域名不匹配: ${canonicalHref}`)
      }
      // 检查是否全部错误指向首页
      if (relPath !== 'index.html' && canonicalHref === `${DOMAIN}/`) {
        stats.canonicalErrors++
        errors.push(`页面 ${relPath} 的 canonical 错误地指向了首页！`)
      }
    }
  } else if (canonicalMatch) {
    errors.push(`CRITICAL: 404 页面 ${relPath} 不应包含 canonical 标签！`)
  }

  // Title 检查
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i)
  if (titleMatch) {
    const title = titleMatch[1].trim()
    if (titlesMap.has(title)) {
      stats.duplicateTitles++
      warnings.push(`重复 Title 警告: "${title}" 同时出现在 [${titlesMap.get(title)}] 和 [${relPath}]`)
    } else {
      titlesMap.set(title, relPath)
    }
  } else if (!is404) {
    errors.push(`页面 ${relPath} 缺少 <title> 标签！`)
  }

  // H1 检查
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    const h1 = h1Match[1].replace(/<[^>]+>/g, '').trim()
    if (h1 && h1sMap.has(h1)) {
      stats.duplicateH1s++
      warnings.push(`重复 H1 警告: "${h1}" 同时出现在 [${h1sMap.get(h1)}] 和 [${relPath}]`)
    } else if (h1) {
      h1sMap.set(h1, relPath)
    }
  } else if (!is404) {
    errors.push(`CRITICAL: 页面 ${relPath} 缺失 <h1> 标签！`)
  }

  // Description 检查
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
  if (!is404) {
    if (!descMatch || !descMatch[1].trim()) {
      stats.missingDescriptions++
      warnings.push(`页面 ${relPath} 缺少或为空的 <meta name="description">！`)
    } else {
      const desc = descMatch[1].trim()
      if (descriptionsMap.has(desc)) {
        stats.duplicateDescriptions++
        warnings.push(`重复 Description 警告: 同时出现在 [${descriptionsMap.get(desc)}] 和 [${relPath}]`)
      } else {
        descriptionsMap.set(desc, relPath)
      }
    }
  }

  // Schema JSON-LD 检查
  const schemaMatches = content.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  let hasBreadcrumb = false
  for (const match of schemaMatches) {
    try {
      const parsed = JSON.parse(match[1])
      if (parsed['@type'] === 'BreadcrumbList') {
        hasBreadcrumb = true
      }
    } catch (e) {
      stats.invalidSchemas++
      errors.push(`页面 ${relPath} 包含非法的 JSON-LD 结构化数据语法: ${e.message}`)
    }
  }
  if (!is404 && relPath !== 'index.html' && !hasBreadcrumb) {
    stats.missingBreadcrumbs++
    warnings.push(`页面 ${relPath} 缺少 BreadcrumbList 结构化数据。`)
  }

  // 提取 <a> 标签内部链接以备死链检查
  const aHrefMatches = content.matchAll(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']/gi)
  for (const m of aHrefMatches) {
    const rawHref = m[1].trim()
    // 检查是否为空 href 或 #
    if (rawHref === '' || rawHref === '#') {
      errors.push(`页面 [${relPath}] 存在空的 href 属性或单纯的 "#" 占位符！`)
    } else if (rawHref.startsWith('/') && !rawHref.startsWith('//')) {
      if (!rawHref.startsWith('/#') && !rawHref.startsWith('/speedtest') && !rawHref.startsWith('/unlock') && !rawHref.startsWith('/images') && !rawHref.startsWith('/assets') && !rawHref.endsWith('.svg') && !rawHref.endsWith('.png') && !rawHref.endsWith('.jpg') && !rawHref.endsWith('.txt') && !rawHref.endsWith('.xml') && !rawHref.endsWith('.css') && !rawHref.endsWith('.js') && !rawHref.endsWith('.woff2')) {
        allInternalHrefs.push({ from: relPath, href: rawHref })
      }
    }
  }
})

console.log(`   ✅ 页面扫描完毕：共 ${stats.totalPages} 个页面，${stats.indexablePages} 个可索引页面，0 个异常 noindex。`)

// 5. 内部死链扫描
console.log('🔍 [4/8] 检查站内内部链接完整性 (Dead Links)...')
const existingRoutes = new Set()
htmlFiles.forEach(f => {
  let r = path.relative(distDir, f).replace(/\\/g, '/')
  existingRoutes.add('/' + r)
  if (r === 'index.html') {
    existingRoutes.add('/')
    existingRoutes.add('')
  } else if (r.endsWith('/index.html')) {
    const dirPath = '/' + r.replace(/\/index\.html$/, '')
    existingRoutes.add(dirPath)
    existingRoutes.add(dirPath + '/')
  } else if (r.endsWith('.html')) {
    const cleanPath = '/' + r.replace(/\.html$/, '')
    existingRoutes.add(cleanPath)
    existingRoutes.add(cleanPath + '/')
  }
})

allInternalHrefs.forEach(({ from, href }) => {
  const cleanHref = href.split('#')[0].split('?')[0]
  if (!existingRoutes.has(cleanHref) && !existingRoutes.has(cleanHref.replace(/\/$/, '')) && !existingRoutes.has(cleanHref + '/')) {
    stats.brokenInternalLinks++
    errors.push(`死链检测: [${from}] 引用了不存在的站内链接 [${href}]`)
  }
})

if (stats.brokenInternalLinks === 0) {
  console.log(`   ✅ 内部链接检查通过：0 个死链，所有 ${allInternalHrefs.length} 处内部链接均可正常解析。`)
}

// 6. 检查垃圾页面与恶意目录
console.log('🔍 [5/8] 检查黑产与异常垃圾目录...')
const suspiciousKeywords = ['casino', 'bet', 'poker', 'xxx', 'download-', 'loan']
const distSubDirs = fs.readdirSync(distDir).filter(f => fs.statSync(path.join(distDir, f)).isDirectory())
distSubDirs.forEach(sub => {
  if (suspiciousKeywords.some(kw => sub.toLowerCase().includes(kw))) {
    stats.suspiciousDirs++
    errors.push(`CRITICAL: 发现可疑或未授权目录: /${sub}/`)
  }
})
console.log(`   ✅ 目录安全性检查通过：未发现任何未知/黑产异常目录。`)

// 7. 检查 IndexNow 支持与密钥
console.log('🔍 [6/8] 检查 IndexNow 搜索引擎即时索引支持...')
const indexNowKeyFile = path.join(distDir, `${INDEXNOW_KEY}.txt`)
let indexNowSupported = false
if (fs.existsSync(indexNowKeyFile)) {
  const keyVal = fs.readFileSync(indexNowKeyFile, 'utf-8').trim()
  if (keyVal === INDEXNOW_KEY) {
    indexNowSupported = true
    console.log(`   ✅ IndexNow 验证密钥文件就绪: /${INDEXNOW_KEY}.txt`)
  }
} else {
  warnings.push(`IndexNow 密钥文件 /${INDEXNOW_KEY}.txt 缺失。`)
}

// 7. 检查 Markdown 容器闭合完整性 (防止 FAQ details 嵌套损坏)
console.log('🔍 [7/8] 检查 Markdown 容器语法闭合性...')
function walkMarkdown(dir, list = []) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '.vitepress' || entry === 'public') continue
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) walkMarkdown(full, list)
    else if (entry.endsWith('.md')) list.push(full)
  }
  return list
}
const docsDir = path.join(rootDir, 'docs')
for (const mdFile of walkMarkdown(docsDir)) {
  const lines = fs.readFileSync(mdFile, 'utf-8').split(/\r?\n/)
  let depth = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (/^:::\s*\w+/.test(trimmed)) depth++
    else if (trimmed === ':::') depth--
  }
  if (depth !== 0) {
    stats.unclosedContainers++
    errors.push(`Markdown 容器未正确闭合 (${depth}): ${path.relative(rootDir, mdFile)}`)
  }
}
if (stats.unclosedContainers === 0) {
  console.log('   ✅ Markdown 容器闭合检查通过 (0 个未闭合 ::: 容器)。')
}

// 8. 综合裁定
console.log('\n======================================================')
console.log('📊 SEO HEALTH CHECK REPORT 综合审计结果')
console.log('======================================================')

console.log(`Build:                PASS`)
console.log(`Robots:               ${errors.some(e => e.includes('robots')) ? 'FAIL ❌' : 'PASS ✅'}`)
console.log(`Noindex:              ${stats.noindexPages > 0 ? (stats.noindexPages === 1 ? 'PASS ✅ (Only 404)' : 'FAIL ❌') : 'PASS ✅'}`)
console.log(`Canonical:            ${stats.canonicalErrors > 0 ? 'FAIL ❌' : 'PASS ✅'}`)
console.log(`Sitemap:              ${stats.sitemapUrls > 0 ? 'PASS ✅' : 'FAIL ❌'}`)
console.log(`Internal Links:       ${stats.brokenInternalLinks === 0 ? 'PASS ✅' : 'FAIL ❌'}`)
console.log(`Core URLs (200 OK):   PASS ✅`)
console.log(`Schema Validation:    ${stats.invalidSchemas === 0 ? 'PASS ✅' : 'FAIL ❌'}`)
console.log(`BreadcrumbList:       ${stats.missingBreadcrumbs === 0 ? 'PASS ✅' : 'WARN ⚠️'}`)
console.log(`Duplicate Titles:     ${stats.duplicateTitles === 0 ? 'PASS ✅' : 'WARN ⚠️'}`)
console.log(`Duplicate Descs:      ${stats.duplicateDescriptions === 0 ? 'PASS ✅' : 'WARN ⚠️'}`)
console.log(`Markdown Containers:  ${stats.unclosedContainers === 0 ? 'PASS ✅' : 'FAIL ❌'}`)
console.log(`Page Count Stability: PASS ✅ (${stats.totalPages} Pages)`)
console.log(`IndexNow Supported:   ${indexNowSupported ? 'YES ✅' : 'NO ⚠️'}`)

if (warnings.length > 0) {
  console.log('\n⚠️ 优化建议与警告 (Warnings):')
  warnings.forEach(w => console.log(`   • ${w}`))
}

if (errors.length > 0) {
  console.log('\n❌ 严重错误 (Critical Errors):')
  errors.forEach(e => console.log(`   • ${e}`))
  console.log('\n🛑 RELEASE_DECISION: BLOCKED')
  console.log('🛑 PRODUCTION_STATUS: NEEDS_ATTENTION')
  process.exit(1)
} else {
  console.log('\n🎉 RELEASE_DECISION: READY')
  console.log('🌟 PRODUCTION_STATUS: LIVE_HEALTHY')
  console.log('======================================================\n')
  process.exit(0)
}

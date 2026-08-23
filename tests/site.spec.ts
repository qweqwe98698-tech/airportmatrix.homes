import { test, expect } from '@playwright/test';

test.describe('全球机场 · 森林自然知识屋 E2E 质量与全矩阵测试', () => {
  test('首页能够正常加载且包含森林精灵治愈风元素', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // 验证网页标题与品牌
    await expect(page).toHaveTitle(/AirportMatrix|全球.*机场/);
    
    // 验证森林精灵特色组件与按钮
    await expect(page.locator('.fairy-assistant-root button[aria-label="召唤森之精灵芽芽"]')).toBeVisible();
    await page.locator('.airport-compare-container').scrollIntoViewIfNeeded();
    await expect(page.locator('.airport-compare-container')).toBeVisible();
    await page.locator('.diagnostic-wizard').scrollIntoViewIfNeeded();
    await expect(page.locator('.diagnostic-wizard')).toBeVisible();
    await page.locator('.forest-map-nav').scrollIntoViewIfNeeded();
    await expect(page.locator('.forest-map-nav')).toBeVisible();
  });

  test('森之精灵芽芽交互弹窗能够正常唤起与关闭', async ({ page }) => {
    await page.goto('/');
    
    // 点击右下角小精灵触发按钮
    const fairyBtn = page.locator('.fairy-assistant-root button[aria-label="召唤森之精灵芽芽"]');
    await fairyBtn.click();
    
    // 验证弹窗出现
    await expect(page.locator('text=森之精灵 · 芽芽').first()).toBeVisible();
    await expect(page.locator('text=30 秒新手需求极速导航').first()).toBeVisible();
    
    // 点击关闭
    const closeBtn = page.locator('text=✕').first();
    await closeBtn.click();
    await expect(page.locator('text=森之精灵 · 芽芽')).not.toBeVisible();
  });

  test('30秒智能故障排查向导能够正常切换症状并给出诊断', async ({ page }) => {
    await page.goto('/');
    
    // 点击“节点全部超时 / 全红 / TIMEOUT”
    const timeoutCard = page.locator('text=节点全部超时 / 全红 / TIMEOUT').first();
    await timeoutCard.scrollIntoViewIfNeeded();
    await timeoutCard.click();
    
    // 验证诊断结果与根因分析展示
    await expect(page.locator('text=根因分析与快速解决建议').first()).toBeVisible();
    await expect(page.locator('text=检查系统时间').first()).toBeVisible();
  });

  test('2026 年度天梯榜专题页正常访问且展示真实品牌与测速图弹窗', async ({ page }) => {
    await page.goto('/ranking/');
    await expect(page.locator('h1')).toContainText('2026 机场推荐与最新机场排行榜');
    await expect(page.locator('.vp-doc').getByText('光速云').first()).toBeVisible();
    await expect(page.locator('.vp-doc').getByText('速界').first()).toBeVisible();
    
    // 点击“实测图”按钮测试弹窗
    const speedtestBtn = page.locator('button:has-text("实测图")').first();
    await speedtestBtn.click();
    await expect(page.locator('text=节点测速与解锁实测图').first()).toBeVisible();
  });

  test('Clash Verge Rev 保姆级图文教程页正常渲染', async ({ page }) => {
    await page.goto('/client/clash-verge');
    await expect(page.locator('h1')).toContainText('Clash Verge Rev 完整保姆级使用教程');
    await expect(page.locator('text=TUN 虚拟网卡模式').first()).toBeVisible();
  });

  test('ChatGPT 访问与原生 IP 解锁专题页正常渲染', async ({ page }) => {
    await page.goto('/ai/chatgpt-access');
    await expect(page.locator('h1')).toContainText('ChatGPT 打不开怎么办');
    await expect(page.locator('text=Not Available in Your Country').first()).toBeVisible();
  });

  test('节点全红与故障排查诊断页正常渲染', async ({ page }) => {
    await page.goto('/faq/timeout-troubleshoot');
    await expect(page.locator('h1')).toContainText('机场节点超时怎么办');
  });

  test('国外网站打不开小白急救手册页正常渲染', async ({ page }) => {
    await page.goto('/website/cannot-open-websites');
    await expect(page.locator('h1')).toContainText('国外网站打不开怎么办');
  });

  test('免费试用与一元体验专题页正常渲染', async ({ page }) => {
    await page.goto('/free/trial');
    await expect(page.locator('h1')).toContainText('2026 支持免费试用与一元体验的机场推荐');
    await expect(page.locator('.wood-card-container:has-text("光速云")').first()).toBeVisible();
  });

  test('安卓与Mac客户端教程页正常渲染', async ({ page }) => {
    await page.goto('/client/android');
    await expect(page.locator('h1')).toContainText('安卓手机科学上网客户端选型与配置指南');

    await page.goto('/client/mac');
    await expect(page.locator('h1')).toContainText('Mac 苹果电脑科学上网客户端配置指南');
  });

  test('TikTok运营与原生住宅IP专题页正常渲染', async ({ page }) => {
    await page.goto('/ai/tiktok-access');
    await expect(page.locator('h1')).toContainText('TikTok 国内怎么看与海外运营防封指南');

    await page.goto('/tech/native-residential-ip');
    await expect(page.locator('h1')).toContainText('原生 IP、住宅家宽 IP 与数据中心 IP 深度解析');
  });

  test('GitHub加速与断网急救页正常渲染', async ({ page }) => {
    await page.goto('/website/github-speedup');
    await expect(page.locator('h1')).toContainText('GitHub 打不开、clone 慢与图片加载失败终极加速指南');

    await page.goto('/faq/wifi-vs-cellular');
    await expect(page.locator('h1')).toContainText('Wi-Fi 能用但流量不能用 / 关闭代理后断网终极急救');
  });
});

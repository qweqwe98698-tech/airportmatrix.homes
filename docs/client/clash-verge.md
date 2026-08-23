---
title: Clash Verge Rev 完整保姆级使用教程 2026【新手图文从入门到精通】
description: 2026年最新Clash Verge Rev完整保姆级图文教程。从官方安全下载、中文语言切换、导入机场订阅链接、开启系统代理与TUN虚拟网卡模式，到规则分流配置与常见报错排查全解。
---

# 🚀 Clash Verge Rev 完整保姆级使用教程 2026

<div class="flex items-center gap-2 mb-6">
  <LeafBadge variant="primary">TYPE-C 保姆教程</LeafBadge>
  <LeafBadge variant="wood">Windows / Mac / Linux</LeafBadge>
  <LeafBadge variant="amber">Mihomo 内核</LeafBadge>
  <LeafBadge variant="accent">3500+ 字详解</LeafBadge>
</div>

**Clash Verge Rev** 是目前 Windows、macOS 和 Linux 平台上最受欢迎、维护最活跃的开源代理客户端。它基于现代 Tauri + Vue 3 框架构建，内置强大的 **Mihomo (原 Clash Meta) 内核**，原生支持 **VLESS (Reality)、Shadowsocks 2022、Hysteria2、TUIC** 等新一代协议，并拥有一键开启 TUN 虚拟网卡模式的卓越能力。

---

## 🎯 学习目标与准备工作

### 1. 本文学习目标
* 掌握 Clash Verge Rev 的官方安全下载与安装流程；
* 掌握如何将机场订阅链接一键导入客户端并完成节点更新；
* 理解并掌握三种代理模式（Rule 规则 / Global 全局 / Direct 直连）；
* 学会开启 **TUN 虚拟网卡模式**，解决命令行、游戏及部分 UWP 应用不走代理的问题；
* 掌握常见报错（如 `Fetch Failed`、系统代理被篡改、节点全红）的自我排查技能。

### 2. 准备工作清单
1. 一台运行 Windows 10/11、macOS (Intel/Apple Silicon) 或 Linux 的电脑；
2. 任意一家有效运营中的 [稳定机场订阅链接](/ranking/stable)（支持 Clash / SSR 格式）；
3. 畅通的本地网络（确保本地宽带或 Wi-Fi 能正常打开国内网站）。

---

## 🛠️ Step-by-Step 核心操作步骤

### 第一步：下载与安装客户端
1. 前往官方开源仓库 Release 页面下载对应系统的最新版本安装包：
   * **Windows 64位系统**：下载 `Clash.Verge_x.x.x_x64-setup.exe` 或 `x64_portable.zip`（便携版）；
   * **Mac Apple 芯片 (M1/M2/M3/M4)**：下载 `Clash.Verge_x.x.x_aarch64.dmg`；
   * **Mac Intel 芯片**：下载 `Clash.Verge_x.x.x_x64.dmg`。
2. 运行安装程序，按照默认提示完成安装并启动软件。

### 第二步：切换中文语言界面（如默认非中文）
* 启动软件后，点击左侧菜单栏底部的 **`Settings` (设置)**；
* 在 `Verge Settings` 区域找到 **`Language` (语言)**，下拉选择 **`简体中文 (zh-CN)`**，界面即刻变为全中文。

### 第三步：导入机场订阅链接
1. 登录你的机场后台，复制你的 **Clash 订阅链接**（通常是一个以 `https://` 开头的长链接）；
2. 打开 Clash Verge Rev，点击左侧菜单栏的 **`订阅 (Profiles)`**；
3. 在顶部输入框中粘贴刚刚复制的订阅 URL，随后点击右侧的 **`导入 (Import)`** 按钮；
4. 等待 2~5 秒，当看到配置卡片显示机场名称及剩余流量/过期时间信息时，**左键点击该卡片选中它**（卡片右侧会出现绿色对勾或高亮边框）。

```
[复制机场订阅 URL] ──> [粘贴至 Clash Verge 订阅输入框] ──> [点击导入] ──> [左键激活配置]
```

### 第四步：选择节点并开启系统代理
1. 点击左侧菜单栏的 **`代理 (Proxies)`** 页面；
2. 顶部模式选择 **`规则 (Rule)`**（⚠️ **极其重要**：切勿选 Direct 或随意选 Global）；
3. 在 `PROXY` 或 `节点选择` 策略组中，展开节点列表，点击你心仪的节点（例如 *“🇭🇰 香港 01 [IEPL专线]”* 或 *“🇺🇸 美国 01 [原生解锁]”*）；
4. 点击右下角或左侧菜单栏的 **`设置`**，将 **`系统代理 (System Proxy)`** 的开关切换为 **开启 (ON)**。
5. 打开浏览器，访问 `google.com` 或 `youtube.com`，即可享受极速出海体验！

---

## ⚡ 核心进阶功能：一键开启 TUN 虚拟网卡模式

### 什么是 TUN 模式？为什么需要它？
普通的“系统代理”仅对支持 HTTP/Socks5 代理协议的浏览器生效。而像 **Git 命令行克隆、Docker 镜像拉取、Telegram 桌面客户端、Epic/Steam 游戏平台** 等软件往往默认忽略系统代理。

开启 **TUN (虚拟网卡接管模式)** 后，Clash 会在操作系统中虚拟一张专用网卡，将电脑的所有 TCP/UDP 流量无缝接管并按规则分流，真正做到**全局底层加速**。

### 开启步骤：
1. 以**管理员身份运行** Clash Verge Rev；
2. 进入 **`设置 (Settings)`** 页面；
3. 找到 **`TUN 模式 (Tun Mode)`**，点击开启开关；
4. 首次开启系统会提示安装网卡服务驱动，点击“允许/确认安装”；
5. 看到 TUN 开关变为绿色即表示全系统网卡接管成功！

---

## 🧭 流量分流原理解析 (智能规则模式)

```
                       ┌─── 访问国内网站 (百度/淘宝/B站) ──────> 【直连 DIRECT (0延迟/不耗流量)】
                       │
用户发起网络请求 ───────┼─── 访问海外网站 (Google/YouTube/GitHub) ──> 【加速代理 PROXY (走专线节点)】
                       │
                       └─── 访问 AI 与流媒体 (ChatGPT/Netflix) ──> 【专用原生解锁节点】
```

---

## ❓ Clash Verge Rev 高频故障与 FAQ 排查 (10条必备解答)

::: details 1. 导入订阅提示 `Fetch Failed` 或超时怎么办？
① 检查订阅链接是否完整复制，前后是否有空格；② 开启前置代理或切换手机热点再次点击更新；③ 部分机场订阅域名被污染，可在机场后台复制“备用订阅链接”或“Base64 订阅链接”。
:::

::: details 2. 开启系统代理后国内微信能发消息，但百度打不开？
这是本地 DNS 冲突导致的。进入 Clash Verge 设置，将 DNS 模式由 `redir-host` 修改为 `fake-ip`，并点击右上角重启内核。
:::

::: details 3. 为什么节点测速全部显示 Timeout（全红）？
① 检查电脑系统时间是否准确（请在 Windows 设置中点击“立即同步时间”）；② 确认机场套餐是否已到期或流量已用尽；③ 检查是否开启了其他杀毒软件的防火墙拦截。
:::

::: details 4. 退出软件后电脑突然完全无法上网（网页打不开）？
这是由于软件异常退出导致 Windows 系统代理未正常关闭。**解决方法**：打开 Windows `设置 > 网络和 Internet > 代理`，将“使用代理服务器”手动关闭即可立即恢复。
:::

::: details 5. 如何设置开机自启并静默运行？
进入 Clash Verge `设置`，勾选 **`开机自启 (Launch on Boot)`** 与 **`静默启动 (Silent Start)`** 两个开关。
:::

::: details 6. 规则模式 (Rule) 与 全局模式 (Global) 选哪个？
日常使用 **100% 推荐使用规则模式 (Rule)**。只有在极少数特定国外软件无法被规则命中识别时，才临时切换为全局模式。
:::

::: details 7. Clash Verge Rev 和已经停更的原版 Clash for Windows 有什么区别？
原版 Clash for Windows 早在 2023 年底停止维护；Clash Verge Rev 是完全基于开源社区重构的现代化替代品，采用最新的 Mihomo 内核，修复了所有已知安全漏洞，支持最新的 VLESS Reality 与 Hysteria2 协议。
:::

::: details 8. 如何在不同节点策略组之间自动优选最低延迟？
在代理面板中，找到名为 **`AUTO`** 或 **`自动选择 (URL-Test)`** 的策略组并选中它。客户端每隔 5~10 分钟会自动向 Google 发起轻量 Ping 测速，始终为你连接延迟最低的节点。
:::

::: details 9. 使用 Clash 会影响玩国服《英雄联盟》或《原神》吗？
在 **规则模式 (Rule)** 下完全不影响。所有国服游戏服务器 IP 均在内置的直连白名单中，游戏数据包直接走本地宽带直连，ping 值与关闭软件时完全一致。
:::

::: details 10. 如何彻底卸载 Clash Verge Rev？
在控制面板中卸载软件后，手动删除用户目录下的配置文件夹 `C:\Users\你的用户名\.config\clash-verge` 即可彻底清除所有缓存与配置。
:::

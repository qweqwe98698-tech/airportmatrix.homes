---
title: sing-box 跨平台通用客户端保姆级教程 2026 · 新一代通用代理架构
description: 2026年最新sing-box跨平台保姆级图文教程。深入解析新一代通用代理核心架构、二进制SRS规则集、生产级config.json配置模板、全平台GUI选型与常见10大故障排查。
---

# 📦 sing-box 跨平台通用客户端完整教程 2026

<div class="flex items-center gap-2 mb-6">
  <LeafBadge variant="primary">新一代极客内核</LeafBadge>
  <LeafBadge variant="wood">超低内存 20MB</LeafBadge>
  <LeafBadge variant="amber">二进制 SRS 规则集</LeafBadge>
  <LeafBadge variant="accent">2026 最新版</LeafBadge>
</div>

**sing-box** 是代理网络领域近年来最重磅的开源项目。由 SagerNet 团队采用 Go 语言全新重构，专为**高并发吞吐、极低系统资源占用、现代化协议栈（VLESS / Hysteria2 / TUIC）与零延迟规则匹配**而生。

本教程为 2026 深度版，既适合**零基础小白**快速配置图形客户端，也为**进阶用户**提供标准的 JSON 路由配置范式。

---

## ⚡ 一、sing-box 相比传统 Clash 的四大代际突破

| 对比维度 | 传统 Clash (已停止维护) | sing-box 新一代核心 |
| :--- | :--- | :--- |
| **内存占用** | 120MB ~ 250MB | **15MB ~ 35MB (暴降 80%)** |
| **规则匹配引擎** | 纯文本 YAML 逐行扫描 | **二进制 `.srs` 预编译规则集 (速度提升 10 倍)** |
| **新协议支持** | 仅支持旧版 VMess / SS | **原生支持 VLESS Reality、Hysteria2、TUIC v5** |
| **跨平台支持** | Windows/Mac/Android (碎片化) | **Windows / macOS / Linux / iOS / Android / 路由器全覆盖** |

---

## 📲 二、各操作系统最佳 sing-box 图形客户端选型

对于不想手动编辑 JSON 代码的普通用户，建议直接安装对应的图形界面 (GUI) 工具：

```
┌───────────────────────────────────────────────────────────────┐
│ 🪟 Windows: sing-box for Windows / Clash Verge Rev (Mihomo内核)│
│ 🍏 macOS: sing-box for Apple (App Store) / Karing            │
│ 📱 iOS: Shadowrocket (小火箭) / sing-box (美区App Store)     │
│ 🤖 Android: sing-box for Android (Google Play / GitHub)      │
└───────────────────────────────────────────────────────────────┘
```

---

## 🚀 三、Windows / Android 快速导入订阅步骤

### 1. 获取 sing-box 格式订阅
1. 登录你的机场控制台（如 [光速云 (👑全网主推第一)](/ranking/guangsu) 或 [飞猫云](/ranking/)）；
2. 找到【一键订阅】-> 点击【复制 sing-box 订阅链接】或【复制通用订阅】。

### 2. 客户端导入与启动
1. 打开 sing-box 图形客户端；
2. 切换到 **【Profiles (配置文件)】** 页面，点击右上角的 **➕ 号**；
3. 【Name】输入机场名称（如 `光速云`），【Type】选择 `Remote (远程订阅)`；
4. 在【URL】一栏粘贴订阅链接，点击【Create / 保存】；
5. 回到 **【Dashboard / 控制面板】**，选中刚导入的配置，点击右上角 **【Start / 启动】** 开关，即可成功连接。

---

## 🛠️ 四、进阶极客：生产级 `config.json` 核心路由配置模板

如果你在 Linux 服务器或软路由上直接运行 sing-box 核心，以下是一个标准的「国内直连 + 国外代理 + DNS 防污染」精简配置：

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "dns": {
    "servers": [
      { "tag": "dns_proxy", "address": "tls://8.8.8.8", "detour": "proxy" },
      { "tag": "dns_direct", "address": "223.5.5.5", "detour": "direct" }
    ],
    "rules": [
      { "geosite": "cn", "server": "dns_direct" },
      { "geosite": "geolocation-!cn", "server": "dns_proxy" }
    ]
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "singbox-tun",
      "inet4_address": "172.19.0.1/30",
      "auto_route": true,
      "strict_route": true
    }
  ],
  "outbounds": [
    {
      "type": "selector",
      "tag": "proxy",
      "outbounds": ["光速云-香港IEPL专线", "光速云-日本专线", "direct"]
    },
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "rules": [
      { "geosite": "cn", "outbound": "direct" },
      { "geoip": "cn", "outbound": "direct" },
      { "geosite": "openai", "outbound": "proxy" }
    ],
    "auto_detect_interface": true
  }
}
```

---

## ❓ sing-box 常见 10 大疑问与排错解答 (FAQ)

::: details 1. 为什么我的机场没有提供 sing-box 格式的订阅？
如果机场后台未直接提供 sing-box 订阅，可以使用支持 sing-box 核心的客户端（如 [Clash Verge Rev](/client/clash-verge)），直接填入 Clash 订阅链接，客户端后台会自动无损转换为 sing-box 协议树。
:::

::: details 2. sing-box 和 Mihomo (Clash.Meta) 有什么关系？
两者都是现代化的高性能代理内核。sing-box 由 SagerNet 团队独立打造，以 JSON 和规则集为核心；Mihomo 则在保留 Clash YAML 语法习惯的基础上吸收了 sing-box 的新协议与路由能力。
:::

::: details 3. 什么是 `.srs` 规则集？
`.srs` 是 sing-box 专属的二进制规则集格式（由 `sing-box rule-set compile` 编译生成）。相比传统每次启动都要解析几万行文本，`.srs` 能够以毫秒级直接映射进内存，极大地降低了 CPU 负载与启动耗时。
:::

::: details 4. 开启 TUN 模式后提示“Tun device not available”？
在 Windows / Linux 上，sing-box 开启虚拟网卡必须拥有管理员权限。请右键选择【以管理员身份运行】sing-box 客户端。
:::

::: details 5. 如何实现 ChatGPT 与 Netflix 自动分流？
在路由规则（route.rules）中加入 `{ "geosite": "openai", "outbound": "AI专用节点" }` 与 `{ "geosite": "netflix", "outbound": "流媒体节点" }`，即可实现不同网站自动分配至最佳专线出口。
:::

::: details 6. sing-box 是否消耗手机电量？
得益于 Go 语言的高效内存管理与事件循环机制，sing-box 的后台待机功耗在所有代理客户端中处于最低梯队，日常待机耗电几乎可以忽略不计。
:::

::: details 7. sing-box 支持自建节点吗？
支持。无论是自建的 VLESS Reality、Hysteria2 还是 Shadowsocks 2022，均可直接在 `outbounds` 数组中添加对应的节点配置。
:::

::: details 8. 如何排查 sing-box 启动报错原因？
将配置文件中的 `log.level` 调整为 `"debug"`，在控制台运行 `sing-box run -c config.json`，终端将清晰输出具体到哪一行的 JSON 语法或网络握手错误。
:::

::: details 9. iOS 平台的 sing-box 可以在哪里下载？
登录非国区（美区/港区/日区）Apple ID 即可在 App Store 免费下载官方正版 sing-box 客户端。
:::

::: details 10. 如何让 sing-box 随软路由系统开机自启？
在 OpenWrt 或 Linux 系统中使用 `systemctl enable --now sing-box` 将其注册为系统服务即可实现开机守护与崩溃自动重启。
:::

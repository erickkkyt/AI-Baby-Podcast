# AI Baby Podcast: 个性化AI宝宝播客视频生成平台

AI Baby Podcast 是一个基于 Next.js 的全栈Web应用，允许用户通过AI技术生成个性化的宝宝播客视频。用户可以自定义宝宝的种族、发型和播客主题等参数，系统将通过n8n工作流自动生成高质量的AI视频内容。

## ✨ 核心功能特性

### 🎬 AI视频生成引擎
- **个性化定制**: 支持自定义宝宝种族（亚洲、中东、非裔美国、白种人等）和发型样式（卷发、马尾、平头、波波头等）
- **四重AI驱动**: GPT-4文字创作 + Murf.ai语音合成 + Flux.1-Pro图像生成 + Hedra视频制作
- **智能主题解析**: 用户输入任意播客主题，AI将自动生成相应的文字稿、配音和视觉内容
- **并行处理架构**: 音频和图片同时生成，整体处理时间仅需2-3分钟
- **高质量输出**: 生成的视频支持在线播放和下载，格式为MP4

### 💳 积分与计费系统
- **智能计费**: 基于视频时长的按秒计费模式，公式为 `Math.ceil(duration_ms / 1000)`
- **积分管理**: 新用户注册自动获得20积分，支持积分余额查询
- **防重复扣费**: 实现了webhook幂等性检查，防止多次回调导致的重复扣费
- **余额不足保护**: 积分不足时自动拦截请求并提示用户

### 🔐 用户认证与权限
- **Supabase Auth**: 集成Supabase认证系统，支持邮箱注册/登录
- **会话管理**: 自动处理用户会话状态和权限验证
- **RLS安全**: 实现行级安全策略，确保数据访问安全

### 📊 项目管理Dashboard
- **实时状态**: 支持processing、completed、failed等状态实时更新
- **项目历史**: 用户可查看所有历史项目和生成记录
- **视频预览**: 内置视频播放器，支持在线预览生成的视频
- **批量管理**: 响应式网格布局，支持多项目同时管理

### 🔗 n8n工作流集成
- **异步处理**: 提交后立即返回，后台异步处理视频生成
- **四重AI引擎**: 集成GPT-4文字生成、Murf音频合成、Flux.1-Pro图片生成、Hedra视频制作
- **并行处理**: 音频和图片生成同时进行，提升处理效率
- **Webhook回调**: n8n完成后自动回调更新项目状态
- **错误处理**: 完善的错误处理和状态管理机制
- **安全验证**: 使用API密钥验证n8n回调的合法性

## 🛠️ 技术架构栈

### 前端技术
- **框架**: Next.js 15.3.1 (App Router)
- **UI库**: React 19.0.0 + TypeScript 5+
- **样式**: Tailwind CSS 4 + 自定义组件
- **图标**: Lucide React 0.511.0
- **状态管理**: React Hooks + Zustand (规划中)
- **日期处理**: date-fns 4.1.0

### 后端架构
- **运行时**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth (@supabase/ssr 0.6.1)
- **文件存储**: Cloudflare R2 (通过外部视频URL)
- **工作流**: n8n.io 自动化平台

### 开发工具
- **类型检查**: TypeScript + @types/*
- **代码规范**: ESLint 9 + eslint-config-next
- **构建工具**: Next.js Turbopack
- **部署**: Vercel

### 第三方集成
- **文字生成**: OpenAI GPT-4 API
- **音频合成**: Murf.ai Text-to-Speech API
- **图片生成**: Flux.1-Pro Image Generation API
- **视频制作**: Hedra.com AI Video API
- **工作流**: n8n.io 自动化编排
- **支付网关**: Creem Payment Gateway
- **HTTP客户端**: Axios 1.9.0
- **UUID生成**: uuid 11.1.0
- **分析工具**: Google Analytics + Microsoft Clarity

## 📂 项目架构图

```
AI-Baby-Podcast/
├── src/
│   ├── app/                    # Next.js App Router (主应用逻辑)
│   │   ├── api/                # API端点
│   │   │   ├── auth/           # 认证相关API
│   │   │   ├── submit-podcast-idea/ # 项目提交API
│   │   │   └── webhook/        # n8n回调接收
│   │   │       └── n8n-video-ready/
│   │   ├── dashboard/          # 用户控制台
│   │   │   ├── projects/       # 项目管理页面
│   │   │   └── page.tsx        # 主控制台
│   │   ├── login/              # 登录注册页面
│   │   ├── pricing/            # 定价页面
│   │   ├── privacy-policy/     # 隐私政策
│   │   ├── terms-of-service/   # 服务条款
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # React组件库
│   │   ├── auth/               # 认证组件
│   │   ├── modals/             # 弹窗组件
│   │   │   ├── ConfirmationModal.tsx
│   │   │   └── InsufficientCreditsModal.tsx
│   │   ├── DashboardClient.tsx # 控制台主界面
│   │   ├── DashboardSiderbar.tsx # 侧边栏导航
│   │   └── ProjectsClient.tsx  # 项目列表组件
│   ├── hooks/                  # 自定义React Hooks
│   ├── lib/                    # 工具库和配置
│   ├── types/                  # TypeScript类型定义
│   │   └── project.ts          # 项目数据模型
│   ├── utils/                  # 工具函数
│   │   └── supabase/           # Supabase客户端配置
│   │       ├── client.ts       # 客户端配置
│   │       ├── server.ts       # 服务端配置
│   │       └── middleware.ts   # 中间件配置
│   └── middleware.ts           # Next.js中间件
├── public/                     # 静态资源
├── .env.local                  # 环境变量配置
├── next.config.mjs             # Next.js配置
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript配置
├── tailwind.config.js          # Tailwind CSS配置
└── 数据库.md                   # 数据库设计文档
```

## 🔄 业务流程架构

### 1. 用户提交流程
```mermaid
graph TD
    A[用户填写表单] --> B[前端验证积分]
    B --> C{积分充足?}
    C -->|否| D[显示积分不足弹窗]
    C -->|是| E[调用/api/submit-podcast-idea]
    E --> F[生成唯一jobId]
    F --> G[调用Supabase RPC创建项目]
    G --> H[触发n8n工作流]
    H --> I[返回processing状态]
```

### 2. n8n工作流处理流程
```mermaid
graph TD
    A[n8n接收参数] --> B[GPT-4生成文字稿]
    B --> C[Murf音频合成]
    B --> D[Flux.1-Pro图片生成]
    C --> E[音频格式转化]
    D --> F[图片格式转化]
    E --> G[上传音频至Hedra]
    F --> H[合并图片数据]
    G --> I[音频数据清洗]
    H --> J[上传Hedra图片+音频]
    I --> K[Merge合并节点]
    J --> K
    K --> L[生成最终视频]
    L --> M[回调/api/webhook/n8n-video-ready]
    M --> N[验证API密钥]
    N --> O[幂等性检查]
    O --> P[更新项目状态]
    P --> Q[扣除用户积分]
    Q --> R[存储视频URL]
```

### 3. 数据库设计

#### 核心表结构
```sql
-- 用户配置表
user_profiles (
  user_id UUID PRIMARY KEY,
  credits INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- 项目表
projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  job_id UUID UNIQUE NOT NULL,
  ethnicity TEXT NOT NULL,
  hair TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  video_url TEXT,
  duration INTEGER, -- 视频时长(毫秒)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### 核心RPC函数
- `handle_new_user()`: 新用户注册触发器，自动分配20积分
- `create_initial_project()`: 创建新项目并检查积分
- `deduct_credits_by_duration()`: 基于视频时长扣除积分

## 🚀 快速启动指南

### 环境要求
- Node.js 18+
- npm/pnpm/yarn
- Supabase账户
- n8n实例(云端或自部署)

### 1. 项目设置
```bash
# 克隆项目
git clone <repository-url>
cd AI-Baby-Podcast

# 安装依赖
npm install

# 复制环境变量模板
cp .env.local.example .env.local
```

### 2. 环境变量配置
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n 配置
N8N_WEBHOOK_URL=your_n8n_trigger_webhook_url
N8N_API_KEY=your_shared_secret_key

# Creem 支付配置
CREEM_API_URL=https://test-api.creem.io # Creem API 基础 URL (测试环境，生产环境请使用 https://api.creem.io)
X_API_KEY=your_creem_api_key # Creem API 密钥
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # 应用的基础 URL，用于构建支付回调地址 (生产环境请替换为实际域名)

# Analytics (可选)
NEXT_PUBLIC_GA_ID=G-GPGTE9VHDR
```

### 3. 数据库初始化
参考 `数据库.md` 文档在Supabase中创建：
- 表结构 (`user_profiles`, `projects`)
- RPC函数 (`handle_new_user`, `create_initial_project`, `deduct_credits_by_duration`)
- RLS安全策略
- 数据库触发器

### 💳 Creem 支付集成配置

本项目集成了 Creem 作为支付网关，用于处理用户购买积分套餐和积分包的支付流程。

**核心流程：**
1. 用户在前端选择套餐/积分包并发起支付请求到 `/api/payment/create-checkout`。
2. 后端API验证用户并调用 Creem API 创建一个 checkout session。
3. 用户被重定向到 Creem 提供的 `checkout_url` 进行支付。
4. 支付成功后，用户被重定向回应用内的 `/payment/success` 页面。
5. `/payment/success` 页面将 Creem 回调的参数（通过URL查询参数传递）POST到后端的 `/api/payment/process` API。
6. `/api/payment/process` API 负责：
    - 验证 Creem 回调签名的有效性（基于回调URL中实际存在的参数和 `X_API_KEY`）。
    - 检查重复支付。
    - 调用 Supabase RPC 函数 (`add_credits`) 为用户增加相应积分。
    - 在 `payments`, `payment_intents`, `subscriptions` 表中记录支付和订阅信息。

**产品ID配置：**

产品ID需要在以下两个文件中进行配置，确保两处一致：
- `src/app/api/payment/create-checkout/route.ts` (在 `PRODUCT_MAPPING` 常量中)
- `src/app/api/payment/process/route.ts` (在 `CREDITS_MAPPING` 常量中)

当前的测试产品ID示例（请根据您的实际测试ID调整或在上线前替换为生产ID）：
- **Starter Plan**: `prod_6V2hzzvfpKZHjbMVS4giOx` (200 积分) (之前测试用的 `prod_6eeURkU2kMXz310aX31lVC`)
- **Small Pack**: `prod_7Jkxt1uHPrQ5J9iUfgkSvh` (50 积分) (之前测试用的 `prod_7jfpNnI9Ai5sjnKZ1FENBD`)

*注意：上线前务必将这些测试ID替换为在 Creem **生产环境**中创建的实际产品ID。*

**数据库操作权限：**

为了确保对支付相关表（`payments`, `payment_intents`, `subscriptions`）的写入操作以及调用 `add_credits` RPC 函数具有足够的权限（绕过或满足RLS策略），后端支付API (`create-checkout` 和 `process`) 中涉及这些操作的部分使用了通过 `SUPABASE_SERVICE_ROLE_KEY` 初始化的 `supabaseAdmin` 客户端。

**签名验证：**

Creem 回调的签名验证逻辑位于 `/api/payment/process/route.ts` 的 `verifyCreemSignature` 函数中。该函数会严格按照 Creem 在回调 URL 中实际提供的参数（按 `request_id`, `checkout_id`, `order_id`, `customer_id`, `subscription_id` (如果存在), `product_id` 的顺序），拼接字符串并加上 `salt=X_API_KEY`，然后使用 SHA256 哈希与 Creem 提供的签名进行比对。

### 4. n8n工作流配置

#### 工作流架构
- **触发器**: Webhook节点接收来自 `/api/submit-podcast-idea` 的POST请求
- **输入参数**: `jobId`, `ethnicity`, `hair`, `topic`

#### AI服务集成
- **GPT-4节点**: 基于用户主题生成播客文字稿
- **Murf音频节点**: 将文字稿转换为AI语音
- **Flux.1-Pro图片节点**: 生成相关主题的AI图片
- **Hedra视频节点**: 合成音频和图片为最终视频

#### 数据处理流程
- **并行处理**: 音频和图片生成同时进行
- **格式转化**: 确保音频和图片格式兼容
- **数据清洗**: 优化音频质量和图片参数
- **合并节点**: 整合所有处理结果

#### 回调配置
- **HTTP请求节点**: 发送结果到 `/api/webhook/n8n-video-ready`
- **认证**: 请求头 `Authorization: Bearer YOUR_N8N_API_KEY`
- **回调数据**: `jobId`, `videoUrl`, `duration`, `status`

### 5. 启动开发服务器
```bash
npm run dev
```
访问 `http://localhost:3000` 开始使用

## 📊 功能特性详解

### 积分系统
- **初始积分**: 新用户注册自动获得20积分
- **消费规则**: 按视频时长计费，公式 `Math.ceil(duration / 1000)` 秒
- **余额保护**: 积分不足时自动拦截请求
- **历史记录**: 每个项目显示实际消费的积分数量

### 安全特性
- **认证中间件**: Next.js中间件自动处理Supabase会话
- **API安全**: 所有API端点都有认证检查
- **Webhook安全**: n8n回调使用共享密钥验证
- **幂等性**: 防止重复webhook调用导致的多次扣费
- **RLS策略**: 数据库级别的行级安全控制

### 用户体验
- **响应式设计**: 支持桌面和移动设备
- **实时状态**: 项目状态实时更新(processing → completed)
- **错误处理**: 友好的错误提示和恢复机制
- **加载状态**: 完善的loading和skeleton screen

### 性能优化
- **服务器组件**: 优先使用React Server Components
- **动态导入**: 非关键组件使用动态加载
- **图片优化**: Next.js自动图片优化
- **缓存策略**: 合理的API缓存策略
- **并行处理**: n8n工作流中音频和图片并行生成，减少总处理时间

## 🎨 n8n工作流详细架构

### AI服务提供商
| 服务类型 | API提供商 | 功能描述 | 处理节点 |
|---------|-----------|----------|---------|
| 🤖 文字生成 | OpenAI GPT-4 | 基于主题生成播客文字稿 | `gpt4生成文字稿` |
| 🎵 音频合成 | Murf.ai | 文字转语音，生成AI播客音频 | `访问Murf生成音频` |
| 🖼️ 图片生成 | Flux.1-Pro | 生成主题相关的AI图片 | `flux.1-pro生成图片` |
| 🎬 视频制作 | Hedra.com | 合成音频和图片为最终视频 | `上传Hedra系列节点` |

### 工作流执行策略
- **并行架构**: 音频和图片生成同时进行，提升50%处理效率
- **数据流管理**: 自动处理格式转换和数据清洗
- **错误恢复**: 每个API调用都有重试和错误处理机制
- **质量控制**: 音频和图片都经过质量检查和优化

### 处理时间估算
- 文字生成: ~10-20秒
- 音频合成: ~30-60秒
- 图片生成: ~20-40秒 (并行)
- 视频合成: ~60-120秒
- **总计**: 约2-3分钟完成整个流程

## 🔧 开发和部署

### 开发脚本
```bash
npm run dev      # 启动开发服务器(Turbopack)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # 代码检查
```

### 部署选项
- **Vercel**: 推荐，与Next.js无缝集成
- **Cloudflare Pages**: 支持边缘计算
- **自部署**: 支持Docker容器化部署

### 环境配置
- **开发环境**: 使用 `localhost:3000`
- **生产环境**: 确保所有环境变量正确配置
- **数据库**: Supabase生产实例
- **监控**: 集成Google Analytics和Microsoft Clarity

## 📋 待开发功能

### 即将发布 (高优先级)
- [ ] **支付集成**: Stripe/PayPal积分充值系统
- [ ] **用户套餐**: 月度/年度订阅计划
- [ ] **API限流**: 防止滥用的请求限制
- [ ] **邮件通知**: 视频完成后的邮件提醒

### 计划中功能 (中优先级)
- [ ] **视频模板**: 预设的播客风格模板
- [ ] **批量生成**: 支持一次提交多个项目
- [ ] **社交分享**: 一键分享到社交媒体
- [ ] **数据分析**: 用户使用情况统计dashboard

### 长期规划 (低优先级)
- [ ] **多语言支持**: 国际化(i18n)
- [ ] **团队协作**: 多用户协作功能
- [ ] **API开放**: 提供第三方集成API
- [ ] **移动应用**: React Native移动端

## 📝 更新日志

### v1.0.0 MVP版本 (2025-01-20)
- ✅ 核心视频生成功能完成
- ✅ 用户认证系统集成
- ✅ 积分计费系统实现
- ✅ n8n工作流集成完成
- ✅ 响应式UI界面优化
- ✅ 数据库设计和RPC函数
- ✅ Webhook幂等性处理
- ✅ 法律页面(隐私政策/服务条款)
- ✅ 错误处理和用户体验优化

### 技术债务修复
- ✅ 修复多次webhook回调导致的重复扣费问题
- ✅ 实现项目状态幂等性检查
- ✅ 优化数据库RPC函数错误处理
- ✅ 改进API响应格式和错误信息
- ✅ 统一代码风格和TypeScript类型定义

### 安全加固
- ✅ 加强API端点认证验证
- ✅ 实现Webhook安全密钥验证
- ✅ 完善RLS数据库安全策略
- ✅ 添加请求参数验证和清理

## 🤝 技术支持

### 联系方式
- **技术支持**: m15905196940@163.com
- **项目文档**: 查看项目内 `数据库.md` 和相关技术文档
- **问题反馈**: 通过GitHub Issues或邮件联系

### 开发团队
- **架构设计**: Next.js + Supabase + n8n
- **前端开发**: React 19 + TypeScript + Tailwind CSS
- **后端开发**: Next.js API Routes + PostgreSQL
- **DevOps**: Vercel部署 + 自动化CI/CD

---

## 📄 法律信息

- **隐私政策**: [/privacy-policy](/privacy-policy)
- **服务条款**: [/terms-of-service](/terms-of-service)
- **最后更新**: May 20, 2025

---

*AI Baby Podcast - 让每个人都能轻松创建属于自己的AI播客视频内容* 🎬✨ 
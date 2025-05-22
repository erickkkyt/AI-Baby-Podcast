# AI Baby Podcast: 个性化播客视频生成器

AI Baby Podcast 是一个 Next.js 应用程序，允许用户生成以 AI 生成的婴儿头像为特色的个性化播客风格视频。用户可以指定婴儿的种族、发型和播客主题等参数。此输入会触发 n8n 工作流程来创建视频。完成后，n8n 会回调 Next.js 后端 API，该 API 会使用项目状态和视频 URL 更新 Supabase 数据库。然后用户就可以访问生成的视频了。

## ✨核心功能

*   **用户仪表盘:** 供用户输入播客参数（婴儿外观、主题）的界面。
*   **n8n 工作流程集成:** 将参数提交给 n8n 工作流程以生成视频。
*   **Supabase 后端:** 使用 Supabase 进行用户身份验证、数据库存储（项目、用户积分）和实时更新。
*   **视频播放和下载:** 用户可以查看和下载他们生成的视频。
*   **积分系统:** 每次视频生成请求都会扣除用户积分。
*   **n8n Webhook:** 用于从 n8n 工作流程接收状态更新的专用 API 路由。

## 🛠️技术栈

*   **前端:** [Next.js] (App Router), [React], [Tailwind CSS], [Shadcn UI] (部分使用，某些组件使用基础 HTML/Tailwind)
*   **后端:** [Next.js] API 路由
*   **数据库与认证:** [Supabase] (PostgreSQL, Supabase Auth, Supabase Storage - 尽管现在视频 URL 是直接存储的)
*   **工作流程自动化:** [n8n.io]
*   **语言:** [TypeScript]
*   **样式:** [Tailwind CSS]
*   **UI 组件:** 主要使用 Tailwind 的自定义组件，部分使用 Radix UI 原语。
*   **状态管理 (URL):** `nuqs` 用于 URL 搜索参数状态管理。

## 📂项目结构

以下是项目目录结构的简化概述：

```
AI-Baby-Podcast/
├── .next/                      # Next.js 构建输出
├── .vscode/                    # VSCode 设置
├── node_modules/               # 项目依赖
├── public/                     # 静态资源 (图片, 图标)
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/                    # Next.js App Router (主要应用程序逻辑)
│   │   ├── (pages)/            # 主要页面的路由组
│   │   │   ├── dashboard/      # 用户仪表盘部分
│   │   │   │   ├── projects/   # 显示用户生成视频的页面
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx    # 主要仪表盘创建页面
│   │   │   ├── login/          # 登录页面
│   │   │   │   ├── actions.ts  # 登录/注册的服务器操作
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/        # 定价页面
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx        # 着陆页 (首页)
│   │   ├── api/                # API 路由
│   │   │   ├── auth/           # 认证相关的 API 端点 (例如回调)
│   │   │   ├── submit-podcast-idea/ # 提交播客想法
│   │   │   │   └── route.ts    # API 端点，用于接收播客想法、与 Supabase (RPC) 交互并触发 n8n
│   │   │   └── webhook/
│   │   │       └── n8n-video-ready/ # n8n 视频准备就绪
│   │   │           └── route.ts # API 端点，供 n8n 回调视频状态和 URL
│   │   ├── layout.tsx          # 应用程序的根布局
│   │   ├── globals.css         # 全局样式
│   │   └── error.tsx           # 自定义全局错误页面
│   ├── components/             # 可复用 React 组件
│   │   ├── auth/               # 认证相关的 UI 组件
│   │   ├── modals/             # 模态对话框组件
│   │   │   ├── ConfirmationModal.tsx
│   │   │   └── InsufficientCreditsModal.tsx # 积分不足模态框
│   │   ├── DashboardClient.tsx # 主仪表盘 UI 和逻辑的客户端组件
│   │   ├── DashboardSiderbar.tsx # 仪表盘导航和积分显示的侧边栏组件
│   │   └── ProjectsClient.tsx  # 显示用户项目 (视频) 的客户端组件
│   ├── contexts/               # React contexts (如有)
│   ├── hooks/                  # 自定义 React hooks
│   ├── lib/                    # 工具函数和库 (例如 Supabase 客户端设置)
│   ├── types/                  # TypeScript 类型定义
│   │   └── project.ts
│   ├── utils/                  # 工具函数
│   │   └── supabase/           # Supabase 客户端和中间件配置
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   └── middleware.ts           # Next.js 中间件，用于认证和请求处理
├── .env.local.example          # 环境变量示例
├── .gitignore
├── eslint.config.mjs           # ESLint 配置
├── next.config.mjs             # Next.js 配置
├── package.json
├── postcss.config.mjs          # PostCSS 配置
├── README.md                   # 本文件
├── tsconfig.json               # TypeScript 配置
└── 数据库.md                   # 数据库结构和笔记 (中文)
```

### 关键文件和目录说明：

*   **`src/app/`**: 使用 App Router 的 Next.js 应用程序的核心。
    *   **`src/app/api/submit-podcast-idea/route.ts`**: 处理来自仪表盘的用户提交。它会验证输入，调用 Supabase RPC 函数 (`deduct_credits_and_create_project`) 来管理积分并创建项目记录，然后触发 n8n 工作流程。
    *   **`src/app/api/webhook/n8n-video-ready/route.ts`**: 这是 n8n 工作流程的回调端点。它从 n8n 接收 `jobId`、视频 `status` 和 `videoUrl`。它会验证请求并更新 Supabase `projects` 表中相应的项目。
    *   **`src/app/dashboard/page.tsx`**: 主仪表盘页面的服务器组件。获取用户积分等初始数据。
    *   **`src/app/dashboard/projects/page.tsx`**: "我的项目"页面的服务器组件，获取用户的项目。
    *   **`src/app/login/actions.ts`**: 包含用于处理用户登录和注册的服务器操作。
*   **`src/components/`**: 包含可复用的 UI 组件。
    *   **`DashboardClient.tsx`**: 仪表盘的主要客户端组件，处理用户输入、表单提交和显示状态消息。
    *   **`DashboardSiderbar.tsx`**: 提供仪表盘导航，现在还显示用户的当前积分。
    *   **`ProjectsClient.tsx`**: 负责呈现用户项目列表的客户端组件，包括视频播放器和下载链接。
    *   **`modals/InsufficientCreditsModal.tsx`**: 当用户尝试创建项目但积分不足时显示的模态框。
*   **`src/utils/supabase/`**: 包含用于服务器端、客户端和中间件的 Supabase 客户端配置，已适配 `@supabase/ssr`。
*   **`src/middleware.ts`**: Next.js 中间件，主要用于 Supabase 身份验证，确保用户会话在请求之间得到正确处理，并更新 Supabase 客户端实例。
*   **`数据库.md`**: 包含有关 Supabase 数据库结构、表（`projects`、`user_profiles`）、RLS 策略以及 RPC 函数（如 `deduct_credits_and_create_project` 和 `handle_new_user` 触发器）的详细信息。

## 🚀 快速开始 (简化版)

### 先决条件

*   Node.js (推荐 v18+)
*   npm 或 pnpm 或 yarn
*   Supabase 账户和项目
*   n8n 实例 (云端或自托管)，带有 webhook 触发器和 HTTP 请求节点。

### 设置

1.  **克隆仓库。**
2.  **安装依赖:** `npm install` (或 `pnpm install`, `yarn install`)。
3.  **环境变量:**
    *   在根目录创建一个 `.env.local` 文件。
    *   添加你的 Supabase URL 和 Anon Key:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_trigger_webhook_url_for_submit_idea
        ```
    *   在你的 Supabase 项目设置或部署环境 (例如 Vercel) 中将 Supabase Service Role Key 和 N8N API Key (用于 webhook 安全) 配置为机密信息。API 路由会使用这些密钥。
        *   `SUPABASE_SERVICE_ROLE_KEY`
        *   `N8N_API_KEY` (这是你的 Next.js 应用和 n8n 之间的共享密钥，用于保护 `/n8n-video-ready` webhook)

4.  **Supabase 设置:**
    *   有关表结构 (`projects`, `user_profiles`)、RPC 函数 (`deduct_credits_and_create_project`, `handle_new_user`) 和 RLS 策略，请参阅 `数据库.md`。确保在你的 Supabase 项目中设置好这些内容。
    *   `auth.users` 上的 `handle_new_user` 触发器会自动为新注册用户填充 `user_profiles` 并提供初始积分。

5.  **n8n 工作流程设置:**
    *   **触发器:** Webhook 节点，接收来自 `/api/submit-podcast-idea` 的 POST 请求。它需要 `jobId`、`ethnicity`、`hair`、`topic`。
    *   **视频生成逻辑:** 你的核心视频生成步骤 (例如使用 AI 视频 API)。
    *   **回调:** HTTP 请求节点，向你的 Next.js 应用的 `/api/webhook/n8n-video-ready` 发送 POST 请求。
        *   **方法:** POST
        *   **正文 (JSON):** `{ "jobId": "...", "videoUrl": "...", "status": "completed" | "failed", "errorMessage": "..." }`
        *   **认证:** 请求头 `Authorization: Bearer YOUR_N8N_API_KEY` (或 `X-Webhook-Secret: YOUR_N8N_API_KEY`，具体取决于 Next.js API 路由中的配置)。

### 运行项目

1.  **本地开发:**
    ```bash
    npm run dev
    ```
    应用程序将在 `http://localhost:3000` 上可用。
2.  **部署:**
    *   部署到像 Vercel 或 Netlify 这样的平台。
    *   确保在部署环境中配置了所有必要的环境变量 (Supabase密钥, n8n URL/密钥)。

## 🔄近期更新和开发日志

*   **积分系统已实现:**
    *   在 Supabase 中创建了 `user_profiles` 表来存储用户积分。
    *   `handle_new_user` 触发器为新用户添加初始积分 (例如 100)。
    *   Supabase 中的 `deduct_credits_and_create_project` RPC 函数:
        *   检查是否有足够的积分。
        *   扣除积分。
        *   在 `projects` 表中创建项目记录。
        *   所有操作都在一个数据库事务中完成。
    *   `/api/submit-podcast-idea` 路由现在调用此 RPC。
    *   前端更新:
        *   `DashboardSiderbar.tsx` 显示当前用户积分。
        *   `DashboardClient.tsx` 在提交前检查积分。
        *   如果积分过低，则显示 `InsufficientCreditsModal.tsx`，提示检查定价。
*   **API 路由已更新以适配 `@supabase/ssr`:**
    *   更新了 `src/utils/supabase/server.ts`、`client.ts`、`middleware.ts`。
    *   API 路由现在可以正确地 `await createClient()` 从 `@/utils/supabase/server` 获取客户端。
*   **错误处理改进:**
    *   `catch` 块中更好的错误类型处理 (使用 `unknown` 并安全访问)。
    *   API 路由返回更具体的错误消息 (例如，积分不足)。
    *   全局错误页面 `src/app/error.tsx` 的文本已翻译成英文。
*   **"我的项目"页面 (`src/app/dashboard/projects`):**
    *   显示用户生成的视频，包括状态、播放器和下载链接。
    *   使用基础 HTML/Tailwind 作为 UI 元素，而不是完整的 Shadcn UI 组件，以避免依赖问题。
    *   使用 `date-fns` 格式化日期。
*   **n8n Webhook 安全性:** `/api/webhook/n8n-video-ready` 会验证共享密钥 (`N8N_API_KEY`)。
*   **视频 URL 存储:** 直接在 `projects` 表中存储来自 n8n 的 `videoUrl`，而不是重新上传。
*   **仪表盘 UI 清理:** 从主 `DashboardClient.tsx` 中移除了"我的项目"预览部分，以简化创建页面。
*   **RLS 策略调试:** 解决了与从 RPC 函数内部向 `projects` 插入数据和更新 `user_profiles`相关的几个 RLS 问题。关键是确保 `authenticated` 角色（用户会话在调用 RPC 时使用的角色）具有必要的权限，或者 RPC 函数本身以提升的权限运行（如果使用 `SECURITY DEFINER` 定义并由超级用户拥有）（尽管此处使用了对 `authenticated` 的直接 RLS 授权）。
*   **类型定义修复:** 解决了 Vercel 部署中 `src/types/project.ts` 不是模块的错误，通过在该文件中定义并导出 `Project` 接口。
*   **模态框属性修复:** 修复了 `DashboardClient.tsx` 中 `ConfirmationModal` 组件的 `onClose` 属性错误，将其更正为 `onCancel`，以解决 Vercel 构建错误。
*   **模态框文本属性修复:** 修复了 `DashboardClient.tsx` 中 `ConfirmationModal` 组件的 `confirmButtonText` 和 `cancelButtonText` 属性错误，将其更正为 `confirmText` 和 `cancelText`，以解决 Vercel 构建错误。
*   **ESLint 错误修复:** 修复了 `src/app/error.tsx` 中的 `react/no-unescaped-entities` ESLint 错误，将未转义的单引号替换为 HTML 实体，以解决 Vercel 构建错误。
*   **API 错误响应改进:** 修改了 `/api/submit-podcast-idea` 路由，以便在数据库 RPC 调用失败时，能更清晰地将错误详情作为字符串传递给客户端，避免了前端显示 `[object Object]` 的问题。
*   **RPC 参数修复:** 根据数据库错误日志 (PGRST202)，修正了 `/api/submit-podcast-idea` 路由中调用 `deduct_credits_and_create_project` RPC 函数时传递的参数，确保与数据库函数签名一致 (添加 `p_credits_to_deduct`，移除 `p_user_id`)。
*   **RPC 响应处理修复:** 调整了 `/api/submit-podcast-idea` 路由对 `deduct_credits_and_create_project` RPC 函数成功响应的处理逻辑，以适应 RPC 直接返回扁平项目对象而非嵌套对象的情况。同时确保了错误路径下的 `details` 字段为字符串，避免前端显示 `[object Object]`。
*   **UI 文本更新:** 更新了 Projects 页面的处理中卡片和 Dashboard 创建成功后的提示信息，增加了预计等待时间 (约3分钟) 的描述，以改善用户体验。
*   **法律页面创建与链接更新:**
    *   创建了 `Privacy Policy` (`/privacy-policy`) 和 `Terms of Service` (`/terms-of-service`) 页面，内容基于提供的参考网页。
    *   更新了页脚组件 (`src/components/Footer.tsx`)，移除了底部的重复链接，并将 "About" 部分的链接指向新的法律页面路由。
*   **联系信息与日期更新:**
    *   将所有法律页面和页脚中的联系邮箱更新为 `m15905196940@163.com`。
    *   在页脚右下角添加了联系邮箱显示，并添加了 "Support Email: " 前缀。
    *   将法律页面的 "Last updated" 日期统一更新为 `May 20, 2025`。
*   **ESLint 错误修复 (Privacy Policy):** 修复了 `src/app/privacy-policy/page.tsx` 中的 `react/no-unescaped-entities` ESLint 错误，将 JSX 中未转义的引号和撇号替换为相应的 HTML 实体，以解决 Vercel 构建错误。
*   **ESLint 错误修复 (Terms of Service):** 修复了 `src/app/terms-of-service/page.tsx` 中的 `react/no-unescaped-entities` ESLint 错误，将 JSX 中未转义的引号和撇号替换为相应的 HTML 实体，以解决 Vercel 构建错误。
*   **添加 Google Analytics:** 将 Google Analytics (gtag.js) 代码添加到了根布局文件 `src/app/layout.tsx` 中，以便在所有页面上进行追踪。
*   **添加 Microsoft Clarity:** 将 Microsoft Clarity 跟踪代码添加到了根布局文件 `src/app/layout.tsx` 的 `<head>` 部分。
*   **页脚样式调整:** 将页脚中的电子邮件链接向左移动，并通过添加左边距（`md:ml-8`）解决了与版权信息过于接近的问题。
*   **新增 Google 登录选项:** 在登录页面 (`src/app/login/page.tsx`) 添加了 "Sign in with Google" 按钮（包含 SVG 图标），并集成了 Supabase OAuth 功能。
*   **添加 OAuth 回调路由:** 创建了 `src/app/auth/callback/route.ts` 用于处理包括 Google 登录在内的 OAuth 提供商回调，成功后将用户重定向到 `/dashboard`。

## ⚠️已知问题和注意事项

*   **老用户积分:** 在 `handle_new_user` 触发器和 `user_profiles` 表创建之前创建的现有用户可能没有积分条目。可能需要手动回填脚本或一种机制，在他们首次登录/操作时创建其个人资料。
*   **n8n 工作流程复杂性:** n8n 中的实际视频生成是一个占位符；真正的实现将涉及与 AI 视频 API (例如 D-ID、Synthesia、Hedra) 的集成。
*   **来自 n8n 的错误传播:** 如果 n8n 工作流程内部失败，`errorMessage` 会传递给 webhook，但目前未详细存储在 `projects` 表中 (只有状态设置为 'failed')。

## 💡未来增强功能

*   **手动调整积分:** 管理员界面或 Supabase 函数，用于为特定用户添加/删除积分。
*   **订阅计划:** 集成 Stripe 或类似服务，供用户购买更多积分或订阅计划。
*   **详细的项目错误日志记录:** 在 `projects` 表中存储来自 n8n 的更详细的错误消息。
*   **增强的视频播放器:** 更强大的带有自定义控件的视频播放器。
*   **通知:** 视频生成完成或失败时的电子邮件或应用内通知。
*   **公开分享:** 用户可以通过公开链接分享他们生成的视频的选项。
*   **i18n / 本地化:** UI 的完全国际化。

---
(之前 README 中关于 X-Monitor 的内容已被移除，因为这是一个新的项目重点)
--- 
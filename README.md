# jike-publish

用于发布内容到**即刻（Jike）**的工具，基于 [jike-sdk](https://github.com/open-jike/jike-sdk) 构建。

## 功能

- 发布文字动态到即刻
- 支持指定圈子（Topic）发布
- 提供 CLI 命令行工具和 Node.js API

## 安装

```bash
npm install
```

## 配置

复制 `.env.example` 为 `.env`，填写必要的配置项：

```bash
cp .env.example .env
```

| 变量名 | 说明 |
|---|---|
| `JIKE_ENDPOINT_ID` | API 接入点 ID |
| `JIKE_ENDPOINT_URL` | API 接入点 URL |
| `JIKE_BUNDLE_ID` | App Bundle ID |
| `JIKE_APP_VERSION` | App 版本号 |
| `JIKE_BUILD_NO` | App 构建号 |
| `JIKE_USER_AGENT` | User-Agent 请求头 |
| `JIKE_ACCESS_TOKEN` | 即刻访问令牌（Access Token） |

> **说明**：接入点配置和 Access Token 可通过抓包即刻 App 的网络请求获取。

## 使用

### CLI 命令行

```bash
# 发布普通动态
npm start -- "Hello, Jike! 🎉"

# 在指定圈子发布动态
npm start -- "在这个圈子里打卡 ✅" --topic <topic-id>

# 或者构建后直接运行
npm run build
node dist/cli.js "Hello, Jike!"
```

### Node.js API

```typescript
import { publish } from './dist/index.js'

const result = await publish(
  {
    endpointId: 'jike',
    endpointUrl: 'https://your-endpoint-url/',
    bundleId: 'com.jike.app',
    appVersion: '7.0.0',
    buildNo: '700',
    userAgent: 'jike/7.0.0 (iPhone; iOS 16.0)',
    accessToken: 'your-access-token',
  },
  'Hello, Jike! 🎉',
  { topicId: 'optional-topic-id' },
)

if (result.success) {
  console.log('发布成功，动态 ID：', result.postId)
} else {
  console.error('发布失败：', result.error)
}
```

## 构建

```bash
npm run build
```

## 许可证

MIT


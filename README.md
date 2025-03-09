# KubeView - Kubernetes Cluster Management Tool

KubeView is an open-source Kubernetes cluster management tool that provides a user-friendly interface for visualizing and managing Kubernetes resources. It offers both a web interface that can be deployed within a Kubernetes cluster and a Windows desktop client built with Electron.

## Features

- **Cluster Overview**: Visualize your entire Kubernetes cluster in an intuitive dashboard
- **Resource Management**: View, filter, and manage Kubernetes resources including Pods, Deployments, Services, and more
- **Resource Visualization**: Interactive graph visualization showing relationships between Kubernetes resources
- **Multi-cluster Support**: Connect to and manage multiple Kubernetes clusters
- **Namespace Filtering**: Filter resources by namespace for better organization
- **Cross-platform**: Available as a web application or Windows desktop client
- **Real-time Updates**: Live updates of resource status and metrics
- **Kubernetes 1.32 Compatible**: Fully compatible with Kubernetes version 1.32

## Architecture

KubeView consists of three main components:

1. **Web Interface**: A React-based web application that provides the user interface
2. **Backend API**: A Node.js API that communicates with the Kubernetes API
3. **Desktop Client**: An Electron-based desktop application for Windows

\`\`\`mermaid title="KubeView Architecture" type="diagram"
graph TD;
    A["Web Interface (React)"]-->B["Backend API (Node.js)"]
    C["Desktop Client (Electron)"]-->B
    B-->D["Kubernetes API"]
    D-->E["Kubernetes Cluster"]

\`\`\`

## 中文文档

### 项目说明

KubeView是一个开源的Kubernetes集群管理工具，提供用户友好的界面来可视化和管理Kubernetes资源。它既可以作为Web应用部署在Kubernetes集群内，也可以作为Windows桌面客户端使用。

### 主要功能

- **集群概览**：通过直观的仪表板可视化整个Kubernetes集群
- **资源管理**：查看、筛选和管理包括Pod、Deployment、Service等在内的Kubernetes资源
- **资源可视化**：交互式图形可视化展示Kubernetes资源之间的关系
- **多集群支持**：连接和管理多个Kubernetes集群
- **命名空间筛选**：通过命名空间筛选资源，提高组织效率
- **用户认证**：通过用户认证和基于角色的权限确保安全访问
- **资源监控**：实时监控集群资源，支持自定义告警
- **跨平台**：可作为Web应用或Windows桌面客户端使用
- **实时更新**：资源状态和指标的实时更新
- **兼容Kubernetes 1.32**：完全兼容Kubernetes 1.32版本

### 环境要求

- Node.js 18.x或更高版本
- npm 9.x或更高版本
- Kubernetes集群（用于部署）
- 已配置kubectl并能访问您的集群

### 快速开始

#### 本地开发

1. 克隆仓库：
\`\`\`bash
git clone https://github.com/yourusername/kubeview.git
cd kubeview
\`\`\`

2. 安装依赖：
\`\`\`bash
npm install
\`\`\`

3. 运行开发服务器：
\`\`\`bash
npm run dev
\`\`\`

4. 访问应用：
\`\`\`
http://localhost:3000
\`\`\`

#### 默认登录凭据
- 用户名：`admin`
- 密码：`password`

### 生产环境构建

1. 构建应用：
\`\`\`bash
npm run build
\`\`\`

2. 启动生产服务器：
\`\`\`bash
npm start
\`\`\`

### Docker构建

1. 构建Docker镜像：
\`\`\`bash
docker build -t kubeview:latest .
\`\`\`

2. 运行Docker容器：
\`\`\`bash
docker run -p 3000:3000 kubeview:latest
\`\`\`

3. 访问应用：
\`\`\`
http://localhost:3000
\`\`\`

### 部署到Kubernetes

#### 使用kubectl

1. 应用Kubernetes清单文件：
\`\`\`bash
kubectl apply -f kubernetes/deployment.yaml
\`\`\`

2. 检查部署状态：
\`\`\`bash
kubectl get pods -l app=kubeview
\`\`\`

3. 访问应用：
\`\`\`bash
# 创建到服务的端口转发
kubectl port-forward svc/kubeview 8080:80
\`\`\`

4. 打开浏览器并访问：
\`\`\`
http://localhost:8080
\`\`\`

#### 使用Helm

1. 添加KubeView Helm仓库：
\`\`\`bash
helm repo add kubeview https://yourusername.github.io/kubeview-helm
helm repo update
\`\`\`

2. 安装Helm chart：
\`\`\`bash
helm install kubeview kubeview/kubeview
\`\`\`

3. 按照Helm提供的说明访问应用。

### 环境变量

KubeView支持以下环境变量：

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `PORT` | 服务器运行端口 | `3000` |
| `NODE_ENV` | 环境模式 | `production` |
| `KUBEVIEW_AUTH_ENABLED` | 启用认证 | `true` |
| `KUBEVIEW_SESSION_SECRET` | 会话加密密钥 | `kubeview-secret` |
| `KUBEVIEW_DEFAULT_NAMESPACE` | 默认显示的命名空间 | `default` |

### 桌面客户端

桌面客户端提供与Web界面相同的功能，但作为Windows上的原生应用程序运行。

#### 构建桌面客户端

1. 构建Electron应用：
\`\`\`bash
npm run build:electron
\`\`\`

2. 构建好的应用将在`dist`目录中可用。

### 项目结构

\`\`\`
kubeview/
├── app/                  # Next.js应用
│   ├── components/       # React组件
│   ├── hooks/            # 自定义React钩子
│   ├── lib/              # 工具函数
│   ├── services/         # API服务
│   └── types/            # TypeScript类型定义
├── electron/             # Electron应用文件
├── kubernetes/           # Kubernetes部署清单
└── public/               # 静态资源
\`\`\`

### 运行测试

\`\`\`bash
npm test
\`\`\`

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

### 贡献指南

欢迎贡献！请随时提交Pull Request。

1. Fork仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m '添加一些惊人的功能'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 打开Pull Request

### 许可证

本项目采用MIT许可证 - 详情请参阅LICENSE文件。


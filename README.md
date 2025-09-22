# 个人博客系统

基于Spring Boot 3.2.0 + MySQL 8.0 + Docker的个人博客系统，支持完整的监控体系。

## 功能特性

- ✅ 文章发布和管理
- ✅ 文章分类管理  
- ✅ 评论系统
- ✅ 响应式设计
- ✅ Docker容器化部署
- ✅ Prometheus + Grafana 监控

## 技术栈

- **后端**: Spring Boot 3.2.0 + JDK 17
- **数据库**: MySQL 8.0
- **容器化**: Docker + Docker Compose
- **监控**: Prometheus + Grafana
- **模板引擎**: Thymeleaf

## 快速开始

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+

### 一键部署

```bash
# 克隆项目
git clone <your-repo-url>
cd personal-blog

# 启动所有服务
docker-compose up -d

# 访问应用
# 博客系统: http://localhost:8080  
# 监控面板: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9091
```

## 服务组件

- **blog-app**: Spring Boot应用 (8080)
- **mysql**: MySQL数据库 (3306) 
- **prometheus**: 监控数据收集 (9091)
- **grafana**: 监控可视化 (3000)
- **node-exporter**: 系统监控 (9100)
- **mysql-exporter**: 数据库监控 (9104)

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f blog-app

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 重新构建
docker-compose up -d --build
```

## 监控访问

- **健康检查**: http://localhost:8080/actuator/health
- **应用指标**: http://localhost:8080/actuator/prometheus
- **监控面板**: http://localhost:3000 (admin/admin)

## 联系方式

- 微信: linux-king
- 邮箱: 284690589@qq.com
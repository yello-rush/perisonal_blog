# 个人博客系统

基于Spring Boot 3.2.0 + MySQL 8.0 + Thymeleaf的个人博客系统

## 功能特性

- ✅ 文章发布和管理
- ✅ 文章分类管理
- ✅ 评论系统
- ✅ 全文搜索
- ✅ 响应式设计
- ✅ Docker容器化部署
- ✅ Nginx反向代理
- ✅ Redis缓存支持

## 技术栈

- **后端框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **模板引擎**: Thymeleaf
- **构建工具**: Maven 3.9
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx
- **缓存**: Redis 7
- **Java版本**: OpenJDK 17

## 快速开始

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+

### 一键部署

```bash
# 克隆项目
git clone https://github.com/your-username/personal-blog.git
cd personal-blog

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f blog-app
```

### 开发环境

```bash
# 启动开发环境（包含调试端口和管理工具）
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# 访问应用: http://localhost:8080
# 访问数据库管理: http://localhost:8081 (adminer)
# 调试端口: 5005
```

### 生产环境

```bash
# 启动生产环境（包含Nginx反向代理）
docker-compose --profile nginx up -d

# 访问应用: http://localhost
```

## 项目结构

```
personal-blog/
├── src/                          # 源代码
│   ├── main/
│   │   ├── java/                 # Java源码
│   │   └── resources/            # 资源文件
│   │       ├── static/           # 静态资源
│   │       ├── templates/        # Thymeleaf模板
│   │       ├── application.yml   # 应用配置
│   │       └── application-docker.yml  # Docker环境配置
│   └── test/                     # 测试代码
├── docker/                       # Docker配置文件
│   ├── mysql/                    # MySQL配置
│   ├── nginx/                    # Nginx配置
│   └── redis/                    # Redis配置
├── mysql-data/                   # 数据库初始化脚本
├── Dockerfile                    # 应用镜像构建文件
├── docker-compose.yml            # 服务编排文件
├── docker-compose.override.yml   # 开发环境覆盖配置
└── pom.xml                      # Maven项目配置
```

## 环境配置

### 数据库配置

默认数据库配置：
- 主机: mysql (容器内网络)
- 端口: 3306
- 数据库: personal_blog
- 用户名: root
- 密码: root123456

### 应用配置

主要配置文件：
- `application.yml`: 基础配置
- `application-docker.yml`: Docker环境专用配置

### 环境变量

支持的环境变量：
- `DB_HOST`: 数据库主机 (默认: mysql)
- `DB_PORT`: 数据库端口 (默认: 3306)
- `DB_NAME`: 数据库名 (默认: personal_blog)
- `DB_USERNAME`: 数据库用户名 (默认: root)
- `DB_PASSWORD`: 数据库密码 (默认: root123456)
- `JAVA_OPTS`: JVM参数

## Docker服务

### 核心服务

- **blog-app**: Spring Boot应用 (端口: 8080)
- **mysql**: MySQL数据库 (端口: 3306)

### 可选服务

- **nginx**: 反向代理 (端口: 80, 443) - 使用 `--profile nginx`
- **redis**: 缓存服务 (端口: 6379) - 使用 `--profile redis`
- **adminer**: 数据库管理工具 (端口: 8081) - 仅开发环境

## 常用命令

```bash
# 查看所有服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f blog-app

# 重启应用
docker-compose restart blog-app

# 重新构建并启动
docker-compose up -d --build

# 停止所有服务
docker-compose down

# 停止并删除数据
docker-compose down -v

# 进入应用容器
docker-compose exec blog-app bash

# 进入数据库容器
docker-compose exec mysql mysql -uroot -p

# 备份数据库
docker-compose exec mysql mysqldump -uroot -proot123456 personal_blog > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -uroot -proot123456 personal_blog < backup.sql
```

## 监控和日志

### 健康检查

- 应用健康检查: http://localhost:8080/actuator/health
- 通过Nginx: http://localhost/health

### 日志查看

```bash
# 应用日志
docker-compose logs -f blog-app

# 数据库日志
docker-compose logs -f mysql

# Nginx日志
docker-compose logs -f nginx

# 所有服务日志
docker-compose logs -f
```

### 性能监控

- 应用指标: http://localhost:8080/actuator/metrics
- JVM信息: http://localhost:8080/actuator/info

## 开发指南

### 本地开发

1. 启动数据库和Redis
```bash
docker-compose up -d mysql redis
```

2. 在IDE中启动Spring Boot应用

3. 访问 http://localhost:8080

### 代码提交

```bash
git add .
git commit -m "feat: 新功能描述"
git push origin main
```

### 部署更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

## 故障排查

### 常见问题

1. **端口被占用**
   ```bash
   netstat -tulpn | grep :8080
   ```

2. **数据库连接失败**
   ```bash
   docker-compose logs mysql
   ```

3. **应用启动失败**
   ```bash
   docker-compose logs blog-app
   ```

### 清理和重置

```bash
# 停止所有服务
docker-compose down

# 删除所有数据
docker-compose down -v

# 清理镜像
docker system prune -a

# 重新开始
docker-compose up -d
```

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 微信: linux-king
- 邮箱: 284690589@qq.com
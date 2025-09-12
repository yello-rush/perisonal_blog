# 多阶段构建：构建阶段
FROM maven:3.8.5-openjdk-17-slim AS build

# 设置工作目录
WORKDIR /app

复制Maven配置文件
COPY .m2/settings-docker.xml /root/.m2/settings.xml

# 复制 pom.xml 文件（利用Docker缓存机制）
COPY pom.xml .

# 下载依赖（这一层会被缓存，除非pom.xml改变）
RUN mvn dependency:go-offline -B

# 复制源代码
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 运行阶段：使用更小的JRE镜像
FROM openjdk:17-jdk-slim

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建应用用户（安全考虑）
RUN groupadd -r app && useradd -r -g app app

# 设置工作目录
WORKDIR /app

# 从构建阶段复制jar文件
COPY --from=build /app/target/*.jar app.jar

# 更改文件所有者
RUN chown app:app app.jar

# 切换到应用用户
USER app

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.profiles.active=docker", \
    "-jar", \
    "app.jar"]
package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 个人博客系统应用启动类
 * Spring Boot 应用的入口点，负责启动整个博客系统
 * 使用 @SpringBootApplication 注解开启自动配置和组件扫描
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@SpringBootApplication
public class Main {
    /**
     * 应用程序入口点
     * 启动 Spring Boot 应用并输出启动成功信息
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
        System.out.println("个人博客系统启动成功！访问 http://localhost:8080");
    }
}
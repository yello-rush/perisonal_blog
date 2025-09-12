package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 * 配置 Spring MVC 的静态资源映射，确保图片、CSS、JS 等资源能正确访问
 * 在开发环境中关闭缓存，方便实时测试修改
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 配置静态资源处理器
     * 设置 URL 路径和实际文件路径的映射关系
     * 
     * @param registry 资源处理器注册表
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 图片资源映射：将 /images/** 路径映射到 classpath:/static/images/ 目录
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(0); // 开发环境不缓存，方便实时测试
        
        // 所有静态资源映射：将所有请求映射到 classpath:/static/ 目录
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0); // 开发环境不缓存
    }
}
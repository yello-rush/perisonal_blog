package org.example.controller;

import org.example.model.Blog;
import org.example.model.Comment;
import org.example.service.BlogService;
import org.example.service.CategoryService;
import org.example.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * 博客控制器
 * 处理博客系统的所有HTTP请求，包括页面路由和API接口
 * 提供首页、文章详情、搜索、评论等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Controller
public class BlogController {

    /**
     * 博客文章服务层
     */
    @Autowired
    private BlogService blogService;
    
    /**
     * 分类服务层
     */
    @Autowired
    private CategoryService categoryService;
    
    /**
     * 评论服务层
     */
    @Autowired
    private CommentService commentService;

    /**
     * 首页控制器
     * 处理首页访问，支持按分类筛选文章
     * 
     * @param model 视图模型，用于传递数据到模板
     * @param categoryId 可选的分类ID，用于筛选文章
     * @return 首页模板名称
     */
    @GetMapping("/")
    public String index(Model model, @RequestParam(value = "category", required = false) Long categoryId) {
        // 添加博客文章列表，支持按分类筛选
        if (categoryId != null) {
            model.addAttribute("blogs", blogService.getBlogsByCategory(categoryId));
            model.addAttribute("currentCategory", categoryService.getCategoryById(categoryId).orElse(null));
        } else {
            model.addAttribute("blogs", blogService.getAllBlogs());
        }
        
        // 添加分类列表，用于导航栏显示
        model.addAttribute("categories", categoryService.getAllCategories());
        
        // 添加应用启动时间（使用JVM启动时间）
        LocalDateTime startTime = getApplicationStartTime();
        model.addAttribute("startTime", startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return "index";
    }

        /**
     * 文章详情页控制器
     * 显示指定文章的详细内容和相关评论，支持HTML格式内容渲染
     *
     * @param id 文章ID
     * @param model 视图模型
     * @return 文章详情页模板名称，或重定向到首页
     */
    @GetMapping("/blog/{id}")
    public String blogDetail(@PathVariable Long id, Model model) {
        Optional<Blog> blogOpt = blogService.getBlogById(id);
        if (blogOpt.isPresent()) {
            Blog blog = blogOpt.get();
            
            // 获取文章的顶级评论（不包括回复）
            model.addAttribute("comments", commentService.getTopLevelCommentsByBlogId(id));
            
            // 获取评论数量统计
            model.addAttribute("commentCount", commentService.getCommentCountByBlogId(id));
            
            // 获取文章分类信息
            if (blog.getCategoryId() != null) {
                model.addAttribute("category", categoryService.getCategoryById(blog.getCategoryId()).orElse(null));
            }
            
            // 增加阅读量统计
            blogService.incrementViewCount(id);
            
            // 传递文章对象到模板
            model.addAttribute("blog", blog);
            
            // 使用新的文章详情模板
            return "blog-detail-new";
        } else {
            // 文章不存在，重定向到首页
            return "redirect:/";
        }
    }

    /**
     * 搜索博客文章API
     * 提供RESTful API接口，支持关键词搜索文章
     * 
     * @param keyword 搜索关键词，可选参数
     * @return 匹配的文章列表，JSON格式
     */
    @GetMapping("/api/search")
    @ResponseBody
    public java.util.List<Blog> searchBlogs(@RequestParam(value = "keyword", required = false) String keyword) {
        return blogService.searchBlogs(keyword);
    }
    
    /**
     * 提交评论API
     * 处理新评论的提交，支持一级评论和回复功能
     * 
     * @param nickname 评论者昵称
     * @param email 评论者邮箱
     * @param content 评论内容
     * @param blogId 关联的文章ID
     * @param parentId 父评论ID（回复时使用）
     * @return 创建的评论对象，JSON格式
     */
    @PostMapping("/api/comments")
    @ResponseBody
    public Comment submitComment(@RequestParam String nickname,
                               @RequestParam String email,
                               @RequestParam String content,
                               @RequestParam Long blogId,
                               @RequestParam(required = false) Long parentId) {
        return commentService.addComment(nickname, email, content, blogId, parentId);
    }
    
    /**
     * 获取评论的回复API
     * 用于动态加载指定评论的所有回复
     * 
     * @param parentId 父评论ID
     * @return 该评论的所有回复，JSON格式
     */
    @GetMapping("/api/comments/{parentId}/replies")
    @ResponseBody
    public java.util.List<Comment> getReplies(@PathVariable Long parentId) {
        return commentService.getRepliesByParentId(parentId);
    }
    
        /**
     * 获取文章的顶级评论API
     * 用于动态加载文章的一级评论，不包括回复
     *
     * @param blogId 博客文章ID
     * @return 该文章的所有顶级评论，JSON格式
     */
    @GetMapping("/api/comments/top/{blogId}")
    @ResponseBody
    public java.util.List<Comment> getTopLevelComments(@PathVariable Long blogId) {
        return commentService.getTopLevelCommentsByBlogId(blogId);
    }
    
    /**
     * 获取应用启动时间
     * 使用JVM启动时间作为网站运行时间的起始点，与监控平台的系统运行时间概念保持一致
     * 
     * @return 应用启动时间
     */
    private LocalDateTime getApplicationStartTime() {
        // 获取JVM启动时间戳（毫秒）
        long jvmStartTime = ManagementFactory.getRuntimeMXBean().getStartTime();
        
        // 转换为LocalDateTime
        Instant instant = Instant.ofEpochMilli(jvmStartTime);
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

}
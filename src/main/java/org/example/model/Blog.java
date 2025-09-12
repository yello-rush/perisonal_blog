package org.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 博客文章实体类
 * 用于存储博客文章的基本信息，包括标题、内容、摘要、作者等
 * 支持文章分类、阅读统计、状态管理等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Entity
@Table(name = "blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 文章标题
     * 不能为空，最大长度200字符
     */
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    /**
     * 文章正文内容
     * 支持HTML格式，存储为长文本类型
     */
    @Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
    private String content;
    
    /**
     * 文章摘要
     * 用于列表页显示和SEO优化
     */
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;
    
    /**
     * 文章创建时间
     * 自动生成，用于排序和显示
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * 文章作者
     * 默认为"小明同学"
     */
    @Column(name = "author", length = 50)
    private String author = "小明同学";
    
    /**
     * 文章阅读次数
     * 用于统计文章热度
     */
    @Column(name = "view_count")
    private int viewCount = 0;
    

    
    
    /**
     * 评论数量统计
     * 用于快速显示评论数，避免频繁查询数据库
     */
    @Column(name = "comment_count")
    private Integer commentCount = 0;
    
    /**
     * 文章最后更新时间
     * 每次修改文章时自动更新
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * 文章分类ID
     * 外键关联到categories表，简化分类关系管理
     */
    @Column(name = "category_id")
    private Long categoryId;
    
    /**
     * 默认构造函数
     * JPA要求的无参构造函数
     */
    public Blog() {}

    /**
     * 带参数的构造函数
     * 创建新文章时使用
     * 
     * @param title 文章标题
     * @param content 文章内容
     * @param summary 文章摘要
     * @param author 文章作者
     * @param categoryId 分类ID
     */
    public Blog(String title, String content, String summary, String author, Long categoryId) {
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.author = author;
        this.categoryId = categoryId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * JPA生命周期回调 - 持久化前执行
     * 自动设置创建时间和更新时间
     */
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * JPA生命周期回调 - 更新前执行
     * 自动更新最后修改时间
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ================================
    // Getters 和 Setters 方法
    // ================================
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }
    

    
    
    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    /**
     * 获取格式化的创建时间
     * 格式：yyyy-MM-dd HH:mm
     * 
     * @return 格式化后的创建时间字符串，如果时间为null则返回空字符串
     */
    public String getFormattedCreatedAt() {
        if (createdAt == null) return "";
        return createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }
}
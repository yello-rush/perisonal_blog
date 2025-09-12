package org.example.model;

import jakarta.persistence.*;

/**
 * 文章分类实体类
 * 用于管理博客文章的分类信息，支持分类排序和文章计数
 * 简化设计，避免复杂的关联关系
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Entity
@Table(name = "categories")
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 分类名称
     * 唯一不可为空，最大长度50字符
     */
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;
    
    /**
     * 分类描述
     * 可选字段，用于详细说明分类的内容和用途
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * 文章数量统计
     * 用于快速显示该分类下的文章数量，默认为0
     */
    @Column(name = "article_count")
    private Integer articleCount = 0;
    
    /**
     * 分类排序顺序
     * 数字越小排序越靠前，默认为0
     */
    @Column(name = "sort_order")
    private Integer sortOrder = 0;
    
    
    /**
     * 默认构造函数
     * JPA要求的无参构造函数
     */
    public Category() {}
    
    /**
     * 带参数的构造函数
     * 创建新分类时使用
     * 
     * @param name 分类名称
     * @param description 分类描述
     * @param sortOrder 排序顺序
     */
    public Category(String name, String description, Integer sortOrder) {
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
    }
    
    
    // ================================
    // Getters 和 Setters 方法
    // ================================
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getArticleCount() { return articleCount; }
    public void setArticleCount(Integer articleCount) { this.articleCount = articleCount; }
    
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
}
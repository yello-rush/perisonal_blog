package org.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 评论实体类
 * 用于存储博客文章的评论信息，支持多级回复功能
 * 包含用户角色识别、头像显示等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Entity
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 关联的博客文章ID
     * 外键关联到blogs表，标识评论属于哪篇文章
     */
    @Column(name = "blog_id", nullable = false)
    private Long blogId;
    
    /**
     * 回复的父评论ID
     * 如果为null表示顶级评论，否则表示对某条评论的回复
     */
    @Column(name = "parent_id")
    private Long parentId;
    
    /**
     * 评论者昵称
     * 必填字段，最大长度50字符
     */
    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;
    
    /**
     * 评论者邮箱地址
     * 必填字段，用于识别用户身份和生成头像
     */
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    /**
     * 评论者头像URL
     * 默认使用系统提供的默认头像
     */
    @Column(name = "avatar", length = 255)
    private String avatar = "/images/default-avatar.svg";
    
    /**
     * 用户角色
     * 用于区分游客、博主、管理员等不同身份
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole = UserRole.guest;
    
    /**
     * 评论内容
     * 必填字段，支持文本格式
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    /**
     * 评论创建时间
     * 自动生成，用于排序和显示
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * 用户角色枚举
     * 定义系统中不同类型的用户角色
     */
    public enum UserRole {
        /** 游客用户 */
        guest("游客"), 
        /** 博主 */
        blogger("博主"), 
        /** 注册读者 */
        reader("读者"), 
        /** 系统管理员 */
        admin("管理员");
        
        private final String displayName;
        
        UserRole(String displayName) {
            this.displayName = displayName;
        }
        
        /**
         * 获取角色的显示名称
         * @return 角色显示名称
         */
        public String getDisplayName() {
            return displayName;
        }
    }
    
    /**
     * 默认构造函数
     * JPA要求的无参构造函数
     */
    public Comment() {}
    
    /**
     * 带参数的构造函数
     * 创建新评论时使用
     * 
     * @param nickname 评论者昵称
     * @param email 评论者邮箱
     * @param content 评论内容
     * @param blogId 关联的文章ID
     */
    public Comment(String nickname, String email, String content, Long blogId) {
        this.nickname = nickname;
        this.email = email;
        this.content = content;
        this.blogId = blogId;
        this.createdAt = LocalDateTime.now();
    }
    
    /**
     * JPA生命周期回调 - 持久化前执行
     * 自动设置创建时间
     */
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    // ================================
    // Getters 和 Setters 方法
    // ================================
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBlogId() { return blogId; }
    public void setBlogId(Long blogId) { this.blogId = blogId; }
    
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    
    public UserRole getUserRole() { return userRole; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    /**
     * 获取格式化的创建时间（北京时间）
     * 格式：yyyy年MM月dd日 HH:mm
     * 
     * @return 格式化后的创建时间字符串，如果时间为null则返回空字符串
     */
    public String getFormattedCreatedAt() {
        if (createdAt == null) return "";
        return createdAt.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm"));
    }
    
    /**
     * 获取用户角色显示名称
     * 
     * @return 角色的中文显示名称，如果角色为null则返回"游客"
     */
    public String getRoleDisplayName() {
        if (userRole == null) return "游客";
        return userRole.getDisplayName();
    }
}
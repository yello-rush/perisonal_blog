package org.example.repository;

import org.example.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 博客文章数据访问层
 * 提供文章的数据库操作方法，包括基本的CRUD操作和复杂查询
 * 支持按分类查询、全文搜索、状态筛选等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    /**
     * 查询所有文章（按创建时间倒序）
     * 用于首页文章列表显示
     * 
     * @return 文章列表，按创建时间倒序排列
     */
    @Query("SELECT b FROM Blog b ORDER BY b.createdAt DESC")
    List<Blog> findAllPublishedOrderByCreatedAt();
    
    /**
     * 根据分类ID查询文章（按创建时间倒序）
     * 用于分类页面显示特定分类下的所有文章
     * 
     * @param categoryId 分类ID
     * @return 指定分类下的文章列表
     */
    @Query("SELECT b FROM Blog b WHERE b.categoryId = :categoryId ORDER BY b.createdAt DESC")
    List<Blog> findPublishedBlogsByCategoryId(@Param("categoryId") Long categoryId);
    
    /**
     * 全文搜索文章（按创建时间倒序）
     * 支持在文章标题、摘要和内容中搜索关键词，不区分大小写
     * 
     * @param keyword 搜索关键词
     * @return 匹配的文章列表
     */
    @Query("SELECT b FROM Blog b WHERE " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY b.createdAt DESC")
    List<Blog> searchBlogs(@Param("keyword") String keyword);
    
    /**
     * 增加文章浏览量
     * 用于统计文章阅读量，每次访问文章详情页时调用
     * 
     * @param id 文章ID
     */
    @Modifying
    @Transactional
    @Query("UPDATE Blog b SET b.viewCount = b.viewCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);
    

    
    /**
     * 统计文章数量
     * 用于显示站点统计信息
     * 
     * @return 文章数量
     */
    @Query("SELECT COUNT(b) FROM Blog b")
    long countPublishedBlogs();
    
    /**
     * 根据分类统计文章数量
     * 用于统计各个分类下的文章数量
     * 
     * @param categoryId 分类ID
     * @return 指定分类下文章数量
     */
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.categoryId = :categoryId")
    long countPublishedBlogsByCategoryId(@Param("categoryId") Long categoryId);
}
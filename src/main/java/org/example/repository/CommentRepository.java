package org.example.repository;

import org.example.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论数据访问层
 * 提供评论的数据库操作方法，支持多级评论功能
 * 包括顶级评论查询、回复查询、评论统计等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    /**
     * 查询文章的所有顶级评论（非回复）
     * 返回指定文章下的所有一级评论，按时间升序排列
     * 
     * @param blogId 博客文章ID
     * @return 顶级评论列表
     */
    @Query("SELECT c FROM Comment c WHERE c.blogId = :blogId AND c.parentId IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findTopLevelCommentsByBlogId(@Param("blogId") Long blogId);
    
    /**
     * 查询评论的回复
     * 返回指定评论的所有回复，按时间升序排列
     * 
     * @param parentId 父评论ID
     * @return 回复评论列表
     */
    @Query("SELECT c FROM Comment c WHERE c.parentId = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(@Param("parentId") Long parentId);
    
    /**
     * 查询文章的所有评论（包括回复）
     * 返回指定文章下的所有评论，包括一级评论和所有回复
     * 
     * @param blogId 博客文章ID
     * @return 所有评论列表
     */
    @Query("SELECT c FROM Comment c WHERE c.blogId = :blogId ORDER BY c.createdAt ASC")
    List<Comment> findAllCommentsByBlogId(@Param("blogId") Long blogId);
    
    /**
     * 统计文章的评论数量
     * 返回指定文章下的所有评论数量（包括回复）
     * 
     * @param blogId 博客文章ID
     * @return 评论总数
     */
    long countByBlogId(Long blogId);
    
    /**
     * 根据邮箱查询评论（用于识别回头客）
     * 用于查找某个用户的所有评论历史，按时间倒序排列
     * 
     * @param email 用户邮箱地址
     * @return 该用户的所有评论
     */
    List<Comment> findByEmailOrderByCreatedAtDesc(String email);
    
    /**
     * 查询最新的评论
     * 用于管理后台显示最近的评论动态
     * 
     * @return 所有评论按时间倒序排列
     */
    @Query("SELECT c FROM Comment c ORDER BY c.createdAt DESC")
    List<Comment> findLatestComments();
}
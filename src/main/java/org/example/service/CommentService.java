package org.example.service;

import org.example.model.Comment;
import org.example.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 评论服务类
 * 提供评论系统的业务逻辑处理，支持多级评论功能
 * 包括评论的增删改查、用户角色识别、评论统计等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Service
public class CommentService {
    
    /**
     * 评论数据访问层
     */
    @Autowired
    private CommentRepository commentRepository;
    
    /**
     * 获取文章的所有顶级评论
     * 返回指定文章下的一级评论，不包括回复
     * 
     * @param blogId 博客文章ID
     * @return 顶级评论列表
     */
    public List<Comment> getTopLevelCommentsByBlogId(Long blogId) {
        return commentRepository.findTopLevelCommentsByBlogId(blogId);
    }
    
    /**
     * 获取评论的回复
     * 返回指定评论的所有回复
     * 
     * @param parentId 父评论ID
     * @return 回复评论列表
     */
    public List<Comment> getRepliesByParentId(Long parentId) {
        return commentRepository.findRepliesByParentId(parentId);
    }
    
    /**
     * 获取文章的所有评论
     * 返回指定文章下的所有评论，包括一级评论和所有回复
     * 
     * @param blogId 博客文章ID
     * @return 所有评论列表
     */
    public List<Comment> getAllCommentsByBlogId(Long blogId) {
        return commentRepository.findAllCommentsByBlogId(blogId);
    }
    
    /**
     * 保存评论
     * 用于创建新评论或更新现有评论
     * 
     * @param comment 评论对象
     * @return 保存后的评论对象
     */
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    /**
     * 根据ID获取评论
     * 用于查询单个评论的详细信息
     * 
     * @param id 评论ID
     * @return 评论对象，如果不存在则返回Optional.empty()
     */
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }
    
    /**
     * 删除评论
     * 注意：删除父评论时，其所有回复也应该被删除
     * 
     * @param id 评论ID
     */
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
    
    /**
     * 统计文章评论数量
     * 返回指定文章下的所有评论数量（包括回复）
     * 
     * @param blogId 博客文章ID
     * @return 评论总数
     */
    public long getCommentCountByBlogId(Long blogId) {
        return commentRepository.countByBlogId(blogId);
    }
    
    /**
     * 根据邮箱查询评论历史
     * 用于获取某个用户的所有评论，可用于识别回头客或用户管理
     * 
     * @param email 用户邮箱地址
     * @return 该用户的所有评论
     */
    public List<Comment> getCommentsByEmail(String email) {
        return commentRepository.findByEmailOrderByCreatedAtDesc(email);
    }
    
    /**
     * 获取最新评论
     * 用于管理后台显示最近的评论动态
     * 
     * @return 所有评论按时间倒序排列
     */
    public List<Comment> getLatestComments() {
        return commentRepository.findLatestComments();
    }
    
    /**
     * 添加新评论
     * 创建新评论并自动识别用户角色，支持回复功能
     * 
     * @param nickname 评论者昵称
     * @param email 评论者邮箱
     * @param content 评论内容
     * @param blogId 关联的文章ID
     * @param parentId 父评论ID（如果是回复）
     * @return 创建的评论对象
     */
    public Comment addComment(String nickname, String email, String content, Long blogId, Long parentId) {
        Comment comment = new Comment(nickname, email, content, blogId);
        comment.setParentId(parentId);
        
        // 根据邮箱判断用户角色
        // TODO: 请将下行替换为您的实际邮箱地址
        if ("你的邮箱@example.com".equals(email)) {
            comment.setUserRole(Comment.UserRole.blogger);
        } else {
            comment.setUserRole(Comment.UserRole.guest);
        }
        
        return commentRepository.save(comment);
    }
}
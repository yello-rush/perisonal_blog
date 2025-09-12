package org.example.service;

import org.example.model.Blog;
import org.example.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 博客服务类
 * 提供博客文章的业务逻辑处理，包括文章的查询、搜索、统计等功能
 * 作为控制器层和数据访问层之间的中间层，处理业务规则
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Service
public class BlogService {

    /**
     * 博客文章数据访问层
     */
    @Autowired
    private BlogRepository blogRepository;
    
    // TODO: 如果需要分类功能扩展，可以取消注释
    // @Autowired
    // private CategoryRepository categoryRepository;


    /**
     * 获取所有已发布的博客文章（按创建时间倒序）
     * 用于首页文章列表显示，只显示已发布的文章
     * 
     * @return 已发布的文章列表
     */
    public List<Blog> getAllBlogs() {
        return blogRepository.findAllPublishedOrderByCreatedAt();
    }

    /**
     * 根据ID获取博客文章
     * 用于文章详情页显示，支持查询任意状态的文章
     * 
     * @param id 文章ID
     * @return 文章对象，如果不存在则返回Optional.empty()
     */
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    /**
     * 增加文章浏览量
     * 每次访问文章详情页时调用，用于统计文章热度
     * 
     * @param id 文章ID
     */
    public void incrementViewCount(Long id) {
        blogRepository.incrementViewCount(id);
    }

    /**
     * 根据关键词搜索博客文章
     * 支持在文章标题、摘要和内容中搜索，不区分大小写
     * 如果关键词为空，则返回所有文章
     * 
     * @param keyword 搜索关键词
     * @return 匹配的博客文章列表
     */
    public List<Blog> searchBlogs(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBlogs();
        }
        return blogRepository.searchBlogs(keyword.trim());
    }

    /**
     * 根据分类获取文章
     * 返回指定分类下的所有已发布文章
     * 
     * @param categoryId 分类ID
     * @return 指定分类下的文章列表
     */
    public List<Blog> getBlogsByCategory(Long categoryId) {
        return blogRepository.findPublishedBlogsByCategoryId(categoryId);
    }

    // TODO: 置顶文章功能 - 预留给未来扩展
    // /**
    //  * 获取置顶文章
    //  */
    // public List<Blog> getPinnedBlogs() {
    //     return blogRepository.findPinnedBlogs();
    // }

    /**
     * 保存博客文章
     * 用于创建新文章或更新现有文章
     * 
     * @param blog 文章对象
     * @return 保存后的文章对象
     */
    public Blog saveBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    /**
     * 删除博客文章
     * 注意：删除文章后对应的评论也应该被删除（数据库级别约束或业务逻辑处理）
     * 
     * @param id 文章ID
     */
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }

    /**
     * 统计已发布文章总数
     * 用于显示站点统计信息
     * 
     * @return 已发布的文章数量
     */
    public long getTotalBlogCount() {
        return blogRepository.countPublishedBlogs();
    }
}
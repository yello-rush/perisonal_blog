package org.example.repository;

import org.example.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 分类数据访问层
 * 提供文章分类的数据库操作方法
 * 支持分类的查询、排序和统计功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * 按排序顺序查询所有分类
     * 返回所有分类，按sortOrder字段升序排列
     * 
     * @return 所有分类列表，按排序顺序排列
     */
    List<Category> findAllByOrderBySortOrderAsc();
    
    /**
     * 根据名称查找分类
     * 用于检查分类名称是否已存在，因为分类名称是唯一的
     * 
     * @param name 分类名称
     * @return 匹配的分类对象，如果不存在则返回null
     */
    Category findByName(String name);
    
    /**
     * 查询有文章的分类
     * 只返回那些包含文章的分类，用于前台导航显示
     * 
     * @return 有文章的分类列表，按排序顺序排列
     */
    @Query("SELECT c FROM Category c WHERE c.articleCount > 0 ORDER BY c.sortOrder ASC")
    List<Category> findCategoriesWithArticles();
}
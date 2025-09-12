package org.example.service;

import org.example.model.Category;
import org.example.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 分类服务类
 * 提供文章分类的业务逻辑处理，支持分类的增删改查功能
 * 包括分类的排序管理、文章计数统计等功能
 * 
 * @author 博主
 * @version 1.0
 * @since 2024-09-01
 */
@Service
public class CategoryService {
    
    /**
     * 分类数据访问层
     */
    @Autowired
    private CategoryRepository categoryRepository;
    
    /**
     * 获取所有分类（按排序顺序）
     * 返回所有分类，按sortOrder字段升序排列
     * 
     * @return 所有分类列表
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }
    
    /**
     * 获取有文章的分类
     * 只返回那些包含文章的分类，用于前台导航显示
     * 
     * @return 有文章的分类列表
     */
    public List<Category> getCategoriesWithArticles() {
        return categoryRepository.findCategoriesWithArticles();
    }
    
    /**
     * 根据ID获取分类
     * 用于查询单个分类的详细信息
     * 
     * @param id 分类ID
     * @return 分类对象，如果不存在则返回Optional.empty()
     */
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
    
    /**
     * 根据名称获取分类
     * 用于检查分类名称是否已存在，因为分类名称是唯一的
     * 
     * @param name 分类名称
     * @return 匹配的分类对象，如果不存在则返回null
     */
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    /**
     * 保存分类
     * 用于创建新分类或更新现有分类
     * 
     * @param category 分类对象
     * @return 保存后的分类对象
     */
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    /**
     * 删除分类
     * 注意：删除分类前应该检查是否还有文章关联到该分类
     * 
     * @param id 分类ID
     */
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    
    /**
     * 统计分类总数
     * 用于显示站点统计信息
     * 
     * @return 分类的总数量
     */
    public long getTotalCategoryCount() {
        return categoryRepository.count();
    }
}
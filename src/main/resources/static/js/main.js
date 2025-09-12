// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化时钟
    initClock();
    
    // 初始化网站运行时间
    initRuntime();
    
    // 初始化Hero页面滚动效果
    initHeroScroll();
    
    // 添加一些交互效果
    initInteractions();
    
    // 初始化文章展开功能
    initArticleExpansion();

    // 初始化搜索功能
    initSearchFunction();
    
    // 初始化评论功能
    initCommentFunction();
    
    // 初始化侧边栏粘性滚动增强功能
    initSidebarSticky();
    
    // 初始化分类筛选和排序功能
    initFilterAndSort();

    // 如果通过锚点直接进入博客区，确保导航栏和内容淡入动画已触发
    initHashActivation();
});

/**
 * 初始化日期功能
 */
function initClock() {
    const dateElement = document.getElementById('dateInfo');
    const lunarElement = document.getElementById('lunarInfo');
    const heroDateElement = document.getElementById('heroDateInfo');
    const heroLunarElement = document.getElementById('heroLunarInfo');
    
    function updateDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekDay = weekDays[now.getDay()];
        const dateText = `${year}年${month}月${date}日 星期${weekDay}`;
        const lunar = convertToLunar(now);
        
        // 更新博客区域的日期
        if (dateElement) {
            dateElement.textContent = dateText;
        }
        if (lunarElement) {
            lunarElement.textContent = lunar;
        }
        
        // 更新Hero区域的日期
        if (heroDateElement) {
            heroDateElement.textContent = dateText;
        }
        if (heroLunarElement) {
            heroLunarElement.textContent = lunar;
        }
    }
    
    // 立即更新一次
    updateDateTime();
    
    // 每小时更新一次
    setInterval(updateDateTime, 60000 * 60);
}

/**
 * 简化的农历转换函数
 */
function convertToLunar(date) {
    // 农历年份天干地支
    const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化计算 - 计算相对于2024年甲辰年的偏移
    const baseYear = 2024;
    const yearOffset = year - baseYear;
    const tianganIndex = (0 + yearOffset) % 10; // 2024年是甲年，索引0
    const dizhiIndex = (4 + yearOffset) % 12;   // 2024年是辰年，索引4
    
    const lunarYear = tiangan[tianganIndex < 0 ? tianganIndex + 10 : tianganIndex] + 
                     dizhi[dizhiIndex < 0 ? dizhiIndex + 12 : dizhiIndex];
    const zodiacAnimal = zodiac[dizhiIndex < 0 ? dizhiIndex + 12 : dizhiIndex];
    
    // 农历月份和日期的简化映射
    const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 简化的农历日期计算（这里使用近似算法）
    const dayOfYear = Math.floor((new Date(year, month - 1, day) - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24)) + 1;
    const approximateLunarMonth = Math.floor((dayOfYear - 1) / 30) % 12;
    const approximateLunarDay = ((dayOfYear - 1) % 30);
    
    const lunarMonthName = lunarMonths[approximateLunarMonth] + '月';
    const lunarDayName = lunarDays[approximateLunarDay] || '初一';
    
    return `${lunarYear}年(${zodiacAnimal}年) ${lunarMonthName}${lunarDayName}`;
}

/**
 * 初始化Hero页面滚动效果
 */
function initHeroScroll() {
    const heroSection = document.getElementById('heroSection');
    const scrollHint = document.querySelector('.scroll-hint');
    
    if (!heroSection) return;
    
    // 点击滚动提示时平滑滚动到博客内容
    if (scrollHint) {
        scrollHint.addEventListener('click', function() {
            const blogSection = document.querySelector('.blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // 添加鼠标悬停效果
        scrollHint.style.cursor = 'pointer';
    }
    
    // 获取需要淡入的元素
    const header = document.querySelector('.blog-section .header');
    const profileCard = document.querySelector('.profile-card');
    const content = document.querySelector('.content');
    const postCards = document.querySelectorAll('.post-card');
    
    // 监听滚动事件
    let ticking = false;
    let hasTriggeredFadeIn = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset;
                const windowHeight = window.innerHeight;
                
                // 当滚动超过50%的窗口高度时，隐藏滚动提示
                if (scrollHint) {
                    if (scrollTop > windowHeight * 0.5) {
                        scrollHint.style.opacity = '0';
                    } else {
                        scrollHint.style.opacity = '1';
                    }
                }
                
                // 当滚动到博客区域时触发淡入动画
                if (scrollTop > windowHeight * 0.3 && !hasTriggeredFadeIn) {
                    hasTriggeredFadeIn = true;
                    
                    // 依次添加淡入效果，时间间隔更长
                    setTimeout(() => {
                        if (header) header.classList.add('fade-in');
                    }, 200);
                    
                    setTimeout(() => {
                        if (profileCard) profileCard.classList.add('fade-in');
                        const searchCard = document.querySelector('.search-card');
                        if (searchCard) searchCard.classList.add('fade-in');
                    }, 600);
                    
                    setTimeout(() => {
                        if (content) content.classList.add('fade-in');
                    }, 1000);
                    
                    // 文章卡片逐个淡入，间隔更长
                    postCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, 1400 + (index * 300));
                    });
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // 鼠标滚轮事件监听，提供更好的滚动体验
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // 如果在Hero section中向下滚动，直接跳转到博客内容
        if (scrollTop < windowHeight * 0.1 && e.deltaY > 0) {
            e.preventDefault();
            isScrolling = true;
            
            const blogSection = document.querySelector('.blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 滚动完成后重置标志
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    }, { passive: false });
}

/**
 * 处理通过 #blogSection 锚点进入时，直接展示博客区并触发淡入动画
 */
function initHashActivation() {
    if (location.hash === '#blogSection') {
        const header = document.querySelector('.blog-section .header');
        const profileCard = document.querySelector('.profile-card');
        const content = document.querySelector('.content');
        const postCards = document.querySelectorAll('.post-card');

        // 立即滚动到博客区起始位置
        const blogSection = document.getElementById('blogSection');
        if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }

        // 触发与滚动到达时一致的淡入序列
        setTimeout(() => { if (header) header.classList.add('fade-in'); }, 0);
        setTimeout(() => { 
            if (profileCard) profileCard.classList.add('fade-in');
            const searchCard = document.querySelector('.search-card');
            if (searchCard) searchCard.classList.add('fade-in');
        }, 200);
        setTimeout(() => { if (content) content.classList.add('fade-in'); }, 400);
        postCards.forEach((card, index) => {
            setTimeout(() => { card.classList.add('fade-in'); }, 600 + (index * 150));
        });
    }
}

/**
 * 初始化网站运行时间
 */
function initRuntime() {
    const runtimeElement = document.getElementById('runtime');
    if (!runtimeElement) return;
    
    // 从后端获取网站启动时间
    const startTimeStr = window.siteStartTime || '2024-01-01 00:00:00';
    const startTime = new Date(startTimeStr);
    
    function updateRuntime() {
        const now = new Date();
        const diff = now - startTime;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let runtimeText = '';
        if (days > 0) {
            runtimeText += `${days}天`;
        }
        if (hours > 0) {
            runtimeText += `${hours}小时`;
        }
        runtimeText += `${minutes}分钟`;
        
        runtimeElement.textContent = runtimeText;
    }
    
    // 立即更新一次
    updateRuntime();
    
    // 每分钟更新一次运行时间
    setInterval(updateRuntime, 60000);
}

/**
 * 初始化文章展开功能
 */
function initArticleExpansion() {
    const postsView = document.querySelector('.posts-view');
    const articleView = document.getElementById('articleView');
    const backBtn = document.getElementById('backBtn');
    const postCards = document.querySelectorAll('.post-card');
    
    if (!postsView || !articleView) return;
    
    // 为每个文章卡片添加点击事件
    postCards.forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const blogId = card.dataset.id;
                if (blogId) {
                    // 跳转到文章详情页
                    window.location.href = `/blog/${blogId}`;
                }
            });
        }
        
        // 也可以点击整个卡片
        card.addEventListener('click', function(e) {
            // 避免在点击按钮时重复触发
            if (e.target.classList.contains('read-more-btn')) return;
            e.preventDefault();
            const blogId = card.dataset.id;
            if (blogId) {
                // 跳转到文章详情页
                window.location.href = `/blog/${blogId}`;
            }
        });
        
        // 为卡片添加鼠标悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 返回按钮事件
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('返回按钮被点击'); // 调试用
            hideArticle();
        });
    }
    
    // 显示文章详情
    function showArticle(card) {
        const title = card.dataset.title;
        const content = card.dataset.content;
        const author = card.dataset.author;
        const date = card.dataset.date;
        const readCount = card.dataset.readCount;
        const blogId = card.dataset.id;
        
        // 填充文章内容
        const articleTitle = document.getElementById('articleTitle');
        const articleMeta = document.getElementById('articleMeta');
        const articleContent = document.querySelector('.content-body');
        
        if (articleTitle) articleTitle.textContent = title;
        if (articleMeta) {
            articleMeta.innerHTML = `
                <span class="article-date">${date}</span>
                <span class="article-author">by ${author}</span>
                <span class="article-read-count">${readCount} 阅读</span>
            `;
        }
        if (articleContent) {
            // 处理换行符
            const formattedContent = content.replace(/\n/g, '<br>');
            articleContent.innerHTML = formattedContent;
        }
        
        // 显示并初始化评论区域
        const commentsSectionContainer = document.getElementById('commentsSectionContainer');
        const currentBlogIdInput = document.getElementById('currentBlogId');
        if (commentsSectionContainer && currentBlogIdInput && blogId) {
            currentBlogIdInput.value = blogId;
            commentsSectionContainer.style.display = 'block';
            
            // 添加淡入效果
            setTimeout(() => {
                commentsSectionContainer.classList.add('fade-in');
            }, 300);
            
            // 加载评论
            loadCommentsForArticle(blogId);
            
            // 绑定首页评论事件（如果还没绑定）
            bindIndexCommentEvents();
        }
        
        // 重置动画
        const animatedElements = articleView.querySelectorAll('.article-title, .article-meta, .article-content');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // 触发重排
            el.style.animation = null;
        });
        
        // 切换视图
        postsView.classList.add('hidden');
        articleView.classList.add('active');
        
        // 滚动到博客内容区域的顶部，与返回按钮行为保持一致
        setTimeout(() => {
            const blogSection = document.querySelector('.blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }
    
    // 隐藏文章详情
    function hideArticle() {
        console.log('隐藏文章'); // 调试用
        postsView.classList.remove('hidden');
        articleView.classList.remove('active');
        
        // 隐藏评论区域
        const commentsSectionContainer = document.getElementById('commentsSectionContainer');
        if (commentsSectionContainer) {
            commentsSectionContainer.style.display = 'none';
            commentsSectionContainer.classList.remove('fade-in');
        }
        
        // 滚动到博客内容区域的顶部，而不是整个页面顶部
        setTimeout(() => {
            const blogSection = document.querySelector('.blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }
    
    // ESC键返回
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && articleView.classList.contains('active')) {
            hideArticle();
        }
    });
}

/**
 * 初始化交互效果
 */
function initInteractions() {
    // 注意：文章卡片的交互效果已在 initArticleExpansion() 中处理
    
    // 为按钮添加点击动画
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = e.offsetX - 10 + 'px';
            ripple.style.top = e.offsetY - 10 + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                this.removeChild(ripple);
            }, 600);
        });
    });
    
    // 平滑滚动效果 - 只处理特定的链接，避免影响文章内容导航
    const links = document.querySelectorAll('a[href^="#"]:not(.article-body a):not(.article-content a)');
    links.forEach(link => {
        // 排除导航栏、文章内容中的链接，避免影响导航功能
        if (link.closest('.header') || 
            link.classList.contains('back-home-btn') ||
            link.closest('.article-body') ||
            link.closest('.article-content')) {
            return;
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加阅读进度条（仅在文章详情页）
    if (document.querySelector('.article')) {
        initReadingProgress();
    }
}

/**
 * 初始化阅读进度条
 */
function initReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    progressBar.style.zIndex = '1000';
    progressBar.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

/**
 * 工具函数：格式化数字
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加一些CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchCount = document.getElementById('searchCount');
    const postsView = document.querySelector('.posts-view');
    const postsList = document.querySelector('.posts-list');
    
    let allBlogs = []; // 存储所有博客数据
    let currentSearchTimeout = null;
    
    // 获取所有博客数据
    function loadAllBlogs() {
        const postCards = document.querySelectorAll('.post-card');
        allBlogs = Array.from(postCards).map(card => ({
            id: card.getAttribute('data-id'),
            title: card.getAttribute('data-title'),
            content: card.getAttribute('data-content'),
            author: card.getAttribute('data-author'),
            date: card.getAttribute('data-date'),
            readCount: card.getAttribute('data-read-count'),
            element: card,
            summary: card.querySelector('.post-summary').textContent
        }));
        
        // 更新初始计数
        updateSearchCount(allBlogs.length);
    }
    
    // 高亮关键词
    function highlightText(text, keyword) {
        if (!keyword.trim()) return text;
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // 执行搜索
    function performSearch(keyword) {
        if (!keyword.trim()) {
            // 显示所有文章
            showAllBlogs();
            return;
        }
        
        // 发送搜索请求到后端
        fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(searchResults => {
                displaySearchResults(searchResults, keyword);
            })
            .catch(error => {
                console.error('搜索出错:', error);
                showNoResults();
            });
    }
    
    // 显示搜索结果
    function displaySearchResults(results, keyword) {
        if (results.length === 0) {
            showNoResults();
            return;
        }
        
        // 清空当前列表
        postsList.innerHTML = '';
        
        // 为每个结果创建卡片
        results.forEach(blog => {
            const postCard = createPostCard(blog, keyword);
            postsList.appendChild(postCard);
        });
        
        updateSearchCount(results.length);
        
        // 重新绑定阅读更多按钮的事件
        bindReadMoreEvents();
    }
    
    // 创建文章卡片
    function createPostCard(blog, keyword = '') {
        
        const article = document.createElement('article');
        article.className = 'post-card fade-in';
        article.setAttribute('data-id', blog.id);
        article.setAttribute('data-title', blog.title);
        article.setAttribute('data-content', blog.content);
        article.setAttribute('data-author', blog.author);
        
        // 处理日期格式 - 尝试多种可能的字段名
        const dateStr = blog.formattedCreateTime || blog.createTime || new Date().toLocaleDateString();
        article.setAttribute('data-date', dateStr);
        
        // 处理阅读量
        const readCount = blog.readCount || 0;
        article.setAttribute('data-read-count', readCount);
        
        // 高亮显示搜索关键词
        const highlightedTitle = keyword ? highlightText(blog.title || '', keyword) : (blog.title || '');
        const summary = blog.summary || blog.content?.substring(0, 100) + '...' || '';
        const highlightedSummary = keyword ? highlightText(summary, keyword) : summary;
        
        article.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">
                    <span>${highlightedTitle}</span>
                </h3>
                <div class="post-meta">
                    <span class="date">${dateStr}</span>
                    <span class="author">by ${blog.author || '作者'}</span>
                    <span class="read-count">${readCount} 阅读</span>
                </div>
            </div>
            <div class="post-content">
                <p class="post-summary">${highlightedSummary}</p>
            </div>
            <div class="post-footer">
                <button class="read-more-btn">阅读全文 →</button>
            </div>
        `;
        
        return article;
    }
    
    // 显示所有文章
    function showAllBlogs() {
        postsList.innerHTML = '';
        allBlogs.forEach(blog => {
            postsList.appendChild(blog.element.cloneNode(true));
        });
        updateSearchCount(allBlogs.length);
        bindReadMoreEvents();
    }
    
    // 显示无结果
    function showNoResults() {
        postsList.innerHTML = `
            <div class="search-no-results">
                <p>😔 没有找到匹配的文章</p>
                <p>试试其他关键词吧！</p>
            </div>
        `;
        updateSearchCount(0);
    }
    
    // 更新搜索计数
    function updateSearchCount(count) {
        searchCount.textContent = count;
    }
    
    // 重新绑定阅读更多按钮事件
    function bindReadMoreEvents() {
        const readMoreBtns = document.querySelectorAll('.read-more-btn');
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const postCard = this.closest('.post-card');
                const blogId = postCard.dataset.id;
                if (blogId) {
                    // 跳转到文章详情页
                    window.location.href = `/blog/${blogId}`;
                }
            });
        });
    }
    
    // 处理输入事件
    function handleSearchInput() {
        const keyword = searchInput.value.trim();
        
        // 显示/隐藏清除按钮
        if (keyword) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
        
        // 重置分类筛选状态
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('active');
            }
        });
        
        // 防抖搜索
        if (currentSearchTimeout) {
            clearTimeout(currentSearchTimeout);
        }
        
        currentSearchTimeout = setTimeout(() => {
            console.log('搜索触发，关键词:', keyword); // 调试信息
            performSearch(keyword);
        }, 300);
    }
    
    // 清除搜索
    function clearSearch() {
        searchInput.value = '';
        clearSearchBtn.classList.remove('visible');
        showAllBlogs();
        searchInput.focus();
    }
    
    // 绑定事件
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }
    
    // 初始化
    loadAllBlogs();
}

// ================================
// 评论功能
// ================================

// 初始化评论功能
function initCommentFunction() {
    // 页面加载完成后初始化
    if (document.getElementById('submitComment')) {
        bindCommentEvents();
        loadRepliesForAllComments();
    }
}

// 绑定评论相关事件
function bindCommentEvents() {
    // 提交评论按钮
    const submitBtn = document.getElementById('submitComment');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleCommentSubmit);
    }

    // 回复按钮
    const replyBtns = document.querySelectorAll('.reply-btn');
    replyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            toggleReplyForm(commentId);
        });
    });

    // 取消回复按钮
    const cancelBtns = document.querySelectorAll('.cancel-reply-btn');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            hideReplyForm(commentId);
        });
    });

    // 提交回复按钮
    const submitReplyBtns = document.querySelectorAll('.submit-reply-btn');
    submitReplyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            handleReplySubmit(commentId);
        });
    });
}

// 处理评论提交
async function handleCommentSubmit() {
    const blogId = document.getElementById('blogId').value;
    const nickname = document.getElementById('commentNickname').value.trim();
    const email = document.getElementById('commentEmail').value.trim();
    const content = document.getElementById('commentContent').value.trim();

    // 表单验证
    if (!nickname) {
        showErrorToast('请输入昵称');
        return;
    }
    if (!email || !isValidEmail(email)) {
        showErrorToast('请输入有效的邮箱地址');
        return;
    }
    if (!content) {
        showErrorToast('请输入评论内容');
        return;
    }

    const submitBtn = document.getElementById('submitComment');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    try {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('email', email);
        formData.append('content', content);
        formData.append('blogId', blogId);

        const response = await fetch('/api/comments', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const newComment = await response.json();
            
            // 清空表单
            document.getElementById('commentNickname').value = '';
            document.getElementById('commentEmail').value = '';
            document.getElementById('commentContent').value = '';
            
            // 显示成功提示
            showSuccessToast('评论发表成功！');
            
            // 重新加载页面以显示新评论
            window.location.reload();
        } else {
            showErrorToast('评论提交失败，请重试');
        }
    } catch (error) {
        console.error('提交评论时出错:', error);
        showErrorToast('评论提交失败，请重试');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '发表评论';
    }
}

// 处理回复提交
async function handleReplySubmit(parentId) {
    const blogId = document.getElementById('blogId').value;
    const nickname = document.getElementById(`replyNickname-${parentId}`).value.trim();
    const email = document.getElementById(`replyEmail-${parentId}`).value.trim();
    const content = document.getElementById(`replyContent-${parentId}`).value.trim();

    // 表单验证
    if (!nickname) {
        alert('请输入昵称');
        return;
    }
    if (!email || !isValidEmail(email)) {
        alert('请输入有效的邮箱地址');
        return;
    }
    if (!content) {
        alert('请输入回复内容');
        return;
    }

    const submitBtn = document.querySelector(`.submit-reply-btn[data-comment-id="${parentId}"]`);
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    try {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('email', email);
        formData.append('content', content);
        formData.append('blogId', blogId);
        formData.append('parentId', parentId);

        const response = await fetch('/api/comments', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const newReply = await response.json();
            
            // 清空回复表单
            document.getElementById(`replyNickname-${parentId}`).value = '';
            document.getElementById(`replyEmail-${parentId}`).value = '';
            document.getElementById(`replyContent-${parentId}`).value = '';
            
            // 显示成功提示
            showSuccessToast('回复发表成功！');
            
            // 隐藏回复表单
            hideReplyForm(parentId);
            
            // 重新加载回复
            loadReplies(parentId);
        } else {
            showErrorToast('回复提交失败，请重试');
        }
    } catch (error) {
        console.error('提交回复时出错:', error);
        showErrorToast('回复提交失败，请重试');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '回复';
    }
}

// 切换回复表单显示/隐藏
function toggleReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        if (replyForm.style.display === 'none' || !replyForm.style.display) {
            replyForm.style.display = 'block';
            // 自动聚焦到内容输入框
            const textarea = document.getElementById(`replyContent-${commentId}`);
            if (textarea) {
                textarea.focus();
            }
        } else {
            replyForm.style.display = 'none';
        }
    }
}

// 隐藏回复表单
function hideReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.style.display = 'none';
    }
}

// 加载所有评论的回复
async function loadRepliesForAllComments() {
    const commentItems = document.querySelectorAll('.comment-item');
    for (const item of commentItems) {
        const commentId = item.getAttribute('data-comment-id');
        if (commentId) {
            await loadReplies(commentId);
        }
    }
}

// 加载指定评论的回复
async function loadReplies(commentId) {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies`);
        if (response.ok) {
            const replies = await response.json();
            const repliesContainer = document.getElementById(`replies-${commentId}`);
            
            if (repliesContainer && replies.length > 0) {
                repliesContainer.innerHTML = replies.map(reply => createReplyHTML(reply)).join('');
            }
        }
    } catch (error) {
        console.error('加载回复时出错:', error);
    }
}

// 创建回复HTML
function createReplyHTML(reply) {
    const roleTag = getRoleTagHTML(reply.userRole);
    return `
        <div class="reply-item">
            <div class="comment-avatar">
                <img src="${reply.avatar || '/images/default-avatar.svg'}" alt="头像" class="avatar-img">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-user-info">
                        <span class="comment-username">${escapeHtml(reply.nickname)}</span>
                        ${roleTag}
                    </div>
                    <div class="comment-actions">
                        <span class="comment-time">${reply.formattedCreatedAt || '刚刚'}</span>
                    </div>
                </div>
                <div class="comment-text">${escapeHtml(reply.content)}</div>
            </div>
        </div>
    `;
}

// 获取用户角色标签HTML
function getRoleTagHTML(userRole) {
    switch(userRole) {
        case 'blogger':
            return '<span class="user-role-tag blogger">博主</span>';
        case 'reader':
            return '<span class="user-role-tag reader">读者</span>';
        case 'admin':
            return '<span class="user-role-tag admin">管理员</span>';
        case 'guest':
            return '<span class="user-role-tag guest">游客</span>';
        default:
            // 如果没有明确角色，默认显示为游客
            return '<span class="user-role-tag guest">游客</span>';
    }
}

// 邮箱格式验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// HTML转义，防止XSS攻击
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * 初始化侧边栏粘性滚动增强功能
 */
function initSidebarSticky() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // 延迟应用侧边栏的高度限制和过渡效果，避免页面加载时滚动条闪现
    setTimeout(() => {
        sidebar.classList.add('loaded');
    }, 100);
    
    let ticking = false;
    
    // 监听滚动事件，添加视觉反馈
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset;
                const viewportHeight = window.innerHeight;
                const blogSection = document.querySelector('.blog-section');
                
                if (blogSection) {
                    const blogSectionTop = blogSection.offsetTop;
                    
                    // 当滚动超过博客区域开始位置时，添加滚动中的样式
                    if (scrollTop > blogSectionTop - 100) {
                        sidebar.style.transform = 'translateY(0)';
                        sidebar.style.opacity = '1';
                    } else {
                        sidebar.style.transform = 'translateY(0)';
                        sidebar.style.opacity = '1';
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // 平滑滚动到对应区域的功能增强
    const profileCard = sidebar.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('click', function(e) {
            // 如果点击的是联系方式区域，不触发滚动
            if (!e.target.closest('.contact-info')) {
                const blogSection = document.querySelector('.blog-section');
                if (blogSection) {
                    blogSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

/**
 * 初始化分类筛选和排序功能
 */
function initFilterAndSort() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const sortBtns = document.querySelectorAll('.sort-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    if (!categoryBtns.length || !sortBtns.length) return;
    
    let currentCategory = 'all';
    let currentSort = null; // 初始状态无排序
    
    // 分类筛选
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category === currentCategory) return;
            
            console.log('分类筛选被点击，分类:', category); // 调试信息
            currentCategory = category;
            
            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 清除搜索状态，避免冲突
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                const clearSearchBtn = document.getElementById('clearSearch');
                if (clearSearchBtn) {
                    clearSearchBtn.classList.remove('visible');
                }
            }
            
            // 重置排序状态，用户需要重新选择排序
            currentSort = null;
            sortBtns.forEach(b => b.classList.remove('active'));
            console.log('排序状态已重置'); // 调试信息
            
            // 应用筛选和排序
            filterAndSortPosts(currentCategory, currentSort);
        });
    });
    
    // 排序功能
    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sort = this.getAttribute('data-sort');
            if (sort === currentSort) return;
            
            console.log('排序被点击，排序方式:', sort); // 调试信息
            currentSort = sort;
            
            // 更新按钮状态
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 清除搜索状态，避免冲突
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                const clearSearchBtn = document.getElementById('clearSearch');
                if (clearSearchBtn) {
                    clearSearchBtn.classList.remove('visible');
                }
            }
            
            // 应用筛选和排序
            filterAndSortPosts(currentCategory, currentSort);
        });
    });
    
    /**
     * 筛选和排序文章
     */
    function filterAndSortPosts(category, sort) {
        console.log('开始筛选，分类:', category, '排序:', sort); // 调试信息
        const postsList = document.querySelector('.posts-list');
        if (!postsList) return;
        
        // 重新获取当前的文章卡片（防止搜索功能替换了DOM）
        const currentPostCards = document.querySelectorAll('.post-card');
        console.log('当前文章卡片数量:', currentPostCards.length); // 调试信息
        
        // 获取所有文章卡片
        let filteredPosts = Array.from(currentPostCards);
        
        // 分类筛选
        if (category !== 'all') {
            filteredPosts = filteredPosts.filter(card => {
                const cardCategoryId = card.getAttribute('data-category-id');
                return cardCategoryId === category;
            });
        }
        
        // 排序
        filteredPosts.sort((a, b) => {
            if (sort === 'latest') {
                // 按创建时间排序（最新优先）
                const timeA = new Date(a.getAttribute('data-created-time') || 0);
                const timeB = new Date(b.getAttribute('data-created-time') || 0);
                return timeB - timeA;
            } else if (sort === 'popular') {
                // 按阅读量排序（多到少）
                const readCountA = parseInt(a.getAttribute('data-read-count') || 0);
                const readCountB = parseInt(b.getAttribute('data-read-count') || 0);
                return readCountB - readCountA;
            }
            return 0;
        });
        
        // 🔧 新的稳定筛选逻辑：避免闪现
        console.log('筛选后文章数量:', filteredPosts.length); // 调试信息
        
        // 第一步：立即停止所有动画和重置状态
        currentPostCards.forEach(card => {
            // 清理所有动画相关的类和样式
            card.classList.remove('fade-in', 'filtering');
            card.style.transition = 'none'; // 暂时禁用过渡
            card.style.opacity = '';
            card.style.transform = '';
            card.style.order = '';
        });
        
        // 第二步：使用 requestAnimationFrame 确保样式重置完成
        requestAnimationFrame(() => {
            // 第三步：设置最终的显示状态（无动画）
            currentPostCards.forEach(card => {
                if (!filteredPosts.includes(card)) {
                    // 不符合条件：直接隐藏，无动画
                    card.style.display = 'none';
                } else {
                    // 符合条件：确保显示
                    card.style.display = 'block';
                }
            });
            
            // 第四步：设置排序
            filteredPosts.forEach((card, index) => {
                card.style.order = index;
            });
            
            // 第五步：重新启用动画并添加淡入效果
            setTimeout(() => {
                filteredPosts.forEach((card, index) => {
                    // 重新启用过渡
                    card.style.transition = '';
                    
                    // 轻微的淡入效果（更温和）
                    setTimeout(() => {
                        card.style.opacity = '0.3';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    }, index * 30); // 更快的级联
                });
            }, 100); // 给DOM一点时间稳定
        });
    }
}

// ================================
// 首页评论功能
// ================================

let indexCommentEventsBound = false; // 防止重复绑定事件

// 绑定首页评论相关事件
function bindIndexCommentEvents() {
    if (indexCommentEventsBound) return;
    
    // 提交评论按钮
    const submitBtn = document.getElementById('submitCommentIndex');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleIndexCommentSubmit);
    }
    
    indexCommentEventsBound = true;
}

// 处理首页评论提交
async function handleIndexCommentSubmit() {
    const blogId = document.getElementById('currentBlogId').value;
    const nickname = document.getElementById('commentNicknameIndex').value.trim();
    const email = document.getElementById('commentEmailIndex').value.trim();
    const content = document.getElementById('commentContentIndex').value.trim();

    // 表单验证
    if (!nickname) {
        showErrorToast('请输入昵称');
        return;
    }
    if (!email || !isValidEmail(email)) {
        showErrorToast('请输入有效的邮箱地址');
        return;
    }
    if (!content) {
        showErrorToast('请输入评论内容');
        return;
    }
    if (!blogId) {
        showErrorToast('文章ID无效');
        return;
    }

    const submitBtn = document.getElementById('submitCommentIndex');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    try {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('email', email);
        formData.append('content', content);
        formData.append('blogId', blogId);

        const response = await fetch('/api/comments', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const newComment = await response.json();
            
            // 清空表单
            document.getElementById('commentNicknameIndex').value = '';
            document.getElementById('commentEmailIndex').value = '';
            document.getElementById('commentContentIndex').value = '';
            
            // 显示成功提示
            showSuccessToast('评论发表成功！');
            
            // 重新加载评论
            loadCommentsForArticle(blogId);
        } else {
            showErrorToast('评论提交失败，请重试');
        }
    } catch (error) {
        console.error('提交评论时出错:', error);
        showErrorToast('评论提交失败，请重试');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '发表评论';
    }
}

// 加载指定文章的评论
async function loadCommentsForArticle(blogId) {
    try {
        // 加载顶级评论
        const response = await fetch(`/api/comments/top/${blogId}`);
        if (response.ok) {
            const comments = await response.json();
            displayIndexComments(comments);
            
            // 更新评论数量
            updateIndexCommentCount(comments.length);
            
            // 为每个评论加载回复
            for (const comment of comments) {
                await loadIndexReplies(comment.id);
            }
        }
    } catch (error) {
        console.error('加载评论时出错:', error);
    }
}

// 显示首页评论列表
function displayIndexComments(comments) {
    const commentsList = document.getElementById('commentsListIndex');
    if (!commentsList) return;
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">暂无评论，来发表第一条评论吧！</div>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => createIndexCommentHTML(comment)).join('');
}

// 创建首页评论HTML
function createIndexCommentHTML(comment) {
    const roleTag = getRoleTagHTML(comment.userRole);
    return `
        <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-avatar">
                <img src="${comment.avatar || '/images/default-avatar.svg'}" alt="头像" class="avatar-img">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-user-info">
                        <span class="comment-username">${escapeHtml(comment.nickname)}</span>
                        ${roleTag}
                    </div>
                    <div class="comment-actions">
                        <span class="comment-time">${comment.formattedCreatedAt || '刚刚'}</span>
                        <button class="reply-btn" onclick="toggleIndexReplyForm(${comment.id})">回复</button>
                    </div>
                </div>
                <div class="comment-text">${escapeHtml(comment.content)}</div>
                
                <!-- 回复区域容器 -->
                <div class="replies-container" id="replies-index-${comment.id}">
                    <!-- 动态加载回复内容 -->
                </div>
                
                <!-- 回复表单（初始隐藏，无头像） -->
                <div class="reply-form" id="reply-form-index-${comment.id}" style="display: none;">
                    <div class="comment-form">
                        <div class="comment-form-content-only">
                            <textarea 
                                id="replyContent-index-${comment.id}"
                                class="comment-textarea reply-textarea" 
                                placeholder="输入回复内容..."
                                rows="2"></textarea>
                        </div>
                        <div class="comment-form-footer">
                            <div class="comment-form-inputs">
                                <input type="text" id="replyNickname-index-${comment.id}" class="comment-input" placeholder="昵称" required>
                                <input type="email" id="replyEmail-index-${comment.id}" class="comment-input" placeholder="邮箱" required>
                            </div>
                            <div class="reply-form-actions">
                                <button type="button" class="cancel-reply-btn" onclick="hideIndexReplyForm(${comment.id})">取消</button>
                                <button type="button" class="submit-reply-btn" onclick="handleIndexReplySubmit(${comment.id})">回复</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 切换首页回复表单
function toggleIndexReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-index-${commentId}`);
    if (replyForm) {
        if (replyForm.style.display === 'none' || !replyForm.style.display) {
            replyForm.style.display = 'block';
            const textarea = document.getElementById(`replyContent-index-${commentId}`);
            if (textarea) {
                textarea.focus();
            }
        } else {
            replyForm.style.display = 'none';
        }
    }
}

// 隐藏首页回复表单
function hideIndexReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-index-${commentId}`);
    if (replyForm) {
        replyForm.style.display = 'none';
    }
}

// 处理首页回复提交
async function handleIndexReplySubmit(parentId) {
    const blogId = document.getElementById('currentBlogId').value;
    const nickname = document.getElementById(`replyNickname-index-${parentId}`).value.trim();
    const email = document.getElementById(`replyEmail-index-${parentId}`).value.trim();
    const content = document.getElementById(`replyContent-index-${parentId}`).value.trim();

    // 表单验证
    if (!nickname) {
        showErrorToast('请输入昵称');
        return;
    }
    if (!email || !isValidEmail(email)) {
        showErrorToast('请输入有效的邮箱地址');
        return;
    }
    if (!content) {
        showErrorToast('请输入回复内容');
        return;
    }

    const submitBtn = document.querySelector(`.submit-reply-btn[onclick="handleIndexReplySubmit(${parentId})"]`);
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
    }

    try {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('email', email);
        formData.append('content', content);
        formData.append('blogId', blogId);
        formData.append('parentId', parentId);

        const response = await fetch('/api/comments', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const newReply = await response.json();
            
            // 清空回复表单
            document.getElementById(`replyNickname-index-${parentId}`).value = '';
            document.getElementById(`replyEmail-index-${parentId}`).value = '';
            document.getElementById(`replyContent-index-${parentId}`).value = '';
            
            // 显示成功提示
            showSuccessToast('回复发表成功！');
            
            // 隐藏回复表单
            hideIndexReplyForm(parentId);
            
            // 重新加载回复
            loadIndexReplies(parentId);
        } else {
            showErrorToast('回复提交失败，请重试');
        }
    } catch (error) {
        console.error('提交回复时出错:', error);
        showErrorToast('回复提交失败，请重试');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '回复';
        }
    }
}

// 加载首页回复
async function loadIndexReplies(commentId) {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies`);
        if (response.ok) {
            const replies = await response.json();
            const repliesContainer = document.getElementById(`replies-index-${commentId}`);
            
            if (repliesContainer && replies.length > 0) {
                repliesContainer.innerHTML = replies.map(reply => createIndexReplyHTML(reply)).join('');
            }
        }
    } catch (error) {
        console.error('加载回复时出错:', error);
    }
}

// 创建首页回复HTML
function createIndexReplyHTML(reply) {
    const roleTag = getRoleTagHTML(reply.userRole);
    return `
        <div class="reply-item">
            <div class="comment-avatar">
                <img src="${reply.avatar || '/images/default-avatar.svg'}" alt="头像" class="avatar-img">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <div class="comment-user-info">
                        <span class="comment-username">${escapeHtml(reply.nickname)}</span>
                        ${roleTag}
                    </div>
                    <div class="comment-actions">
                        <span class="comment-time">${reply.formattedCreatedAt || '刚刚'}</span>
                    </div>
                </div>
                <div class="comment-text">${escapeHtml(reply.content)}</div>
            </div>
        </div>
    `;
}

// 更新首页评论计数
function updateIndexCommentCount(count) {
    const commentCountDisplay = document.getElementById('commentCountDisplay');
    if (commentCountDisplay) {
        commentCountDisplay.textContent = `${count} 条评论`;
    }
}

// ================================
// Toast提示组件
// ================================

function showToast(message, type = 'success', duration = 4000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 创建唯一ID
    const toastId = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    toast.id = toastId;
    
    // 设置toast内容
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon"></div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast('${toastId}')">&times;</button>
        <div class="toast-progress" style="width: 100%;"></div>
    `;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 触发动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 进度条动画
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar && duration > 0) {
        progressBar.style.transition = `width ${duration}ms linear`;
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 100);
    }
    
    // 自动移除
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toastId);
        }, duration);
    }
    
    return toastId;
}

function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Toast快捷方法
function showSuccessToast(message, duration = 4000) {
    return showToast(message, 'success', duration);
}

function showErrorToast(message, duration = 5000) {
    return showToast(message, 'error', duration);
}

function showWarningToast(message, duration = 4000) {
    return showToast(message, 'warning', duration);
}

function showInfoToast(message, duration = 4000) {
    return showToast(message, 'info', duration);
}
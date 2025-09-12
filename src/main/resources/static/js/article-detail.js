/**
 * 文章详情页交互功能
 * 包含目录生成、评论功能、返回顶部等
 */

// 全局变量
let currentBlogId = 0;

/**
 * 生成文章目录
 */
function generateTOC() {
    const tocContainer = document.getElementById('toc-content');
    const articleBody = document.querySelector('.article-body');
    
    if (!tocContainer || !articleBody) return;
    
    // 查找所有标题
    const headings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        tocContainer.innerHTML = '<p style="color: #999; font-size: 14px;">暂无目录</p>';
        return;
    }
    
    let tocHTML = '<ul class="toc-list">';
    let currentLevel = 1;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent.trim();
        const id = `heading-${index}`;
        
        // 为标题添加ID
        heading.id = id;
        
        // 根据层级调整缩进
        const indent = (level - 1) * 15;
        
        tocHTML += `
            <li style="margin-left: ${indent}px;">
                <a href="#${id}" class="toc-link" data-level="${level}">
                    ${text}
                </a>
            </li>
        `;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
    
    // 添加目录点击事件
    tocContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('toc-link')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 平滑滚动到目标位置
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 高亮当前目录项
                document.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        }
    });
}

/**
 * 初始化评论功能
 */
function initComments() {
    const commentForm = document.getElementById('commentForm');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitComment();
        });
    }
    
    // 初始化回复按钮
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('onclick').match(/\d+/)[0];
            showReplyForm(commentId);
        });
    });
}

/**
 * 提交评论
 */
function submitComment() {
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if (!nickname || !email || !content) {
        showMessage('请填写完整信息', 'warning');
        return;
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('请输入正确的邮箱格式', 'warning');
        return;
    }
    
    // 显示提交中状态
    const submitBtn = document.querySelector('#commentForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // 发送请求
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            nickname: nickname,
            email: email,
            content: content,
            blogId: currentBlogId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            showMessage('评论提交成功！', 'success');
            // 清空表单
            document.getElementById('commentForm').reset();
            // 刷新评论列表
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showMessage('评论提交失败，请重试', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('网络错误，请检查网络连接', 'error');
    })
    .finally(() => {
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

/**
 * 显示回复表单
 */
function showReplyForm(parentId) {
    // 隐藏其他回复表单
    document.querySelectorAll('.reply-form').forEach(form => {
        form.remove();
    });
    
    const replyHTML = `
        <div class="reply-form" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <form onsubmit="submitReply(event, ${parentId})">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <input type="text" placeholder="昵称" required>
                    <input type="email" placeholder="邮箱" required>
                </div>
                <textarea placeholder="回复内容..." required style="width: 100%; height: 80px; margin-bottom: 10px;"></textarea>
                <div>
                    <button type="submit" style="background: #1e88e5; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 10px;">发表回复</button>
                    <button type="button" onclick="this.closest('.reply-form').remove()" style="background: #ccc; color: #333; border: none; padding: 8px 16px; border-radius: 4px;">取消</button>
                </div>
            </form>
        </div>
    `;
    
    const commentItem = document.querySelector(`button[onclick*="${parentId}"]`).closest('.comment-item');
    commentItem.insertAdjacentHTML('afterend', replyHTML);
}

/**
 * 提交回复
 */
function submitReply(event, parentId) {
    event.preventDefault();
    
    const form = event.target;
    const nickname = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const content = form.querySelector('textarea').value.trim();
    
    if (!nickname || !email || !content) {
        showMessage('请填写完整信息', 'warning');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            nickname: nickname,
            email: email,
            content: content,
            blogId: currentBlogId,
            parentId: parentId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            showMessage('回复提交成功！', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showMessage('回复提交失败，请重试', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('网络错误，请检查网络连接', 'error');
    })
    .finally(() => {
        submitBtn.textContent = '发表回复';
        submitBtn.disabled = false;
    });
}

/**
 * 文章操作功能
 */
function likeArticle() {
    const likeBtn = document.querySelector('.like-btn');
    const isLiked = likeBtn.classList.contains('active');
    
    if (isLiked) {
        likeBtn.classList.remove('active');
        showMessage('已取消点赞', 'info');
    } else {
        likeBtn.classList.add('active');
        showMessage('点赞成功！', 'success');
    }
    
    // 这里可以发送请求到后端保存点赞状态
    // fetch('/api/blog/' + currentBlogId + '/like', { method: 'POST' });
}

// 分享功能优化 - 仅复制链接到剪贴板并显示提示 by=>friday
function shareArticle() {
    // 复制链接到剪贴板并显示提示
    navigator.clipboard.writeText(window.location.href).then(() => {
        showMessage('文章链接已经复制到剪贴板', 'success');
    }).catch(() => {
        // 如果clipboard API不可用，使用fallback方法
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showMessage('文章链接已经复制到剪贴板', 'success');
        } catch (err) {
            showMessage('复制失败，请手动复制链接', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    });
}

function bookmarkArticle() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const isBookmarked = bookmarkBtn.classList.contains('active');
    
    if (isBookmarked) {
        bookmarkBtn.classList.remove('active');
        showMessage('已取消收藏', 'info');
    } else {
        bookmarkBtn.classList.add('active');
        showMessage('收藏成功！', 'success');
    }
    
    // 这里可以发送请求到后端保存收藏状态
    // fetch('/api/blog/' + currentBlogId + '/bookmark', { method: 'POST' });
}

/**
 * 返回顶部功能
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 监听滚动事件
 */
function initScrollEvents() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        // 返回顶部按钮显示/隐藏
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // 目录高亮跟随
        updateTOCHighlight();
    });
}

/**
 * 更新目录高亮
 */
function updateTOCHighlight() {
    const headings = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    let currentHeading = null;
    
    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
            currentHeading = heading;
        }
    });
    
    // 清除所有高亮
    tocLinks.forEach(link => link.classList.remove('active'));
    
    // 高亮当前标题对应的目录项
    if (currentHeading) {
        const currentLink = document.querySelector(`.toc-link[href="#${currentHeading.id}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }
}

/**
 * 主题切换功能
 */
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * 显示消息提示
 */
function showMessage(text, type = 'info') {
    // 移除现有的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const message = document.createElement('div');
    message.className = `message-toast message-${type}`;
    message.textContent = text;
    
    // 添加样式
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    // 根据类型设置背景色
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    message.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(message);
    
    // 显示动画
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

/**
 * 初始化主题
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.className = 'fas fa-sun';
    } else {
        themeToggle.className = 'fas fa-moon';
    }
}

/**
 * 图片懒加载
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.article-body img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        });
    }
}

/**
 * 初始化分类颜色 - 根据分类名称设置不同颜色 by=>friday
 */
function initCategoryColors() {
    const categoryTags = document.querySelectorAll('.tag[data-category]');
    
    categoryTags.forEach(tag => {
        const category = tag.getAttribute('data-category');
        if (category) {
            // 根据分类名称设置不同的颜色类
            tag.classList.add('category-' + category.replace(/\s+/g, '-'));
        }
    });
}

/**
 * 确保个人主页区域正确显示 by=>friday
 */
function ensureProfileDisplay() {
    const profileCard = document.querySelector('.profile-card');
    const authorSidebar = document.querySelector('.author-sidebar');
    
    if (profileCard) {
        profileCard.style.display = 'block';
        profileCard.style.visibility = 'visible';
        profileCard.style.opacity = '1';
        console.log('Profile card found and made visible');
    } else {
        console.log('Profile card not found');
    }
    
    if (authorSidebar) {
        authorSidebar.style.display = 'flex';
        authorSidebar.style.visibility = 'visible';
        console.log('Author sidebar found and made visible');
    } else {
        console.log('Author sidebar not found');
    }
}

/**
 * 初始化日期显示功能 - 复制首页功能 by=>friday
 */
function initDateDisplay() {
    function updateDateTime() {
        const now = new Date();
        
        // 格式化日期
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[now.getDay()];
        
        const dateString = `${year}年${month}月${date}日 ${weekday}`;
        
        // 简单的农历计算（这里用一个固定示例，实际项目中可能需要更复杂的农历库）
        const lunarYears = ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
                          '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
                          '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
                          '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
                          '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
                          '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'];
        
        const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        const lunarYear = lunarYears[(year - 1924) % 60];
        const animal = animals[(year - 1924) % 12];
        const lunarString = `${lunarYear}年(${animal}年) 腊月初一`;
        
        // 更新页面显示
        const heroDateInfo = document.getElementById('heroDateInfo');
        const heroLunarInfo = document.getElementById('heroLunarInfo');
        
        if (heroDateInfo) {
            heroDateInfo.textContent = dateString;
        }
        if (heroLunarInfo) {
            heroLunarInfo.textContent = lunarString;
        }
    }
    
    // 初始化显示
    updateDateTime();
    
    // 每分钟更新一次
    setInterval(updateDateTime, 60000);
}

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前文章ID
    const blogIdInput = document.getElementById('blogId');
    currentBlogId = blogIdInput ? blogIdInput.value : (window.blogId || 0);
    
    // 初始化日期显示 by=>friday
    initDateDisplay();
    
    // 初始化分类颜色 by=>friday
    initCategoryColors();
    
    // 确保个人主页显示 by=>friday
    ensureProfileDisplay();
    
    // 确保导航栏始终可点击 - 延迟执行以确保DOM完全加载
    setTimeout(() => {
        fixNavigationBar();
    }, 100);
    
    // 初始化各种功能
    initTheme();
    initScrollEvents();
    initLazyLoading();
    
    // 如果存在目录容器，生成目录
    if (document.getElementById('toc-content')) {
        generateTOC();
    }
    
    // 如果存在评论表单，初始化评论功能
    if (document.getElementById('commentForm')) {
        initComments();
    }
    
    // 代码块复制功能
    initCodeCopy();
});

/**
 * 代码块复制功能
 */
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((block, index) => {
        const pre = block.parentElement;
        pre.style.position = 'relative';
        
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.className = 'code-copy-btn';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        pre.appendChild(copyBtn);
        
        // 鼠标悬停显示复制按钮
        pre.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        // 复制功能
        copyBtn.addEventListener('click', () => {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1000);
                showMessage('代码已复制到剪贴板', 'success');
            }).catch(() => {
                showMessage('复制失败，请手动选择复制', 'error');
            });
        });
    });
}

/**
 * 搜索功能
 */
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.createElement('div');
    
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-overlay" onclick="closeSearch()"></div>
        <div class="search-content">
            <div class="search-header">
                <input type="text" placeholder="搜索文章..." id="searchInput">
                <button onclick="closeSearch()"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-results" id="searchResults">
                <p>请输入关键词搜索文章</p>
            </div>
        </div>
    `;
    
    searchModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: none;
    `;
    
    document.body.appendChild(searchModal);
    
    searchToggle.addEventListener('click', () => {
        searchModal.style.display = 'block';
        document.getElementById('searchInput').focus();
    });
    
    // 搜索功能
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const keyword = e.target.value.trim();
        
        if (keyword.length < 2) {
            document.getElementById('searchResults').innerHTML = '<p>请输入至少2个字符</p>';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(keyword);
        }, 300);
    });
}

/**
 * 执行搜索
 */
function performSearch(keyword) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<p>搜索中...</p>';
    
    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>未找到相关文章</p>';
                return;
            }
            
            let html = '<div class="search-list">';
            data.forEach(article => {
                html += `
                    <div class="search-item">
                        <h4><a href="/blog/${article.id}">${article.title}</a></h4>
                        <p>${article.summary || '无摘要'}</p>
                        <div class="search-meta">
                            <span>${article.author}</span>
                            <span>${article.formattedCreateTime}</span>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            resultsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p>搜索出错，请重试</p>';
        });
}

/**
 * 关闭搜索
 */
function closeSearch() {
    const searchModal = document.querySelector('.search-modal');
    searchModal.style.display = 'none';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<p>请输入关键词搜索文章</p>';
}

/**
 * 初始化页面淡入动画
 */
function initPageFadeIn() {
    // 等待页面完全加载后开始动画
    setTimeout(() => {
        // 文章标题区域淡入（最先）
        const articleHero = document.querySelector('.article-hero');
        if (articleHero) {
            articleHero.classList.add('fade-in');
        }
        
        // 作者侧边栏淡入
        setTimeout(() => {
            const authorSidebar = document.querySelector('.author-sidebar');
            if (authorSidebar) {
                authorSidebar.classList.add('fade-in');
            }
        }, 300);
        
        // 文章内容淡入
        setTimeout(() => {
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                articleContent.classList.add('fade-in');
            }
        }, 600);
        
        // 评论区淡入（最后）
        setTimeout(() => {
            const commentsSection = document.querySelector('.comments-section');
            if (commentsSection) {
                commentsSection.classList.add('fade-in');
            }
        }, 900);
    }, 100);
}

/**
 * 修复导航栏在滚动时失效的问题
 */
function fixNavigationBar() {
    const header = document.querySelector('.header');
    const backHomeBtn = document.querySelector('.back-home-btn');
    const heroLogo = document.querySelector('.hero-logo a');
    
    if (header) {
        // 确保导航栏始终在最顶层
        header.style.zIndex = '9999';
        header.style.pointerEvents = 'auto';
        header.style.position = 'fixed';
        
        // 确保导航栏内的所有元素都能响应点击
        const navElements = header.querySelectorAll('*');
        navElements.forEach(element => {
            element.style.pointerEvents = 'auto';
        });
    }
    
    // 强制重新绑定Rush标题的点击事件
    if (heroLogo) {
        heroLogo.style.pointerEvents = 'auto';
        heroLogo.style.cursor = 'pointer';
        
        // 移除可能存在的事件监听器冲突
        heroLogo.addEventListener('click', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = this.getAttribute('href') || '/';
        }, true); // 使用捕获阶段，优先级更高
    }
    
    if (backHomeBtn) {
        // 确保返回按钮始终可点击
        backHomeBtn.style.pointerEvents = 'auto';
        backHomeBtn.style.cursor = 'pointer';
        
        // 重新绑定点击事件，确保功能正常
        backHomeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = this.getAttribute('href') || '/';
        }, true); // 使用捕获阶段，优先级更高
    }
    
    // 监听滚动事件，确保导航栏始终保持正确的层级
    window.addEventListener('scroll', function() {
        if (header) {
            header.style.zIndex = '9999';
            header.style.pointerEvents = 'auto';
        }
    });
    
    // 延迟再次确保导航栏功能正常（解决异步加载问题）
    setTimeout(() => {
        fixNavigationBarDelayed();
    }, 1000);
}

/**
 * 延迟修复导航栏功能
 */
function fixNavigationBarDelayed() {
    const backHomeBtn = document.querySelector('.back-home-btn');
    const heroLogo = document.querySelector('.hero-logo a');
    
    // 再次确保链接可以正常工作
    [backHomeBtn, heroLogo].forEach(element => {
        if (element) {
            // 清除所有可能的事件监听器
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // 重新绑定事件
            newElement.addEventListener('click', function(e) {
                console.log('Navigation clicked:', this.getAttribute('href')); // 调试信息
                window.location.href = this.getAttribute('href') || '/';
            });
            
            newElement.style.pointerEvents = 'auto';
            newElement.style.cursor = 'pointer';
        }
    });
}

// 页面加载完成后初始化淡入动画
document.addEventListener('DOMContentLoaded', function() {
    initPageFadeIn();
});
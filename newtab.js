document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const engineBtns = document.querySelectorAll('.engine-btn');
  const bookmarkBar = document.getElementById('bookmarkBar');
  const otherBookmarks = document.getElementById('otherBookmarks');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  const closeButton = document.querySelector('.close-button');

  // 确保所有元素都存在
  if (!modal || !modalBody || !modalTitle || !closeButton) {
    console.error("Modal elements are not found in the DOM.");
    return;
  }

  // 显示弹窗的函数
  function showModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'block';
  }

  // 搜索引擎配置
  const searchEngines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q='
  };

  let currentEngine = 'bing';

  // 点击搜索引擎按钮时执行搜索
  engineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      engineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEngine = btn.dataset.engine;
      performSearch(); // 点击按钮时立即执行搜索
    });
  });

  // 执行搜索
  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = searchEngines[currentEngine] + encodeURIComponent(query);
    }
  }

  // 监听回车键
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // 获取书签并显示在书签栏
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    console.log("获取到的书签数据:", bookmarkTreeNodes); // 调试输出
    bookmarkTreeNodes.forEach(node => {
      node.children.forEach(child => {
        if (child.title === "书签栏") {
          child.children.forEach(child1 => {
            displayBookmarks(child1, bookmarkBar); // 书签栏
          });
        } else if (child.title === "其他书签") {
          displayBookmarks(child, otherBookmarks); // 其他书签
        }
      });
    });
  });

  function displayBookmarks(node, container) {
    console.log("处理节点:", node);
    if (node.children) {
        // 创建文件夹元素
        const folderElement = document.createElement('div');
        folderElement.className = 'folder';
        // 为文件夹添加title信息，包含子项数量
    const childrenCount = node.children ? node.children.length : 0;
    folderElement.title = `${node.title} (${childrenCount} 项)`;

        // 创建文件夹标题
        const folderTitle = document.createElement('div');
        folderTitle.className = 'folder-title';
        
        // 添加文件夹图标
        const folderIcon = document.createElement('span');
        folderIcon.className = 'folder-icon bi bi-folder';
        folderTitle.appendChild(folderIcon);
        
        // 添加文件夹标题文本
        folderTitle.appendChild(document.createTextNode(node.title));
        folderElement.appendChild(folderTitle);

        // 创建悬浮窗，添加到 body 末尾
        const popup = document.createElement('div');
        popup.className = 'popup';
        document.body.appendChild(popup);

        // 点击文件夹标题时显示悬浮窗
        folderTitle.addEventListener('click', (event) => {
            event.stopPropagation();
            
            document.querySelectorAll('.popup[data-level="0"]').forEach(p => {
                if (p !== popup) {
                    p.style.display = 'none';
                }
            });

            popup.innerHTML = '';
            popup.setAttribute('data-level', '0');
            createPopupContent(node.children, popup);

            const rect = folderTitle.getBoundingClientRect();
            if (container.classList.contains('other-bookmarks')) {
                // 其他书签的弹窗向左展示
                popup.style.right = '0';
                popup.style.left = 'auto';
            } else {
                // 普通书签的弹窗向右展示
                popup.style.left = `${rect.left}px`;
                popup.style.right = 'auto';
            }
            popup.style.top = `${rect.bottom}px`;
            popup.style.display = 'block';
        });

        // 点击其他地方隐藏所有弹窗
        document.addEventListener('click', (event) => {
            if (!folderElement.contains(event.target) && !popup.contains(event.target)) {
                hideAllPopups();
            }
        });

        container.appendChild(folderElement);
    } else {
        const bookmarkElement = document.createElement('div');
        bookmarkElement.className = 'bookmark';
        bookmarkElement.title = node.title; // 添加title属性用于悬停显示完整标题
        
        // 创建图标容器
        const iconContainer = document.createElement('span');
        iconContainer.className = 'bookmark-icon';
        
        // 创建并设置图标
        const icon = document.createElement('img');
        icon.className = 'favicon';
        // 使用Chrome API获取favicon
        try {
            const urlObj = new URL(node.url);
            // 使用chrome://favicon/ URL，但添加时间戳以避免缓存问题
            icon.src = `chrome://favicon/${urlObj.origin}?timestamp=${Date.now()}`;
            icon.onerror = function() {
                // 如果favicon加载失败，使用默认图标
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/><path fill="%23666" d="M8 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>';
            };
        } catch (e) {
            // 如果URL无效，使用默认图标
            icon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/><path fill="%23666" d="M8 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>';
        }
        iconContainer.appendChild(icon);
        
        // 添加图标和文本
        bookmarkElement.appendChild(iconContainer);
        bookmarkElement.appendChild(document.createTextNode(node.title));

        // 添加包含URL的完整title信息
        bookmarkElement.title = `${node.title}\n${node.url}`;

        bookmarkElement.addEventListener('click', () => {
            chrome.tabs.create({ url: node.url });
        });
        container.appendChild(bookmarkElement);
    }
  }

  // 创建弹窗内容
  function createPopupContent(children, popup) {
    children.forEach(child => {
        const childElement = document.createElement('div');
        childElement.className = 'popup-item';
        childElement.title = child.title; // 添加title属性用于悬停显示完整标题
        
        if (child.url) {
            // 创建图标容器
            const iconContainer = document.createElement('span');
            iconContainer.className = 'bookmark-icon';
            
            // 创建并设置图标
            const icon = document.createElement('img');
            icon.className = 'favicon';
            // 使用Chrome API获取favicon
            try {
                const urlObj = new URL(child.url);
                // 使用chrome://favicon/ URL，但添加时间戳以避免缓存问题
                icon.src = `chrome://favicon/${urlObj.origin}?timestamp=${Date.now()}`;
                icon.onerror = function() {
                    // 如果favicon加载失败，使用默认图标
                    this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/><path fill="%23666" d="M8 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>';
                };
            } catch (e) {
                // 如果URL无效，使用默认图标
                icon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="%23666" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/><path fill="%23666" d="M8 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></svg>';
            }
            iconContainer.appendChild(icon);
            
            // 添加图标和文本
            childElement.appendChild(iconContainer);

            // 为书签文本添加容器
            const textSpan = document.createElement('span');
            textSpan.className = 'bookmark-text';
            textSpan.textContent = child.title;
            childElement.appendChild(textSpan);

            // 添加包含URL的完整title信息
            childElement.title = `${child.title}\n${child.url}`;

            childElement.addEventListener('click', () => {
                chrome.tabs.create({ url: child.url });
            });
        } else if (child.children) {
            // 如果是文件夹，添加文件夹图标
            const folderIcon = document.createElement('span');
            folderIcon.className = 'folder-icon bi bi-folder';
            
            childElement.appendChild(folderIcon);

            // 为文件夹文本添加容器
            const folderTextSpan = document.createElement('span');
            folderTextSpan.className = 'bookmark-text';
            folderTextSpan.textContent = child.title;
            childElement.appendChild(folderTextSpan);

            // 为文件夹添加title信息，包含子项数量
            const childrenCount = child.children ? child.children.length : 0;
            childElement.title = `${child.title} (${childrenCount} 项)`;

            childElement.classList.add('has-children');
            
            // 创建子级弹窗
            const subPopup = document.createElement('div');
            subPopup.className = 'popup sub-popup';
            document.body.appendChild(subPopup);
            
            // 鼠标进入时显示子级弹窗
            childElement.addEventListener('mouseenter', (event) => {
                hideSubPopups(popup);
                
                subPopup.innerHTML = '';
                createPopupContent(child.children, subPopup);
                
                const rect = childElement.getBoundingClientRect();
                if (popup.style.right === '0px' || popup.style.right === '0') {
                    // 其他书签的子级弹窗向左展示
                    subPopup.style.right = '342px'; // 更新为新的宽度 (330px + 12px margin)
                    subPopup.style.left = 'auto';
                } else {
                    // 普通书签的子级弹窗向右展示
                    subPopup.style.left = `${rect.right}px`;
                    subPopup.style.right = 'auto';
                }
                subPopup.style.top = `${rect.top}px`;
                subPopup.style.display = 'block';
            });
        }
        
        popup.appendChild(childElement);
    });
  }

  // 隐藏所有弹窗
  function hideAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
  }

  // 隐藏子级弹窗
  function hideSubPopups(parentPopup) {
    document.querySelectorAll('.sub-popup').forEach(popup => {
        if (popup !== parentPopup) {
            popup.style.display = 'none';
        }
    });
  }

  // 关闭弹窗
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 点击弹窗外部关闭弹窗
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // 处理左侧菜单点击事件
  const menuItems = document.querySelectorAll('.menu-item');
  const menuPopups = document.querySelectorAll('.menu-popup');
  const toolsPopup = document.getElementById('toolsPopup');
  const toolsClose = document.querySelector('.tools-close');
  let activePopup = null;

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const popupType = item.dataset.popup;
      const popup = document.getElementById(`${popupType}Popup`);
      
      // 特殊处理工具弹窗
      if (popupType === 'tools') {
        if (popup.classList.contains('active')) {
          popup.classList.remove('active');
          activePopup = null;
        } else {
          menuPopups.forEach(p => p.classList.remove('active'));
          popup.classList.add('active');
          activePopup = popup;
        }
        return;
      }

      // 处理其他弹窗
      if (popup === activePopup && popup.classList.contains('active')) {
        popup.classList.remove('active');
        activePopup = null;
        return;
      }

      menuPopups.forEach(p => p.classList.remove('active'));
      popup.classList.add('active');
      activePopup = popup;

      const rect = item.getBoundingClientRect();
      popup.style.top = `${rect.top}px`;
    });
  });

  // 处理工具弹窗关闭按钮
  if (toolsClose) {
    toolsClose.addEventListener('click', (e) => {
      e.stopPropagation();
      toolsPopup.classList.remove('active');
      activePopup = null;
    });
  }

  // 点击其他地方关闭所有弹窗
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-popup') && !e.target.closest('.menu-item')) {
      menuPopups.forEach(popup => popup.classList.remove('active'));
      activePopup = null;
    }
  });

  // 阻止工具弹窗内部点击事件冒泡
  if (toolsPopup) {
    toolsPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 处理工具弹窗的标签切换
  const tabItems = document.querySelectorAll('.tab-item');
  const contentPanels = document.querySelectorAll('.content-panel');

  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      tabItems.forEach(t => t.classList.remove('active'));
      contentPanels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const panelId = `${tab.dataset.tab}-panel`;
      document.getElementById(panelId).classList.add('active');
    });
  });

  // 修改农历日期转换函数
  const lunar = {
    lunarInfo: [
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
        0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557
    ],

    // 中文数字
    nStr1: ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    nStr2: ['初', '十', '廿', '卅'],
    nStr3: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],

    // 获取农历日期
    getLunarDate(date) {
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
            
        // 计算与1900年1月31日相差的天数
        let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;
        
        // 计算农历年份
        let lunarYear = 1900;
        let temp = 0;
        for(lunarYear = 1900; lunarYear < 2100 && offset > 0; lunarYear++) {
            temp = this.getLunarYearDays(lunarYear);
            offset -= temp;
        }
        if(offset < 0) {
            offset += temp;
            lunarYear--;
        }
        
        // 计算农历月份
        let lunarMonth = 1;
        let leap = this.getLeapMonth(lunarYear);
        let isLeap = false;
        
        let monthDays = 0;
        for(lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
            if(leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
                --lunarMonth;
                isLeap = true;
                monthDays = this.getLeapDays(lunarYear);
            } else {
                monthDays = this.getLunarMonthDays(lunarYear, lunarMonth);
            }
            
            if(isLeap && lunarMonth === (leap + 1)) isLeap = false;
            offset -= monthDays;
        }
        
        if(offset === 0 && leap > 0 && lunarMonth === leap + 1) {
            if(isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                --lunarMonth;
            }
        }
        if(offset < 0) {
            offset += monthDays;
            --lunarMonth;
        }
        
        // 计算农历日
        let lunarDay = offset + 1;

        // 格式化输出
        let monthStr = this.nStr3[lunarMonth - 1] + '月';
        let dayStr = '';
        
        switch (lunarDay) {
            case 10:
                dayStr = '初十';
                break;
            case 20:
                dayStr = '二十';
                break;
            case 30:
                dayStr = '三十';
                break;
            default:
                dayStr = this.nStr2[Math.floor(lunarDay/10)] + this.nStr1[lunarDay%10];
        }
        
        return `农历${monthStr}${dayStr}`;
    },

    // 获取农历年总天数
    getLunarYearDays(year) {
        let sum = 348;
        for(let i=0x8000; i>0x8; i>>=1) {
            sum += (this.lunarInfo[year-1900] & i)? 1: 0;
        }
        return sum + this.getLeapDays(year);
    },

    // 获取闰月天数
    getLeapDays(year) {
        if(this.getLeapMonth(year)) {
            return (this.lunarInfo[year-1900] & 0x10000)? 30: 29;
        }
        return 0;
    },

    // 获取闰月月份
    getLeapMonth(year) {
        return this.lunarInfo[year-1900] & 0xf;
    },

    // 获取农历某月天数
    getLunarMonthDays(year, month) {
        return (this.lunarInfo[year-1900] & (0x10000>>month))? 30: 29;
    }
  };

  // 修改时间更新函数
  function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const now = new Date();
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // 更新日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
    const lunarDate = lunar.getLunarDate(now);
    
    dateDisplay.innerHTML = `
        <div class="solar-date">${year}年${month}月${date}日</div>
        <div class="week">${week}</div>
    `;
  }

  // 初始更新
  updateTime();
  // 每秒更新一次
  setInterval(updateTime, 1000);
}); 
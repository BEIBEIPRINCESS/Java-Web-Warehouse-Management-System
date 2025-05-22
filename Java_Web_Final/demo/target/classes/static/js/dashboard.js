// 获取当前用户信息
const currentUser = document.getElementById('currentUser');
if (currentUser) {
    currentUser.textContent = `当前用户：${localStorage.getItem('username')}`;
}

// 导航菜单处理
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        loadPage(page);
        
        // 更新活动状态
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// 加载页面内容
async function loadPage(page) {
    const content = document.getElementById('content');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        switch (page) {
            case 'dashboard':
                content.innerHTML = '<h2>欢迎使用仓库管理系统</h2>';
                break;
            case 'products':
                await loadProducts(content, token);
                break;
            case 'categories':
                await loadCategories(content, token);
                break;
            case 'stock':
                await loadStock(content, token);
                break;
            case 'users':
                await loadUsers(content, token);
                break;
        }
    } catch (error) {
        content.innerHTML = `<p>加载失败：${error.message}</p>`;
    }
}

// 加载商品列表
async function loadProducts(container, token) {
    try {
        const response = await fetch('/api/products/page?pageNum=1&pageSize=10', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取商品列表失败');
        }

        const data = await response.json();
        
        let html = `
            <div class="table-container">
                <h2>商品管理</h2>
                <button class="btn btn-primary" onclick="showAddProductForm()">添加商品</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>编码</th>
                            <th>分类</th>
                            <th>价格</th>
                            <th>库存</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.data.content.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.code}</td>
                    <td>${product.category && product.category.name ? product.category.name : '未分类'}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editProduct(${product.id})">编辑</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">删除</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p>加载商品列表失败：${error.message}</p>`;
    }
}

// 加载分类列表
async function loadCategories(container, token) {
    try {
        const response = await fetch('/api/categories/page?pageNum=1&pageSize=10', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取分类列表失败');
        }

        const data = await response.json();
        
        let html = `
            <div class="table-container">
                <h2>分类管理</h2>
                <button class="btn btn-primary" onclick="showAddCategoryForm()">添加分类</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>描述</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.data.content.forEach(category => {
            html += `
                <tr>
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>${category.description}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editCategory(${category.id})">编辑</button>
                        <button class="btn btn-danger" onclick="deleteCategory(${category.id})">删除</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p>加载分类列表失败：${error.message}</p>`;
    }
}

// 加载库存记录
async function loadStock(container, token) {
    try {
        const response = await fetch('/api/stock-records/page?pageNum=1&pageSize=10', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取库存记录失败');
        }

        const data = await response.json();
        console.log('库存记录原始数据:', data.data.content);
        let html = `
            <div class="table-container">
                <h2>库存管理</h2>
                <button class="btn btn-primary" onclick="showAddStockForm()">添加记录</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>商品</th>
                            <th>类型</th>
                            <th>数量</th>
                            <th>时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.data.content.forEach(record => {
            html += `
                <tr>
                    <td>${record.id !== undefined ? record.id : ''}</td>
                    <td>${record.product && record.product.name ? record.product.name : ''}</td>
                    <td>${record.type || ''}</td>
                    <td>${record.quantity || ''}</td>
                    <td>${record.createTime ? new Date(record.createTime).toLocaleString() : ''}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editStockRecord(${record.id})">编辑</button>
                        <button class="btn btn-danger" onclick="deleteStockRecord(${record.id})">删除</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p>加载库存记录失败：${error.message}</p>`;
    }
}

// 加载用户列表
async function loadUsers(container, token) {
    try {
        const response = await fetch('/api/users/page?pageNum=1&pageSize=10', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('获取用户列表失败');
        }

        const data = await response.json();
        
        let html = `
            <div class="table-container">
                <h2>用户管理</h2>
                <button class="btn btn-primary" onclick="showAddUserForm()">添加用户</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户名</th>
                            <th>角色</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.data.content.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editUser(${user.id})">编辑</button>
                        <button class="btn btn-danger" onclick="deleteUser(${user.id})">删除</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p>加载用户列表失败：${error.message}</p>`;
    }
}

// 显示添加分类表单
window.showAddCategoryForm = function() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>添加分类</h2>
            <form id="addCategoryForm">
                <div class="form-group">
                    <label>分类名称</label>
                    <input type="text" id="categoryName" required>
                </div>
                <div class="form-group">
                    <label>描述</label>
                    <input type="text" id="categoryDesc">
                </div>
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn" id="cancelAddCategory">取消</button>
            </form>
        </div>
    `;
    document.getElementById('addCategoryForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('categoryName').value;
        const description = document.getElementById('categoryDesc').value;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });
        if (res.ok) {
            alert('添加成功');
            loadPage('categories');
        } else {
            alert('添加失败');
        }
    };
    document.getElementById('cancelAddCategory').onclick = function() {
        loadPage('categories');
    };
};

// 显示添加商品表单
window.showAddProductForm = async function() {
    const content = document.getElementById('content');
    // 获取所有分类
    const token = localStorage.getItem('token');
    let categories = [];
    try {
        const res = await fetch('/api/categories/page?pageNum=1&pageSize=100', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            categories = data.data.content;
        }
    } catch (e) {}
    let categoryOptions = categories.map(c => `<option value="${c.id}">${c.name}（ID:${c.id}）</option>`).join('');
    content.innerHTML = `
        <div class="form-container">
            <h2>添加商品</h2>
            <form id="addProductForm">
                <div class="form-group">
                    <label>商品名称</label>
                    <input type="text" id="productName" required>
                </div>
                <div class="form-group">
                    <label>商品编号</label>
                    <input type="text" id="productCode" required>
                </div>
                <div class="form-group">
                    <label>分类</label>
                    <select id="productCategoryId" required>
                        <option value="">请选择分类</option>
                        ${categoryOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>价格</label>
                    <input type="number" id="productPrice" required>
                </div>
                <div class="form-group">
                    <label>库存</label>
                    <input type="number" id="productStock" required>
                </div>
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn" id="cancelAddProduct">取消</button>
            </form>
        </div>
    `;
    document.getElementById('addProductForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('productName').value;
        const code = document.getElementById('productCode').value;
        const categoryId = document.getElementById('productCategoryId').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        if (!categoryId) {
            alert('请选择分类');
            return;
        }
        const token = localStorage.getItem('token');
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, code, categoryId, price, stock })
        });
        const result = await res.json();
        if (res.ok && result.code === 200) {
            alert('添加成功');
            loadPage('products');
        } else {
            alert('添加失败: ' + (result.message || '未知错误'));
        }
    };
    document.getElementById('cancelAddProduct').onclick = function() {
        loadPage('products');
    };
};

// 显示添加库存表单
window.showAddStockForm = async function() {
    const content = document.getElementById('content');
    // 先获取所有商品
    const token = localStorage.getItem('token');
    let products = [];
    try {
        const res = await fetch('/api/products/page?pageNum=1&pageSize=100', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            products = data.data.content;
        }
    } catch (e) {}
    let productOptions = products.map(p => `<option value="${p.id}">${p.name}（${p.code}）</option>`).join('');
    content.innerHTML = `
        <div class="form-container">
            <h2>添加库存记录</h2>
            <form id="addStockForm">
                <div class="form-group">
                    <label>商品</label>
                    <select id="stockProductId" required>
                        <option value="">请选择商品</option>
                        ${productOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>类型（IN/OUT）</label>
                    <select id="stockType" required>
                        <option value="IN">入库</option>
                        <option value="OUT">出库</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>数量</label>
                    <input type="number" id="stockQuantity" required min="1" step="1">
                </div>
                <div class="form-group">
                    <label>备注</label>
                    <input type="text" id="stockRemark">
                </div>
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn" id="cancelAddStock">取消</button>
            </form>
        </div>
    `;
    document.getElementById('addStockForm').onsubmit = async function(e) {
        e.preventDefault();
        const productId = document.getElementById('stockProductId').value;
        const type = document.getElementById('stockType').value;
        const quantity = parseInt(document.getElementById('stockQuantity').value);
        const remark = document.getElementById('stockRemark').value;
        if (!productId) {
            alert('请选择商品');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert('请输入有效的数量');
            return;
        }
        // 调试输出
        console.log('请求体:', JSON.stringify({
            type: type,
            productId: parseInt(productId),
            quantity: quantity,
            remark: remark
        }));
        const res = await fetch('/api/stock-records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: type,
                productId: parseInt(productId),
                quantity: quantity,
                remark: remark
            })
        });
        if (res.ok) {
            alert('添加成功');
            loadPage('stock');
        } else {
            const errorData = await res.json();
            alert('添加失败: ' + (errorData.message || '未知错误'));
        }
    };
    document.getElementById('cancelAddStock').onclick = function() {
        loadPage('stock');
    };
};

// 显示添加用户表单
window.showAddUserForm = function() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>添加用户</h2>
            <form id="addUserForm">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="userName" required>
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" id="userPassword" required>
                </div>
                <div class="form-group">
                    <label>角色（如ADMIN/USER）</label>
                    <input type="text" id="userRole" required>
                </div>
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn" id="cancelAddUser">取消</button>
            </form>
        </div>
    `;
    document.getElementById('addUserForm').onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('userName').value;
        const password = document.getElementById('userPassword').value;
        const role = document.getElementById('userRole').value;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, password, role })
        });
        if (res.ok) {
            alert('添加成功');
            loadPage('users');
        } else {
            alert('添加失败');
        }
    };
    document.getElementById('cancelAddUser').onclick = function() {
        loadPage('users');
    };
};

// 删除商品
window.deleteProduct = async function(id) {
    if (!confirm('确定要删除该商品吗？')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.ok) {
        alert('删除成功');
        loadPage('products');
    } else {
        alert('删除失败');
    }
};

// 编辑商品
window.editProduct = async function(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/products/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        alert('获取商品信息失败');
        return;
    }
    const data = await res.json();
    const product = data.data;
    // 获取所有分类
    let categories = [];
    try {
        const res2 = await fetch('/api/categories/page?pageNum=1&pageSize=100', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (res2.ok) {
            const data2 = await res2.json();
            categories = data2.data.content;
        }
    } catch (e) {}
    let categoryOptions = categories.map(c => `<option value="${c.id}" ${product.category && product.category.id === c.id ? 'selected' : ''}>${c.name}（ID:${c.id}）</option>`).join('');
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>编辑商品</h2>
            <form id="editProductForm">
                <div class="form-group">
                    <label>商品名称</label>
                    <input type="text" id="productName" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label>商品编号</label>
                    <input type="text" id="productCode" value="${product.code}" required>
                </div>
                <div class="form-group">
                    <label>分类</label>
                    <select id="productCategoryId" required>
                        <option value="">请选择分类</option>
                        ${categoryOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>价格</label>
                    <input type="number" id="productPrice" value="${product.price || ''}" required>
                </div>
                <div class="form-group">
                    <label>库存</label>
                    <input type="number" id="productStock" value="${product.stock || 0}" required>
                </div>
                <button type="submit" class="btn btn-primary">保存</button>
                <button type="button" class="btn" id="cancelEditProduct">取消</button>
            </form>
        </div>
    `;
    document.getElementById('editProductForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('productName').value;
        const code = document.getElementById('productCode').value;
        const categoryId = document.getElementById('productCategoryId').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        if (!categoryId) {
            alert('请选择分类');
            return;
        }
        const res = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, code, categoryId, price, stock })
        });
        if (res.ok) {
            alert('保存成功');
            loadPage('products');
        } else {
            alert('保存失败');
        }
    };
    document.getElementById('cancelEditProduct').onclick = function() {
        loadPage('products');
    };
};

// 删除分类
window.deleteCategory = async function(id) {
    if (!confirm('确定要删除该分类吗？')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.ok) {
        alert('删除成功');
        loadPage('categories');
    } else {
        alert('删除失败');
    }
};

// 编辑分类
window.editCategory = async function(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/categories/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        alert('获取分类信息失败');
        return;
    }
    const data = await res.json();
    const category = data.data;
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>编辑分类</h2>
            <form id="editCategoryForm">
                <div class="form-group">
                    <label>分类名称</label>
                    <input type="text" id="categoryName" value="${category.name}" required>
                </div>
                <div class="form-group">
                    <label>描述</label>
                    <input type="text" id="categoryDesc" value="${category.description || ''}">
                </div>
                <button type="submit" class="btn btn-primary">保存</button>
                <button type="button" class="btn" id="cancelEditCategory">取消</button>
            </form>
        </div>
    `;
    document.getElementById('editCategoryForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('categoryName').value;
        const description = document.getElementById('categoryDesc').value;
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });
        if (res.ok) {
            alert('保存成功');
            loadPage('categories');
        } else {
            alert('保存失败');
        }
    };
    document.getElementById('cancelEditCategory').onclick = function() {
        loadPage('categories');
    };
};

// 删除用户
window.deleteUser = async function(id) {
    if (!confirm('确定要删除该用户吗？')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.ok) {
        alert('删除成功');
        loadPage('users');
    } else {
        alert('删除失败');
    }
};

// 编辑用户
window.editUser = async function(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) {
        alert('获取用户信息失败');
        return;
    }
    const data = await res.json();
    const user = data.data;
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>编辑用户</h2>
            <form id="editUserForm">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="userName" value="${user.username}" required>
                </div>
                <div class="form-group">
                    <label>角色</label>
                    <input type="text" id="userRole" value="${user.role}" required>
                </div>
                <button type="submit" class="btn btn-primary">保存</button>
                <button type="button" class="btn" id="cancelEditUser">取消</button>
            </form>
        </div>
    `;
    document.getElementById('editUserForm').onsubmit = async function(e) {
        e.preventDefault();
        const username = document.getElementById('userName').value;
        const role = document.getElementById('userRole').value;
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, role })
        });
        if (res.ok) {
            alert('保存成功');
            loadPage('users');
        } else {
            alert('保存失败');
        }
    };
    document.getElementById('cancelEditUser').onclick = function() {
        loadPage('users');
    };
};

// 编辑库存记录
window.editStockRecord = async function(id) {
    const token = localStorage.getItem('token');
    // 获取库存记录详情
    const res = await fetch(`/api/stock-records/page?pageNum=1&pageSize=100`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
    let record = null;
    let products = [];
    if (res.ok) {
        const data = await res.json();
        // 查找目标库存记录
        record = data.data.content.find(r => Number(r.id) === Number(id));
        console.log('editStockRecord参数id:', id, '查到的record:', record);
    }
    // 获取所有商品
    try {
        const res2 = await fetch('/api/products/page?pageNum=1&pageSize=100', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (res2.ok) {
            const data2 = await res2.json();
            products = data2.data.content;
        }
    } catch (e) {}
    if (!record) {
        alert('未找到该库存记录');
        return;
    }
    let productOptions = products.map(p => `<option value="${p.id}" ${record.productId === p.id ? 'selected' : ''}>${p.name}（${p.code}）</option>`).join('');
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="form-container">
            <h2>编辑库存记录</h2>
            <form id="editStockForm">
                <input type="hidden" id="stockRecordId" value="${record.id}">
                <div class="form-group">
                    <label>商品</label>
                    <select id="stockProductId" required>
                        <option value="">请选择商品</option>
                        ${productOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>类型（IN/OUT）</label>
                    <select id="stockType" required>
                        <option value="IN" ${record.type === 'IN' ? 'selected' : ''}>入库</option>
                        <option value="OUT" ${record.type === 'OUT' ? 'selected' : ''}>出库</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>数量</label>
                    <input type="number" id="stockQuantity" required min="1" step="1" value="${record.quantity}">
                </div>
                <div class="form-group">
                    <label>备注</label>
                    <input type="text" id="stockRemark" value="${record.remark || ''}">
                </div>
                <button type="submit" class="btn btn-primary">保存</button>
                <button type="button" class="btn" id="cancelEditStock">取消</button>
            </form>
        </div>
    `;
    document.getElementById('editStockForm').onsubmit = async function(e) {
        e.preventDefault();
        const recordId = document.getElementById('stockRecordId').value;
        const productId = document.getElementById('stockProductId').value;
        const type = document.getElementById('stockType').value;
        const quantity = parseInt(document.getElementById('stockQuantity').value);
        const remark = document.getElementById('stockRemark').value;
        if (!productId) {
            alert('请选择商品');
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            alert('请输入有效的数量');
            return;
        }
        // 调试输出
        console.log('编辑请求体:', JSON.stringify({
            type: type,
            productId: parseInt(productId),
            quantity: quantity,
            remark: remark
        }));
        const res = await fetch(`/api/stock-records/${recordId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: type,
                productId: parseInt(productId),
                quantity: quantity,
                remark: remark
            })
        });
        if (res.ok) {
            alert('保存成功');
            loadPage('stock');
        } else {
            const errorData = await res.json();
            alert('保存失败: ' + (errorData.message || '未知错误'));
        }
    };
    document.getElementById('cancelEditStock').onclick = function() {
        loadPage('stock');
    };
};

// 删除库存记录
window.deleteStockRecord = async function(id) {
    if (!confirm('确定要删除该库存记录吗？')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/stock-records/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.ok) {
        alert('删除成功');
        loadPage('stock');
    } else {
        alert('删除失败');
    }
};

// 页面加载时默认显示控制台
document.addEventListener('DOMContentLoaded', () => {
    // 隐藏用户管理菜单（普通用户不可见）
    if (localStorage.getItem('role') !== 'ADMIN') {
        const usersMenu = document.querySelector('li a[data-page="users"]');
        if (usersMenu) {
            usersMenu.parentElement.style.display = 'none';
        }
    }
    loadPage('dashboard');
}); 
const userService = {
    initStorage() {
        if (!localStorage.getItem('mockUsers')) {
            const testUsers = [
                {
                    id: '1',
                    email: 'test@example.com',
                    password: '123456',
                    nickname: 'ТестовыйИгрок',
                    avatar: '../assets/images/account_avatar_juggernaut.png',
                    wallet: 1000,
                    favorites: [],
                    cart: [],
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('mockUsers', JSON.stringify(testUsers));
        }
    },
    
    register(email, password) {
        this.initStorage();
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        
        if (mockUsers.some(u => u.email === email)) {
            return { success: false, message: 'Этот email уже зарегистрирован' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            nickname: email.split('@')[0],
            avatar: '../assets/images/account_avatar_juggernaut.png',
            wallet: 0,
            favorites: [],
            cart: [],
            createdAt: new Date().toISOString()
        };
        
        mockUsers.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        
        return this.login(email, password);
    },
    
    login(email, password) {
        this.initStorage();
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUserId', user.id);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userNickname', user.nickname);
            localStorage.setItem('selectedAvatar', user.avatar);
            localStorage.setItem('userFavorites', JSON.stringify(user.favorites || []));
            localStorage.setItem('userCart', JSON.stringify(user.cart || []));
            
            return { success: true, user };
        }
        
        return { success: false, message: 'Неверный email или пароль' };
    },
    
    getCurrentUser() {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;
        
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        return mockUsers.find(u => u.id === userId);
    },
    
    updateUserData(updates) {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return { success: false, message: 'Пользователь не авторизован' };
        
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return { success: false, message: 'Пользователь не найден' };
        }
        
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates
        };
        
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        
        if (updates.nickname) {
            localStorage.setItem('userNickname', updates.nickname);
        }
        if (updates.avatar) {
            localStorage.setItem('selectedAvatar', updates.avatar);
        }
        if (updates.favorites) {
            localStorage.setItem('userFavorites', JSON.stringify(updates.favorites));
        }
        if (updates.cart) {
            localStorage.setItem('userCart', JSON.stringify(updates.cart));
        }
        
        return { success: true, user: mockUsers[userIndex] };
    },
    
    updateAvatar(avatarPath) {
        return this.updateUserData({ avatar: avatarPath });
    },
    
    updateNickname(nickname) {
        return this.updateUserData({ nickname: nickname });
    },
    
    updateWallet(amount) {
        const user = this.getCurrentUser();
        if (!user) return { success: false };
        
        const newBalance = (user.wallet || 0) + amount;
        return this.updateUserData({ wallet: newBalance });
    },
    
    addToFavorites(item) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Пользователь не авторизован' };
        
        if (user.favorites && user.favorites.some(fav => fav.id === item.id)) {
            return { success: false, message: 'Предмет уже в избранном' };
        }
        
        const favorites = user.favorites || [];
        favorites.push(item);
        
        return this.updateUserData({ favorites });
    },
    
    removeFromFavorites(itemId) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Пользователь не авторизован' };
        
        const favorites = (user.favorites || []).filter(item => item.id !== itemId);
        return this.updateUserData({ favorites });
    },
    
    isInFavorites(itemId) {
        const user = this.getCurrentUser();
        if (!user || !user.favorites) return false;
        
        return user.favorites.some(item => item.id === itemId);
    },
    
    addToCart(item) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Пользователь не авторизован' };
        
        if (user.cart && user.cart.some(cartItem => cartItem.id === item.id)) {
            return { success: false, message: 'Предмет уже в корзине' };
        }
        
        const cart = user.cart || [];
        cart.push(item);
        
        return this.updateUserData({ cart });
    },
    
    removeFromCart(itemId) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Пользователь не авторизован' };
        
        const cart = (user.cart || []).filter(item => item.id !== itemId);
        return this.updateUserData({ cart });
    },
    
    isInCart(itemId) {
        const user = this.getCurrentUser();
        if (!user || !user.cart) return false;
        
        return user.cart.some(item => item.id === itemId);
    },
    
    getFavorites() {
        const user = this.getCurrentUser();
        return user ? (user.favorites || []) : [];
    },
    
    getCart() {
        const user = this.getCurrentUser();
        return user ? (user.cart || []) : [];
    },
    
    clearCart() {
        return this.updateUserData({ cart: [] });
    },
    
    logout() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userNickname');
        localStorage.removeItem('selectedAvatar');
        localStorage.removeItem('userFavorites');
        localStorage.removeItem('userCart');
        window.location.href = '../index.html';
    },
    
    isAuthenticated() {
        return localStorage.getItem('currentUserId') !== null;
    }
};

if (typeof window !== 'undefined') {
    window.userService = userService;
}
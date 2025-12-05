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
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('mockUsers', JSON.stringify(testUsers));
            console.log('Созданы тестовые пользователи');
        }
    },
    
    // Регистрация нового пользователя
    register(email, password) {
        this.initStorage();
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        
        // Проверка, существует ли пользователь
        if (mockUsers.some(u => u.email === email)) {
            return { success: false, message: 'Этот email уже зарегистрирован' };
        }
        
        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            nickname: email.split('@')[0], // Никнейм из email
            avatar: '../assets/images/account_avatar_juggernaut.png',
            wallet: 0,
            createdAt: new Date().toISOString()
        };
        
        // Добавляем в массив
        mockUsers.push(newUser);
        
        // Сохраняем обновленный массив
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        
        // Автоматически входим
        return this.login(email, password);
    },
    
    // Вход пользователя
    login(email, password) {
        this.initStorage();
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Сохраняем сессионные данные
            localStorage.setItem('currentUserId', user.id);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userNickname', user.nickname);
            localStorage.setItem('selectedAvatar', user.avatar);
            
            return { success: true, user };
        }
        
        return { success: false, message: 'Неверный email или пароль' };
    },
    
    // Получить текущего пользователя (из mockUsers)
    getCurrentUser() {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;
        
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        return mockUsers.find(u => u.id === userId);
    },
    
    // Обновить данные пользователя
    updateUserData(updates) {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return { success: false, message: 'Пользователь не авторизован' };
        
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return { success: false, message: 'Пользователь не найден' };
        }
        
        // Обновляем данные
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates
        };
        
        // Сохраняем обновленный массив
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        
        // Также обновляем сессионные данные
        if (updates.nickname) {
            localStorage.setItem('userNickname', updates.nickname);
        }
        if (updates.avatar) {
            localStorage.setItem('selectedAvatar', updates.avatar);
        }
        
        return { success: true, user: mockUsers[userIndex] };
    },
    
    // Обновить аватар
    updateAvatar(avatarPath) {
        return this.updateUserData({ avatar: avatarPath });
    },
    
    // Обновить никнейм
    updateNickname(nickname) {
        return this.updateUserData({ nickname: nickname });
    },
    
    // Обновить баланс
    updateWallet(amount) {
        const user = this.getCurrentUser();
        if (!user) return { success: false };
        
        const newBalance = (user.wallet || 0) + amount;
        return this.updateUserData({ wallet: newBalance });
    },
    
    // Выход
    logout() {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userNickname');
        localStorage.removeItem('selectedAvatar');
        window.location.href = '../index.html';
    },
    
    // Проверить авторизацию
    isAuthenticated() {
        return localStorage.getItem('currentUserId') !== null;
    }
};

function showPopup() {
  document.getElementById('popup-overlay').classList.add('active');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
}

const overlay = document.getElementById('popup-overlay');
const popup = document.getElementById('popup');

overlay.addEventListener('click', function(event) {
  if (event.target === overlay) {
    closePopup();
  }
});

popup.addEventListener('click', function(event) {
  event.stopPropagation();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePopup();
});

function changeAvatar(avatarSrc) {
    const mainAvatar = document.querySelector('.account_avatar .avatar');
    if (mainAvatar) {
        mainAvatar.src = avatarSrc;
    }
    
    // Сохраняем в общую базу пользователей
    userService.updateAvatar(avatarSrc);
    
    closePopup(); 
}

function toggleNicknameEdit() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    
    if (nicknameInput.style.display === 'none' || nicknameInput.style.display === '') {
        nicknameText.style.display = 'none';
        nicknameInput.style.display = 'block';
        nicknameInput.value = nicknameText.textContent;
        nicknameInput.focus();
        nicknameInput.select();
    } else {
        saveNickname();
    }
}

function saveNickname() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    
    if (!nicknameText || !nicknameInput) return;
    
    let newNickname = nicknameInput.value.trim();
    
    if (newNickname === '') {
        newNickname = nicknameText.textContent;
    }
    
    nicknameText.textContent = newNickname;
    nicknameText.style.display = 'block';
    nicknameInput.style.display = 'none';
    
    // Сохраняем в общую базу пользователей
    userService.updateNickname(newNickname);
}

function handleNicknameKeyPress(event) {
    if (event.key === 'Enter') {
        saveNickname();
    }
    
    if (event.key === 'Escape') {
        cancelNicknameEdit();
    }
}

function cancelNicknameEdit() {
    const nicknameText = document.getElementById('nickname-text');
    const nicknameInput = document.getElementById('nickname-input');
    
    nicknameText.style.display = 'block';
    nicknameInput.style.display = 'none';
}

function logout() {
    userService.logout();
    window.location.href = '../index.html';
}

// ОДИН обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // 1. Проверка авторизации
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
        console.log('Пользователь не авторизован, перенаправление...');
        window.location.href = './authorization.html';
        return;
    }
    
    // 2. Обработчик кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // 3. Загрузка данных пользователя
    loadUserData();
    
    // 4. Настройка аватаров
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
        const mainAvatar = document.querySelector('.account_avatar .avatar');
        mainAvatar.src = savedAvatar;
    }

    const popupAvatars = document.querySelectorAll('#popup img');
    popupAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            changeAvatar(this.src);
        });
    });

    // 5. Настройка никнейма
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
        document.getElementById('nickname-text').textContent = savedNickname;
    }
    
    const nicknameInput = document.getElementById('nickname-input');
    nicknameInput.addEventListener('keypress', handleNicknameKeyPress);
    nicknameInput.addEventListener('blur', saveNickname); 
    
    const nicknameText = document.getElementById('nickname-text');
    nicknameText.addEventListener('click', toggleNicknameEdit);
    
    const avatarChangeButton = document.querySelector('.account_avatar .avatar');
    if (avatarChangeButton) {
        avatarChangeButton.addEventListener('click', showPopup);
    }
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', showPopup);
    }
});

function loadUserData() {
    const user = userService.getCurrentUser();
    
    if (!user) {
        console.log('Пользователь не найден');
        window.location.href = '../authorization/authorization.html';
        return;
    }
    
    // Загружаем аватар
    const mainAvatar = document.querySelector('.account_avatar .avatar');
    if (mainAvatar && user.avatar) {
        mainAvatar.src = user.avatar;
    }
    
    // Загружаем никнейм
    const nicknameText = document.getElementById('nickname-text');
    if (nicknameText) {
        nicknameText.textContent = user.nickname;
    }
    
    // Загружаем email
    const emailElement = document.querySelector('.account_email');
    if (emailElement) {
        emailElement.textContent = user.email;
    }
    
    // Загружаем баланс
    const walletElement = document.querySelector('.account_wallet');
    if (walletElement && user.wallet !== undefined) {
        walletElement.textContent = `${user.wallet}₽`;
    }
}
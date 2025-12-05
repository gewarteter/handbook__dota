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

// Элементы DOM
const authContainer = document.getElementById('authContainer');
const toRegisterBtn = document.getElementById('toRegister');
const toLoginBtn = document.getElementById('toLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const passwordConfirmGroup = document.querySelector('.password-confirm');
const loginMessage = document.getElementById('loginMessage');

// Поля ввода
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');

// Ошибки
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const registerEmailError = document.getElementById('registerEmailError');
const registerPasswordError = document.getElementById('registerPasswordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('Загрузка страницы авторизации');
    
    // Инициализируем хранилище
    userService.initStorage();
    
    if (userService.isAuthenticated()) {
        console.log('Пользователь уже авторизован, редирект на account.html');
        window.location.href = '../pages/account.html';
        return;
    }
    
    console.log('Пользователь не авторизован, показываем форму входа');
    passwordConfirmGroup.style.display = 'none';
    
    // Автозаполнение для тестирования (используем тестового пользователя из initStorage)
    loginEmail.value = 'test@example.com';
    loginPassword.value = '123456';
});

// Переключение между формами
toRegisterBtn.addEventListener('click', () => {
    switchToRegister();
});

toLoginBtn.addEventListener('click', () => {
    switchToLogin();
});

function switchToRegister() {
    authContainer.classList.add('login-mode');
    passwordConfirmGroup.style.display = 'block';
    clearErrors();
}

function switchToLogin() {
    authContainer.classList.remove('login-mode');
    passwordConfirmGroup.style.display = 'none';
    clearErrors();
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация пароля
function validatePassword(password) {
    return password.length >= 6;
}

// Очистка ошибок
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.style.display = 'none');
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
}

// Обработка входа
loginBtn.addEventListener('click', () => {
    console.log('Нажата кнопка Войти');
    clearErrors();
    let isValid = true;
    
    if (!validateEmail(loginEmail.value)) {
        loginEmailError.style.display = 'block';
        loginEmail.classList.add('error');
        isValid = false;
    }
    
    if (!validatePassword(loginPassword.value)) {
        loginPasswordError.style.display = 'block';
        loginPassword.classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        const result = userService.login(loginEmail.value, loginPassword.value);
        console.log('Результат входа:', result);
        
        if (result.success) {
            console.log('Успешный вход! Переход на account.html');
            // Небольшая задержка для отладки
            setTimeout(() => {
                window.location.href = '../pages/account.html';
            }, 100);
        } else {
            console.log('Ошибка входа:', result.message);
            loginEmailError.textContent = result.message;
            loginEmailError.style.display = 'block';
            loginEmail.classList.add('error');
        }
    }
});

// Обработка регистрации
registerBtn.addEventListener('click', () => {
    clearErrors();
    let isValid = true;
    
    if (!validateEmail(registerEmail.value)) {
        registerEmailError.style.display = 'block';
        registerEmail.classList.add('error');
        isValid = false;
    }
    
    if (!validatePassword(registerPassword.value)) {
        registerPasswordError.style.display = 'block';
        registerPassword.classList.add('error');
        isValid = false;
    }
    
    if (registerPassword.value !== confirmPassword.value) {
        confirmPasswordError.style.display = 'block';
        confirmPassword.classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        const result = userService.register(registerEmail.value, registerPassword.value);
        
        if (result.success) {
            // Автоматически логиним после регистрации
            localStorage.setItem('currentUserId', result.user.id);
            localStorage.setItem('userEmail', result.user.email);
            
            // Показываем сообщение
            loginMessage.style.display = 'block';
            
            // Автозаполнение полей входа
            loginEmail.value = registerEmail.value;
            
            // Переключаемся на форму входа через 2 секунды
            setTimeout(() => {
                switchToLogin();
                loginMessage.style.display = 'none';
            }, 2000);
            
            // Очищаем поля регистрации
            registerEmail.value = '';
            registerPassword.value = '';
            confirmPassword.value = '';
        } else {
            registerEmailError.textContent = result.message;
            registerEmailError.style.display = 'block';
            registerEmail.classList.add('error');
        }
    }
});

// Очистка ошибок при вводе
const allInputs = document.querySelectorAll('input');
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
});



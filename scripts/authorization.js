const authContainer = document.getElementById('authContainer');
const toRegisterBtn = document.getElementById('toRegister');
const toLoginBtn = document.getElementById('toLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const passwordConfirmGroup = document.querySelector('.password-confirm');
const loginMessage = document.getElementById('loginMessage');

// поля ввода
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');

// ошибки
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const registerEmailError = document.getElementById('registerEmailError');
const registerPasswordError = document.getElementById('registerPasswordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Загрузка страницы авторизации');
    userService.initStorage();
    
    if (userService.isAuthenticated()) {
        console.log('Пользователь уже авторизован, редирект на account.html');
        window.location.href = '../pages/account.html';
        return;
    }
    
    console.log('Пользователь не авторизован, показываем форму входа');
    passwordConfirmGroup.style.display = 'none';
    loginEmail.value = 'test@example.com';
    loginPassword.value = '123456';
});

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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.style.display = 'none');
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
}

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
            localStorage.setItem('currentUserId', result.user.id);
            localStorage.setItem('userEmail', result.user.email);
            loginMessage.style.display = 'block';

            loginEmail.value = registerEmail.value;
            
            setTimeout(() => {
                switchToLogin();
                loginMessage.style.display = 'none';
            }, 2000);
            
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
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

const mainPage = document.getElementById("page__main");
const favoritesPage = document.getElementById("page__favorites");
const cartPage = document.getElementById("page__cart");
const favBtn = document.getElementById("to_favorites");
const cartBtn = document.getElementById("to_cart");
const back_to_mainBtn = document.getElementById("back_to_main");
const prev_to_mainBtn = document.getElementById("prev_to_main");

favBtn.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  favoritesPage.classList.remove("hidden");
  cartPage.classList.add("hidden"); 
  document.body.classList.add("no-gradient");
});

back_to_mainBtn.addEventListener("click", () => {
  mainPage.classList.remove("hidden");
  favoritesPage.classList.add("hidden");
  document.body.classList.remove("no-gradient");
});

cartBtn.addEventListener("click", () => {
  mainPage.classList.add("hidden");
  cartPage.classList.remove("hidden");
  favoritesPage.classList.add("hidden");
  document.body.classList.add("no-gradient");
});

prev_to_mainBtn.addEventListener("click", () => {
  mainPage.classList.remove("hidden");
  cartPage.classList.add("hidden");
  document.body.classList.remove("no-gradient");
});

function loadFavorites() {
    const favoritesContainer = document.querySelector('#page__favorites .container');
    if (!favoritesContainer) return;
    
    if (typeof userService === 'undefined') {
        favoritesContainer.innerHTML = '<p>Сервис временно недоступен</p>';
        return;
    }
    const favorites = userService.getFavorites();
    const backButton = favoritesContainer.querySelector('#back_to_main');
    favoritesContainer.innerHTML = '';
    if (backButton) {
        favoritesContainer.appendChild(backButton);
    }
    if (favorites.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'В избранном пока ничего нет';
        emptyMessage.style.cssText = 'text-align: center; margin-top: 3.15rem; color: #888; font-size: calc(1rem + 1vw); font-family: Montseratt;';
        favoritesContainer.appendChild(emptyMessage);
        return;
    }
    const favoritesGrid = document.createElement('div');
    favoritesGrid.className = 'favorites-grid';
    favoritesGrid.style.cssText = 'display: flex; flex-direction: column; gap: 0.65rem; margin-top: 30px;';

    favorites.forEach(item => {
        const itemWrapper = document.createElement('div');
        itemWrapper.style.cssText = 'background-color: #38344455; border-radius: 10px;';
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.style.cssText = 'margin-bottom: 0;'; 
        itemElement.innerHTML = item.fullHtml;

        const cartContainer = itemElement.querySelector('.additions__buy button');
        if (cartContainer) {
            cartContainer.style.display = 'none'; 
        }
        
        const favoriteBtn = itemElement.querySelector('.additions button');
        if (favoriteBtn) {
            const img = favoriteBtn.querySelector('img');
            if (img) {
                img.src = '../assets/images/icon__full_heart.png';
                img.alt = 'Удалить из избранного';
            }
            
            favoriteBtn.addEventListener('click', () => {
                if (typeof userService !== 'undefined') {
                    userService.removeFromFavorites(item.id);
                    loadFavorites();
                    if (typeof itemService !== 'undefined') {
                        itemService.updateButtonStates();
                    }
                }
            });
        }
    itemWrapper.appendChild(itemElement);
    favoritesGrid.appendChild(itemWrapper);
});
    favoritesContainer.appendChild(favoritesGrid);
}

function loadCart() {
    const cartContainer = document.querySelector('#page__cart .container');
    if (!cartContainer) return;
    
    if (typeof userService === 'undefined') {
        cartContainer.innerHTML = '<p>Сервис временно недоступен</p>';
        return;
    }
    
    const cartItems = userService.getCart();
    
    const backButton = cartContainer.querySelector('#prev_to_main');
    cartContainer.innerHTML = '';
    if (backButton) {
        cartContainer.appendChild(backButton);
    }
    
    if (cartItems.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.style.cssText = 'text-align: center; margin-top: 3.15rem; color: #888; font-size: calc(1rem + 1vw); font-family: Montseratt;';
        cartContainer.appendChild(emptyMessage);
        return;
    }
    
    const cartList = document.createElement('div');
    cartList.className = 'cart-list';
    cartList.style.cssText = 'margin-top: 30px;';
    
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        totalPrice += item.price;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.style.cssText = 'display: flex; color: #fff; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #888;';
        
        // назва
        const itemInfo = document.createElement('div');
        itemInfo.style.cssText = 'display: flex; align-items: center; gap: 0.9rem;';
        
        const itemImg = document.createElement('img');
        itemImg.src = item.image;
        itemImg.alt = item.name;
        itemImg.style.cssText = 'width: 9vw; object-fit: contain;';
        
        const itemName = document.createElement('p');
        itemName.textContent = item.name;
        itemName.style.cssText = 'margin: 0; font-weight: bold; font-size: calc(1rem + 1vw);';
        
        itemInfo.appendChild(itemImg);
        itemInfo.appendChild(itemName);
        
        // деньге
        const itemActions = document.createElement('div');
        itemActions.style.cssText = 'display: flex; align-items: center; gap: 1rem;';
        
        const itemPrice = document.createElement('p');
        itemPrice.textContent = `${item.price}₽`;
        itemPrice.style.cssText = 'margin: 0; font-weight: bold; color: #95BF7A; font-size: calc(1rem + 1vw);';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 5px;';
        
        const deleteIcon = document.createElement('img');
        deleteIcon.src = '../assets/images/icon__trash.png';
        deleteIcon.alt = 'Удалить из корзины';
        deleteIcon.style.cssText = 'width: 9vw;';
        
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.addEventListener('click', () => {
            if (typeof userService !== 'undefined') {
                userService.removeFromCart(item.id);
                loadCart();
                if (typeof itemService !== 'undefined') {
                    itemService.updateButtonStates();
                }
            }
        });
        
        itemActions.appendChild(itemPrice);
        itemActions.appendChild(deleteBtn);
        
        cartItemElement.appendChild(itemInfo);
        cartItemElement.appendChild(itemActions);
        cartList.appendChild(cartItemElement);
    });
    
    cartContainer.appendChild(cartList);
    
    // игого
    const totalElement = document.createElement('div');
    totalElement.style.cssText = 'color: #fff; font-family: Montseratt; margin-top: 1.25rem; padding: 1.25rem; background-color: #38344455; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;';
    
    const totalText = document.createElement('p');
    totalText.textContent = 'Итого:';
    totalText.style.cssText = 'margin: 0; font-size: calc(1rem + 1vw);';
    
    const totalPriceElement = document.createElement('p');
    totalPriceElement.textContent = `${totalPrice}₽`;
    totalPriceElement.style.cssText = 'margin: 0; font-weight: bold; color: #95BF7A; font-size: calc(1rem + 1vw);';
    
    totalElement.appendChild(totalText);
    totalElement.appendChild(totalPriceElement);
    
    cartContainer.appendChild(totalElement);
    
    // оплата
    const paymentBtn = document.createElement('button');
    paymentBtn.textContent = 'Перейти к оплате';
    paymentBtn.style.cssText = 'margin-top: 1.25rem; padding: 0.9rem 1.87rem; font-family: Montseratt; background-color: #38344455; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: calc(1rem + 1vw); width: 100%; transition: background-color 0.3s;';
    
    paymentBtn.addEventListener('mouseover', () => {
        paymentBtn.style.backgroundColor = '#7da864';
    });
    
    paymentBtn.addEventListener('mouseout', () => {
        paymentBtn.style.backgroundColor = '#95BF7A';
    });
    
    paymentBtn.addEventListener('click', () => {
        if (confirm(`Оплатить ${totalPrice}₽?`)) {
            alert('оплата успешно проведена');
            if (typeof userService !== 'undefined') {
                userService.clearCart();
            }
            loadCart();
            if (typeof itemService !== 'undefined') {
                itemService.updateButtonStates();
            }
        }
    });
    
    cartContainer.appendChild(paymentBtn);
}

function updateItemButtonsOnAllPages() {
    if (typeof itemService !== 'undefined') {
        itemService.updateButtonStates();
    }
}

favBtn.addEventListener("click", () => {
    mainPage.classList.add("hidden");
    favoritesPage.classList.remove("hidden");
    loadFavorites(); 
});

cartBtn.addEventListener("click", () => {
    mainPage.classList.add("hidden");
    cartPage.classList.remove("hidden");
    loadCart(); 
});

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
            if (typeof userService !== 'undefined') {
                userService.logout();
            } else {
                localStorage.clear();
                window.location.href = '../index.html';
            }
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

    const mainPage = document.getElementById("page__main");
    const favoritesPage = document.getElementById("page__favorites");
    const cartPage = document.getElementById("page__cart");
    const favBtn = document.getElementById("to_favorites");
    const cartBtn = document.getElementById("to_cart");
    const back_to_mainBtn = document.getElementById("back_to_main");
    const prev_to_mainBtn = document.getElementById("prev_to_main");

    if (favBtn && favoritesPage && mainPage) {
        favBtn.addEventListener("click", () => {
            mainPage.classList.add("hidden");
            favoritesPage.classList.remove("hidden");
            loadFavorites();
        });
    }

    if (cartBtn && cartPage && mainPage) {
        cartBtn.addEventListener("click", () => {
            mainPage.classList.add("hidden");
            cartPage.classList.remove("hidden");
            loadCart();
        });
    }

    if (back_to_mainBtn && favoritesPage && mainPage) {
        back_to_mainBtn.addEventListener("click", () => {
            mainPage.classList.remove("hidden");
            favoritesPage.classList.add("hidden");
        });
    }

    if (prev_to_mainBtn && cartPage && mainPage) {
        prev_to_mainBtn.addEventListener("click", () => {
            mainPage.classList.remove("hidden");
            cartPage.classList.add("hidden");
        });
    }
});

function loadUserData() {
    const user = userService.getCurrentUser();
    
    if (!user) {
        console.log('Пользователь не найден');
        window.location.href = '../authorization/authorization.html';
        return;
    }
    
    const mainAvatar = document.querySelector('.account_avatar .avatar');
    if (mainAvatar && user.avatar) {
        mainAvatar.src = user.avatar;
    }
    
    const nicknameText = document.getElementById('nickname-text');
    if (nicknameText) {
        nicknameText.textContent = user.nickname;
    }
    
    const emailElement = document.querySelector('.account_email');
    if (emailElement) {
        emailElement.textContent = user.email;
    }
    
    const walletElement = document.querySelector('.account_wallet');
    if (walletElement && user.wallet !== undefined) {
        walletElement.textContent = `${user.wallet}₽`;
    }
}
const introPage = document.getElementById("introPage");
const contentPage = document.getElementById("contentPage");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

nextBtn.addEventListener("click", () => {
  introPage.classList.add("hidden");
  contentPage.classList.remove("hidden");
});
prevBtn.addEventListener("click", () => {
  introPage.classList.remove("hidden");
  contentPage.classList.add("hidden");
});

const accordionItems = document.querySelectorAll(".accordion__wrapper");
accordionItems.forEach((item) => {
  const panel = item.querySelector(".label");
  const accordionContent = item.querySelector(".content");
  const accordionBtn = item.querySelector(".item__btn");

  panel.addEventListener("click", function () {
    accordionContent.classList.toggle("open");
    accordionBtn.classList.toggle("open");
  });
});

const itemService = {
    initItems() {
        this.setupItemButtons();
        this.updateButtonStates();
    },

    setupItemButtons() {
        document.querySelectorAll('.additions button').forEach(button => {
            const img = button.querySelector('img');
            if (img && img.src.includes('heart') && !button.dataset.listenerAdded) {
                button.addEventListener('click', (e) => this.handleFavoriteClick(e));
                button.dataset.listenerAdded = 'true';
            }
        });

        document.querySelectorAll('.additions__buy button').forEach(button => {
            const img = button.querySelector('img');
            if (img && img.src.includes('cart') && !button.dataset.listenerAdded) {
                button.addEventListener('click', (e) => this.handleCartClick(e));
                button.dataset.listenerAdded = 'true';
            }
        });
    },

    handleFavoriteClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (typeof userService === 'undefined' || !userService.isAuthenticated()) {
            alert('Для добавления в избранное необходимо войти в аккаунт');
            window.location.href = './authorization.html';
            return;
        }
        
        const itemElement = event.target.closest('.item');
        const item = this.extractItemData(itemElement);
        
        if (userService.isInFavorites(item.id)) {
            userService.removeFromFavorites(item.id);
            this.updateHeartIcon(event.target.closest('button'), false);
        } else {
            userService.addToFavorites(item);
            this.updateHeartIcon(event.target.closest('button'), true);
            this.showAddedAnimation(event.target.closest('button'));
        }
    },

    handleCartClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (typeof userService === 'undefined' || !userService.isAuthenticated()) {
            alert('Для добавления в корзину необходимо войти в аккаунт');
            window.location.href = './authorization.html';
            return;
        }
        
        const itemElement = event.target.closest('.item');
        const item = this.extractItemData(itemElement);
        
        if (userService.isInCart(item.id)) {
            userService.removeFromCart(item.id);
            this.updateCartIcon(event.target.closest('button'), false);
        } else {
            userService.addToCart(item);
            this.updateCartIcon(event.target.closest('button'), true);
            this.showAddedAnimation(event.target.closest('button'));
        }
    },

    extractItemData(itemElement) {
        const nameElement = itemElement.querySelector('.item__name p');
        const imgElement = itemElement.querySelector('.item__name img');
        const priceElement = itemElement.querySelector('.additions__buy p');
        
        const itemId = nameElement ? 
            nameElement.textContent.trim().toLowerCase().replace(/\s+/g, '_') + '_' + 
            Date.now().toString().slice(-6) : 
            'item_' + Date.now();
        
        return {
            id: itemId,
            name: nameElement ? nameElement.textContent.trim() : 'Предмет',
            image: imgElement ? imgElement.src : '',
            price: priceElement ? this.parsePrice(priceElement.textContent) : 0,
            description: this.extractDescription(itemElement),
            fullHtml: itemElement.outerHTML
        };
    },

    parsePrice(priceText) {
        const match = priceText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    },

    extractDescription(itemElement) {
        const descriptionElements = itemElement.querySelectorAll('.action p.gray__text');
        let description = '';
        descriptionElements.forEach(p => {
            description += p.textContent.trim() + ' ';
        });
        return description.trim();
    },

    updateHeartIcon(button, isFavorited) {
        const img = button.querySelector('img');
        if (img) {
            img.src = isFavorited ? 
                '../assets/images/icon__full_heart.png' : 
                '../assets/images/icon__empty_heart.png';
            img.alt = isFavorited ? 'В избранном' : 'Добавить в избранное';
        }
    },

    updateCartIcon(button, isInCart) {
        const img = button.querySelector('img');
        if (img) {
            img.src = isInCart ? 
                '../assets/images/icon__full_cart.png' : 
                '../assets/images/icon__empty_cart.png';
            img.alt = isInCart ? 'В корзине' : 'Добавить в корзину';
        }
    },

    updateButtonStates() {
        if (typeof userService === 'undefined' || !userService.isAuthenticated()) {
            document.querySelectorAll('.additions button, .additions__buy button').forEach(button => {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
            });
            return;
        }

        document.querySelectorAll('.item').forEach(itemElement => {
            const item = this.extractItemData(itemElement);
            const favoriteBtn = itemElement.querySelector('.additions button');
            const cartBtn = itemElement.querySelector('.additions__buy button');
            
            if (favoriteBtn) {
                const isFavorited = userService.isInFavorites(item.id);
                this.updateHeartIcon(favoriteBtn, isFavorited);
                favoriteBtn.disabled = false;
                favoriteBtn.style.opacity = '1';
                favoriteBtn.style.cursor = 'pointer';
            }
            
            if (cartBtn) {
                const isInCart = userService.isInCart(item.id);
                this.updateCartIcon(cartBtn, isInCart);
                cartBtn.disabled = false;
                cartBtn.style.opacity = '1';
                cartBtn.style.cursor = 'pointer';
            }
        });
    },

    showAddedAnimation(element) {
        element.classList.add('added-animation');
        setTimeout(() => {
            element.classList.remove('added-animation');
        }, 300);
    }
};

if (typeof window !== 'undefined') {
    window.itemService = itemService;
}

document.addEventListener("DOMContentLoaded", () => {
  const titleTabs = document.querySelectorAll(".titles > div");
  const contentSections = document.querySelectorAll("section .container > div");
  function activateTab(clickedTab) {
    titleTabs.forEach((tab) => tab.classList.remove("chosen"));
    clickedTab.classList.add("chosen");
    contentSections.forEach((section) => (section.style.display = "none"));
    if (clickedTab.classList.contains("basic")) {
      document.querySelector(".basical").style.display = "block";
    } else if (clickedTab.classList.contains("improvements")) {
      document.querySelector(".improve").style.display = "block";
    }
  }
  titleTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
  });
  const initialChosenTab = document.querySelector(".titles .chosen");
  if (initialChosenTab) {
    activateTab(initialChosenTab);
  } else {
    if (titleTabs.length > 0) {
      activateTab(titleTabs[0]);
    }
  }
});
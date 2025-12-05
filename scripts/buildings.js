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

class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.scrollThreshold = 800;
        this.init();
    }
    init() {
        window.addEventListener('scroll', () => {
            this.toggleButton();
        });

        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
    toggleButton() {
        if (window.pageYOffset > this.scrollThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});
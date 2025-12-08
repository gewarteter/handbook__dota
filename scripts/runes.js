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

let data = [{
    name: 'Руна Богатства',
    img: '../assets/images/rune_of_wealth.png',
    text: 'Никогда не исчезают сами по себе. Если не были подобраны до появления следующих, новые руны появятся рядом со старыми.',
    text_2: 'Появляются в 0:00 на игровых часах, затем каждые 3 минуты (3:00, 6:00, 9:00, и т. д.)'
}, {
    name: 'Руна воды',
    img: '../assets/images/rune_of_water.png',
    text: 'Если руны воды не были подобраны до появления следующих, то они исчезнут.',
    text_2: 'Появляются лишь в 2:00 и 4:00 на игровых часах на обеих точках появления рун на реке.'
}, {
    name: 'Руна Мудрости',
    img: '../assets/images/rune_of_wisdom.png',
    text: 'Никогда не исчезают сами по себе. Если не были подобраны до появления следующих, новые руны появятся рядом со старыми.',
    text_2: 'Появляются в 7:00 на игровых часах, затем каждые 7 минут (14:00, 21:00, 28:00, и т. д.)'
}];

let elements = document.querySelector('.slider');
let prev = document.getElementById('back');
let next = document.getElementById('forward');
let index = 0;
let isTransitioning = false;
let slidesPerView = 1;

function updateSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1440) {
        slidesPerView = Math.min(4, data.length);
    } else if (width >= 1024) {
        slidesPerView = Math.min(3, data.length);
    } else if (width >= 768) {
        slidesPerView = Math.min(2, data.length);
    } else {
        slidesPerView = 1;
    }
}

function getMaxIndex() {
    return Math.max(0, data.length - slidesPerView);
}

function renderSlides() {
    let slideHtml = data.map(slide => 
        `<div class='slide'>
            <div class="slide__content">
                <div class="slide__name"><h3>${slide.name}</h3></div>
                <div class="slide__img"><img src='${slide.img}' alt='${slide.name}'></div>
                <div class="slide__text">
                    <p style="font-family: Spectral SC;">${slide.text}</p>
                    <p style="font-family: Spectral SC ExtraBold;">${slide.text_2}</p>
                </div>
            </div>
        </div>`).join('');
    
    elements.innerHTML = slideHtml;
    
    setTimeout(() => {
        updateSliderPosition();
    }, 100);
}

function updateSliderPosition() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    elements.style.transition = 'transform 0.5s ease';
    const translateX = -(index * (100 / slidesPerView));
    elements.style.transform = `translateX(${translateX}%)`;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 300);
}

function nextSlide() {
    if (isTransitioning) return;
    
    const maxIndex = getMaxIndex();
    if (index >= maxIndex) {
        index = 0;
    } else {
        index++;
    }
    updateSliderPosition();
}

function prevSlide() {
    if (isTransitioning) return;
    
    const maxIndex = getMaxIndex();
    if (index <= 0) {
        index = maxIndex;
    } else {
        index--;
    }
    updateSliderPosition();
}

function forceCorrectWidth() {
    const sliderPosition = document.querySelector('.slider__position');
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        slide.style.maxWidth = '100%';
        slide.style.width = '100%';
    });
    
    updateSliderPosition();
}

function addSwipeSupport() {
    let startX = 0;
    let endX = 0;
    
    elements.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    elements.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = startX - endX;
        const minSwipeDistance = 20;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);

window.addEventListener('resize', function() {
    updateSlidesPerView();
    forceCorrectWidth();
});

function initSlider() {
    updateSlidesPerView();
    renderSlides();
    addSwipeSupport();
    
    setTimeout(() => {
        forceCorrectWidth();
    }, 300);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
} else {
    initSlider();
}
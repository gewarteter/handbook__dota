/* let data = [{
    name: 'Руна Богатства',
    img: '../assets/images/rune_of_wealth.png',
	text: 'Никогда не исчезают сами по себе. Если не были подобраны до появления следующих, новые руны появятся рядом со старыми.',
	text_2: 'Появляются в 0:00 на игровых часах, затем каждые 3 минуты (3:00, 6:00, 9:00, и т. д.)'},
	{
    name: 'Руна воды',
    img: '../assets/images/rune_of_water.png',
	text: 'Если руны воды не были подобраны до появления следующих, то они исчезнут.',
	text_2: 'Появляются лишь в 2:00 и 4:00 на игровых часах на обеих точках появления рун на реке.'},
	{
    name: 'Руна Богатства',
    img: '../assets/images/rune_of_wisdom.png',
	text: 'Никогда не исчезают сами по себе. Если не были подобраны до появления следующих, новые руны появятся рядом со старыми.',
	text_2: 'Появляются в 7:00 на игровых часах, затем каждые 7 минут (14:00, 21:00, 28:00, и т. д.)'}]

let elements = document.querySelector('.slider')
let prev = document.getElementById('back')
let next = document.getElementById('forward')
let index = 1
let slideWidth = 290

function renderSlides(){
	let firstClone = data[0]
	let lastClone = data[data.length - 1]
	let slideHtml = [lastClone, ...data, firstClone].map(slide => 
		`<div class = 'slide'>
        <div class="slide__content">
        <div class="slide__name"><h3>${slide.name}</h3></div>
		<div class="slide__img"><img src = '${slide.img}'></div>
        <div class="slide__text">
		<p style="font-family: Spectral SC;">${slide.text}</p>
		<p style="font-family: Spectral SC ExtraBold;">${slide.text_2}</p>
        </div>
        </div>
		</div>`).join(' ')
	elements.innerHTML = slideHtml
	elements.style.transform = `translateX(-${index*slideWidth}px)`
}

function updatesSlider(){
	elements.style.transition = 'transform .5s ease'
	elements.style.transform = `translateX(-${index*slideWidth}px)`
}

function nextSlide(){
	if(index >= data.length)
	{
		index++
		updatesSlider()
		setTimeout(() => {
			elements.style.transition = 'none'
			index = 1
			elements.style.transform = `translateX(-${index*slideWidth}px)`
		}, 1000)
		
	} else {
		index++
		updatesSlider()
	}
}

function prevSlide() {
	if (index <= 0)
	{
		index--
		updatesSlider()
		setTimeout(() => {
			elements.style.transition = 'none'
			index = data.length
			elements.style.transform = `translateX(-${index*data.length}px)`
		}, 1000)
	} else {
		index--
		updatesSlider()
	}
}

prev.addEventListener('click', prevSlide)
next.addEventListener('click', nextSlide)

renderSlides() */

/* let data = [{
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
let slideWidth = 0;
let isTransitioning = false;

// Определяем ширину слайда
function updateSlideWidth() {
    const sliderPosition = document.querySelector('.slider__position');
    slideWidth = sliderPosition.offsetWidth;
    elements.style.transform = `translateX(-${index * slideWidth}px)`;
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
    updateSlideWidth();
}

function updateSlider() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    elements.style.transition = 'transform 0.5s ease';
    elements.style.transform = `translateX(-${index * slideWidth}px)`;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 300);
}

function nextSlide() {
    if (isTransitioning) return;
    
    if (index >= data.length - 1) {
        index = 0;
    } else {
        index++;
    }
    updateSlider();
}

function prevSlide() {
    if (isTransitioning) return;
    
    if (index <= 0) {
        index = data.length - 1;
    } else {
        index--;
    }
    updateSlider();
}

// Добавляем поддержку свайпов
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
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Обработчики событий
prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);

// Адаптация к изменению размера окна
window.addEventListener('resize', updateSlideWidth);

// Инициализация
renderSlides();
addSwipeSupport(); */

/* let data = [{
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

// Определяем количество видимых слайдов
function updateSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1440) {
        slidesPerView = 3;
    } else if (width >= 1024) {
        slidesPerView = 2;
    } else {
        slidesPerView = 1;
    }
    
    // Обновляем максимальный индекс
    updateMaxIndex();
}

function updateMaxIndex() {
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
    updateSliderPosition();
}

function updateSliderPosition() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    elements.style.transition = 'transform 0.5s ease';
    
    // Используем translateX с процентами для адаптивности
    const translateX = -(index * (100 / slidesPerView));
    elements.style.transform = `translateX(${translateX}%)`;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function nextSlide() {
    if (isTransitioning) return;
    
    const maxIndex = updateMaxIndex();
    if (index >= maxIndex) {
        index = 0; // Возвращаемся к началу
    } else {
        index++;
    }
    updateSliderPosition();
}

function prevSlide() {
    if (isTransitioning) return;
    
    const maxIndex = updateMaxIndex();
    if (index <= 0) {
        index = maxIndex; // Переходим к концу
    } else {
        index--;
    }
    updateSliderPosition();
}

// Добавляем поддержку свайпов
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
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Обработчики событий
prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);

// Адаптация к изменению размера окна
window.addEventListener('resize', function() {
    updateSlidesPerView();
    updateSliderPosition();
});

// Инициализация
updateSlidesPerView();
renderSlides();
addSwipeSupport(); */

/* let data = [{
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

// Определяем количество видимых слайдов
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
    updateSliderPosition();
}

function updateSliderPosition() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    elements.style.transition = 'transform 0.5s ease';
    
    // Рассчитываем смещение в процентах
    const translateX = -(index * (100 / slidesPerView));
    elements.style.transform = `translateX(${translateX}%)`;
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
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

// Добавляем поддержку свайпов
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
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Функция для предотвращения горизонтального скролла
function preventHorizontalScroll() {
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) return;
        
        const sliderRect = elements.getBoundingClientRect();
        const isInSlider = e.touches[0].clientX >= sliderRect.left && 
                          e.touches[0].clientX <= sliderRect.right &&
                          e.touches[0].clientY >= sliderRect.top && 
                          e.touches[0].clientY <= sliderRect.bottom;
        
        if (isInSlider) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Обработчики событий
prev.addEventListener('click', prevSlide);
next.addEventListener('click', nextSlide);

// Адаптация к изменению размера окна
window.addEventListener('resize', function() {
    updateSlidesPerView();
    updateSliderPosition();
});

// Инициализация
function initSlider() {
    updateSlidesPerView();
    renderSlides();
    addSwipeSupport();
    preventHorizontalScroll();
}

// Запускаем инициализацию когда DOM загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
} else {
    initSlider();
} */


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
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

const rankData = {
    herald: [0, 154, 308, 462, 616],
    guardian: [770, 924, 1078, 1232, 1386],
    crusader: [1540, 1694, 1848, 2002, 2156],
    archon: [2310, 2464, 2618, 2772, 2926],
    legend: [3080, 3234, 3388, 3542, 3696],
    ancient: [3850, 4004, 4158, 4312, 4466],
    divine: [4620, 4820, 5020, 5220, 5420]
};

function initRankFilter() {
    const filterButtons = document.querySelectorAll('.list_item');
    const rankHolder = document.querySelector('.rank__holder');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rankId = this.getAttribute('data-id');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            scrollToActiveButton(this);
            updateRankData(rankId);
            changeRankClass(rankHolder, rankId);
        });
    });
    updateRankData('herald');
}

function scrollToActiveButton(activeButton) {
    const filterBtn = document.querySelector('.filter_btn');
    const container = document.querySelector('.filter__wrapper');
    
    activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

function updateRankData(rankId) {
    const rankValues = document.querySelectorAll('.rank_in_order p');
    const data = rankData[rankId];
    
    if (data && rankValues.length === data.length) {
        rankValues.forEach((pElement, index) => {
            animateNumberChange(pElement, data[index]);
        });
    }
}

function animateNumberChange(element, targetValue) {
    const currentValue = parseInt(element.textContent);
    const duration = 500; 
    const steps = 20; 
    const stepTime = duration / steps;
    const valueDiff = targetValue - currentValue;
    let currentStep = 0;
    
    const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentValueAnimated = Math.round(currentValue + (valueDiff * progress));
        
        element.textContent = currentValueAnimated;
        
        if (currentStep >= steps) {
            element.textContent = targetValue;
            clearInterval(timer);
        }
    }, stepTime);
}

function changeRankClass(rankHolder, rankId) {
    const rankClasses = ['herald', 'guardian', 'crusader', 'archon', 'legend', 'ancient', 'divine'];
    rankHolder.classList.remove(...rankClasses);
    rankHolder.classList.add(rankId);
    rankHolder.classList.remove('visible');
    void rankHolder.offsetWidth; 
    rankHolder.classList.add('visible');
}

function saveSelectedRank(rankId) {
    localStorage.setItem('selectedRank', rankId);
}

function loadSelectedRank() {
    return localStorage.getItem('selectedRank') || 'herald';
}

document.addEventListener('DOMContentLoaded', function() {
    initRankFilter();
    const savedRank = loadSelectedRank();
    const savedButton = document.querySelector(`.list_item[data-id="${savedRank}"]`);
    
    if (savedButton && savedRank !== 'herald') {
        savedButton.click();
    }
    const filterButtons = document.querySelectorAll('.list_item');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const rankId = this.getAttribute('data-id');
            saveSelectedRank(rankId);
        });
    });
});
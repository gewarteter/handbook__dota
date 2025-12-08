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
accordionItems.forEach((attribute) => {
  const panel = attribute.querySelector(".label");
  const accordionContent = attribute.querySelector(".content");
  const accordionBtn = attribute.querySelector(".attribute__btn");

  panel.addEventListener("click", function () {
    accordionContent.classList.toggle("open");
    accordionBtn.classList.toggle("open");
  });
});

const list = document.querySelector(".filter")
const items = document.querySelectorAll(".card__holder")
let currentFilter = null

function filter(){
    list.addEventListener("click", Event => {
        const targetId = Event.target.dataset.id
        if (!targetId) return
        console.log(targetId);

        if (currentFilter === targetId) {
            showAllItems()
            currentFilter = null
        } else {
            getItems(targetId)
            currentFilter = targetId
        }
    })
}

filter()

function getItems(className) {
    items.forEach(item => {
        if (item.classList.contains(className)) {
            item.style.display = "flex"
        } else {
            item.style.display = "none"
        }
    })
}

function showAllItems() {
    items.forEach(item => {
        item.style.display = "flex"
    })
}
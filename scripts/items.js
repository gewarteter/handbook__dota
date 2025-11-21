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
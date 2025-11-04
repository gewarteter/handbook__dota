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


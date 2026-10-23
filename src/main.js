import { PREP_TIME } from "./js/menu.js";

const formEl = document.querySelector(".form");
const orderLogEl = document.querySelector(".order-log");


function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}


function addOrderRow(drink) {
  const li = document.createElement("li");
  li.classList.add("row-pending");
  li.textContent = `⏳ ${drink} · у роботі…`;
  orderLogEl.prepend(li);
  return li;
}


formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const drink = formData.get("drink");
  const state = formData.get("state");

  const delay = PREP_TIME[drink];
  const shouldResolve = state === "fulfilled";

  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then((delayValue) => {
      row.className = "row-ok";
      row.textContent = `✅ ${drink} · готове · ${delayValue} ms`;
    })
    .catch((delayValue) => {
      row.className = "row-err";
      row.textContent = `❌ ${drink} · скасовано · ${delayValue} ms`;
    })
    .finally(() => {
      const timeString = new Date().toLocaleTimeString("uk-UA");
      row.textContent += ` · ${timeString}`;
    });
});
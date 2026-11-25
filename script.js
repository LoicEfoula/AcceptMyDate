const screens = Array.from(document.querySelectorAll(".screen"));
let current = 0;
let busy = false;

function goTo(index) {
  if (busy || index >= screens.length || index === current) return;
  busy = true;

  const from = screens[current];
  from.classList.add("leaving");

  setTimeout(() => {
    from.classList.remove("leaving", "active");
    current = index;
    screens[current].classList.add("active");
    busy = false;
  }, 400);
}

// Tous les boutons "suivant" avancent, y compris « Non » :
// le formulaire se comporte comme si la personne avait répondu « Oui ».
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => goTo(current + 1));
});

// Sélection unique du restaurant
const choices = Array.from(document.querySelectorAll(".choice"));
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((c) => c.classList.remove("selected"));
    choice.classList.add("selected");
  });
});

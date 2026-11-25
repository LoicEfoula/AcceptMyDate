/* =====================================================
   CONFIGURATION : réception des réponses
   -----------------------------------------------------
   1. Va sur https://formspree.io et crée un compte gratuit.
   2. Crée un formulaire ("New form") avec TON adresse e-mail.
   3. Copie l'adresse du formulaire (ex : https://formspree.io/f/abcdwxyz)
      et colle-la ci-dessous à la place du texte entre guillemets.
   ===================================================== */
const CONFIG = {
  endpoint: "https://formspree.io/f/mwloyrnr",
};

/* ---------------- Navigation entre écrans ---------------- */
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
    window.scrollTo(0, 0);
    busy = false;
  }, 400);
}

/* ---------------- Réponses de la personne ---------------- */
const answers = {
  reponse: "",   // vrai bouton cliqué : Oui ou Non
  horaire: "",
  restaurant: "La Bella Vita",
};

// Tous les boutons "suivant" avancent, y compris « Non » :
// le formulaire se comporte comme si la personne avait répondu « Oui »,
// mais on garde le vrai choix pour te l'envoyer.
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.answer) answers.reponse = btn.dataset.answer;
    goTo(current + 1);
  });
});

// Horaires : 15h / 16h / 17h
const slots = Array.from(document.querySelectorAll(".slot"));
const btnJour = document.getElementById("btnJour");
slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    slots.forEach((s) => s.classList.remove("selected"));
    slot.classList.add("selected");
    answers.horaire = slot.dataset.time;
    btnJour.disabled = false;
  });
});

// Restaurants : sélection unique
const choices = Array.from(document.querySelectorAll(".choice"));
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((c) => c.classList.remove("selected"));
    choice.classList.add("selected");
    answers.restaurant = choice.dataset.name;
  });
});

/* ---------------- Envoi des réponses ---------------- */
function sendAnswers() {
  const configured = CONFIG.endpoint && CONFIG.endpoint.startsWith("http");
  if (!configured) {
    console.warn("Envoi non configuré : renseigne CONFIG.endpoint dans script.js");
    return;
  }

  const payload = {
    "Réponse à l'invitation": answers.reponse,
    "Date": "Samedi 28 novembre 2026",
    "Horaire choisi": answers.horaire,
    "Restaurant choisi": answers.restaurant,
    "Envoyé le": new Date().toLocaleString("fr-FR"),
  };

  fetch(CONFIG.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => console.error("Envoi impossible :", err));
}

// Envoi au clic sur « Celui-ci » (dernière question), puis dernier écran
document.getElementById("btnResto").addEventListener("click", sendAnswers);

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
  navLinks.dataset.open = String(open);
});
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }),
);
const form = document.querySelector("[data-inquiry]");
function connectBrief(title, collect) {
  if (!form) return;
  form
    .querySelectorAll('[type="submit"]')
    .forEach((button) => (button.disabled = false));
  const result = document.getElementById("brief-result"),
    area = document.getElementById("brief-text"),
    email = document.getElementById("email-brief"),
    status = document.getElementById("copy-status");
  const update = () => {
    email.href =
      "mailto:josephjilovec@pm.me?subject=" +
      encodeURIComponent(title) +
      "&body=" +
      encodeURIComponent(area.value);
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    area.value =
      title +
      "\n\n" +
      collect(new FormData(form)) +
      "\n\nI understand this service is in development. Please let me know whether a suitable pilot is available and agree the scope before any engagement.";
    update();
    result.hidden = false;
    document.getElementById("brief-heading").focus();
    status.textContent =
      "Draft created in this browser. Nothing has been sent.";
  });
  area.addEventListener("input", update);
  document.getElementById("copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent =
        "Copied. Paste the draft into your preferred email app.";
    } catch {
      area.focus();
      area.select();
      status.textContent =
        "Select and copy the draft above using your device’s copy command.";
    }
  });
  form.addEventListener("input", (e) => {
    if (e.target.closest("#brief-result")) return;
    result.hidden = true;
    status.textContent = "";
  });
}
function observeChapters(selector, onChange) {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) onChange(active.target.dataset.chapter);
    },
    { rootMargin: "-18% 0px -36% 0px", threshold: [0, 0.25, 0.5] },
  );
  document.querySelectorAll(selector).forEach((e) => observer.observe(e));
}
const recordData = {
  documented: [
    "SOURCE / SAMPLE INVOICE",
    "Keep the reference with the record.",
    "The fictional invoice supports a dated oil service entry. It does not establish the current condition of the vehicle.",
    "Which manufacturer guidance applies to this vehicle and its use? Review the available record before agreeing the next scope.",
  ],
  noted: [
    "SOURCE / OWNER RECOLLECTION",
    "A note is useful. It is not an invoice.",
    "The owner recalls a tire rotation. Keep the recollection visible as an unverified note until supporting records or professional review clarify it.",
    "Can the previous provider supply the record? Which details can the technician verify, and what remains unknown?",
  ],
  unknown: [
    "SOURCE / NO RECORD PROVIDED",
    "Unknown stays unknown.",
    "No brake-fluid service record appears in this fictional file. That alone does not establish an overdue item or a required repair.",
    "Please review the correct manufacturer guidance, available history and the vehicle itself before explaining any recommended inspection or work.",
  ],
};
document.querySelectorAll("[data-record]").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll("[data-record]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const d = recordData[b.dataset.record];
    [
      "evidence-label",
      "evidence-heading",
      "evidence-copy",
      "shop-question",
    ].forEach((id, i) => (document.getElementById(id).textContent = d[i]));
  }),
);
const coverageNotes = [
  "Start with the sources you have. Keep a source reference with each dated entry.",
  "Separate documented work from recollection. Leave gaps visible instead of filling them with assumptions.",
  "Begin with the available vehicle details and the right professional questions. A missing history does not establish condition.",
];
document.querySelectorAll("[name=coverage]").forEach((e, i) =>
  e.addEventListener("change", () => {
    if (e.checked)
      document.getElementById("coverage-note").textContent = coverageNotes[i];
  }),
);
connectBrief(
  "Motoryn — ownership-planning interest",
  (d) =>
    "Record coverage: " +
    d.get("coverage") +
    "\nPlanning goal: " +
    d.get("goal") +
    "\nGeneral vehicle description: " +
    (d.get("vehicle") || "To discuss") +
    "\nOwnership question: " +
    (d.get("context") || "To discuss") +
    "\n\nPlease help organize what is documented and prepare questions for my chosen qualified workshop. This is not an inspection or repair booking.",
);

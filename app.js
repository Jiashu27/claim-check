"use strict";

const element = (id) => document.getElementById(id);
const verdictText = (value) => judgementLabels[value];
const newDecisions = () => cases.map(() => ({ initial: null, final: null }));

let currentIndex = 0;
let decisions = newDecisions();

function renderOptions(container, name, selection) {
  container.replaceChildren();
  for (const [value, label] of Object.entries(judgementLabels)) {
    const wrapper = document.createElement("label");
    const input = document.createElement("input");
    Object.assign(input, { type: "radio", name, value, checked: selection === value });
    wrapper.append(input, label);
    container.append(wrapper);
  }
}

function renderAdvice(example) {
  const card = element("source-card");
  const heading = document.createElement("strong");
  const excerpt = document.createElement("p");
  const source = example.source?.id === example.advice.sourceId ? example.source : null;
  element("verdict").textContent = verdictText(example.advice.verdict);
  element("explanation").textContent = example.advice.explanation;
  element("source-ref").textContent = example.advice.sourceId;
  card.classList.toggle("missing", !source);
  heading.textContent = source ? source.title : "Source unavailable";
  excerpt.textContent = source
    ? source.excerpt
    : "The cited ID is absent from the local evidence pack. Check whether you have enough evidence to decide.";
  card.replaceChildren(heading, excerpt);
}

function renderCase({ preserveEvidence = false } = {}) {
  const example = cases[currentIndex];
  const state = decisions[currentIndex];
  const complete = decisions.filter((decision) => decision.final).length;
  const started = decisions.some((decision) => decision.initial);
  const showResult = state.final && (element("timing").value === "immediate" || complete === cases.length);

  element("topic").textContent = example.topic;
  element("case-title").textContent = example.title;
  element("claim").textContent = example.claim;
  element("progress").textContent = `${complete} of ${cases.length} complete`;
  element("timing").disabled = started;
  element("restart").hidden = !started;
  renderOptions(element("initial-options"), "initial", state.initial);
  renderOptions(element("final-options"), "final", state.final);
  element("initial-fields").disabled = Boolean(state.initial);
  element("final-fields").disabled = Boolean(state.final);
  element("reveal").disabled = true;
  element("reveal").hidden = Boolean(state.initial);
  element("finish").disabled = true;
  element("finish").hidden = Boolean(state.final);
  element("finish").textContent = element("timing").value === "immediate" ? "Check result" : "Save decision";
  element("final-form").hidden = !state.initial;
  element("locked").hidden = Boolean(state.initial);
  element("advice").hidden = !state.initial;
  element("to-final").hidden = Boolean(state.final);
  if (!preserveEvidence) element("evidence").open = false;
  if (state.initial) renderAdvice(example);

  element("pending").hidden = !state.final || Boolean(showResult);
  element("result").hidden = !showResult;
  if (showResult) {
    element("result-title").textContent = state.final === example.answer ? "Matches the evidence" : "Reconsider the evidence";
    element("feedback").textContent = example.feedback;
    element("comparison").textContent = [
      ["Initial", state.initial], ["AI", example.advice.verdict], ["Final", state.final]
    ].map(([label, value]) => `${label} · ${verdictText(value)}`).join("  /  ");
  }

  [...element("case-nav").children].forEach((button, index) => {
    const finished = Boolean(decisions[index].final);
    button.textContent = `${cases[index].title}${finished ? " ✓" : ""}`;
    button.setAttribute("aria-label", `${cases[index].title}${finished ? ", complete" : ""}`);
    if (index === currentIndex) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

function showAdvice(event) {
  event.preventDefault();
  const selection = new FormData(event.currentTarget).get("initial");
  const state = decisions[currentIndex];
  if (!selection || state.initial) return;
  state.initial = selection;
  renderCase();
  element("announce").textContent = "Simulated advice is available. You can inspect the cited evidence.";
  element("evidence").querySelector("summary").focus();
}

function saveFinal(event) {
  event.preventDefault();
  const selection = new FormData(event.currentTarget).get("final");
  const state = decisions[currentIndex];
  if (!selection || !state.initial || state.final) return;
  state.final = selection;
  renderCase({ preserveEvidence: true });
  if (element("result").hidden) {
    element("pending").focus();
  } else {
    element("result-title").focus();
  }
  element("announce").textContent = decisions.every((decision) => decision.final)
    ? "Practice complete. Feedback is available for every case."
    : element("progress").textContent;
}

cases.forEach((example, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.addEventListener("click", () => {
    if (index === currentIndex) return;
    currentIndex = index;
    renderCase();
    element("announce").textContent = example.title;
  });
  element("case-nav").append(button);
});

element("initial-form").addEventListener("change", () => { element("reveal").disabled = false; });
element("final-form").addEventListener("change", () => { element("finish").disabled = false; });
element("initial-form").addEventListener("submit", showAdvice);
element("final-form").addEventListener("submit", saveFinal);
element("to-final").addEventListener("click", () => {
  const options = element("final-options");
  (options.querySelector("input:checked") || options.querySelector("input")).focus();
});
element("restart").addEventListener("click", () => {
  decisions = newDecisions();
  currentIndex = 0;
  renderCase();
  element("announce").textContent = "Practice restarted.";
  element("timing").focus();
});
element("result-title").setAttribute("tabindex", "-1");
element("pending").setAttribute("tabindex", "-1");

renderCase();

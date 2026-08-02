
"use strict";

const technologyStates = [
  ["Pneumatic logic", "Fluid at low pressure", "Fluid at high pressure"],
  ["Relay logic", "Circuit open", "Circuit closed"],
  ["CMOS logic", "0–1.5 V", "3.5–5.0 V"],
  ["TTL logic", "0–0.8 V", "2.0–5.0 V"],
  ["Fibre optics", "Light off", "Light on"],
  ["Dynamic memory", "Capacitor discharged", "Capacitor charged"],
  ["Non-volatile memory", "Fuse blown", "Fuse intact"],
  ["Bipolar memory", "Electrons trapped", "Electrons released"],
  ["Bubble memory", "No magnetic bubble", "Bubble present"],
  ["Magnetic tape or disk", "Flux direction north", "Flux direction south"],
  ["Polymer memory", "Molecule in state A", "Molecule in state B"],
  ["Read-only compact disc", "No pit", "Pit"],
  ["Rewritable compact disc", "Dye in crystalline state", "Dye in non-crystalline state"]
];

function initialiseVoltageExplorer() {
  const slider = document.getElementById("voltage");
  const valueNode = document.getElementById("voltage-value");
  const result = document.getElementById("logic-result");
  const marker = document.getElementById("voltage-marker");
  function update() {
    const voltage = Number(slider.value);
    valueNode.textContent = `${voltage.toFixed(1)} V`;
    marker.style.left = `${(voltage / 5) * 100}%`;
    if (voltage < 2) result.innerHTML = "This value falls in the example <strong>LOW / logic 0</strong> range.";
    else if (voltage > 3) result.innerHTML = "This value falls in the example <strong>HIGH / logic 1</strong> range.";
    else result.innerHTML = "This value lies in the <strong>undefined region</strong>; the circuit should not rely on it as a valid LOW or HIGH.";
  }
  slider.addEventListener("input", update);
  update();
}

function initialiseTechnologyExplorer() {
  const select = document.getElementById("technology");
  technologyStates.forEach(([name], index) => select.add(new Option(name, String(index))));
  function update() {
    const [, zero, one] = technologyStates[Number(select.value)];
    document.getElementById("state-zero").textContent = zero;
    document.getElementById("state-one").textContent = one;
  }
  select.addEventListener("change", update);
  update();
}

function initialiseByteExplorer() {
  const bits = Array(8).fill(0);
  const buttons = [...document.querySelectorAll(".byte-bit")];
  function update() {
    const binary = bits.join("");
    const decimal = parseInt(binary, 2);
    document.getElementById("byte-binary").textContent = binary;
    document.getElementById("byte-decimal").textContent = String(decimal);
    document.getElementById("byte-hex").textContent = `0x${decimal.toString(16).toUpperCase().padStart(2, "0")}`;
    buttons.forEach((button, index) => {
      button.textContent = String(bits[index]);
      button.setAttribute("aria-pressed", String(bits[index] === 1));
    });
  }
  buttons.forEach((button, index) => button.addEventListener("click", () => { bits[index] ^= 1; update(); }));
  document.getElementById("byte-clear").addEventListener("click", () => { bits.fill(0); update(); });
  document.getElementById("byte-all").addEventListener("click", () => { bits.fill(1); update(); });
  update();
}

function initialiseQuiz() {
  const form = document.getElementById("foundation-check");
  const feedback = document.getElementById("foundation-feedback");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const answers = new FormData(form);
    const expected = { q1: "discrete", q2: "two", q3: "eight" };
    const correct = Object.entries(expected).filter(([key, value]) => answers.get(key) === value).length;
    if (correct === 3) {
      feedback.textContent = "Correct. You have completed Digital Foundations.";
      feedback.className = "feedback correct";
      globalThis.SmartStartProgress?.complete("digital-values");
    } else {
      feedback.textContent = `${correct} of 3 correct. Review the sections above and try again.`;
      feedback.className = "feedback incorrect";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialiseVoltageExplorer();
  initialiseTechnologyExplorer();
  initialiseByteExplorer();
  initialiseQuiz();
});

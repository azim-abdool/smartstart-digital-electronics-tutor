"use strict";

(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const basicGate = $("#basic-gate");
  const inputX = $("#input-x");
  const inputY = $("#input-y");
  const inputYRow = $("#input-y-row");
  let x = 0;
  let y = 0;

  const gateData = {
    AND: { expression: "Z = X · Y", description: "The output is 1 only when both inputs are 1.", arity: 2, evaluate: (a, b) => a & b },
    OR: { expression: "Z = X + Y", description: "The output is 1 when either input, or both inputs, are 1.", arity: 2, evaluate: (a, b) => a | b },
    NOT: { expression: "Z = X′", description: "The output is the complement of the input.", arity: 1, evaluate: a => Number(!a) },
    NAND: { expression: "Z = (X · Y)′", description: "The output is the complement of AND; it is 0 only when both inputs are 1.", arity: 2, evaluate: (a, b) => Number(!(a & b)) },
    NOR: { expression: "Z = (X + Y)′", description: "The output is the complement of OR; it is 1 only when both inputs are 0.", arity: 2, evaluate: (a, b) => Number(!(a | b)) },
    BUFFER: { expression: "Z = X", description: "The output follows the input without inversion.", arity: 1, evaluate: a => a },
    INVERTER: { expression: "Z = X′", description: "Another name for the NOT gate; the output is the complement of the input.", arity: 1, evaluate: a => Number(!a) }
  };

  function setSwitch(button, value) {
    button.setAttribute("aria-checked", String(Boolean(value)));
    button.querySelector("span").textContent = String(value);
  }

  function toggleSwitch(button, key) {
    if (button.disabled) return;
    if (key === "x") x = Number(!x);
    if (key === "y") y = Number(!y);
    setSwitch(inputX, x);
    setSwitch(inputY, y);
    updateBasicExplorer();
  }

  inputX.addEventListener("click", () => toggleSwitch(inputX, "x"));
  inputY.addEventListener("click", () => toggleSwitch(inputY, "y"));
  basicGate.addEventListener("change", updateBasicExplorer);

  function truthRows(type) {
    const data = gateData[type];
    if (data.arity === 1) return [[0, data.evaluate(0)], [1, data.evaluate(1)]];
    return [[0,0],[0,1],[1,0],[1,1]].map(([a,b]) => [a,b,data.evaluate(a,b)]);
  }

  function updateBasicExplorer() {
    const type = basicGate.value;
    const data = gateData[type];
    const output = data.evaluate(x, y);
    const unary = data.arity === 1;

    inputY.disabled = unary;
    inputYRow.classList.toggle("disabled", unary);
    $(".signal-y").hidden = unary;

    ["AND", "OR", "NOT"].forEach(name => $("#shape-" + name.toLowerCase()).hidden = name !== type);
    $("#basic-expression").textContent = data.expression;
    $("#gate-name").textContent = `${type} gate`;
    $("#basic-result").textContent = unary ? `${type} ${x} gives ${output}.` : `${x} ${type} ${y} gives ${output}.`;

    $(".signal-x").classList.toggle("active", Boolean(x));
    $(".signal-y").classList.toggle("active", Boolean(y));
    $(".output-signal").classList.toggle("active", Boolean(output));

    const body = $("#basic-table-body");
    const rows = truthRows(type);
    $("#basic-caption").textContent = `${type} gate truth table`;
    $("#basic-y-head").hidden = unary;
    body.innerHTML = rows.map(row => {
      const current = unary ? row[0] === x : row[0] === x && row[1] === y;
      return unary
        ? `<tr class="${current ? "current" : ""}"><td>${row[0]}</td><td hidden></td><td>${row[1]}</td></tr>`
        : `<tr class="${current ? "current" : ""}"><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`;
    }).join("");
  }

  const familyGate = $("#family-gate");
  familyGate.addEventListener("change", updateFamily);

  function symbolMarkup(type) {
    const bubble = '<circle cx="372" cy="150" r="18"></circle>';
    if (type === "AND" || type === "NAND") {
      return `<path d="M165 55 H235 C315 55 350 92 350 150 C350 208 315 245 235 245 H165 Z"></path>${type === "NAND" ? bubble : ""}`;
    }
    if (type === "OR" || type === "NOR") {
      return `<path d="M160 55 Q220 150 160 245 Q285 245 350 150 Q285 55 160 55 Z"></path><path d="M160 55 Q220 150 160 245" fill="none"></path>${type === "NOR" ? bubble : ""}`;
    }
    if (type === "BUFFER" || type === "INVERTER") {
      return `<path d="M175 55 L350 150 L175 245 Z"></path>${type === "INVERTER" ? bubble : ""}`;
    }
    return "";
  }

  function updateFamily() {
    const type = familyGate.value;
    const data = gateData[type];
    $("#family-title").textContent = `${type.charAt(0)}${type.slice(1).toLowerCase()} gate`;
    $("#family-description").textContent = data.description;
    $("#family-formula").textContent = data.expression;
    $("#family-shape").innerHTML = symbolMarkup(type);
    $$(".family-input-b").forEach(node => node.style.display = data.arity === 1 ? "none" : "");
    $(".family-output").setAttribute("x1", (type === "NAND" || type === "NOR" || type === "INVERTER") ? "390" : "350");
  }

  const practice = $("#truth-practice");
  const practiceSelects = $$("#truth-practice select[data-answer]");
  const feedback = $("#practice-feedback");

  practice.addEventListener("submit", event => {
    event.preventDefault();
    let answered = 0;
    let correct = 0;
    practiceSelects.forEach(select => {
      select.classList.remove("correct", "incorrect");
      if (select.value !== "") answered += 1;
      const isCorrect = select.value === select.dataset.answer;
      if (isCorrect) {
        correct += 1;
        select.classList.add("correct");
      } else if (select.value !== "") {
        select.classList.add("incorrect");
      }
    });

    if (answered < practiceSelects.length) {
      feedback.className = "feedback incorrect";
      feedback.textContent = `You have completed ${answered} of ${practiceSelects.length} outputs. Fill in every row before checking.`;
      return;
    }
    if (correct === practiceSelects.length) {
      feedback.className = "feedback correct";
      feedback.textContent = "All three truth tables are correct. Logic Gates and Truth Tables is complete.";
      globalThis.SmartStartProgress?.complete("logic-gates");
    } else {
      feedback.className = "feedback incorrect";
      feedback.textContent = `${correct} of ${practiceSelects.length} outputs are correct. Revisit the highlighted selections and try again.`;
    }
  });

  $("#clear-practice").addEventListener("click", () => {
    practiceSelects.forEach(select => { select.value = ""; select.classList.remove("correct", "incorrect"); });
    feedback.className = "feedback";
    feedback.textContent = "Complete all ten outputs, then check your work.";
  });

  setSwitch(inputX, x);
  setSwitch(inputY, y);
  updateBasicExplorer();
  updateFamily();
})();

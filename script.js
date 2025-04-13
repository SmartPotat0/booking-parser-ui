let iata = {}, tkp = {}, statuses = {};

async function loadData() {
  iata = await fetch("iata.json").then(r => r.json());
  tkp = await fetch("tkp.json").then(r => r.json());
  statuses = await fetch("statuses.json").then(r => r.json());
}

function resolveCity(code) {
  return iata[code] || tkp[code] || code;
}

function resolveStatus(code) {
  return statuses[code] || "";
}

function convertBooking() {
  const input = document.getElementById("input-booking").value.trim();
  const codes = input.match(/[A-ZА-ЯЁ]{3}/g) || [];
  const resolved = codes.map(code => resolveCity(code));
  document.getElementById("output-booking").textContent = resolved.join(" → ");
}

function convertSystem() {
  const input = document.getElementById("input-system").value.trim();
  const parts = input.split("\n").map(line => {
    const codes = line.match(/[A-ZА-ЯЁ]{6}|[A-ZА-ЯЁ]{3}\s+[A-ZА-ЯЁ]{3}/g);
    let from = "", to = "";
    if (codes && codes[0]) {
      const clean = codes[0].replace(/\s+/g, "");
      from = clean.slice(0, 3);
      to = clean.slice(3, 6);
    }
    const time = line.match(/\d{4}\s+\d{4}/g);
    const stat = Object.keys(statuses).find(s => line.includes(s));
    let result = `${resolveCity(from)} — ${resolveCity(to)}`;
    if (time) result += " " + time[0].replace(/(\d{2})(\d{2})/, "$1:$2");
    if (stat) result += " — " + resolveStatus(stat);
    return result;
  });
  document.getElementById("output-system").textContent = parts.join("\n");
}

function copyResult(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
}
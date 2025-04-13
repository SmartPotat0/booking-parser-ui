let iataDict = {};
let tkpDict = {};
let statusDict = {};

async function loadData() {
  iataDict = await fetch("iata.json").then(r => r.json());
  tkpDict = await fetch("tkp.json").then(r => r.json());
  statusDict = await fetch("statuses.json").then(r => r.json());
}

function getCity(code) {
  return iataDict[code] || tkpDict[code] || code;
}

function getStatus(code) {
  return statusDict[code] || "";
}

function formatTime(time) {
  return time.slice(0,2) + ":" + time.slice(2);
}

function parseLine(line) {
  const months = {
    "ЯНВ": "01", "ФЕВ": "02", "МАР": "03", "АПР": "04",
    "МАЙ": "05", "ИЮН": "06", "ИЮЛ": "07", "АВГ": "08",
    "СЕН": "09", "ОКТ": "10", "НОЯ": "11", "ДЕК": "12"
  };

  const regexes = [
    /([A-ZА-Я]{2})[- ]?(\d{3,4})\s+[A-ZА-Я]\s+(\d{2})([А-Я]{3})(\d{2})\s+([A-ZА-Я]{3})\s+([A-ZА-Я]{3})\s+([A-ZА-Я0-9]{2,4})\s+(\d{4})\s+(\d{4})/,
    /([A-ZА-Я0-9-]{5,7})\s+[A-ZА-Я]\s+(\d{2})([А-Я]{3})(\d{2})\s+([А-ZА-Я]{6})\s+([A-ZА-Я0-9]{2,4})\s+(\d{4})\s+(\d{4})/
  ];

  for (const r of regexes) {
    const m = line.match(r);
    if (m) {
      if (m.length === 11) {
        const [_, air, num, day, mon, yy, from, to, status, dep, arr] = m;
        const code = air + "-" + num;
        const date = `${day}.${months[mon]}20${yy}`;
        const fromCity = getCity(from);
        const toCity = getCity(to);
        const statusText = getStatus(status);
        let result = `${code} ${date}, ${fromCity} ${formatTime(dep)} — ${toCity} ${formatTime(arr)}`;
        if (statusText) result += ` — ${statusText}`;
        return result;
      } else if (m.length === 9) {
        const [_, code, day, mon, yy, both, status, dep, arr] = m;
        const from = both.slice(0, 3);
        const to = both.slice(3, 6);
        const date = `${day}.${months[mon]}20${yy}`;
        const fromCity = getCity(from);
        const toCity = getCity(to);
        const statusText = getStatus(status);
        let result = `${code} ${date}, ${fromCity} ${formatTime(dep)} — ${toCity} ${formatTime(arr)}`;
        if (statusText) result += ` — ${statusText}`;
        return result;
      }
    }
  }
  return "⚠️ Не удалось распознать: " + line;
}

async function transform() {
  await loadData();
  const input = document.getElementById("input").value.trim();
  const lines = input.split("\n");
  const output = lines.map(parseLine);
  document.getElementById("output").textContent = output.join("\n");
}

function copyToClipboard() {
  navigator.clipboard.writeText(document.getElementById("output").textContent);
}
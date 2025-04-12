async function transform() {
  const input = document.getElementById("input").value.trim();
  const response = await fetch("airports.json");
  const dict = await response.json();

  const iataDict = dict.iata;
  const tkpDict = dict.tkp;

  const lines = input.split("\n");
  const output = [];

  for (const line of lines) {
    const match = line.match(/([A-ZА-Я0-9\-]+)\s+[A-ZА-Я]\s+(\d{2})([А-Я]{3})(\d{2})\s+([А-Я]{3})([А-Я]{3})\s+\S+\s+(\d{4})\s+(\d{4})/u);
    if (!match) {
      output.push("⚠️ Не удалось разобрать: " + line);
      continue;
    }

    const [_, flight, day, mon, year, from, to, dep, arr] = match;
    const months = {
      "ЯНВ": "01", "ФЕВ": "02", "МАР": "03", "АПР": "04",
      "МАЙ": "05", "ИЮН": "06", "ИЮЛ": "07", "АВГ": "08",
      "СЕН": "09", "ОКТ": "10", "НОЯ": "11", "ДЕК": "12"
    };

    const date = `${day}.${months[mon]}20${year}`;
    const fromCity = iataDict[from] || from;
    const toCity = iataDict[to] || to;
    const fromTKP = tkpDict[fromCity] || from;
    const toTKP = tkpDict[toCity] || to;
    const depTime = dep.slice(0,2) + ":" + dep.slice(2);
    const arrTime = arr.slice(0,2) + ":" + arr.slice(2);

    output.push(`${flight} ${date}, ${fromCity} ${fromTKP} (${from}) ${depTime} — ${toCity} ${toTKP} (${to}) ${arrTime}`);
  }

  document.getElementById("output").textContent = output.join("\n");
}

function copyToClipboard() {
  const text = document.getElementById("output").textContent;
  navigator.clipboard.writeText(text);
}
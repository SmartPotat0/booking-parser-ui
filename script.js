
async function convert() {
  const input = document.getElementById('inputText').value;
  const response = await fetch('airports.json');
  const dict = await response.json();

  const lines = input.trim().split('\n');
  const segments = [];

  for (const line of lines) {
    const regex = /(\w{2}-\d{3})\s+[A-ZА-Я]\s+(\d{2})([А-Я]{3})(\d{2})\s+(\w{3})(\w{3})\s+\w+\s+(\d{4})\s+(\d{4})/u;
    const match = regex.exec(line);
    if (!match) continue;

    const [, flight, day, mon, year, from, to, dep, arr] = match;
    const months = {
      "ЯНВ": "01", "ФЕВ": "02", "МАР": "03", "АПР": "04", "МАЙ": "05", "ИЮН": "06",
      "ИЮЛ": "07", "АВГ": "08", "СЕН": "09", "ОКТ": "10", "НОЯ": "11", "ДЕК": "12"
    };
    const date = `${day}.${months[mon]}.${20 + parseInt(year)}`;
    const fromCity = dict[from] || from;
    const toCity = dict[to] || to;
    const depTime = dep.slice(0,2) + ":" + dep.slice(2);
    const arrTime = arr.slice(0,2) + ":" + arr.slice(2);

    segments.push(`${flight} ${date}, ${fromCity} ${from} ${depTime} — ${toCity} ${to} ${arrTime};`);
  }

  document.getElementById('output').innerText = segments.join('\n');
}

function copyOutput() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text);
}

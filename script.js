let iataData = {};

fetch('iata.json')
  .then(res => res.json())
  .then(data => { iataData = data; });

function parseDate(dateStr) {
  const months = {
    'ЯНВ': '01', 'ФЕВ': '02', 'МАР': '03', 'АПР': '04',
    'МАЙ': '05', 'ИЮН': '06', 'ИЮЛ': '07', 'АВГ': '08',
    'СЕН': '09', 'ОКТ': '10', 'НОЯ': '11', 'ДЕК': '12'
  };
  const match = dateStr.match(/(\d{2})([А-Я]{3})(\d{2})/);
  if (!match) return dateStr;
  const [, day, mon, yy] = match;
  return `${day}.${months[mon] || mon}.20${yy}`;
}

document.getElementById("convert-btn").onclick = () => {
  const input = document.getElementById("input").value;
  const lines = input.split("\n").map(line => line.trim()).filter(Boolean);
  const output = lines.map(line => {
    try {
      const parts = line.split(/\s+/);
      const flight = parts[0];
      const date = parseDate(parts[2]);
      const route = parts[3];
      const depCode = route.substring(0, 3);
      const arrCode = route.substring(3, 6);
      const timeDep = parts[5].replace(/(\d{2})(\d{2})/, "$1:$2");
      const timeArr = parts[6].replace(/(\d{2})(\d{2})/, "$1:$2");

      const depCity = iataData[depCode]?.city_ru || depCode;
      const arrCity = iataData[arrCode]?.city_ru || arrCode;

      return `${flight} ${date}, ${depCity} ${depCode} ${timeDep} — ${arrCity} ${arrCode} ${timeArr};`;
    } catch {
      return "⚠️ Ошибка разбора строки.";
    }
  });
  document.getElementById("output").textContent = output.join("\n");
};

document.getElementById("copy-btn").onclick = () => {
  const output = document.getElementById("output").textContent;
  if (!output) return;
  navigator.clipboard.writeText(output);
  const copyStatus = document.getElementById("copy-status");
  copyStatus.textContent = "✓ Скопировано!";
  setTimeout(() => (copyStatus.textContent = ""), 2000);
};
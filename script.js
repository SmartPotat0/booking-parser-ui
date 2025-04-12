
import airports from "./airports.json" assert { type: "json" };

function getCity(iata) {
    return airports[iata] || iata;
}

function parseSegment(segment) {
    const regex = /([A-ZА-Я0-9]+)[\s]+([0-9]{2})([А-Я]{3})([0-9]{2})[\s]+([А-Я]{3})([А-Я]{3})[\s]+[A-Z0-9]+[\s]+([0-9]{4})[\s]+([0-9]{4})/u;
    const match = segment.match(regex);
    if (!match) return null;

    const [_, flight, day, mon, year, from, to, dep, arr] = match;
    const monthMap = {
        "ЯНВ": "01", "ФЕВ": "02", "МАР": "03", "АПР": "04", "МАЙ": "05", "ИЮН": "06",
        "ИЮЛ": "07", "АВГ": "08", "СЕН": "09", "ОКТ": "10", "НОЯ": "11", "ДЕК": "12"
    };
    const date = `${day}.${monthMap[mon]}20${year}`;
    return `${flight} ${date}, ${getCity(from)} ${from} ${dep.slice(0,2)}:${dep.slice(2)} — ${getCity(to)} ${to} ${arr.slice(0,2)}:${arr.slice(2)};`;
}

function transform() {
    const input = document.getElementById("input").value;
    const lines = input.trim().split("\n");
    const results = lines.map(parseSegment).filter(Boolean);
    document.getElementById("output").textContent = results.join("\n");
}

function copyToClipboard() {
    const text = document.getElementById("output").textContent;
    navigator.clipboard.writeText(text);
}

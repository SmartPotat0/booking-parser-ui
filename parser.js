// parser.js

// Справочник месяцев
const MONTHS = {
  'ЯНВ': '01', 'ФЕВ': '02', 'МАР': '03', 'АПР': '04', 'МАЙ': '05', 'ИЮН': '06',
  'ИЮЛ': '07', 'АВГ': '08', 'СЕН': '09', 'ОКТ': '10', 'НОЯ': '11', 'ДЕК': '12'
};

// Хранилище справочников (загружаются один раз)
let airportCodes = {};

fetch('airport_codes.json')
  .then(res => res.json())
  .then(data => airportCodes = data);

function convertBooking() {
  const input = document.getElementById('bookingInput').value.trim();
  const resultArea = document.getElementById('bookingResult');

  try {
    const tokens = input.split(/\s+/);

    // Определение номера рейса
    let flightRaw = tokens[0];
    let flightNumber = '';
    if (/^[A-ZА-Я]{2}\d{3,4}$/i.test(flightRaw)) {
      flightNumber = flightRaw.slice(0, 2) + '-' + flightRaw.slice(2);
    } else if (/^[A-ZА-Я]{2}-\d{3,4}$/i.test(flightRaw)) {
      flightNumber = flightRaw;
    } else if (/^[A-ZА-Я]{2}$/.test(flightRaw) && /^\d{3,4}$/.test(tokens[1])) {
      flightNumber = flightRaw + '-' + tokens[1];
      tokens.splice(1, 1); // удалим номер из массива
    } else {
      throw new Error('Не удалось определить номер рейса');
    }

    // Определение даты
    const dateToken = tokens[2];
    const day = dateToken.slice(0, 2);
    const mon = dateToken.slice(2, 5).toUpperCase();
    const year = '20' + dateToken.slice(5);
    const formattedDate = `${day}.${MONTHS[mon]}.${year}`;

    // Определение кодов аэропортов (3 или 4 элемент)
    const rawCodes = tokens[3].length > 6 ? tokens[3].match(/.{1,3}/g) : tokens[3].split(/(?<=\G.{3})/);
    const [depCode, arrCode] = rawCodes;

    const depData = airportCodes[depCode] || { city: depCode, iata: '' };
    const arrData = airportCodes[arrCode] || { city: arrCode, iata: '' };

    // Время
    const timeFrom = tokens[tokens.length - 2];
    const timeTo = tokens[tokens.length - 1];
    const formattedTimeFrom = timeFrom.slice(0, 2) + ':' + timeFrom.slice(2);
    const formattedTimeTo = timeTo.slice(0, 2) + ':' + timeTo.slice(2);

    const result = `${flightNumber} ${formattedDate}, ${depData.city} ${depData.iata} ${formattedTimeFrom} — ${arrData.city} ${arrData.iata} ${formattedTimeTo}`;
    resultArea.value = result.trim();

  } catch (e) {
    resultArea.value = 'Ошибка: ' + e.message;
  }
}
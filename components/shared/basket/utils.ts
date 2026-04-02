export const daysWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "день";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "дня";
  }

  return "дней";
};
const WEEKDAY_LABELS = ["Вс", "Пнд", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTH_LABELS = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

const formatDateLabel = (date: Date) => {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const month = MONTH_LABELS[date.getMonth()];
  return `${weekday}.${date.getDate()}.${month}`;
};

export const formatDeliveryDay = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return value;
  return formatDateLabel(date);
};

export const formatDeliveryDate = (value?: Date | null) => {
  if (!value) return "";
  if (Number.isNaN(value.getTime())) return "";
  return formatDateLabel(value);
};

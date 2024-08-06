const colorsForFrontImages = [
  "#FF5733", // Оранжевий
  "#33FF57", // Зелений
  "#3357FF", // Синій
  "#F3FF33", // Жовтий
  "#FF33A6", // Рожевий
  "#33F9FF", // Бірюзовий
  "#F6FF33", // Лимонний
  "#FF6F33", // Персиковий
  "#33FFEC", // М'ятний
  "#FF33C4", // Малиновий
  "#8A33FF", // Фіолетовий
  "#33FF5B", // Лаймовий
];

// Отримуємо 6 кольорів
const firstSixColors = colorsForFrontImages.slice(0, 6);

// Дублюємо перші 6 кольорів і отримуємо 12 карт
const twelveCards = [...firstSixColors, ...firstSixColors];

// Отримуємо 9 кольорів
const firstNineColors = colorsForFrontImages.slice(0, 9);

// Дублюємо перші 9 кольорів і отримуємо 18 карт
const eighteenCards = [...firstNineColors, ...firstNineColors];

// Отримуємо 12 кольорів
const firstTwelveColors = colorsForFrontImages.slice(0, 12);

// Дублюємо перші 12 кольорів і отримуємо 24 карт
const twentyFourCards = [...firstTwelveColors, ...firstTwelveColors];

export { twelveCards, eighteenCards, twentyFourCards };

import type { QuizIconKey } from "@/components/quiz/quiz-icons";

export const UNDECIDED = "Поки не визначився (-лась)";

export type QuizOption = {
  value: string;
  icon?: QuizIconKey;
  /** Шлях до картинки в `public/`, напр. "/assets/body-sedan.png". Замінює іконку. */
  image?: string;
};

export type QuizStep = {
  id: string;
  question: string;
  hint?: string;
  layout: "cards" | "compact";
  options: QuizOption[];
};

/** Короткі підписи відповідей для адмінки */
export const answerLabels: Record<string, string> = {
  body_type: "Кузов",
  fuel_type: "Паливо",
  year: "Рік",
  budget: "Бюджет",
  region: "Регіон",
};

export const quizSteps: QuizStep[] = [
  {
    id: "body_type",
    question: "Який тип кузова вам потрібен?",
    hint: "Можна вибрати кілька варіантів",
    layout: "cards",
    options: [
      { value: "Седан", icon: "sedan" },
      { value: "Хетчбек", icon: "hatchback" },
      { value: "Універсал", icon: "wagon" },
      { value: "Кросовер", icon: "crossover" },
      { value: "Позашляховик", icon: "suv" },
      { value: "Мінівен", icon: "minivan" },
      { value: UNDECIDED, icon: "question" },
    ],
  },
  {
    id: "fuel_type",
    question: "Тип палива",
    hint: "Можна вибрати кілька варіантів",
    layout: "cards",
    options: [
      { value: "Бензин", icon: "petrol" },
      { value: "Дизель", icon: "diesel" },
      { value: "Газ", icon: "gas" },
      { value: "Гібрид", icon: "hybrid" },
      { value: "Електро", icon: "electric" },
      { value: UNDECIDED, icon: "question" },
    ],
  },
  {
    id: "year",
    question: "Рік випуску авто",
    layout: "compact",
    options: [
      { value: "до 2012 р." },
      { value: "2012 – 2015 р." },
      { value: "2015 – 2018 р." },
      { value: "2018 – 2020 р." },
      { value: "2020 – 2026 р." },
      { value: UNDECIDED },
    ],
  },
  {
    id: "budget",
    question: "Бюджет на покупку авто",
    hint: "Ціна «під ключ», з доставкою та розмитненням",
    layout: "compact",
    options: [
      { value: "до 9 000 $" },
      { value: "9 000 – 12 000 $" },
      { value: "12 000 – 15 000 $" },
      { value: "15 000 – 20 000 $" },
      { value: "20 000 – 30 000 $" },
      { value: "30 000 $ і більше" },
    ],
  },
  {
    id: "region",
    question: "Звідки шукати авто?",
    layout: "compact",
    options: [
      { value: "США" },
      { value: "Європа" },
      { value: "Без різниці — головне ціна" },
    ],
  },
];

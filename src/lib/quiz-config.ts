import type { QuizIconKey } from "@/components/quiz/quiz-icons";

export const UNDECIDED = "Поки не визначився (-лась)";

export const POPULAR_BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Toyota",
  "Volkswagen",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Lexus",
  "Tesla",
  "Jeep",
  "Volvo",
  "Porsche",
  "Chevrolet",
] as const;

export const BUDGET_PRESETS = [
  "до 7 000 $",
  "7 000 – 12 000 $",
  "12 000 – 18 000 $",
  "18 000 – 25 000 $",
  "25 000 – 35 000 $",
  "35 000 $ і більше",
] as const;

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
  layout: "cards" | "compact" | "budget" | "car_wish";
  options: QuizOption[];
};

/** Короткі підписи відповідей для адмінки */
export const answerLabels: Record<string, string> = {
  body_type: "Кузов",
  fuel_type: "Паливо",
  year: "Рік",
  budget: "Бюджет",
  brand: "Марка",
  car_wish: "Побажання",
};

export const quizSteps: QuizStep[] = [
  {
    id: "body_type",
    question: "Який тип кузова вам потрібен?",
    hint: "Можна вибрати кілька варіантів",
    layout: "cards",
    options: [
      {
        value: "Седан",
        icon: "sedan",
        image: "/assets/Sedan-Transparent.png",
      },
      {
        value: "Хетчбек",
        icon: "hatchback",
        image:
          "/assets/sleek-white-hatchback-car-with-aerodynamic-design-isolated-against-a-transparent-digital-space-png.webp",
      },
      {
        value: "Універсал",
        icon: "wagon",
        image: "/assets/2025_BMW_M5_Touring_Main.png",
      },
      {
        value: "Кросовер",
        icon: "crossover",
        image:
          "/assets/transparent_exterior-studioProportional-left_A88CF61A9CF10EC9ADFA890FFBD2F2920B6C06E2.avif",
      },
      {
        value: "Позашляховик",
        icon: "suv",
        image: "/assets/land-cruiser-on-transparent-background-free-png.webp",
      },
      {
        value: "Мінівен",
        icon: "minivan",
        image:
          "/assets/minivan-black-car-3d-isolated-on-transparent-background_11130232.png",
      },
      { value: UNDECIDED, icon: "question", image: "/assets/punctuation-marks.png" },
    ],
  },
  {
    id: "fuel_type",
    question: "Тип палива",
    hint: "Можна вибрати кілька варіантів",
    layout: "cards",
    options: [
      { value: "Бензин", icon: "petrol", image: "/assets/fuel-pump.png" },
      { value: "Газ", icon: "gas", image: "/assets/natural-gas.png" },
      {
        value: "Гібрид",
        icon: "hybrid",
        image: "/assets/fuel.png",
      },
      { value: "Електро", icon: "electric", image: "/assets/electro-fuel.png" },
      { value: UNDECIDED, icon: "question", image: "/assets/punctuation-marks.png" },
    ],
  },
  {
    id: "year",
    question: "Рік випуску авто",
    layout: "compact",
    options: [
      { value: "2015 – 2018 р." },
      { value: "2019 – 2021 р." },
      { value: "2022 – 2024 р." },
      { value: "2025 – 2026 р." },
      { value: UNDECIDED },
    ],
  },
  {
    id: "budget",
    question: "Бюджет на покупку авто",
    hint: "Ціна «під ключ», з доставкою та розмитненням. Оберіть варіант або вкажіть свій.",
    layout: "budget",
    options: [],
  },
  {
    id: "car_wish",
    question: "Яка марка або побажання по авто?",
    hint: "Обов’язково — оберіть марку або опишіть, яке авто шукаєте",
    layout: "car_wish",
    options: [],
  },
];

export const MIN_BUDGET_USD = 7000;

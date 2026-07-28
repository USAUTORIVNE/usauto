type CarShape = {
  /** Профіль кузова: від заднього бампера до переднього. */
  body: string;
  wheelRadius: number;
  wheelY: number;
  wheels: [number, number];
};

const cars: Record<string, CarShape> = {
  sedan: {
    body: "M6 36V29h20l7-11h20l7 11h24V36",
    wheelRadius: 6,
    wheelY: 36,
    wheels: [26, 70],
  },
  hatchback: {
    body: "M16 36V30l9-12h24l8 12h23V36",
    wheelRadius: 6,
    wheelY: 36,
    wheels: [30, 71],
  },
  wagon: {
    body: "M6 36V18h44l8 11h26V36",
    wheelRadius: 6,
    wheelY: 36,
    wheels: [24, 72],
  },
  crossover: {
    body: "M8 33V26l12-10h22l9 10h25V33",
    wheelRadius: 8,
    wheelY: 34,
    wheels: [26, 70],
  },
  suv: {
    body: "M12 32V15h38l9 10h23V32",
    wheelRadius: 9,
    wheelY: 33,
    wheels: [30, 70],
  },
  minivan: {
    body: "M8 34V16h44l14 12h6V34",
    wheelRadius: 6.5,
    wheelY: 34,
    wheels: [24, 66],
  },
};

function CarIcon({ shape }: { shape: CarShape }) {
  return (
    <svg
      viewBox="0 0 96 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={shape.body} />
      {shape.wheels.map((cx) => (
        <circle key={cx} cx={cx} cy={shape.wheelY} r={shape.wheelRadius} />
      ))}
    </svg>
  );
}

function GlyphIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const iconSet = {
  sedan: <CarIcon shape={cars.sedan} />,
  hatchback: <CarIcon shape={cars.hatchback} />,
  wagon: <CarIcon shape={cars.wagon} />,
  crossover: <CarIcon shape={cars.crossover} />,
  suv: <CarIcon shape={cars.suv} />,
  minivan: <CarIcon shape={cars.minivan} />,
  petrol: (
    <GlyphIcon>
      <path d="M11 34V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v25" />
      <path d="M11 17h12" />
      <path d="M23 13h4l4 5v11a3 3 0 0 0 6 0V22" />
      <path d="M8 34h19" />
    </GlyphIcon>
  ),
  diesel: (
    <GlyphIcon>
      <path d="M20 6c5.5 7.5 9.5 11 9.5 16.5a9.5 9.5 0 0 1-19 0C10.5 17 14.5 13.5 20 6Z" />
      <path d="M16 21v7h3.5c3 0 4.5-1.4 4.5-3.5S22.5 21 19.5 21H16Z" />
    </GlyphIcon>
  ),
  gas: (
    <GlyphIcon>
      <path d="M15 12h10a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" />
      <path d="M18 12V7h4v5" />
      <path d="M11 21h18" />
    </GlyphIcon>
  ),
  hybrid: (
    <GlyphIcon>
      <path d="M20 5c5.8 8 10 11.6 10 17.4A10 10 0 0 1 10 22.4C10 16.6 14.2 13 20 5Z" />
      <path d="M21 15l-5 8h4l-1 7 6-9h-4l1-6Z" />
    </GlyphIcon>
  ),
  electric: (
    <GlyphIcon>
      <path d="M22 5 12 22h7l-2 13 12-19h-8l1-11Z" />
    </GlyphIcon>
  ),
  question: (
    <GlyphIcon>
      <circle cx="20" cy="20" r="14" />
      <path d="M15.5 16a4.5 4.5 0 0 1 9 .3c0 3-4.5 3.6-4.5 7.2" />
      <path d="M20 28.5v.2" />
    </GlyphIcon>
  ),
} as const;

export type QuizIconKey = keyof typeof iconSet;

export function QuizIcon({ name }: { name: QuizIconKey }) {
  return iconSet[name];
}

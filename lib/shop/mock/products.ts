import type { AdvantProductRaw } from "@/lib/validation/api";

type Badge = "hit" | "new" | "sale";
type Kind = "single" | "bundle";
type Fulfillment = "inflated" | "flat" | "pickup_only";
type Offer = AdvantProductRaw["offers"][number];

const COLORS = ["Белый", "Розовый", "Голубой", "Золотой", "Красный"] as const;
const SIZES = ["S", "M", "L"] as const;

type MakeInput = {
  slug: string;
  title: string;
  categoryId: string;
  basePrice: number;
  oldPrice?: number;
  kind?: Kind;
  fulfillment?: Fulfillment;
  badges?: Badge[];
  povod?: string[];
  color?: string[];
  size?: string[];
  withVariants?: boolean;
};

let seq = 0;

/** Фабрика мок-товара в «сырой» форме AdvantShop. */
function make(input: MakeInput): AdvantProductRaw {
  seq += 1;
  const id = `p-${String(seq).padStart(3, "0")}`;
  const kind = input.kind ?? "single";
  const fulfillment = input.fulfillment ?? "inflated";
  const withVariants = input.withVariants ?? kind === "single";

  const offers: Offer[] = withVariants
    ? COLORS.flatMap((c) =>
        SIZES.map((s, i) => ({
          id: `${id}-${c}-${s}`,
          price: input.basePrice + i * 200,
          amount: 25,
          selectedOptions: [
            { name: "Цвет", value: c },
            { name: "Размер", value: s },
          ],
        })),
      )
    : [
        {
          id: `${id}-default`,
          price: input.basePrice,
          amount: 25,
          selectedOptions: [],
        },
      ];

  return {
    id,
    url: input.slug,
    name: input.title,
    description: `${input.title} — праздничное оформление от Sharoduwi. Доставка в день заказа по юго-востоку МО.`,
    parentCategoryId: input.categoryId,
    pictures: [`/mock/${input.slug}-1.jpg`, `/mock/${input.slug}-2.jpg`],
    price: input.basePrice,
    ...(input.oldPrice !== undefined ? { oldPrice: input.oldPrice } : {}),
    offers,
    badges: input.badges ?? [],
    productKind: kind,
    fulfillment,
    facets: {
      povod: input.povod ?? [],
      color: input.color ?? ["Белый"],
      size: input.size ?? ["M"],
    },
  };
}

/** Мок-товары (фаза 1) в «сырой» форме: ~30 позиций по 3 категориям. */
export const mockProducts: AdvantProductRaw[] = [
  // — Гелиевые шары (single, inflated) —
  make({ slug: "shar-serdce-krasnoe", title: "Шар «Сердце» красное", categoryId: "cat-balloons", basePrice: 290, badges: ["hit"], povod: ["lyubov", "den-rozhdeniya"], color: ["Красный"], size: ["M"] }),
  make({ slug: "shar-zvezda-zolotaya", title: "Шар «Звезда» золотая", categoryId: "cat-balloons", basePrice: 320, povod: ["den-rozhdeniya"], color: ["Золотой"], size: ["M"] }),
  make({ slug: "shar-cifra-1", title: "Шар-цифра «1»", categoryId: "cat-balloons", basePrice: 690, badges: ["hit"], povod: ["den-rozhdeniya"], color: ["Золотой", "Розовый"], size: ["L"] }),
  make({ slug: "shar-oblako-pastel", title: "Облако из шаров пастель", categoryId: "cat-balloons", basePrice: 1490, oldPrice: 1790, badges: ["sale"], povod: ["vypiska"], color: ["Розовый", "Голубой"], size: ["L"] }),
  make({ slug: "shar-latex-belyy", title: "Латексные шары белые (10 шт)", categoryId: "cat-balloons", basePrice: 450, color: ["Белый"], size: ["S"] }),
  make({ slug: "shar-bukvy-love", title: "Фольга «LOVE»", categoryId: "cat-balloons", basePrice: 990, povod: ["svadba", "lyubov"], color: ["Золотой"], size: ["L"] }),
  make({ slug: "shar-edinorog", title: "Шар «Единорог»", categoryId: "cat-balloons", basePrice: 540, badges: ["new"], povod: ["den-rozhdeniya"], color: ["Розовый"], size: ["M"] }),
  make({ slug: "shar-konfetti", title: "Шары с конфетти (5 шт)", categoryId: "cat-balloons", basePrice: 620, povod: ["den-rozhdeniya", "gender-party"], color: ["Розовый", "Голубой"], size: ["M"] }),
  make({ slug: "shar-bukvy-name", title: "Имя из фольги (буква)", categoryId: "cat-balloons", basePrice: 350, color: ["Золотой", "Розовый"], size: ["M"] }),
  make({ slug: "shar-mishka", title: "Ходячая фигура «Мишка»", categoryId: "cat-balloons", basePrice: 1290, badges: ["new"], povod: ["vypiska", "rozhdenie"], color: ["Голубой"], size: ["L"] }),
  make({ slug: "shar-zvezdy-nabor", title: "Звёзды металлик (7 шт)", categoryId: "cat-balloons", basePrice: 560, color: ["Золотой"], size: ["S"] }),
  make({ slug: "shar-bday-set", title: "Набор шаров «С днём рождения»", categoryId: "cat-balloons", basePrice: 880, povod: ["den-rozhdeniya"], color: ["Красный", "Золотой"], size: ["M"] }),

  // — Готовые наборы (bundle, inflated, конфигуратор свёрнут) —
  make({ slug: "nabor-vypiska-malchik", title: "Набор «Выписка — мальчик»", categoryId: "cat-bundles", basePrice: 3490, badges: ["hit"], kind: "bundle", withVariants: false, povod: ["vypiska", "rozhdenie"], color: ["Голубой"], size: ["L"] }),
  make({ slug: "nabor-vypiska-devochka", title: "Набор «Выписка — девочка»", categoryId: "cat-bundles", basePrice: 3490, badges: ["hit"], kind: "bundle", withVariants: false, povod: ["vypiska", "rozhdenie"], color: ["Розовый"], size: ["L"] }),
  make({ slug: "nabor-gender-party", title: "Набор «Гендер-пати»", categoryId: "cat-bundles", basePrice: 2990, kind: "bundle", withVariants: false, povod: ["gender-party"], color: ["Розовый", "Голубой"], size: ["L"] }),
  make({ slug: "nabor-rozhdenie", title: "Набор «С рождением!»", categoryId: "cat-bundles", basePrice: 2790, kind: "bundle", withVariants: false, povod: ["rozhdenie"], color: ["Белый", "Золотой"], size: ["L"] }),
  make({ slug: "nabor-bday-premium", title: "Набор «День рождения Premium»", categoryId: "cat-bundles", basePrice: 4290, oldPrice: 4990, badges: ["sale"], kind: "bundle", withVariants: false, povod: ["den-rozhdeniya"], color: ["Золотой"], size: ["L"] }),
  make({ slug: "nabor-romantika", title: "Набор «Романтика»", categoryId: "cat-bundles", basePrice: 2490, kind: "bundle", withVariants: false, povod: ["lyubov", "svadba"], color: ["Красный"], size: ["M"] }),
  make({ slug: "nabor-svadba", title: "Набор «Свадебный»", categoryId: "cat-bundles", basePrice: 3990, kind: "bundle", withVariants: false, povod: ["svadba"], color: ["Белый", "Золотой"], size: ["L"] }),
  make({ slug: "nabor-detskiy", title: "Набор «Детский праздник»", categoryId: "cat-bundles", basePrice: 1990, badges: ["new"], kind: "bundle", withVariants: false, povod: ["den-rozhdeniya"], color: ["Розовый", "Голубой"], size: ["M"] }),
  make({ slug: "nabor-mini", title: "Набор «Мини-сюрприз»", categoryId: "cat-bundles", basePrice: 1290, kind: "bundle", withVariants: false, povod: ["den-rozhdeniya"], color: ["Розовый"], size: ["S"] }),

  // — Пиротехника (pickup_only, age-gate) —
  make({ slug: "piro-fontan-vulkan", title: "Фонтан «Вулкан»", categoryId: "cat-pyro", basePrice: 590, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["M"] }),
  make({ slug: "piro-batareya-salyut-25", title: "Салют 25 залпов", categoryId: "cat-pyro", basePrice: 2490, badges: ["hit"], fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["L"] }),
  make({ slug: "piro-batareya-salyut-49", title: "Салют 49 залпов", categoryId: "cat-pyro", basePrice: 4990, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["L"] }),
  make({ slug: "piro-rimskie-svechi", title: "Римские свечи (набор)", categoryId: "cat-pyro", basePrice: 790, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["M"] }),
  make({ slug: "piro-petardy", title: "Петарды «Корсар»", categoryId: "cat-pyro", basePrice: 350, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["S"] }),
  make({ slug: "piro-bengalskie-ogni", title: "Бенгальские огни 30 см (5 шт)", categoryId: "cat-pyro", basePrice: 190, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["S"] }),
  make({ slug: "piro-fontan-nastolniy", title: "Настольный фонтан (3 шт)", categoryId: "cat-pyro", basePrice: 690, badges: ["new"], fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["S"] }),
  make({ slug: "piro-salyut-100", title: "Салют 100 залпов «Большой»", categoryId: "cat-pyro", basePrice: 8990, badges: ["hit"], fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Белый"], size: ["L"] }),
  make({ slug: "piro-hlopushki", title: "Хлопушки-конфетти (10 шт)", categoryId: "cat-pyro", basePrice: 290, fulfillment: "pickup_only", kind: "single", withVariants: false, color: ["Розовый", "Золотой"], size: ["S"] }),
];

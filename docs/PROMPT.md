# PROMPT — Фронтенд Sharoduwi (гелиевые шары и композиции)

> Боевая спека для Claude Code. Архитектура зафиксирована. Не предлагай альтернативы стеку — реализуй по этому документу. Если решение не описано здесь — следуй разделу «Правила, которые нельзя нарушать».

---

## 0. Контекст и цель

Фронтенд интернет-магазина праздничного декора (гелиевые шары, композиции, букеты, пиротехника, аксессуары). Большой многоуровневый каталог.

**Два режима покупки — UI обслуживает оба:**
- **Мамы 27–45 и семьи** — эмоциональный просмотр, сборка композиций, выбор по поводу и цвету. Им нужна красота, вдохновение, конфигуратор.
- **Мужчины** — покупают пиротехнику и воздушные композиции на выписку из роддома и рождение ребёнка. Покупка разовая, под дедлайн, решение быстрое. Им нужен **короткий путь к готовому набору** (2–3 клика), а не сборка с нуля.

Поэтому на сайте есть и витрина для вдохновения, и быстрый decisive-маршрут: лендинги поводов «выписка» / «рождение» с готовыми композициями + явная категория «Готовые наборы».

- **Делаем только фронтенд.** Бэкенд — AdvantShop, живёт на сабдомене, общается через REST API.
- На старте данные берём из **моков**. UI развязан от AdvantShop адаптерным слоем — переход на реальный REST не должен трогать компоненты.
- Качество — уровень Awwwards. Принцип: **бюджет «вау» концентрируется на редакционных поверхностях (главная, лендинги поводов, hero товара), а каталог/фильтры/корзина/чекаут оптимизируются под скорость.** Никогда не размазывай тяжёлую анимацию по гриду.
- Палитра сдержанная (фон + 1–2 акцента); «радугу» дают сами фото шаров, а не интерфейс.
- **Бизнес-цель — №1 по выручке в Московской агломерации.** Гелиевый шар — скоропортящийся локальный продукт с радиусом доставки в тот же день. Плацдарм — юго-восток МО (Жуковский, Раменское, Люберцы, Малаховка), радиус расширяется к Москве зона за зоной. Поэтому **зона доставки — первичный параметр опыта:** доступность товара, способ получения, ближайший слот и цена зависят от зоны пользователя.

---

## 1. Стек (зафиксировано)

| Слой | Решение |
|---|---|
| Фреймворк | Next.js 15 App Router + React Server Components |
| Язык | TypeScript, `strict: true` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` |
| Стили | Tailwind CSS v4 + shadcn/ui (примитивы) |
| Глобальный стейт | Zustand (только корзина) |
| URL-стейт | nuqs v2 (фильтры, сортировка, пагинация) |
| Анимации | Framer Motion (острова) + чистый CSS (hover/массовое) + GSAP ScrollTrigger (только редакционные) |
| WebGL | React Three Fiber + drei — **только hero главной** |
| Виртуализация | `@tanstack/react-virtual` (порог 100 карточек) |
| Карусель/галерея | `embla-carousel-react` |
| Формы | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Плавный скролл | `lenis` |
| Валидация API | `zod` на границе адаптера |
| Утилиты | `clsx` + `tailwind-merge` (`cn`), `@t3-oss/env-nextjs` |
| Изображения | `next/image` + внешний CDN-loader (Cloudinary или CDN AdvantShop) |
| Аналитика | Яндекс.Метрика |
| Пакетный менеджер | pnpm |

**Не ставить:** Jotai, Redux, Swiper, react-window, react-virtualized, styled-components.

---

## 2. Структура проекта

```
app/
  (shop)/
    page.tsx                  # главная — Server
    c/[...slug]/page.tsx      # категории, многоуровневые — Server
    product/[slug]/page.tsx   # PDP — Server
    povod/[slug]/page.tsx     # лендинги поводов — Server
    povod/[slug]/[district]/page.tsx  # повод × район, программные — Server
    search/page.tsx           # поиск — Server shell
  cart/page.tsx               # fallback корзины (deep-link/SEO)
  checkout/page.tsx           # чекаут
  api/
    order/route.ts            # mock route handler приёма заказа
  layout.tsx
  globals.css
components/
  ui/            # shadcn-примитивы (button, sheet, dialog, input...)
  layout/        # Header, Footer, MegaMenu, CartDrawer, LenisProvider, ZoneSelector
  catalog/       # ProductCard, ProductGrid, FilterPanel, ColorSwatch, SortSelect, Pagination
  product/       # Gallery, Configurator, AddToCart, RelatedProducts, StickyBuyBar
  checkout/      # CheckoutForm, SlotPicker, ZoneNotice
  home/          # HeroBalloons (R3F), RevealSection, CategoryShowcase
  motion/        # Reveal, FadeIn — обёртки Framer Motion
lib/
  shop/          # ГРАНИЦА с AdvantShop
    types.ts     # доменные типы (наши, не AdvantShop)
    api.ts       # серверные fetch-функции (getCategory, getProduct, ...)
    mappers.ts   # AdvantShop response -> наши типы
    client.ts    # fetch-обёртка (base URL, заголовки, ошибки)
    zones.ts     # resolveZone(address) — матчинг адреса на зону доставки
    mock/        # mock JSON + флаг переключения
  store/
    cart.ts      # zustand store
  validation/
    checkout.ts  # zod-схемы форм
    api.ts       # zod-схемы ответов AdvantShop
  hooks/
    useHasHydrated.ts
    useFilters.ts
  utils/
    cn.ts
    format.ts    # цены, даты
types/           # сквозные типы (если нужны вне домена)
```

**Naming:** компоненты — PascalCase (`ProductCard.tsx`); хуки/утилиты — camelCase (`useCart.ts`); сегменты роутов — kebab; доменные типы — единственное число.

**RSC/Client:** всё Server по умолчанию. `"use client"` только на листьях: `FilterPanel`, `ProductGrid`, `Configurator`, `Gallery`, `AddToCart`, `CartDrawer`, motion-обёртки, `HeroBalloons`. Никогда на `layout.tsx`, `page.tsx`.

---

## 3. Слой данных и адаптер AdvantShop

UI зависит **только** от типов из `lib/shop/types.ts`. Форму ответов AdvantShop знает **только** `mappers.ts`. Это единственная точка, которую переписываешь при подключении реального REST.

### `lib/shop/types.ts`

```ts
export type Category = {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  image?: string;
  childrenIds: string[];
};

export type VariantOption = {
  name: string;        // "Цвет", "Размер", "Наполнение"
  values: string[];
};

export type Variant = {
  id: string;
  options: Record<string, string>; // { "Цвет": "Синий", "Размер": "M" }
  price: number;
  oldPrice?: number;
  inStock: boolean;
};

export type DeliveryZone = {
  id: string;                  // "se-mo-core" | "moscow" | "far-mo"
  title: string;              // "Юго-восток МО" | "Москва" | "Дальняя МО"
  kind: "core" | "extended" | "pickup";
  sameDay: boolean;            // возможна ли доставка в тот же день
  minOrder: number;            // минимальная сумма заказа для доставки в зону
  deliveryFee: number;
  earliestSlotHours: number;   // через сколько часов ближайший доступный слот
  areas: string[];             // районы/города для матчинга адреса
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  images: string[];
  basePrice: number;
  oldPrice?: number;
  options: VariantOption[];
  variants: Variant[];
  badges: ("hit" | "new" | "sale")[];
  kind: "single" | "bundle";     // bundle = готовый набор, конфигуратор свёрнут
  fulfillment: "inflated" | "flat" | "pickup_only";
  // inflated   — гелий: локальная доставка по зонам с sameDay + самовывоз
  // flat       — сдутое/аксессуары: доставка во все зоны + самовывоз
  // pickup_only — пиротехника: только самовывоз
  // фасеты для фильтрации
  facets: {
    povod: string[];
    color: string[];
    size: string[];
  };
};
```

### `lib/shop/api.ts` (серверные функции, вызываются из RSC)

```ts
export async function getCategoryBySlug(slug: string): Promise<Category | null>;
export async function getProductsByCategory(
  categoryId: string,
  page: number,
  perPage: number
): Promise<{ items: Product[]; total: number }>;
export async function getProductBySlug(slug: string): Promise<Product | null>;
export async function getRelated(productId: string): Promise<Product[]>;
export async function searchProducts(q: string): Promise<Product[]>;
export async function getMegaMenu(): Promise<Category[]>;
export async function getDeliveryZones(): Promise<DeliveryZone[]>;
```

- Все читают через `client.ts`. Флаг `USE_MOCKS` (env) переключает источник: мок JSON ↔ реальный REST.
- ISR: `export const revalidate = 300` на страницах каталога/PDP. On-demand ревалидация — позже, через webhook AdvantShop.
- `lib/shop/zones.ts` — чистая утилита `resolveZone(address: string): DeliveryZone | null`: матчит адрес/город пользователя на `DeliveryZone.areas`. Без сети, синхронная. Используется в `ZoneSelector` и на чекауте.

### `lib/shop/mappers.ts`

```ts
// ЕДИНСТВЕННОЕ место, знающее реальные поля AdvantShop.
// Сейчас маппит mock-структуру -> Product. Поля REST уточняются при подключении.
export function mapAdvantProduct(raw: unknown): Product {
  const parsed = AdvantProductSchema.parse(raw); // zod
  return { /* ...маппинг... */ };
}
```

- `AdvantProductSchema` в `lib/validation/api.ts`. Любой ответ REST проходит zod **до** маппинга. Невалидный ответ — кидаем понятную ошибку, не пускаем мусор в UI.
- Реальные имена полей AdvantShop (`name`, `offers`, `pictures` и т.п.) подставляются здесь после подтверждения контракта эндпоинтов. До этого — маппинг мок-структуры.

---

## 4. Корзина — Zustand (`lib/store/cart.ts`)

```ts
type CartLine = {
  key: string;        // `${productId}:${variantId}:${hash(options)}` — ключ дедупликации
  productId: string;
  variantId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  options: Record<string, string>;
};

type CartStore = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};
```

- `persist` + `createJSONStorage(() => localStorage)`, `partialize` → только `lines`, `version` + `migrate`.
- **`skipHydration: true` + ручная регидрация.** Серверный рендер корзины пустой; клиент дорегидрирует после монтирования.
- Бейдж корзины в шапке рендерим через `useHasHydrated()` — до регидрации показываем скелетон/пусто. Иначе hydration mismatch.
- **Дедуп по `key`:** `add` ищет существующую строку → инкремент `qty`, иначе push. Без ключа варианты схлопываются.
- Optimistic не нужен — стор клиентский, `add` мгновенен. `useOptimistic` подключается позже, при серверной корзине.
- Подписка только по селекторам: `useCartStore(s => s.add)`, никогда на весь стор.

---

## 5. Фильтры — nuqs (`lib/hooks/useFilters.ts`)

URL — единственный источник правды. Отдельного стора нет.

```ts
useQueryStates({
  povod: parseAsArrayOf(parseAsString).withDefault([]),
  color: parseAsArrayOf(parseAsString).withDefault([]),
  size:  parseAsArrayOf(parseAsString).withDefault([]),
  min:   parseAsInteger,
  max:   parseAsInteger,
  sort:  parseAsStringEnum(["pop","price_asc","price_desc"]).withDefault("pop"),
}, { shallow: true, history: "push" });
```

- **Клиентская фильтрация внутри категории.** RSC отдаёт весь набор категории один раз; фильтрация в `useMemo(() => applyFilters(products, filters), [products, filters])`. `shallow: true` ⇒ смена фасета не дёргает сервер.
- Серверная фильтрация через `searchParams` — только для глобального поиска.
- Сброс: `setFilters(null)` — стирает все ключи.
- Цвет — свотчами; повод — чипами с иконками.

---

## 6. Каталог и производительность

- **Серверная пагинация 48 карточек/страницу** (`?page=`). Виртуализация (`@tanstack/react-virtual`, `overscan: 6`, колонки от `ResizeObserver`) — только когда набор `> 100` (поиск, «показать всё»). На категориях не виртуализируем — бережём SEO и CSS-grid.
- `ProductCard` — `React.memo`, стабильные пропсы (без инлайн-объектов), хендлеры в `useCallback`.
- **Hover — только CSS:** анимируем `transform`/`opacity` (GPU), `will-change` точечно и снимаем. Ноль JS, ноль onMouseEnter-стейтов на гриде. Второе фото для hover — lazy, переключение `opacity`.
- `next/image`: точный `sizes` под каждый брейкпоинт, lazy по умолчанию, `priority` только на hero, blur-placeholder, AVIF/WebP в `next.config`.

---

## 7. Анимации (бюджет)

- **Framer Motion:** reveal секций (`whileInView`, `viewport={{ once: true }}`), enter/exit дровера и модалок (`AnimatePresence`), конфигуратор, shared-element грид→PDP (`layoutId`).
- **Чистый CSS:** все hover, фейды, лоадеры, всё массовое/частое.
- **Layout animations** — только на изолированных элементах (удаление строки корзины, аккордеон фильтров, shared image PDP). **Запрещены на гриде товаров.**
- **R3F** — только hero главной: `dynamic(import, { ssr: false })`, Suspense-фолбэк = статичная картинка, выключается по `prefers-reduced-motion`.
- **Page transitions** — только морф грид→PDP через View Transitions API. На каталоге/чекауте переходов нет (бережём LCP).

---

## 8. Ключевые страницы

- **Главная:** серверная оболочка + острова (hero R3F dynamic, слайдеры embla, reveal-секции FM). ISR.
- **Каталог:** RSC фетчит категорию один раз → клиентские `FilterPanel` + `ProductGrid`, nuqs `shallow`, пагинация 48/стр. Фильтры: сайдбар (десктоп) / `Sheet` bottom-sheet (мобайл).
- **Товар:** RSC фетчит продукт + related. Клиент: `Gallery` (embla + зум), `Configurator` (`useReducer`, цена — производное), `AddToCart` (Zustand). Sticky buy-bar на мобайле.
- **Готовые наборы:** отдельный тип товара — композиция с предустановленными вариантами и одной кнопкой «В корзину». Для decisive-покупателя (мужчина на выписке): минимум выборов, конфигуратор скрыт или свёрнут. Технически — тот же `Product`, у которого `variants` сведены к одному дефолтному; UI карточки показывает «Купить за N ₽» без шага конфигурации.
- **Пиротехника — отдельная категория с age-gate.** Перед добавлением в корзину или входом в категорию — подтверждение возраста (модалка, флаг в sessionStorage). У таких товаров `fulfillment: "pickup_only"` — на чекауте доступен только самовывоз. Точные правила (классы, возраст, ограничения) задаёт владелец — код предоставляет точки под них, значения не хардкодим.
- **Зона доставки (первичный параметр).** `ZoneSelector` в шапке: пользователь задаёт город/район (или определяем по гео), `resolveZone` матчит на `DeliveryZone`, выбор хранится в localStorage. Зона влияет на сообщения о доставке в карточке и на доступные способы получения на чекауте. До выбора зоны — дефолт «Жуковский / юго-восток МО».
- **Корзина:** дровер (`Sheet`) — основной UX. `/cart` — fallback на всю ширину для deep-link/SEO.
- **Чекаут (`/checkout`, без оплаты):** `react-hook-form` + `zod`, один экран в 3 шага (контакты → доставка + **дата/время** → подтверждение). Адрес → `resolveZone` → доступные способы и `SlotPicker`: для `sameDay`-зоны показываем ближайший слот от `earliestSlotHours`, цену из `deliveryFee`, проверку `minOrder`. Если в корзине есть `fulfillment: "pickup_only"` (пиротехника) — доставка скрыта, только самовывоз. Если зона `kind: "pickup"` — тоже только самовывоз. Дата обязательна (шары сдуваются). Сабмит в `api/order/route.ts` (мок). Согласие 152-ФЗ.

---

## 9. Порядок сборки по фазам

Каждую фазу довести до «принято» прежде чем начинать следующую.

### Фаза 0 — Каркас
Next 15 + TS strict-конфиг, Tailwind v4, shadcn init, дерево папок, `@t3-oss/env`, `cn`, `lib/shop/types.ts`, мок-данные (3 категории, ~30 товаров).
**Принято:** `pnpm dev` рендерит пустую главную; `pnpm typecheck` зелёный; моки читаются типизированно.

### Фаза 1 — Слой данных
`client.ts`, `api.ts` (все функции), `mappers.ts`, zod-схемы ответов, флаг `USE_MOCKS`, ISR. Мок зон доставки (минимум: юго-восток МО core, Москва extended, дальняя МО pickup) + `getDeliveryZones` + чистая `resolveZone(address)`.
**Принято:** серверные функции возвращают типизированные данные из моков; zod валидирует; невалидный мок кидает понятную ошибку; `resolveZone` корректно матчит «Раменское»→core, «Химки»→extended.

### Фаза 2 — Лейаут и навигация
Header, MegaMenu (две оси: повод / тип товара, с превью), Footer (2 точки в Жуковском), пустой CartDrawer, LenisProvider, hydration-safe бейдж корзины, `ZoneSelector` в шапке (выбор города/района → `resolveZone`, хранение в localStorage, дефолт юго-восток МО).
**Принято:** навигация и мега-меню работают; дровер открывается; зона выбирается и запоминается между сессиями; ноль hydration warnings.

### Фаза 3 — Каталог
ProductCard (memo, CSS hover, `sizes`), ProductGrid, FilterPanel (nuqs), клиентская фильтрация `useMemo`, серверная пагинация 48, `Sheet` на мобайле, сброс, SortSelect, ColorSwatch.
**Принято:** фильтры в URL и шарятся; грид без джанка; Lighthouse Performance ≥ 90 на категории.

### Фаза 4 — Карточка товара
Gallery (embla + зум), Configurator (`useReducer`, derived price), AddToCart (Zustand, дедуп), RelatedProducts, StickyBuyBar, морф грид→PDP (View Transitions). Для `kind: "bundle"` конфигуратор свёрнут — одна кнопка «Купить за N ₽». Age-gate для категории пиротехники (модалка + флаг в sessionStorage).
**Принято:** конфигуратор пересчитывает цену; добавление с вариантами; дедуп подтверждён (одинаковый вариант → +qty, разный → новая строка); готовый набор покупается в один клик; пиротехника недоступна без подтверждения возраста.

### Фаза 5 — Корзина и чекаут
Полный CartDrawer (setQty, remove, итог), persist со skipHydration, `/cart` fallback, `/checkout` (rhf + zod, 3 шага, 152-ФЗ), сабмит в mock route handler. Адрес → `resolveZone` → доступные способы получения + `SlotPicker` (ближайший слот от `earliestSlotHours`, цена `deliveryFee`, проверка `minOrder`). `fulfillment: "pickup_only"` в корзине или зона `kind: "pickup"` → только самовывоз. Дата/время обязательны.
**Принято:** корзина персистится; чекаут валидируется; при смене зоны меняются способы, слот и цена доставки; при наличии пиротехники доставка недоступна; заказ уходит в мок с зоной и слотом.

### Фаза 6 — Главная и лендинги поводов
HeroBalloons (R3F, dynamic ssr:false, reduced-motion fallback), RevealSection (FM), CategoryShowcase (embla), лендинги поводов. Приоритетные поводы с готовыми наборами на первом экране: **выписка из роддома, рождение ребёнка (мальчик/девочка), гендер-пати** — короткий маршрут «выбрал набор → в корзину». Программные лендинги повод × район (`/povod/vypiska/ramenskoe`) через `generateStaticParams` по парам повод × зона.areas — перехват локального интента.
**Принято:** hero ленивый с фолбэком; LCP ≤ 2.5s; `prefers-reduced-motion` уважается; лендинги выписки/рождения ведут к готовым наборам в 2–3 клика; повод × район генерируются статически с корректными мета/H1 под район.

### Фаза 7 — Полировка и перф
View Transitions грид→PDP отполированы, скелетоны через Suspense, виртуализация поиска `> 100`, аудит ререндеров (React DevTools Profiler), a11y, мета/OG/JSON-LD schema.org (Product, BreadcrumbList), Яндекс.Метрика.
**Принято:** Lighthouse Performance/SEO/Accessibility ≥ 90; ноль hydration warnings; ноль лишних ререндеров грида при смене одного фасета.

---

## 10. Правила, которые нельзя нарушать

1. **RSC по умолчанию.** `"use client"` только на листьях-островах. Не помечай страницы и лейауты клиентскими.
2. **UI не знает про AdvantShop.** Любое обращение к данным — через `lib/shop/api.ts` и доменные типы. Поля AdvantShop живут только в `mappers.ts`.
3. **Анимационный бюджет.** Hover и массовое — CSS. FM — только острова. R3F — только hero. Layout-анимации в гриде запрещены.
4. **Фильтры — в URL** через nuqs. Не заводи стор фильтров.
5. **Корзина — Zustand + skipHydration.** Бейдж рендерь только после регидрации.
6. **Зона доставки — первичный параметр.** Доступность товара, способы получения, слот и цена выводятся из зоны пользователя, а не хардкодятся. Зональная логика живёт только в `lib/shop/zones.ts`.
7. **Не переусложняй.** Не добавляй абстракции, библиотеки и фичи, не описанные здесь, без явного запроса. Реализуй минимально достаточное под текущую фазу.
8. **TS строгий.** Ноль `any`. Ответы внешних API валидируй zod на границе.
9. **Каждую фазу доводи до «принято»** прежде чем двигаться дальше.

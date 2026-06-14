/**
 * Поводы — ось навигации «по событию» (мега-меню) и основа лендингов (фаза 6).
 * slug совпадает со значением facets.povod у товаров.
 */
export type Povod = {
  slug: string;
  title: string;
  priority?: boolean; // приоритетные decisive-маршруты (выписка/рождение/гендер-пати)
};

export const POVODS: readonly Povod[] = [
  { slug: "vypiska", title: "Выписка из роддома", priority: true },
  { slug: "rozhdenie", title: "Рождение ребёнка", priority: true },
  { slug: "gender-party", title: "Гендер-пати", priority: true },
  { slug: "den-rozhdeniya", title: "День рождения" },
  { slug: "lyubov", title: "Любовь и признание" },
  { slug: "svadba", title: "Свадьба" },
];

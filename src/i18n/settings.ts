export const fallbackLng = "en";
export const languages = [fallbackLng, "id", "su"];
export const defaultNS = "translation";
export const cookieName = "i18next";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

export function getContentByLng(
  lng: ListLangType,
  contentEn: string,
  contentId: string,
  contentSu: string
) {
  return lng === "en"
    ? contentEn
    : lng === "id"
    ? contentId
    : lng === "su"
    ? contentSu
    : null;
}

export function getPathname(lng: ListLangType, pathname?: string) {
  return pathname ? `/${lng}/${pathname}` : `/${lng}`;
}

export type ListLangType = "en" | "id" | "su";

export interface ParamsI18n {
  t?: any;
  lng?: ListLangType;
}

// AUTO-GENERATED FILE. DO NOT EDIT.
// Run scripts/generate-translation-types.ts to update.

export interface TranslationDictionary {
  blog?: BlogDict;
  site?: SiteDict;
  footer?: FooterDict;
  marketing?: MarketingDict;
  hero?: HeroDict;
  features?: FeaturesDict;
  howItWorks?: HowItWorksDict;
  useCases?: UseCasesDict;
  cta?: CtaDict;
  navbar?: NavbarDict;
  ui?: UiDict;
  pricing?: PricingDict;
  creative?: CreativeDict;
  privacy_policy?: string;
}

export interface BlogDict {
  page_title?: string;
}

export interface SiteDict {
  name?: string;
}

export interface PagesDict {
  about?: string;
  pricing?: string;
  terms?: string;
  privacy?: string;
  blog?: string;
  demo?: string;
}

export interface SocialDict {
  instagram?: string;
  youtube?: string;
  telegram?: string;
  tiktok?: string;
  discord?: string;
  linkedin?: string;
}

export interface FooterDict {
  pages?: PagesDict;
  company?: string;
  corp?: string;
  address1?: string;
  address2?: string;
  phone?: string;
  email?: string;
  copyright?: string;
  social?: SocialDict;
}

export interface MarketingDict {
  pages?: string;
  tools?: string;
  cases?: string;
  ai_tool_title?: string;
  ai_case_title?: string;
  view_all_tools?: string;
  view_all_cases?: string;
}

export interface HeroDict {
  title?: string;
  description?: string;
  cta?: string;
}

export interface FeaturesDict {
  section_title?: string;
  section_description?: string;
}

export interface HowItWorksDict {
  section_title?: string;
  section_description?: string;
}

export interface CategoriesDict {
  "ai-video": string;
  business: string;
  creative: string;
  teams: string;
}

export interface UseCasesDict {
  section_title?: string;
  section_description?: string;
  categories?: CategoriesDict;
}

export interface CtaDict {
  title?: string;
  description?: string;
  button?: string;
  note?: string;
}

export interface NavbarDict {
  home?: string;
  about?: string;
  pricing?: string;
  terms?: string;
  privacy?: string;
  discord?: string;
  blog?: string;
  start?: string;
  menu?: string;
  close_menu?: string;
  open_menu?: string;
}

export interface UiDict {
  faq?: string;
  approved_by?: string;
  look?: string;
  show_more?: string;
  collapse?: string;
  no_results?: string;
  loading?: string;
  success?: string;
  error?: string;
  try_again?: string;
  empty?: string;
  nothing_found?: string;
  get_started?: string;
}

export interface PricingDict {
  banner_title?: string;
  banner_desc?: string;
  banner_cta?: string;
  without_package?: string;
  with_power_package?: string;
  base_name?: string;
  pro_name?: string;
  base_projects?: string;
  pro_projects?: string;
  save_50?: string;
  start?: string;
  buy?: string;
}

export interface CreativeDict {
  title?: string;
  desc?: string;
  learn_more?: string;
  or?: string;
  apply_email?: string;
}

export type TranslationKey =
  | 'blog.page_title'
  | 'site.name'
  | 'footer.pages.about'
  | 'footer.pages.pricing'
  | 'footer.pages.terms'
  | 'footer.pages.privacy'
  | 'footer.pages.blog'
  | 'footer.pages.demo'
  | 'footer.company'
  | 'footer.corp'
  | 'footer.address1'
  | 'footer.address2'
  | 'footer.phone'
  | 'footer.email'
  | 'footer.copyright'
  | 'footer.social.instagram'
  | 'footer.social.youtube'
  | 'footer.social.telegram'
  | 'footer.social.tiktok'
  | 'footer.social.discord'
  | 'footer.social.linkedin'
  | 'marketing.pages'
  | 'marketing.tools'
  | 'marketing.cases'
  | 'marketing.ai_tool_title'
  | 'marketing.ai_case_title'
  | 'marketing.view_all_tools'
  | 'marketing.view_all_cases'
  | 'hero.title'
  | 'hero.description'
  | 'hero.cta'
  | 'features.section_title'
  | 'features.section_description'
  | 'howItWorks.section_title'
  | 'howItWorks.section_description'
  | 'useCases.section_title'
  | 'useCases.section_description'
  | 'useCases.categories.ai-video'
  | 'useCases.categories.business'
  | 'useCases.categories.creative'
  | 'useCases.categories.teams'
  | 'useCases.categories.social'
  | 'cta.title'
  | 'cta.description'
  | 'cta.button'
  | 'cta.note'
  | 'navbar.home'
  | 'navbar.about'
  | 'navbar.pricing'
  | 'navbar.terms'
  | 'navbar.privacy'
  | 'navbar.discord'
  | 'navbar.blog'
  | 'navbar.start'
  | 'navbar.menu'
  | 'navbar.close_menu'
  | 'navbar.open_menu'
  | 'ui.faq'
  | 'ui.approved_by'
  | 'ui.look'
  | 'ui.show_more'
  | 'ui.collapse'
  | 'ui.no_results'
  | 'ui.loading'
  | 'ui.success'
  | 'ui.error'
  | 'ui.try_again'
  | 'ui.empty'
  | 'ui.nothing_found'
  | 'ui.get_started'
  | 'pricing.banner_title'
  | 'pricing.banner_desc'
  | 'pricing.banner_cta'
  | 'pricing.without_package'
  | 'pricing.with_power_package'
  | 'pricing.base_name'
  | 'pricing.pro_name'
  | 'pricing.base_projects'
  | 'pricing.pro_projects'
  | 'pricing.save_50'
  | 'pricing.start'
  | 'pricing.buy'
  | 'creative.title'
  | 'creative.desc'
  | 'creative.learn_more'
  | 'creative.or'
  | 'creative.apply_email'
  | 'privacy_policy';

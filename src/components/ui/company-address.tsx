import { siteConfig } from "@/config/site";

export function CompanyAddress({ locale }: { locale?: string }) {
  return (
    <>
      <div className="text-muted-foreground">{siteConfig.company.name} (Public Benefit Corporation)</div>
      <div className="text-muted-foreground">{siteConfig.company.address1}</div>
      <div className="text-muted-foreground">{siteConfig.company.address2}</div>

      {/* Turkish office for TR locale */}
      {locale === "tr" && (
        <>
          <div className="text-muted-foreground mt-4 font-medium">{siteConfig.companyTR.name}</div>
          <div className="text-muted-foreground">{siteConfig.companyTR.address1}</div>
          <div className="text-muted-foreground">{siteConfig.companyTR.address2}</div>
          <div className="text-muted-foreground">{siteConfig.companyTR.address3}</div>
        </>
      )}
    </>
  );
}

export function CompanyContact({ locale }: { locale?: string }) {
  return (
    <>
      <div className="text-muted-foreground">Phone: {siteConfig.company.phone}</div>
      {locale === "tr" && (
        <div className="text-muted-foreground">Turkey: {siteConfig.companyTR.phone}</div>
      )}
      <div className="text-muted-foreground">Email: {siteConfig.company.email}</div>
      <div className="text-muted-foreground">Support: help@superduperai.co</div>
    </>
  );
}

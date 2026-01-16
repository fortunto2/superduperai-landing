import { siteConfig } from "@/config/site";

export function CompanyAddress() {
  return (
    <>
      <div className="text-muted-foreground">{siteConfig.company.name} (Public Benefit Corporation)</div>
      <div className="text-muted-foreground">{siteConfig.company.address1}</div>
      <div className="text-muted-foreground">{siteConfig.company.address2}</div>
    </>
  );
}

export function CompanyContact() {
  return (
    <>
      <div className="text-muted-foreground">Phone: {siteConfig.company.phone}</div>
      <div className="text-muted-foreground">Email: {siteConfig.company.email}</div>
      <div className="text-muted-foreground">Support: help@superduperai.co</div>
    </>
  );
}

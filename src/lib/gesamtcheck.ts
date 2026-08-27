import { siteConfig } from "@/lib/site";

/** Shared WhatsApp deep link for every primary CTA on the /gesamtcheck page. */
export const gesamtcheckWhatsappUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
  "Hallo, lass uns den Gesamtcheck bei unserem Termin direkt mit einplanen 👍",
)}`;

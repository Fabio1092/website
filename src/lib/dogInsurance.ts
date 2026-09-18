import { siteConfig } from "@/lib/site";

// ---------------------------------------------------------------------------
// WhatsApp-Anfrage (kein Online-Abschluss für dieses Thema) – zentrale
// Nummer aus siteConfig.whatsappUrl, Nachricht wird hier einmalig gepflegt.
// ---------------------------------------------------------------------------

export const dogWhatsAppMessage = `Hallo Fabio,

ich interessiere mich für eine Hundeversicherung bei der HanseMerkur.

Name meines Hundes:
[bitte ergänzen]

Rasse:
[bitte ergänzen]

Geburtsdatum:
[bitte ergänzen]

Ich interessiere mich für:

[ ] Hundekrankenversicherung
[ ] Hunde-OP-Versicherung

Meine Präferenz ist Premium plus.

Kannst du mir bitte den passenden Beitrag und die Varianten mit bzw. ohne Selbstbeteiligung zeigen?

Viele Grüße`;

export const dogWhatsAppUrl = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(dogWhatsAppMessage)}`;

// ---------------------------------------------------------------------------
// Orientierungswerte für Behandlungskosten (keine garantierten Tierarztpreise).
// ---------------------------------------------------------------------------

export interface TreatmentCost {
  label: string;
  value: string;
}

export const treatmentCosts: TreatmentCost[] = [
  { label: "Bandscheibenvorfall", value: "ca. 5.000 €" },
  { label: "Magendrehung", value: "ca. 4.000 €" },
  { label: "Fraktur", value: "ca. 3.500 €" },
  { label: "Kreuzbandriss", value: "ca. 3.500 €" },
  { label: "Ellbogengelenkdysplasie", value: "ca. 3.000 €" },
  { label: "Fremdkörper-OP", value: "ca. 3.000 €" },
  { label: "Zahnsteinentfernung", value: "ca. 800 €" },
  { label: "Allergiebehandlung", value: "ca. 350 €" },
];

// ---------------------------------------------------------------------------
// HanseMerkur Hundekrankenversicherung: die drei Tarifstufen.
// ---------------------------------------------------------------------------

export interface DogTariffTier {
  id: string;
  name: string;
  isFavorite?: boolean;
  jahreshoechstentschaedigung: string;
  gotSatz: string;
}

export const dogHealthTariffTiers: DogTariffTier[] = [
  {
    id: "komfort",
    name: "Komfort",
    jahreshoechstentschaedigung: "2.500 €",
    gotSatz: "bis 3-facher GOT-Satz",
  },
  {
    id: "premium",
    name: "Premium",
    jahreshoechstentschaedigung: "5.000 €",
    gotSatz: "bis 4-facher GOT-Satz inkl. Notdienst",
  },
  {
    id: "premium-plus",
    name: "Premium plus",
    isFavorite: true,
    jahreshoechstentschaedigung: "grundsätzlich unbegrenzt",
    gotSatz: "bis 4-facher GOT-Satz inkl. Notdienst",
  },
];

// Preisbeispiel: Jack Russell Terrier/Australian Shepherd, 1. Lebensjahr,
// 500 € Selbstbeteiligung, monatliche Zahlweise.
export const dogHealthPricingExample: { tier: string; price: string }[] = [
  { tier: "Komfort", price: "28,19 Euro" },
  { tier: "Premium", price: "37,58 Euro" },
  { tier: "Premium plus", price: "40,17 Euro" },
];

// Gleiches Preisbeispiel für die reine Hunde-OP-Versicherung.
export const dogOpPricingExample: { tier: string; price: string }[] = [
  { tier: "Komfort", price: "7,38 Euro" },
  { tier: "Premium", price: "10,31 Euro" },
  { tier: "Premium plus", price: "11,21 Euro" },
];

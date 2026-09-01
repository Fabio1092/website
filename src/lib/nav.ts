export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavLink[];
};

export const primaryNav: NavLink[] = [
  { label: "Startseite", href: "/" },
  {
    label: "PKV",
    href: "/private-krankenversicherung-kassel/",
    children: [
      { label: "PKV im Überblick", href: "/private-krankenversicherung-kassel/" },
      { label: "PKV für Angestellte", href: "/pkv-angestellte-kassel/" },
      { label: "PKV für Selbstständige", href: "/pkv-selbststaendige-kassel/" },
      { label: "PKV für Beamte", href: "/pkv-beamte-kassel/" },
      { label: "Risikovoranfrage", href: "/pkv-risikovoranfrage/" },
      { label: "Gesundheitsfragen", href: "/pkv-gesundheitsfragen/" },
    ],
  },
  {
    label: "BU",
    href: "/bu/",
    children: [
      { label: "BU im Überblick", href: "/bu/" },
      { label: "BU für Angestellte", href: "/bu-angestellte-kassel/" },
      { label: "BU für Selbstständige", href: "/bu-selbststaendige-kassel/" },
      { label: "BU für Studenten", href: "/bu-studenten-kassel/" },
      { label: "BU/DU für Beamte", href: "/bu-beamte-kassel/" },
      { label: "Risikovoranfrage", href: "/bu-risikovoranfrage/" },
      { label: "Gesundheitsfragen", href: "/bu-gesundheitsfragen/" },
    ],
  },
  { label: "360° Beratung", href: "/360-beratung/" },
  { label: "Ratgeber", href: "/ratgeber/" },
  { label: "Über mich", href: "/ueber-mich/" },
];

export const legalNav: NavLink[] = [
  { label: "Datenschutz", href: "/datenschutz/" },
  { label: "Erstinformation", href: "/erstinformation/" },
  { label: "Impressum", href: "/impressum/" },
];

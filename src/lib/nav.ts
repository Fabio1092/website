export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryNav: NavLink[] = [
  { label: "Startseite", href: "/" },
  { label: "PKV", href: "/private-krankenversicherung-kassel" },
  { label: "BU", href: "/bu" },
  { label: "360° Check", href: "/360-grad-check" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Kontakt", href: "/kontakt" },
];

export const legalNav: NavLink[] = [
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Erstinformation", href: "/erstinformation" },
  { label: "Impressum", href: "/impressum" },
];

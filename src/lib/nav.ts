export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryNav: NavLink[] = [
  { label: "Startseite", href: "/" },
  { label: "PKV", href: "/private-krankenversicherung-kassel" },
  { label: "BU", href: "/bu" },
  { label: "Über mich", href: "/ueber-mich" },
];

export const legalNav: NavLink[] = [
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Erstinformation", href: "/erstinformation" },
  { label: "Impressum", href: "/impressum" },
];

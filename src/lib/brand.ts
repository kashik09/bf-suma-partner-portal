export const BRAND = {
  distributorName: "Sarah Nakato",
  teamName: "Team Vitality",
  whatsappNumber: "+256 700 000 000",
} as const;

export const VENUE = {
  name: "Wellness Hub Kampala",
  address: "Plot 12, Kampala Road, Kampala",
  duration: "About 2 hours",
} as const;

export const waLink = () =>
  "https://wa.me/" + BRAND.whatsappNumber.replace(/[^0-9]/g, "");

export const initials = (name: string) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

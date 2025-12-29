## Packages
framer-motion | Smooth page transitions and micro-interactions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
  urdu: ["var(--font-urdu)"], // Special font for Urdu text
}

Integration assumptions:
- Language toggle stores preference in localStorage ('en' or 'ur')
- Admin login uses mocked credentials initially (basheer000@gmail.com / basheer111)
- Products have 'wheat' or 'flour' categories

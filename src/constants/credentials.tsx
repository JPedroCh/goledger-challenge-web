export const token = btoa(
  `${import.meta.env.VITE_USERNAME}:${import.meta.env.VITE_PASSWORD}`
);

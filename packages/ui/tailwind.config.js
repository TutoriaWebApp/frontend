import sharedConfig from "@repo/config/tailwind/config";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedConfig],
  
  content: ["./src/**/*.{ts,tsx}"],
};
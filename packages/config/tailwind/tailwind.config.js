/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6366F1",  
          secondary: "#0F172A", 
          accent: "#06B6D4",    
        },
        gamification: {
          gold: "#F59E0B",      
          silver: "#94A3B8",    
          bronze: "#B45309",
        },
        surface: {
          base: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        }
      },
      boxShadow: {
        'portfolio': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        quicksand: ["var(--font-quicksand)"],
        inter: ["var(--font-inter)"],
      }
    },
  },
};
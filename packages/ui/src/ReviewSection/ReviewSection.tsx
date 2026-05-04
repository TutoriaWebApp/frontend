"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard/ReviewCard";
import { ReviewFilter } from "./ReviewFilter/ReviewFilter";
import { ReviewPagination } from "./ReviewPagination/ReviewPagination";

export function ReviewSection() {
  const [activeTab, setActiveTab] = useState<"tutor" | "aprendiz">("tutor");

  return (
    <section className="
      bg-white 
      rounded-3xl 
      p-8 
      border 
      border-slate-200 
      shadow-sm 
      mt-6
    ">
      <h2 className="
        text-xl 
        font-bold 
        text-slate-800 
        mb-6 
      ">
        Avaliações
      </h2>
      {/* Abas e Filtro */}
      <div className="
        flex 
        flex-col 
        md:flex-row 
        justify-between 
        items-start 
        md:items-end 
        mb-8 
        gap-4
      ">
        <div className="
          flex
          flex-col
          md:flex-row 
          gap-2
        ">
          <button 
            onClick={() => setActiveTab("tutor")}
            className={`
                px-4 
                py-2 
                font-bold 
                border-2 
                transition-all 
                ${activeTab === "tutor" ? "border-slate-800 bg-slate-50" : "border-slate-300 text-slate-400"}
              `}
          >
            Avaliações (Tutor)
          </button>
          <button 
            onClick={() => setActiveTab("aprendiz")}
            className={`
                px-4 
                py-2 
                font-bold 
                border-2 
                transition-all ${activeTab === "aprendiz" ? "border-slate-800 bg-slate-50" : "border-slate-300 text-slate-400"}
              `}
          >
            Avaliações (Aprendiz)
          </button>
        </div>
        
        <ReviewFilter />
      </div>

      <div className="min-h-[220px]">
        <ReviewCard
          name="Exemplo de User" 
          rating={3} 
          comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
        />
      </div>

      <ReviewPagination />
    </section>
  );
}
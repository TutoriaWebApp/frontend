"use client";

import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { SolicitationCard } from "@repo/ui/SolicitationCard/SolicitationCard";

export default function GerenciadorSolicitacoes() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <div
      className="
      bg-slate-50 
      flex 
      flex-col
    "
    >
      <main
        className="
        p-6 
        md:p-12 
        max-w-7xl 
        mx-auto 
        w-full
      "
      >
        <section
          className="
          bg-white
          rounded-2xl
          border 
          border-slate-100 
          shadow-sm 
          overflow-hidden 
          mb-12
        "
        >
          {/* Cabeçalho do Card (Título + Abas) */}
          <div
            className="
            p-8 
            md:p-10 
            border-b-2
            border-slate-300
          "
          >
            <h1
              className="
              text-3xl 
              font-black 
              text-slate-800 
              mb-8 
            "
            >
              Gerenciador de Solicitações
            </h1>

            {/* Abas integradas ao cabeçalho */}
            <div
              className="
              flex 
              flex-wrap 
              gap-8
            "
            >
              <button
                onClick={() => setActiveTab("aceitas")}
                className={`
                    px-6 
                    py-2.5 
                    rounded-xl 
                    font-black 
                    text-sm
                    2xl:text-base 
                    transition-all 
                    ${
                      activeTab === "aceitas"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-300"
                    }`}
              >
                Solicitações Aceitas
              </button>
              <button
                onClick={() => setActiveTab("pendentes")}
                className={`
                    px-6 
                    py-2.5 
                    rounded-xl 
                    font-black 
                    text-sm
                    2xl:text-base
                    transition-all ${
                      activeTab === "pendentes"
                        ? "bg-indigo-600 text-white shadow-lg shadow-slate-100"
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
                    }`}
              >
                Solicitações Pendentes
              </button>
              <button
                onClick={() => setActiveTab("minhas")}
                className={`
                    px-6 
                    py-2.5 
                    rounded-xl 
                    font-black 
                    text-sm
                    2xl:text-base 
                    transition-all ${
                      activeTab === "minhas"
                        ? "bg-indigo-600 text-white shadow-lg shadow-slate-100"
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
                    }`}
              >
                Minhas Solicitações
              </button>
            </div>
          </div>

          {/* Corpo do Card (Filtros) */}
          <div
            className="
            p-8 
            md:p-10
          "
          >
            <div
              className="
              grid 
              grid-cols-1
              md:grid-cols-3 
              gap-6 
              items-end
            "
            >
              {/* Seus selects e inputs aqui... */}
              <div className="space-y-2">
                <label
                  className="
                    sm:text-xs
                    2xl:text-sm 
                    font-black 
                    text-slate-400 
                    uppercase 
                    tracking-widest 
                    ml-1
                ">
                  Área de Conhecimento
                </label>
                <select
                  className="
                    w-full 
                    bg-slate-50 
                    border-2 
                    border-slate-500 
                    rounded-xl 
                    p-1
                    text-slate-600 
                    focus:border-indigo-600 
                    outline-none 
                    transition-all
                ">
                  <option disabled value={""}>Todas</option>
                  <option>Matemática</option>
                  <option>Programação</option>
                </select>
              </div>

            <div className="space-y-2">
              <label
                className="
                sm:text-xs
                2xl:text-sm 
                font-black 
                text-slate-400 
                uppercase 
                tracking-widest 
                ml-1
              "
              >
                Ordenar Por
              </label>
              <select
                className="
                w-full 
                bg-slate-50 
                border-2 
                border-slate-500 
                rounded-xl 
                p-1 
                text-slate-600 
                focus:border-indigo-600 
                outline-none 
                transition-all
              "
              >
                <option disabled value="">Selecione uma opção</option>
                <option>Mais recentes</option>
                <option>Mais antigas</option>
              </select>
            </div>

              <button className="
              bg-emerald-600
              hover:bg-emerald-700 
              text-white 
                font-black 
                py-1.5 
                rounded-xl 
                shadow-lg 
                shadow-emerald-100 
                transition-all 
                flex 
                items-center 
                justify-center 
                gap-2
                sm:w-full
                lg:w-[80%]
              ">
                <FilterListIcon fontSize="small" />
                Aplicar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* Grid de Solicitações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SolicitationCard
            discipline="Matemática"
            name="João Silva"
            date="20/10/2023"
            status="Aceito"
            mode={activeTab}
          />
          <SolicitationCard
            discipline="Artes"
            name="João Silva"
            date="20/10/2023"
            status="Aceito"
            mode={activeTab}
          />
          <SolicitationCard
            discipline="Geografia"
            name="João Silva"
            date="20/10/2023"
            status="Aceito"
            mode={activeTab}
          />
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Link from "next/link";

import { TutorCard } from "@repo/ui/tutorCard";

export default function BuscaTutores() {
  const [resultsCount, setResultsCount] = useState(12);

  return (
    <div
      className="
        bg-slate-50 
        flex 
        flex-col 
        font-sans
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
        {/* Barra de Filtros */}
        <section
          className="
            bg-white 
            p-6 
            rounded-2xl
            border 
            border-slate-100 
            shadow-sm 
            mb-8
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
            Busca de Tutores
          </h1>
          <div
            className="
            grid 
            grid-cols-1 
            md:grid-cols-4 
            gap-6
            items-end 
        "
          >
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
            "
              >
                <option>Todas</option>
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
                Especialidade
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
                <option>Avaliação</option>
                <option>Proximidade</option>
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
                Ordenar por
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
                <option>Avaliação</option>
                <option>Proximidade</option>
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
                Localização (Raio em KM)
              </label>
              <input
                type="number"
                placeholder="KM"
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
              "/>
            </div>
            <button
              className="
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
                justify-center 
                gap-2
                items-center
                w-full
                md:col-start-4
            "
            >
              Pesquisar
              <SearchIcon />
            </button>
          </div>
        </section>

        <div className="
            bg-white 
            p-6 
            rounded-2xl
            border 
            border-slate-100 
            shadow-sm 
            mb-8
        ">
        <p className="
            text-slate-500 
        ">
          Foram encontrados{" "}
            <span className="
                font-bold 
                text-slate-800
            ">
                {resultsCount}
            </span>{" "}
          tutores de acordo com os critérios selecionados.
        </p>
        </div>

        {/* Grid de Tutores */}
        <div className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-3 
            gap-8 
            mb-12
        ">
          <TutorCard
            name="Ednaldo Pereira"
            location="Guarabira, PB"
            rating={5.0}
            totalRatings={450}
            subjects={["Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes", "Música", "Filosofia", "Artes",]}
            bio="Tutor dedicado a ensinar o que é o que não é. Especialista em compreensão profunda e ritmos envolventes. Tutor dedicado a ensinar o que é o que não é. Especialista em compreensão profunda e ritmos envolventes."
          />
          <TutorCard
            name="Xande Tetinha"
            location="São Paulo, SP"
            rating={4.8}
            totalRatings={123}
            subjects={["Next.js", "Django", "Tailwind"]}
            bio="Desenvolvedor Full Stack apaixonado por ensinar arquitetura de sistemas e interfaces modernas."
          />
          <TutorCard
            name="Tatu Bolinha"
            location="Rio de Janeiro, RJ"
            rating={4.9}
            totalRatings={89}
            subjects={["Língua Portuguesa", "Literatura"]}
            bio="Foco em interpretação de texto e redação para concursos e vestibulares."
          />
        </div>

      <Link href={"/recomendacoes"}>
        <button className="
          group 
          flex 
          items-center 
          gap-3 
          bg-white 
          border-2 
          border-indigo-100 
          text-indigo-600 
          font-black 
          py-3
          px-6 
          rounded-3xl 
          hover:bg-indigo-800 
          hover:text-white 
          transition-all 
          shadow-xl 
          shadow-indigo-100
          ">
          Ver Recomendações
          <ArrowForwardIosIcon
            sx={{ fontSize: 14 }}
            />
        </button>
      </Link>
      </main>
    </div>
  );
}

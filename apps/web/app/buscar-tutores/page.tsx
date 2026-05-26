"use client";

import React, { useEffect, useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Link from "next/link";

import { GetAreas, GetSpecialties, GetTutors } from "@repo/services/userClient";

import { ClipLoader } from "react-spinners";

import { TutorCard } from "@repo/ui/tutorCard";
import { Specialty, TutorArea, TutorData } from "@repo/services/userTypes";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { GetAreaById } from "@repo/services/userClient";

export default function BuscaTutores() {
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const [areasList, setAreasList] = useState<TutorArea[]>();
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>();
  const [tutorsList, setTutorsList] = useState<TutorData[]>();

  let nextPageURL: string = "";
  let prevPageURL: string = "";

  const [queryAreaId, setQueryAreaId] = useState<number>();
  const [querySpecialtyId, setQuerySpecialtyId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTutors, setLoadingTutors] = useState<boolean>(false);

  const { showNotification } = useContext(NotificationContext);

  const fetchArea = async (id: number) => {
    const area = await GetAreaById(id);

    return area.data;
  };

  useEffect(() => {
    async function fetchAreas() {
      setLoading(true);

      const res = await GetAreas();

      if (res.success) {
        setAreasList(res.data);
      }

      setLoading(false);
    }
    fetchAreas();
  }, []);

  useEffect(() => {
    async function fetchSpecialties() {
      const res = await GetSpecialties(queryAreaId);

      if (res.success) {
        setSpecialtiesList(res.data);
      }
    }
    fetchSpecialties();
  }, [queryAreaId]);

const handleSubmit = async () => {
    setLoadingTutors(true);

    const res = await GetTutors(1, queryAreaId, querySpecialtyId);

    if (res.success && res.data) {
      const rawTutors = res.data.results;

      // 1. Tratamos os dados dos tutores ANTES de salvar no estado
      const processedTutors = await Promise.all(
        rawTutors.map(async (tutor) => {
          // Garante segurança caso o tutor venha sem especialidades do Back
          if (!tutor.especialidades) {
            return { ...tutor, areas: [] };
          }

          const uniqueAreaIds = Array.from(
            new Set(tutor.especialidades.map((specialty) => specialty.areaId))
          );

          // Busca todas as áreas do tutor em paralelo
          const areaPromises = uniqueAreaIds.map((areaId) => fetchArea(areaId));
          const fetchedAreas = await Promise.all(areaPromises);

          // Filtra apenas as áreas que retornaram dados válidos
          const validAreas = fetchedAreas.filter((area): area is TutorArea => area !== null);

          return {
            ...tutor,
            areas: validAreas,
          };
        })
      );

      setTutorsList(processedTutors);
      setResultsCount(res.data.count);

      nextPageURL = res.data.next;
      prevPageURL = res.data.previous;

    } else {
      showNotification("Não foi possível obter a lista de tutores", "error");
    }

    setLoadingTutors(false);
  };

  return (
    <>
      {loading && (
        <ClipLoader
          color="#64748b"
          className="relative left-[47%]"
          size={120}
        />
      )}
      {!loading && (
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
                    defaultValue={""}
                    onChange={(e) => setQueryAreaId(Number(e.target.value))}
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
                    <option value={""}>Todas</option>
                    {areasList &&
                      areasList.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nomeArea}
                        </option>
                      ))}
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
                    disabled={queryAreaId ? false : true}
                    defaultValue={""}
                    onChange={(e) =>
                      setQuerySpecialtyId(Number(e.target.value))
                    }
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
                    <option value={""}>Selecione uma especialidade</option>
                    {specialtiesList &&
                      specialtiesList.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.nomeEspecialidade}
                        </option>
                      ))}
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
              "
                  />
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
                <button
                  onClick={handleSubmit}
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

            {resultsCount != null && (
              <div
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
                {resultsCount >= 1 && (
                  <p className="text-slate-500">
                    Foram encontrados{" "}
                    <span
                      className="
                    font-bold 
                    text-slate-800
                    "
                    >
                      {resultsCount}
                    </span>{" "}
                    tutores de acordo com os critérios selecionados.
                  </p>
                )}
                {resultsCount === 0 && (
                  <p className="text-slate-500">
                    Não foram encontrados tutores de acordo com os critérios
                    selecionados.
                  </p>
                )}
              </div>
            )}

            {/* Grid de Tutores */}
            {tutorsList && tutorsList?.length >= 1 && (
              <div
                className="
                  grid 
                  grid-cols-1 
                  md:grid-cols-2 
                  lg:grid-cols-3 
                  gap-8 
                  mb-12
              "
              >
                {tutorsList.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    name={tutor.nomePerfil}
                    photoURL={tutor.fotoURL}
                    location={`${tutor.cidade}, ${tutor.estado}`}
                    rating={5.0}
                    totalRatings={450}
                    subjects={tutor.areas!.map((area) => area.nomeArea)}
                    bio="aa"
                  />
                ))}
              </div>
            )}

            <Link href={"/recomendacoes"}>
              <button
                className="
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
          "
              >
                Ver Recomendações
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </button>
            </Link>
          </main>
        </div>
      )}
    </>
  );
}

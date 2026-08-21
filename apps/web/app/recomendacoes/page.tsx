"use client";

import React, { useEffect, useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Link from "next/link";

import {
  GetAreas,
  GetSpecialties,
  GetRecommendations,
} from "@repo/services/userClient";

import { ClipLoader } from "react-spinners";

import { TutorCard } from "@repo/ui/tutorCard";
import {
  Specialty,
  TutorArea,
  GetRecommendationData,
} from "@repo/services/userTypes";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";

export default function GetRecommendationsPage() {
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const [areasList, setAreasList] = useState<TutorArea[]>();
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>();
  const [tutorsList, setTutorsList] = useState<GetRecommendationData[]>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const [queryAreaId, setQueryAreaId] = useState<number>();
  const [querySpecialtyId, setQuerySpecialtyId] = useState<number>();
  const [queryRadius, setQueryRadius] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTutors, setLoadingTutors] = useState<boolean>(false);

  const { showNotification } = useContext(NotificationContext);

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

  const fetchRecommendationsPage = async (
    page: number,
    currentSize: number,
  ) => {
    if (!queryAreaId) {
      showNotification(
        "É obrigatório selecionar uma área para se obter recomendações",
        "error",
      );
      return;
    }

    setLoadingTutors(true);
    const res = await GetRecommendations(
      page,
      queryAreaId,
      querySpecialtyId,
      queryRadius,
      currentSize,
    );

    if (res.success && res.data) {
      setTutorsList(res.data.results);
      setResultsCount(res.data.count);

      setHasNext(res.data.next !== null);
      setHasPrevious(res.data.previous !== null);
      setCurrentPage(page);
    } else {
      if (res.status != 500) {
        showNotification(
          "Não foi possível obter as recomendações de tutores",
          "error",
        );
      } else {
        showNotification(
          "Erro no servidor, não foi possível obter as recomendações de tutores",
          "error",
        );
      }
    }
    setLoadingTutors(false);
  };

  const handleSubmit = async () => {
    await fetchRecommendationsPage(1, pageSize);
  };

  const handleNextPage = async () => {
    if (hasNext) {
      await fetchRecommendationsPage(currentPage + 1, pageSize);
    }
  };

  const handlePrevPage = async () => {
    if (hasPrevious) {
      await fetchRecommendationsPage(currentPage - 1, pageSize);
    }
  };

  const handlePageSizeChange = async (newSize: number) => {
    setPageSize(newSize);
    if (resultsCount !== null) {
      await fetchRecommendationsPage(1, newSize);
    }
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
                Recomendações de Tutores
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
                      flex
                      items-center
                  "
                  >
                    Área de Conhecimento
                    <span className="text-red-600 text-base">*</span>
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
                    <option disabled value={""}>
                      Selecione uma área
                    </option>
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
                    value={queryRadius}
                    onChange={(e) =>
                      setQueryRadius(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
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
                  />
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
                flex 
                flex-col 
                sm:flex-row 
                justify-between 
                items-start 
                sm:items-center 
                gap-4
              "
              >
                <div>
                  {resultsCount >= 1 && (
                    <p className="text-slate-500">
                      Foram encontradas{" "}
                      <span
                        className="
                        font-bold 
                        text-slate-800
                      "
                      >
                        {resultsCount}
                      </span>{" "}
                      recomendações de tutores de acordo com os critérios selecionados.
                    </p>
                  )}
                  {resultsCount === 0 && (
                    <p className="text-slate-500">
                      Não foram encontrados tutores de acordo com os critérios
                      selecionados.
                    </p>
                  )}
                </div>

                <div
                  className="
                  flex 
                  items-center 
                  gap-2 
                  text-slate-600 
                  font-semibold 
                  whitespace-nowrap
                "
                >
                  <span>Exibir:</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="bg-slate-50 border-2 border-slate-300 rounded-lg p-1 outline-none text-slate-700 font-bold focus:border-indigo-600 transition-all"
                  >
                    <option value={6}>6 por página</option>
                    <option value={12}>12 por página</option>
                    <option value={18}>18 por página</option>
                  </select>
                </div>
              </div>
            )}

            {resultsCount && resultsCount >= 1 && (
              <h1
                className="
                text-3xl 
                font-black 
                text-slate-800 
                mb-8
                ml-4
              "
              >
                Tutores recomendados para você
              </h1>
            )}

            {/* Grid de Tutores */}
            {tutorsList && tutorsList?.length >= 1 && !loadingTutors && (
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
                    id={tutor.perfilTutor.usuarioId}
                    name={tutor.perfilTutor.nomePerfil}
                    photoURL={tutor.perfilTutor.fotoURL}
                    location={`${tutor.perfilTutor.cidade}, ${tutor.perfilTutor.estado}`}
                    rating={Number(tutor.perfilTutor.notaAvaliacao)}
                    totalRatings={Number(tutor.perfilTutor.totalAvaliacoes)}
                    subjects={tutor.perfilTutor.areas.map(
                      (area) => area.nomeArea,
                    )}
                    bio={tutor.perfilTutor.sobremim}
                  />
                ))}
              </div>
            )}
            {loadingTutors && (
              <ClipLoader
                color="#64748b"
                className="relative left-[47%]"
                size={120}
              />
            )}

            {resultsCount != null && resultsCount > 0 && !loadingTutors && (
              <div
                className="
                bg-white border 
                border-slate-100 
                shadow-sm 
                rounded-2xl 
                p-4 
                mb-12 
                flex 
                justify-center 
                items-center 
                gap-6 
                max-w-md
                mx-auto
              "
              >
                <button
                  disabled={!hasPrevious}
                  onClick={handlePrevPage}
                  className={`
                    p-2 
                    rounded-xl 
                    border-2 
                    transition-all 
                    flex 
                    items-center 
                    justify-center 
                    ${hasPrevious ? "border-slate-300 text-slate-600 hover:bg-slate-100 active:scale-95 cursor-pointer" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                </button>

                <span
                  className="
                  text-slate-600 
                  font-black 
                  text-sm 
                  select-none
                "
                >
                  Página {currentPage}
                </span>

                <button
                  disabled={!hasNext}
                  onClick={handleNextPage}
                  className={`
                    p-2 
                    rounded-xl 
                    border-2 
                    transition-all 
                    flex 
                    items-center 
                    justify-center 
                    ${hasNext ? "border-slate-300 text-slate-600 hover:bg-slate-100 active:scale-95 cursor-pointer" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}

            <Link href={"/buscar-tutores"}>
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
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                Buscar Tutores
              </button>
            </Link>
          </main>
        </div>
      )}
    </>
  );
}

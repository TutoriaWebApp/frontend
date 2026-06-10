"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ClipLoader } from "react-spinners";

import { SessionGetData } from "@repo/services/sessionTypes";

import { SolicitationCard } from "@repo/ui/SolicitationCard/SolicitationCard";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { GetSessions } from "@repo/services/sessions";
import { GetAreas, GetSpecialties } from "@repo/services/userClient";
import { TutorArea, Specialty } from "@repo/services/userTypes";

export default function GerenciadorSolicitacoes() {
  const { showNotification } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState<
    | "sessoes_tutor"
    | "sessoes_aprendiz"
    | "solicitacoes_tutor"
    | "solicitacoes_aprendiz"
    | ""
  >("");

  const [sessionsList, setSessionsList] = useState<SessionGetData[]>([]);
  const [globalAreas, setGlobalAreas] = useState<TutorArea[]>([]);
  const [globalSpecialties, setGlobalSpecialties] = useState<Specialty[]>([]);
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const [queryAreaId, setQueryAreaId] = useState<number | undefined>(undefined);
  const [querySpecialtyId, setQuerySpecialtyId] = useState<number | undefined>(
    undefined,
  );
  const [queryOrder, setQueryOrder] = useState<string>("desc");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFormBases() {
      const [resAreas, resSpecs] = await Promise.all([
        GetAreas(),
        GetSpecialties(),
      ]);

      if (resAreas.success) {
        setGlobalAreas(resAreas.data);
      }
      if (resSpecs.success) {
        setGlobalSpecialties(resSpecs.data);
      }
    }
    fetchFormBases();
  }, []);

  const filteredSelectAreas = useMemo(() => {
    const trackingIds = new Set(sessionsList.map((s) => s.areaId));
    return globalAreas.filter((area) => trackingIds.has(area.id));
  }, [globalAreas, sessionsList]);

  const filteredSelectSpecialties = useMemo(() => {
    const trackingIds = new Set(sessionsList.map((s) => s.especialidadeId));
    return globalSpecialties.filter((spec) => {
      const matchSession = trackingIds.has(spec.id);
      const matchArea = !queryAreaId || spec.areaId === queryAreaId;
      return matchSession && matchArea;
    });
  }, [globalSpecialties, sessionsList, queryAreaId]);

  const fetchSessionsPage = async (
    page: number,
    currentSize: number,
    targetTab: string,
  ) => {
    if (
      targetTab == "" ||
      targetTab == "solicitacoes_tutor" ||
      targetTab == "solicitacoes_aprendiz"
    ) {
      return;
    }

    if (targetTab == "sessoes_tutor") {
      targetTab = "tutor";
    } else {
      targetTab = "aprendiz";
    }
    setLoading(true);
    const res = await GetSessions(
      queryAreaId,
      querySpecialtyId,
      queryOrder,
      targetTab,
      page,
      currentSize,
    );

    if (res.success && res.data) {
      setSessionsList(res.data.results);
      setResultsCount(res.data.count);
      setHasNext(res.data.next !== null);
      setHasPrevious(res.data.previous !== null);
      setCurrentPage(page);
    } else {
      showNotification(
        "Não foi possível carregar o histórico de sessões.",
        "error",
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    setQueryAreaId(undefined);
    setQuerySpecialtyId(undefined);
    fetchSessionsPage(1, pageSize, activeTab);
  }, [activeTab]);

  const handleFilterSubmit = async () => {
    await fetchSessionsPage(1, pageSize, activeTab);
  };

  const handleNextPage = async () => {
    if (hasNext) {
      await fetchSessionsPage(currentPage + 1, pageSize, activeTab);
    }
  };

  const handlePrevPage = async () => {
    if (hasPrevious) {
      await fetchSessionsPage(currentPage - 1, pageSize, activeTab);
    }
  };

  const handlePageSizeChange = async (newSize: number) => {
    setPageSize(newSize);
    if (resultsCount !== null) {
      await fetchSessionsPage(1, newSize, activeTab);
    }
  };

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
		flex-1
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
          <div
            className="
		  	p-8 
			md:p-10 
			border-b-2 
			border-slate-200
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

            <div
              className="
				flex 
				flex-wrap 
				gap-4
			"
            >
              <button
                onClick={() => setActiveTab("sessoes_tutor")}
                className={`
					px-6 
					py-2.5 
					rounded-xl 
					font-black 
					text-sm 
					2xl:text-base 
					transition-all 
					cursor-pointer 
					${
            activeTab === "sessoes_tutor"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
              : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
          }`}
              >
                Sessões Aceitas como Tutor
              </button>
              <button
                onClick={() => setActiveTab("sessoes_aprendiz")}
                className={`
					px-6 
					py-2.5 
					rounded-xl 
					font-black 
					text-sm 
					2xl:text-base 
					transition-all 
					cursor-pointer 
			${
        activeTab === "sessoes_aprendiz"
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
          : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
      }`}
              >
                Sessões Aceitas como Aprendiz
              </button>
              <button
                onClick={() => setActiveTab("solicitacoes_tutor")}
                className={`
					px-6 
					py-2.5 
					rounded-xl 
					font-black 
					text-sm 
					2xl:text-base 
					transition-all 
					cursor-pointer 
				${
          activeTab === "solicitacoes_tutor"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
        }`}
              >
                Solicitações Pendentes
              </button>
              <button
                onClick={() => setActiveTab("solicitacoes_aprendiz")}
                className={`
					px-6 
					py-2.5 
					rounded-xl 
					font-black 
					text-sm 
					2xl:text-base 
					transition-all 
					cursor-pointer 
				${
          activeTab === "solicitacoes_aprendiz"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100"
        }`}
              >
                Minhas Solicitações
              </button>
            </div>
          </div>

          {/* Inputs de Controle */}
          <div
            className="
		  	p-8 
			md:p-10 
			bg-slate-50/30
		  "
          >
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
					text-xs
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
                  value={queryAreaId || ""}
                  onChange={(e) => {
                    setQueryAreaId(
                      e.target.value ? Number(e.target.value) : undefined,
                    );
                    setQuerySpecialtyId(undefined);
                  }}
                  className="
				  	w-full 
					bg-white 
					border-2 
					border-slate-300 
					rounded-xl 
					p-2 
					text-sm
					2xl:text-base
					text-slate-600 
					focus:border-indigo-600 
					outline-none 
					transition-all 
					font-bold
				"
                >
                  <option value="">Todas</option>
                  {filteredSelectAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nomeArea}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="
					text-xs
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
                  value={querySpecialtyId || ""}
                  onChange={(e) =>
                    setQuerySpecialtyId(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="
				  	w-full 
					bg-white 
					border-2 
					border-slate-300 
					rounded-xl 
					p-2 
					text-sm 
					2xl:text-base
					text-slate-600 
					focus:border-indigo-600 
					outline-none 
					transition-all 
					font-bold
				"
                >
                  <option value="">Todas</option>
                  {filteredSelectSpecialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.nomeEspecialidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="
					text-xs
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
                  value={queryOrder}
                  onChange={(e) => setQueryOrder(e.target.value)}
                  className="
				  	w-full 
					bg-white 
					border-2 
					border-slate-300 
					rounded-xl 
					p-2 
					text-sm
					2xl:text-base 
					text-slate-600 
					focus:border-indigo-600 
					outline-none 
					transition-all 
					font-bold
				"
                >
                  <option value="desc">Mais recentes</option>
                  <option value="asc">Mais antigas</option>
                </select>
              </div>

              <button
                onClick={handleFilterSubmit}
                className="
					bg-emerald-600 
					hover:bg-emerald-700 
					text-white 
					font-black 
					py-2.5 
					rounded-xl 
					shadow-lg 
					shadow-emerald-100 
					transition-all 
					flex 
					items-center 
					justify-center 
					gap-2 
					w-full 
					cursor-pointer
			  "
              >
                <FilterListIcon fontSize="small" />
                Aplicar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* Visual de Carregamento ou Listagem */}
        {loading ? (
          <div
            className="
		  	flex 
			justify-center 
			items-center 
			py-20
		  "
          >
            <ClipLoader color="#4f46e5" size={80} />
          </div>
        ) : (
          <>
            {resultsCount !== null && (
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
				items-center 
				gap-4
			  "
              >
                <p
                  className="
					text-slate-500 
					font-medium
				"
                >
                  {(resultsCount > 0 && activeTab == "sessoes_aprendiz") ||
                    (activeTab == "sessoes_tutor" && (
                      <>
                        Foram encontradas{" "}
                        <span
                          className="
					  	font-bold 
						text-slate-800
					  "
                        >
                          {resultsCount}
                        </span>{" "}
                        sessões confirmadas.
                      </>
                    ))}
                  {resultsCount == 0 && (
                    <>
                      <span>Nenhum resultado encontrado.</span>
                    </>
                  )}
                </p>

                <div
                  className="
					flex 
					items-center 
					gap-2 
					text-slate-600 
					font-semibold 
					whitespace-nowrap 
					text-sm
					2xl:text-base
				"
                >
                  <span>Exibir:</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="
						bg-slate-50 
						border-2 
						border-slate-200 
						rounded-lg 
						p-1.5 
						outline-none 
						font-bold 
						focus:border-indigo-600 
						text-xs
						2xl:text-sm
					"
                  >
                    <option value={6}>6 por página</option>
                    <option value={12}>12 por página</option>
                    <option value={18}>18 por página</option>
                  </select>
                </div>
              </div>
            )}

            {/* Grid dos Cards de Sessões */}
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
              {sessionsList.length > 0 && activeTab == "sessoes_aprendiz" &&
                sessionsList.map((session) => (
                  <SolicitationCard
                    key={session.id}
					area={session.nomeArea}
					speciality={session.nomeEspecialidade}
					photoURL={session.fotoTutorURL}
					date={session.dataSessao}
					name={session.nomeTutor}
					startTime={session.horarioInicio}
					endTime={session.horarioFim}
					status={"Aceita"}
					mode={activeTab}
                  />
                ))}
			  {sessionsList.length > 0 && activeTab == "sessoes_tutor" &&
                sessionsList.map((session) => (
                  <SolicitationCard
                    key={session.id}
					area={session.nomeArea}
					speciality={session.nomeEspecialidade}
					photoURL={session.fotoAprendizURL}
					date={session.dataSessao}
					name={session.nomeUsuario}
					startTime={session.horarioInicio}
					endTime={session.horarioFim}
					status={"Aceita"}
					mode={activeTab}
                  />
                ))}
            </div>

            {/* Paginação */}
            {resultsCount !== null && resultsCount > 0 && (
              <div
                className="
			  		bg-white 
					border 
					border-slate-100 
					shadow-sm 
					rounded-2xl 
					p-4
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
					${hasPrevious ? "border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                </button>

                <span
                  className="
					text-slate-600 
					font-black 
					text-sm
					2xl:text-base
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
					${hasNext ? "border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

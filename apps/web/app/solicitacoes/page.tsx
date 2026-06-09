"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ClipLoader } from "react-spinners";

import { SolicitationCard } from "@repo/ui/SolicitationCard/SolicitationCard";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { GetSessions } from "@repo/services/sessions";
import { SessionGetData } from "../../../../packages/services/src/types/sessions";

export default function GerenciadorSolicitacoes() {
	const { showNotification } = useContext(NotificationContext);

	const [activeTab, setActiveTab] = useState<"tutor" | "aprendiz">("tutor");
	const [sessionsList, setSessionsList] = useState<SessionGetData[]>([]);
	const [resultsCount, setResultsCount] = useState<number | null>(null);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(6);
	const [hasNext, setHasNext] = useState<boolean>(false);
	const [hasPrevious, setHasPrevious] = useState<boolean>(false);

	const [queryAreaId, setQueryAreaId] = useState<number | undefined>(undefined);
	const [querySpecialtyId, setQuerySpecialtyId] = useState<number | undefined>(undefined);
	const [queryOrder, setQueryOrder] = useState<string>("desc");

	const [loading, setLoading] = useState<boolean>(false);

	// 📑 Extrai dinamicamente as Áreas únicas encontradas nas sessões carregadas
	const availableAreas = useMemo(() => {
		const uniqueAreas = new Map<number, string>();
		sessionsList.forEach((session) => {
			if (session.areaId) {
				uniqueAreas.set(session.areaId, session.nomeArea || `Área ${session.areaId}`);
			}
		});
		return Array.from(uniqueAreas.entries()).map(([id, name]) => ({ id, name }));
	}, [sessionsList]);

	// 📑 Extrai dinamicamente as Especialidades únicas baseadas na Área filtrada
	const availableSpecialties = useMemo(() => {
		const uniqueSpecs = new Map<number, string>();
		sessionsList.forEach((session) => {
			if (session.especialidadeId && (!queryAreaId || session.areaId === queryAreaId)) {
				uniqueSpecs.set(session.especialidadeId, session.nomeEspecialidade || `Especialidade ${session.especialidadeId}`);
			}
		});
		return Array.from(uniqueSpecs.entries()).map(([id, name]) => ({ id, name }));
	}, [sessionsList, queryAreaId]);

	// Função de requisição unificada
	const fetchSessionsPage = async (page: number, currentSize: number, currentTab: "tutor" | "aprendiz") => {
		setLoading(true);
		const res = await GetSessions(
			queryAreaId,
			querySpecialtyId,
			queryOrder,
			currentTab,
			page,
			currentSize
		);

		if (res.success && res.data) {
			setSessionsList(res.data.results);
			setResultsCount(res.data.count);

			setHasNext(res.data.next !== null);
			setHasPrevious(res.data.previous !== null);
			setCurrentPage(page);
		} else {
			showNotification("Não foi possível obter a lista de sessões.", "error");
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchSessionsPage(1, pageSize, activeTab);
	}, [activeTab]);

	const handleSubmit = async () => {
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
		<div className="bg-slate-50 flex flex-col min-h-screen">
			<main className="p-6 md:p-12 max-w-7xl mx-auto w-full flex-1">
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
					{/* Cabeçalho do Card */}
					<div className="p-8 md:p-10 border-b-2 border-slate-200">
						<h1 className="text-3xl font-black text-slate-800 mb-8">
							Gerenciador de Solicitações
						</h1>

						{/* Abas Alternadoras */}
						<div className="flex flex-wrap gap-4">
							<button
								onClick={() => setActiveTab("tutor")}
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
										activeTab === "tutor"
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
											: "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100 text-slate-600"
									}
								`}
							>
								Solicitações Aceitas como Tutor
							</button>
							<button
								onClick={() => setActiveTab("aprendiz")}
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
										activeTab === "aprendiz"
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
											: "bg-white text-slate-400 border border-slate-200 hover:bg-slate-100 text-slate-600"
									}
								`}
							>
								Solicitações Aceitas como Aprendiz
							</button>
						</div>
					</div>

					{/* Corpo dos Filtros */}
					<div className="p-8 md:p-10 bg-slate-50/20">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
							
							{/* Select de Áreas Dinâmicas */}
							<div className="space-y-2">
								<label className="sm:text-xs 2xl:text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
									Área de Conhecimento
								</label>
								<select
									value={queryAreaId || ""}
									onChange={(e) => setQueryAreaId(e.target.value ? Number(e.target.value) : undefined)}
									className="w-full bg-white border-2 border-slate-300 rounded-xl p-2 text-sm text-slate-600 focus:border-indigo-600 outline-none transition-all font-bold"
								>
									<option value="">Todas</option>
									{availableAreas.map((area) => (
										<option key={area.id} value={area.id}>
											{area.name}
										</option>
									))}
								</select>
							</div>

							{/* Select de Especialidades Dinâmicas */}
							<div className="space-y-2">
								<label className="sm:text-xs 2xl:text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
									Especialidade
								</label>
								<select
									value={querySpecialtyId || ""}
									onChange={(e) => setQuerySpecialtyId(e.target.value ? Number(e.target.value) : undefined)}
									className="w-full bg-white border-2 border-slate-300 rounded-xl p-2 text-sm text-slate-600 focus:border-indigo-600 outline-none transition-all font-bold"
								>
									<option value="">Todas</option>
									{availableSpecialties.map((spec) => (
										<option key={spec.id} value={spec.id}>
											{spec.name}
										</option>
									))}
								</select>
							</div>

							{/* Select de Filtro de Ordenação */}
							<div className="space-y-2">
								<label className="sm:text-xs 2xl:text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
									Ordenar Por
								</label>
								<select
									value={queryOrder}
									onChange={(e) => setQueryOrder(e.target.value)}
									className="w-full bg-white border-2 border-slate-300 rounded-xl p-2 text-sm text-slate-600 focus:border-indigo-600 outline-none transition-all font-bold"
								>
									<option value="desc">Mais recentes</option>
									<option value="asc">Mais antigas</option>
								</select>
							</div>

							{/* Botão de Pesquisa */}
							<button
								onClick={handleSubmit}
								className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 w-full cursor-pointer"
							>
								<FilterListIcon fontSize="small" />
								Aplicar Filtros
							</button>
						</div>
					</div>
				</section>

				{/* Bloco de Carregamento / Resultados */}
				{loading ? (
					<div className="flex justify-center items-center py-20">
						<ClipLoader color="#4f46e5" size={80} />
					</div>
				) : (
					<>
						{/* Seção Informativa de Registros */}
								<div className="flex items-center gap-2 text-slate-600 font-semibold whitespace-nowrap text-sm">
									<span>Exibir:</span>
									<select
										value={pageSize}
										onChange={(e) => handlePageSizeChange(Number(e.target.value))}
										className="bg-slate-50 border-2 border-slate-200 rounded-lg p-1.5 outline-none text-slate-700 font-bold focus:border-indigo-600 transition-all text-xs"
									>
										<option value={6}>6 por página</option>
										<option value={12}>12 por página</option>
										<option value={18}>18 por página</option>
									</select>
								</div>
						

						{/* Grid Renderizado de Cards de Sessões */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
							{sessionsList.map((session) => (
								<SolicitationCard
									key={session.id}
									discipline={session.nomeArea || "Tutoria"}
									name={session.nomeParticipante || `ID Participante: ${activeTab === "tutor" ? session.usuarioId : session.tutorId}`}
									date={new Date(session.dataSessao + "T00:00:00").toLocaleDateString("pt-BR")}
									status="Aceito"
									mode={activeTab}
								/>
							))}
						</div>

						{/* Paginação do Footer */}
						{resultsCount !== null && resultsCount > 0 && (
							<div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex justify-center items-center gap-6 max-w-md mx-auto">
								<button
									disabled={!hasPrevious}
									onClick={handlePrevPage}
									className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${hasPrevious ? "border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer active:scale-95" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
								>
									<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
								</button>

								<span className="text-slate-600 font-black text-sm select-none">
									Página {currentPage}
								</span>

								<button
									disabled={!hasNext}
									onClick={handleNextPage}
									className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${hasNext ? "border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer active:scale-95" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
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
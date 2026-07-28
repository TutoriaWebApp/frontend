"use client";

import { useContext, useEffect, useState } from "react";
import { ReviewCard } from "./ReviewCard/ReviewCard";
import { Specialty, TutorArea } from "@repo/services/userTypes";
import { ClipLoader } from "react-spinners";
import { GetReviewsStudent, GetReviewsTutor } from "@repo/services/reviews";
import { ReviewPost } from "@repo/services/reviewTypes";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface ReviewSectionProps {
  userId: number;
  areas: TutorArea[];
  specialties: Specialty[];
  tutorId: number | null;
}

export function ReviewSection({
  userId,
  areas,
  specialties,
  tutorId,
}: ReviewSectionProps) {
  const [activeTab, setActiveTab] = useState<"tutor" | "aprendiz">("aprendiz");

  const [queryAreaId, setQueryAreaId] = useState<number>(0);
  const [querySpecialtyId, setQuerySpecialtyId] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [gradeOrder, setGradeOrder] = useState<string>("");

  const [selectSpecialties, setSelectSpecialties] = useState<Specialty[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  const [reviewsList, setReviewsList] = useState<ReviewPost[]>([]);

  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (queryAreaId == 0) {
      setSelectSpecialties(specialties);
      return;
    }

    const filteredSpecialties = specialties.filter((specialty) => {
      return specialty.areaId === queryAreaId;
    });

    setSelectSpecialties(filteredSpecialties);
    return;
  }, [queryAreaId]);

  async function fetchReviews(page: number = 1, pageSize: number = 6) {
    setLoading(true);

    let res;

    if (activeTab === "aprendiz") {
      res = await GetReviewsStudent(
        page,
        gradeOrder,
        userId,
        queryAreaId,
        querySpecialtyId,
        pageSize,
      );
    } else {
      res = await GetReviewsTutor(
        page,
        gradeOrder,
        tutorId!,
        queryAreaId,
        querySpecialtyId,
        pageSize,
      );
    }

    if (res.success && res.data) {
      setReviewsList(res.data.results);

      setHasNext(res.data.next !== null);
      setHasPrevious(res.data.previous !== null);
      setCurrentPage(page);
    } else {
      showNotification(
        "Não foi possível obter a lista de avaliações.",
        "error",
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchReviews(1, pageSize);
  }, [activeTab, queryAreaId, querySpecialtyId, gradeOrder]);

  const handleNextPage = async () => {
    if (hasNext) {
      await fetchReviews(currentPage + 1, pageSize);
    }
  };

  const handlePrevPage = async () => {
    if (hasPrevious) {
      await fetchReviews(currentPage - 1, pageSize);
    }
  };

  const handlePageSizeChange = async (newSize: number) => {
    setPageSize(newSize);
    await fetchReviews(1, newSize);
  };

  return (
    <section
      className="
      bg-white 
      rounded-3xl 
      p-8 
      border 
      border-slate-200 
      shadow-sm 
      mt-6
    "
    >
      {loading && (
        <ClipLoader
          color="#64748b"
          className="relative left-[47%]"
          size={120}
        />
      )}
      {!loading && (
        <>
          <h2
            className="
        text-xl 
        font-bold 
        text-slate-800 
        mb-6 
      "
          >
            Avaliações
          </h2>
          {/* Abas e Filtro */}
          <div>
            <div
              className="
          flex
          flex-col
          md:flex-row 
          gap-4
          mb-4
        "
            >
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
              <button
                disabled={tutorId === null}
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
            </div>
            <div
              className="
          flex
          flex-col
          md:flex-row
          gap-8
          mb-6
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
                  Ordenar por Notas
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
                  value={gradeOrder}
                  onChange={(e) => {
                    setGradeOrder(e.target.value);
                  }}
                >
                  <option value={""}>Sem Ordenação</option>
                  <option value={"nota"}>Crescente</option>
                  <option value={"-nota"}>Decrescente</option>
                </select>
              </div>
              {activeTab == "tutor" && (
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
                    Filtrar por Área
                  </label>
                  <select
                    value={queryAreaId}
                    onChange={(e) => {
                      setQueryAreaId(Number(e.target.value));

                      if (Number(e.target.value) == 0) {
                        setQuerySpecialtyId(0);
                      }
                    }}
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
                    <option value={0}>Todas</option>
                    {areas &&
                      areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nomeArea}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {activeTab == "tutor" && (
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
                    Filtrar por Especialidade
                  </label>
                  <select
                    disabled={queryAreaId == 0}
                    value={querySpecialtyId}
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
                    <option value={0}>Selecione uma especialidade</option>
                    {selectSpecialties &&
                      selectSpecialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.nomeEspecialidade}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {reviewsList.length == 0 && (
            <span className="
              block
              text-center            
              text-slate-600 
            "> 
              Não foram encontradas avaliações para exibir.
            </span>
          )}
          {reviewsList.length > 0 &&
            reviewsList.map((review) => (
              <div className="min-h-[220px]" key={review.id}>
                <ReviewCard
                  id={review.usuarioAvaliadorId}
                  photo={review.fotoURL}
                  name={review.nomeUsuario}
                  rating={review.nota}
                  comment={review.comentario}
                />
              </div>
            ))}
          {reviewsList.length > 0 && (
            <>
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
            <div
              className="
                flex 
                items-center
                justify-end 
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
            </>
          )}
        </>
      )}
    </section>
  );
}

"use client";

import { useState, useContext, useMemo, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

import { CreateSolicitationAction } from "@repo/services/solicitationsAction";
import { GetAllSolicitations } from "@repo/services/solicitations";
import {
  GetSpecificTutorSessions,
  GetAllUserSessions,
} from "@repo/services/sessions";

import { TimeSlot } from "@repo/services/availabilityTypes";
import { TutorArea, Specialty } from "@repo/services/userTypes";
import { SessionGetData } from "@repo/services/sessionTypes";
import { ClipLoader } from "react-spinners";
import { SolicitationGetData } from "@repo/services/solicitationTypes";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  availabilities: TimeSlot[];
  areas: TutorArea[];
  specialties: Specialty[];
  tutorId: number;
}

const indexToWeekday: Record<number, TimeSlot["dia"]> = {
  0: "DOM",
  1: "SEG",
  2: "TER",
  3: "QUA",
  4: "QUI",
  5: "SEX",
  6: "SAB",
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function ScheduleModal({
  isOpen,
  onClose,
  availabilities,
  areas,
  specialties,
  tutorId,
}: ScheduleModalProps) {
  const { showNotification } = useContext(NotificationContext);

  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [monthOffset, setMonthOffset] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAgendaId, setSelectedAgendaId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(
    null,
  );
  const [recurrent, setRecurrent] = useState<boolean>(false);

  const [tutorSessions, setTutorSessions] = useState<SessionGetData[]>();
  const [userSessions, setUserSessions] = useState<SessionGetData[]>();
  const [userSolicitations, setUserSolicitations] =
    useState<SolicitationGetData[]>();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchTutorSessions = async () => {
    try {
      const res = await GetSpecificTutorSessions(tutorId);

      if (res.success) {
        setTutorSessions(res.data);
      } else {
        showNotification(
          "Não foi possível carregar os dados do tutor.",
          "error",
        );
        handleCancel();
      }
    } catch (e) {
      console.error("Erro ao buscar dados do tutor", e);
      showNotification("Erro de conexão ao buscar dados do tutor.", "error");
    }
  };

  const fetchUserSessions = async () => {
    try {
      const res = await GetAllUserSessions();
      if (res.success) {
        setUserSessions(res.data);
      }
    } catch (e) {
      console.error("Erro ao buscar sessões do usuário", e);
    }
  };

  const fetchUserSolicitations = async () => {
    try {
      const res = await GetAllSolicitations();
      if (res.success) {
        setUserSolicitations(res.data);
      }
    } catch (e) {
      console.error("Erro ao buscar sessões do usuário", e);
    }
  };

  useEffect(() => {
    if (tutorId) {
      const awaitFetches = async () => {
        setLoading(true);

        try {
          await Promise.all([
            fetchTutorSessions(),
            fetchUserSessions(),
            fetchUserSolicitations(),
          ]);
        } catch (e) {
          console.error("Erro no Promise.all", e);
        } finally {
          setLoading(false);
        }
      };

      awaitFetches();
    }
  }, [tutorId]);

  const targetMonthData = useMemo(() => {
    const targetMonth = (currentMonth + monthOffset) % 12;
    const targetYear =
      currentYear + Math.floor((currentMonth + monthOffset) / 12);

    const firstDayInstance = new Date(targetYear, targetMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay();
    const totalDaysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    return {
      monthIndex: targetMonth,
      year: targetYear,
      startDayOfWeek,
      totalDaysInMonth,
      label: `${monthNames[targetMonth]} ${targetYear}`,
    };
  }, [currentMonth, currentYear, monthOffset]);
  const calendarDays = useMemo(() => {
    const daysArray = [];
    const { year, monthIndex, startDayOfWeek, totalDaysInMonth } =
      targetMonthData;

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({
        dayNumber: null,
        status: "disabled",
        dateInstance: null,
        weekdayKey: null,
      });
    }

    const todayCompare = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateInstance = new Date(year, monthIndex, day);
      const dateCompare = new Date(
        dateInstance.getFullYear(),
        dateInstance.getMonth(),
        dateInstance.getDate(),
      );
      const weekdayKey = indexToWeekday[dateInstance.getDay()];
      const slotsForDay = availabilities.filter(
        (slot) => slot.dia === weekdayKey,
      );

      let status: "free" | "busy" | "disabled" = "disabled";

      if (dateCompare >= todayCompare) {
        if (slotsForDay.length > 0) {
          const dateStr = dateInstance.toISOString().split("T")[0];

          const occupiedSessionsThisDay = tutorSessions
            ? tutorSessions.filter((s) => s.dataSessao === dateStr)
            : [];

          const allSlotsOccupied = slotsForDay.every((slot) =>
            occupiedSessionsThisDay.some(
              (s) =>
                s.horarioInicio.slice(0, 5) === slot.horarioInicio.slice(0, 5),
            ),
          );

          if (tutorSessions && allSlotsOccupied) {
            status = "busy";
          } else {
            status = "free";
          }

          daysArray.push({
            dayNumber: day,
            status,
            dateInstance,
            weekdayKey,
          });
        } else {
          daysArray.push({
            dayNumber: day,
            status: "disabled",
            dateInstance,
            weekdayKey,
          });
        }
      } else {
        daysArray.push({
          dayNumber: day,
          status: "disabled",
          dateInstance,
          weekdayKey,
        });
      }
    }

    return daysArray;
  }, [targetMonthData, availabilities, today, tutorSessions]);

  const availableTimesForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    const weekdayKey = indexToWeekday[selectedDate.getDay()];

    const todayDate = new Date();

    const isToday =
      selectedDate.getDate() === todayDate.getDate() &&
      selectedDate.getMonth() === todayDate.getMonth() &&
      selectedDate.getFullYear() === todayDate.getFullYear();

    const currentHourStr = `${String(todayDate.getHours()).padStart(2, "0")}:${String(todayDate.getMinutes()).padStart(2, "0")}`;

    const dayAvailabilities = availabilities.filter(
      (slot) => slot.dia === weekdayKey,
    );

    const daySessions = userSessions
      ? userSessions.filter((session) => session.dataSessao === dateStr)
      : [];

    const daySolicitations = userSolicitations
      ? userSolicitations.filter(
          (solicitation) => solicitation.dataPretendida === dateStr,
        )
      : [];

    const tutorDaySessions = tutorSessions
      ? tutorSessions.filter((session) => session.dataSessao === dateStr)
      : [];

    const formatAvailabilities = dayAvailabilities.map((slot) => {
      const timeFormatted = slot.horarioInicio.slice(0, 5);

      const isPastTime =
        isToday && timeFormatted.localeCompare(currentHourStr) <= 0;

      const isUserOccupied = daySessions.some(
        (session) => session.horarioInicio.slice(0, 5) === timeFormatted,
      );

      const isTutorOccupied = tutorDaySessions.some(
        (session) => session.horarioInicio.slice(0, 5) === timeFormatted,
      );

      const isAlreadyRequested = daySolicitations?.some(
        (solicitation) =>
          solicitation.horarioInicio.slice(0, 5) === timeFormatted &&
          solicitation.agendaId === slot.id,
      );

      let status;

      if (isPastTime) {
        status = "busy";
      } else if (isUserOccupied) {
        status = "userOccupied";
      } else if (isTutorOccupied) {
        status = "busy";
      } else if (isAlreadyRequested) {
        status = "alreadyRequested";
      } else {
        status = "free";
      }

      return {
        id: slot.id!,
        time: timeFormatted,
        status: status,
      };
    });

    return formatAvailabilities.sort((a, b) => a.time.localeCompare(b.time));
  }, [
    selectedDate,
    availabilities,
    userSessions,
    tutorSessions,
    userSolicitations,
  ]);

  const filteredSpecialties = useMemo(() => {
    if (!selectedAreaId) return [];
    return specialties.filter((spec) => spec.areaId === selectedAreaId);
  }, [selectedAreaId, specialties]);

  const handleDayClick = (dayItem: (typeof calendarDays)[0]) => {
    if (dayItem.status === "free" && dayItem.dateInstance) {
      setSelectedDate(dayItem.dateInstance);
      setSelectedAgendaId(null);
    }
  };

  const handleAreaChange = (areaId: number) => {
    setSelectedAreaId(areaId || null);
    setSelectedSpecialtyId(null);
  };

  const handlePrevMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthOffset < 2) {
      setMonthOffset((prev) => prev + 1);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedAgendaId(null);
    setSelectedAreaId(null);
    setSelectedSpecialtyId(null);
    setMonthOffset(0);
    onClose();
  };

  const handleSubmit = async () => {
    if (
      selectedDate &&
      selectedAgendaId &&
      selectedAreaId &&
      selectedSpecialtyId
    ) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dataPretendidaStr = `${year}-${month}-${day}`;

      const bodyData = {
        dataPretendida: dataPretendidaStr,
        recorrente: recurrent,
        estado: "PENDENTE",
        agendaId: selectedAgendaId,
        areaId: selectedAreaId,
        especialidadeId: selectedSpecialtyId,
      };

      const res = await CreateSolicitationAction(bodyData);

      if (res.success) {
        showNotification("Solicitação enviada com sucesso!", "success");
        await fetchUserSolicitations();
        handleCancel();
      } else {
        showNotification("Não foi possível realizar a solicitação.", "error");
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const isFormValid =
    selectedDate &&
    selectedAgendaId !== null &&
    selectedAreaId !== null &&
    selectedSpecialtyId !== null;

  return (
    <>
      {loading && (
        <ClipLoader
          color="#64748b"
          className="relative left-[47%]"
          size={120}
        />
      )}
      <div
        className="
			fixed 
			inset-0 
			z-50 
			flex 
			items-center 
			justify-center 
			bg-black/50 
			backdrop-blur-sm 
			p-4
	"
      >
        <div
          className="
		  bg-white 
			w-full 
			max-w-2xl 
			rounded-3xl 
			shadow-2xl 
			overflow-hidden 
	  "
        >
          {/* Header */}
          <div
            className="
			flex
			justify-between
			items-center 
			p-6 
			border-b 
		  border-slate-100
		"
          >
            <h2
              className="
		  	text-xl 
			font-bold 
			text-slate-800
		  "
            >
              Solicitar Sessão de Tutoria
            </h2>
            <button
              onClick={handleCancel}
              className="
				text-slate-400 
				hover:text-slate-600 
				transition-colors 
				cursor-pointer
			"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className="
			p-6 
			space-y-6 
			max-h-[75vh] 
			overflow-y-auto
		"
          >
            {/* Calendário */}
            <div
              className="
		  	border-2 
			border-slate-100 
			rounded-2xl 
			p-4 
			bg-slate-50/10
		  "
            >
              <div
                className="
				flex 
				justify-between 
				items-center 
				mb-6
			"
              >
                <button
                  disabled={monthOffset === 0}
                  onClick={handlePrevMonth}
                  className={`
					p-1 
					rounded-lg 
					transition-colors 
					${monthOffset === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 cursor-pointer"}`}
                >
                  <ChevronLeftIcon />
                </button>
                <span
                  className="
			  	font-extrabold 
				text-slate-700 
				select-none
			  "
                >
                  {targetMonthData.label}
                </span>
                <button
                  disabled={monthOffset === 2}
                  onClick={handleNextMonth}
                  className={`
					p-1 
					rounded-lg 
					transition-colors 
					${monthOffset === 2 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 cursor-pointer"}`}
                >
                  <ChevronRightIcon />
                </button>
              </div>

              {/* Dias da Semana */}
              <div
                className="
				grid 
				grid-cols-7 
				gap-1 
				mb-2
			"
              >
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                  <div
                    key={d}
                    className="
				  	text-center 
					text-xs 
					font-black 
					text-slate-400 
					uppercase 
					tracking-widest
				"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Grade de Dias */}
              <div
                className="
				grid 
				grid-cols-7 
				gap-2
			"
              >
                {calendarDays.map((item, idx) => {
                  const isSelected =
                    selectedDate &&
                    item.dateInstance &&
                    selectedDate.getDate() === item.dateInstance.getDate() &&
                    selectedDate.getMonth() === item.dateInstance.getMonth() &&
                    selectedDate.getFullYear() ===
                      item.dateInstance.getFullYear();

                  if (item.dayNumber === null) {
                    return <div key={`empty-${idx}`} className="h-10" />;
                  }

                  return (
                    <button
                      key={`day-${idx}`}
                      disabled={
                        item.status === "busy" || item.status === "disabled"
                      }
                      onClick={() => handleDayClick(item)}
                      className={`
						h-10 
						rounded-xl 
						border-2 
						text-sm 
						font-bold 
						transition-all
            hover:border-indigo-500
            ${item.status === "busy" && "bg-red-500 text-white cursor-not-allowed font-semibold shadow-sm hover:border-none"}
						${item.status === "disabled" && "bg-gray-400 border-slate-100 text-slate-800 cursor-not-allowed opacity-60 hover:border-none"}
            ${isSelected ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-100 scale-105" : item.status !== "busy" ? "bg-white border-slate-200 text-slate-700" : ""}
				    `}
                    >
                      {item.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="
		  	grid 
			grid-cols-1 
			sm:grid-cols-2 
			gap-4 
			bg-slate-50/50 
			p-4 
			rounded-2xl 
			border 
			border-slate-100
		"
            >
              <div className="space-y-1.5">
                <label
                  className="
			  	text-xs 
				2xl:text-sm
				font-black 
				text-slate-400 
				uppercase 
				tracking-widest 
				ml-0.5
			  "
                >
                  Área de Conhecimento<span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAreaId || ""}
                  onChange={(e) => handleAreaChange(Number(e.target.value))}
                  className="
                    w-full 
                    bg-white 
                    border-2 
                    border-slate-200 
                    rounded-xl 
                    p-2 
                    text-sm 
                    text-slate-700 
                    outline-none 
                    focus:border-indigo-500 
                    font-bold 
                    transition-all
                  "
                >
                  <option value="">Selecione uma área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nomeArea}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  className="
			  	text-xs 
				2xl:text-sm
				font-black 
				text-slate-400 
				uppercase 
				tracking-widest 
				ml-0.5
			  "
                >
                  Especialidade<span className="text-red-500">*</span>
                </label>
                <select
                  disabled={!selectedAreaId}
                  value={selectedSpecialtyId || ""}
                  onChange={(e) =>
                    setSelectedSpecialtyId(Number(e.target.value))
                  }
                  className="
					w-full 
					bg-white 
					border-2 
					border-slate-200 
					rounded-xl 
					p-2 
					text-sm 
					text-slate-700 
					outline-none 
					focus:border-indigo-500 
					font-bold 
					transition-all 
					disabled:bg-slate-100 
					disabled:text-slate-300 
					disabled:border-slate-100 
					disabled:cursor-not-allowed
				"
                >
                  <option value="">
                    {!selectedAreaId
                      ? "Aguardando Área..."
                      : "Selecione a especialidade"}
                  </option>
                  {filteredSpecialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.nomeEspecialidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horários e Legenda */}
            <div className="flex flex-col md:flex-row gap-6 pt-2">
              <div className="flex-1 space-y-5">
                <p className="text-sm font-bold text-slate-800">
                  {selectedDate
                    ? `Horários livres para o dia ${selectedDate.toLocaleDateString()}:`
                    : "Selecione um dia disponível no calendário para ver os horários:"}
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {selectedDate &&
                    availableTimesForSelectedDay.length === 0 && (
                      <p className="text-xs font-semibold text-rose-500">
                        Nenhum horário livre encontrado para este dia.
                      </p>
                    )}

                  {!selectedDate && (
                    <p className="text-xs font-medium text-slate-400">
                      Aguardando escolha da data...
                    </p>
                  )}

                  {selectedDate &&
                    availableTimesForSelectedDay.map((t) => (
                      <button
                        key={`time-${t.id}`}
                        onClick={() => setSelectedAgendaId(t.id)}
                        disabled={
                          t.status === "userOccupied" ||
                          t.status === "busy" ||
                          t.status === "alreadyRequested"
                        }
                        className={`
                          px-4 
                          py-2 
                          rounded-xl 
                          border-2 
                          font-black 
                          text-xs 
                          transition-all
                          ${t.status === "busy" ? "bg-red-600 border-red-800 text-white cursor-not-allowed" : ""}
                          ${t.status === "userOccupied" ? "bg-blue-600 border-blue-800 text-white cursor-not-allowed opacity-80" : ""}
                          ${t.status === "alreadyRequested" ? "bg-amber-500 border-amber-800 text-white cursor-not-allowed opacity-80" : ""}
                          ${t.status === "free" && selectedAgendaId === t.id ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-100" : ""}
                          ${t.status === "free" && selectedAgendaId !== t.id ? "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/20 cursor-pointer" : ""}
                        `}
                      >
                        {t.time}
                      </button>
                    ))}
                </div>

                <div className="flex items-center">
                  <span className="mr-2 text-sm font-bold">Recorrente</span>
                  <input
                    className="w-4 h-4"
                    type="checkbox"
                    checked={recurrent}
                    onChange={(e) => setRecurrent(e.target.checked)}
                  />
                </div>
                {/* Legenda */}
                <div
                  className="
                  bg-slate-50/60 
                  rounded-2xl 
                  p-4 
                  border 
                  border-slate-200 
                  space-y-3 
                  w-full 
                  h-fit"
                >
                  <p className="text-gray-500 text-xs">
                    Criar uma solicitação com <span className="font-bold">recorrência</span> fará com que o sistema
                    envie, semanalmente, novos pedidos para esta mesma área e
                    especialidade na agenda do tutor, mantendo o mesmo dia e
                    horário.
                  </p>
                </div>
              </div>

              {/* Legenda */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200 space-y-3 w-full md:w-52 h-fit">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Disponibilidade
                </p>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-3 h-3 rounded-md bg-white border-2 border-slate-200" />
                  <span>Livre</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-3 h-3 rounded-md bg-gray-400 border border-slate-100 opacity-60" />
                  <span>Sem Horários</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-3 h-3 rounded-md bg-red-600 border border-slate-100 opacity-60" />
                  <span>Ocupado</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-3 h-3 rounded-md bg-amber-600 border border-slate-100 opacity-60" />
                  <span>Já solicitado.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-4 h-4 rounded-md bg-blue-600 border border-slate-100 opacity-60" />
                  <span>Você já possui sessão este horário.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-300 text-slate-500 hover:bg-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              disabled={!isFormValid}
              onClick={handleSubmit}
              className={`
							px-8 
							py-2.5 
							rounded-xl 
							font-bold 
							text-sm
							transition-all
							${
                !isFormValid
                  ? "bg-slate-300 text-slate-400 cursor-not-allowed"
                  : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-indigo-800 cursor-pointer"
              }
						`}
            >
              Confirmar Solicitação
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

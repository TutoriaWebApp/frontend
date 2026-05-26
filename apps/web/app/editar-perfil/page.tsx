"use client";

import React, { useEffect, useState, useContext } from "react";
import { ClipLoader } from "react-spinners";

import {
  GetUserDataClient,
  GetSchedule,
} from "@repo/services/userClient";

import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import { UserData } from "@repo/services/userTypes";

import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

import { Grade, TurnLeftOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";

import { ChangePasswordModal } from "@repo/ui/changePasswordModal";
import { DeleteStudentAreaModal } from "@repo/ui/Modals/StudentAreas/DeleteStudentArea";
import { DeleteTutorAreaModal } from "@repo/ui/Modals/TutorAreas/DeleteTutorAreas";
import { DeleteSpecialtyModal } from "@repo/ui/Modals/Specialty/DeleteSpecialtyModal";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { GetStates } from "@repo/services/states";
import { StateResult } from "../../../../packages/services/src/types/states";
import { GetCities } from "@repo/services/cities";
import { CityResult } from "../../../../packages/services/src/types/cities";

import { ImageUpload } from "@repo/ui/ImageUpload/ImageUpload";

import { AvailabilityManager } from "@repo/ui/Availability/AvailabilityManager";
import { AddStudentArea } from "@repo/ui/addStudentAreaButton";
import { AddTutorAreaButton } from "@repo/ui/addTutorAreaButton";
import { AddSpecialty } from "@repo/ui/AddSpeciality/AddSpecialty";

import { StudentArea, TutorArea, Specialty } from "@repo/services/userTypes";

import {
  BecomeTutorAction,
  DeleteScheduleAction,
  DeleteSpecialtyAction,
  EditProfileAction,
  InsertScheduleAction,
  InsertSpecialtyAction,
} from "@repo/services/userAction";
import { TimeSlot } from "@repo/services/availabilityTypes";

const registerSchema = z.object({
  nomePerfil: z
    .string()
    .min(1, "Seu perfil deve ter um nome.")
    .max(100, "O nome só pode conter até 100 caracteres."),
  estado: z.string().min(1, "É obrigatório informar seu estado."),
  cidade: z.string().min(1, "É obrigatório infomar sua cidade"),
  aniversario: z
    .string()
    .refine(
      (stringDate) => {
        if (!stringDate) {
          return true;
        }

        const date = new Date(stringDate);

        return !isNaN(date.getTime());
      },
      { message: "Data inválida." },
    )
    .refine(
      (stringDate) => {
        if (!stringDate) {
          return true;
        }
        const date = new Date(stringDate);

        const currentDate = new Date();

        return date <= currentDate;
      },
      { message: "A data não pode ser futura." },
    )
    .nullable(),
  foto: z
    .any()
    .nullable()
    .refine(
      (file) => !file || file instanceof File,
      "A foto de perfil é obrigatória.",
    ),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function EditProfilePage() {
  const methods = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);
  const [states, setStates] = useState<StateResult[]>([]);
  const [cities, setCities] = useState<CityResult[]>([]);
  // const [studentAreas, setStudentAreas] = useState<StudentArea[]>([
  //   { id: 1, area: "Matemática" },
  //   { id: 2, area: "Matemática" },
  // ]);

  const [validTutorAreas, setValidTutorAreas] = useState<boolean | null>(null);

  const [tutorAreas, setTutorAreas] = useState<TutorArea[]>([]);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const [availabilities, setAvailabilities] = useState<TimeSlot[]>([]);
  const selectedEstado = watch("estado", userData?.estado);

  const { showNotification } = useContext(NotificationContext);

  // Change Password Modal
  const openChangePasswordModal = () => setChangePasswordModalIsOpen(true);
  const closeChangePasswordModal = () => setChangePasswordModalIsOpen(false);

  // Student Area Modal
  const [openDeleteStudentAreaModal, setDeleteStudentAreaModal] =
    useState<boolean>(false);
  const setDeleteStudentAreaModalOpen = () => setDeleteStudentAreaModal(true);
  const closeDeleteStudentAreaModal = () => setDeleteStudentAreaModal(false);
  const [studentAreaToDelete, setStudentAreaToDelete] =
    useState<StudentArea | null>(null);

  // Tutor Area Modal
  const [openDeleteTutorAreaModal, setDeleteTutorAreaModal] =
    useState<boolean>(false);
  const setDeleteTutorAreaModalOpen = () => setDeleteTutorAreaModal(true);
  const closeDeleteTutorAreaModal = () => setDeleteTutorAreaModal(false);
  const [tutorAreaToDelete, setTutorAreaToDelete] = useState<TutorArea | null>(
    null,
  );

  // Specialty Modal
  const [openDeleteSpecialtyModal, setDeleteSpecialtyModal] =
    useState<boolean>(false);
  const setDeleteSpecialtyModalOpen = () => setDeleteSpecialtyModal(true);
  const closeDeleteSpecialtyModal = () => setDeleteSpecialtyModal(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<Specialty | null>(
    null,
  );

  const router = useRouter();
  
  const updateSpecialties = async () => {
    const newSpecialties: Specialty[] = [];
    const deletedSpecialties: Specialty[] = [];

    specialties.forEach((specialty) => {
      //Área nova (não estava incluida)
      if (!userData?.perfilTutor?.especialidades.includes(specialty)) {
        newSpecialties.push(specialty);
      }
    });

    userData?.perfilTutor?.especialidades.forEach((specialty) => {
      //Área deletada
      if (!specialties.includes(specialty)) {
        deletedSpecialties.push(specialty);
      }
    });

    if (newSpecialties.length >= 1) {
      newSpecialties.forEach(async (specialty) => {
        await InsertSpecialtyAction(specialty.id, userData!.perfilTutor!.id);
      });
    }

    if (deletedSpecialties.length >= 1) {
      deletedSpecialties.forEach(async (specialty) => {
        await DeleteSpecialtyAction(specialty.contemId!);
      });
    }
  };

  const updateAvailabilities = async () => {
    const newSchedules: TimeSlot[] = [];
    const deletedSchedules: TimeSlot[] = [];

    const tutorSchedules = await GetSchedule(userData?.perfilTutor?.id);

    if (tutorSchedules.success && tutorSchedules.data != undefined) {
      const profileSchedules = tutorSchedules.data

      //Verificar disponibilidade nova
      for (let i = 0; i < availabilities.length; i++) {
        let alreadyExists: boolean = false;

        for (let j = 0; j < profileSchedules.length; j++) {
          if (profileSchedules[j]?.id === availabilities[i]?.id) {
            alreadyExists = true;
            break;
          }
        }

        if (!alreadyExists) {
          newSchedules.push(availabilities[i]!);
        }
      }

      //Verificar disponibilidade para deletar
      for (let i = 0; i < profileSchedules.length; i++) {
        let exists: boolean = false;

        for (let j = 0; j < availabilities.length; j++) {
          if (availabilities[j]?.id === profileSchedules[i]?.id) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          deletedSchedules.push(profileSchedules[i]!);
        }
      }

      console.log("Para Inserir: ", newSchedules);
      console.log("Para Apagar: ", deletedSchedules);

      if (newSchedules.length >= 1) {
        newSchedules.forEach(async (availability) => {
          await InsertScheduleAction(availability, userData!.perfilTutor!.id);
        });
      }

      if (deletedSchedules.length >= 1) {
        deletedSchedules.forEach(async (availability) => {
          console.log(await DeleteScheduleAction(availability.id!));
        });
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const results = await GetUserDataClient();

      if (!results.success) {
        if (results.status === 401) {
          redirect("/?session=expired");
        }
      } else {
        setUserData(results.data);
        reset(results.data);

        if (results.data.perfilTutor) {
          setSpecialties(results.data.perfilTutor.especialidades);

          setTutorAreas(results.data.perfilTutor.areas);

          const tutorSchedules = await GetSchedule(results.data.perfilTutor.id);

          if (tutorSchedules.success && tutorSchedules.data != undefined) {
            setAvailabilities(tutorSchedules.data);
          }
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchStates() {
      setLoading(true);

      const res = await GetStates();

      if (typeof res === "string") {
        showNotification(res, "error");
        return;
      }

      setStates(res);

      setLoading(false);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      const res = await GetCities(selectedEstado);

      if (typeof res === "string") {
        showNotification(res, "error");
        return;
      }

      setCities(res);

      setLoading(false);
    }
    fetchCities();
  }, [selectedEstado]);

  useEffect(() => {
    // Se tiver os dados do usuário e a lista de cidades tiver carregado
    if (userData?.cidade && cities.length > 0) {
      setValue("cidade", userData.cidade);
    }
  }, [cities, userData, setValue]);

  useEffect(() => {
    if (
      tutorAreas.length >= 1 &&
      specialties.length >= 1 &&
      availabilities.length >= 1
    ) {
      setValidTutorAreas(true);
    } else {
      setValidTutorAreas(false);
    }
  }, [tutorAreas, specialties, availabilities]);

  const onSubmit = async (data: RegisterData) => {
    const hasAnyTutorData =
      tutorAreas.length > 0 ||
      specialties.length > 0 ||
      availabilities.length > 0;

    if (hasAnyTutorData && validTutorAreas === false) {
      showNotification(
        "É necessário ter área, especialidade e disponibilidade para ser tutor!",
        "error",
      );
      return;
    }

    if (!userData?.perfilTutor && validTutorAreas) {
      const resultadoTutor = await BecomeTutorAction();

      if (resultadoTutor.success) {
        specialties.forEach(async (specialty) => {
          console.log(
            await InsertSpecialtyAction(specialty.id, resultadoTutor.data!.id),
          );
        });

        availabilities.forEach(async (availability) => {
          console.log(
            await InsertScheduleAction(availability, resultadoTutor.data!.id),
          );
        });
      }
    }

    if (userData?.perfilTutor) {
      updateSpecialties();
      updateAvailabilities();
    }

    const formData = new FormData();

    formData.append("nomePerfil", data.nomePerfil);
    formData.append("estado", data.estado);
    formData.append("cidade", data.cidade);

    if (data.foto) formData.append("foto", data.foto);

    const result = await EditProfileAction(formData);

    if (result.success) {
      showNotification("Perfil alterado com sucesso!", "success");

      router.refresh();

      router.push("/meu-perfil");
    } else {
      showNotification("Não foi possível realizar as alterações", "error");
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
      {!loading && !userData && (
        <h1>Não foi possível obter os dados de perfil.</h1>
      )}
      {!loading && userData && (
        <FormProvider {...methods}>
          <div
            className="
            bg-slate-50 
        "
          >
            <main
              className="
                max-w-5xl 
                mx-auto 
                px-4 
                pt-8 
            "
            >
              {/* Seção de Dados Pessoais */}
              <section
                className="
                        bg-white 
                        rounded-3xl 
                        p-8 
                        border 
                        border-slate-200 
                        shadow-sm
                      "
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div
                    className="
                            w-32 
                            h-32 
                            md:w-40 
                            md:h-40 
                            bg-slate-200 
                            rounded-2xl 
                            border-4 
                            border-slate-200 
                            shadow-md 
                            flex-shrink-0 
                            flex 
                            items-center 
                            justify-center
                          "
                  >
                    <img
                      // Cache Busting
                      src={`${userData.fotoURL}?t=${new Date().getTime()}`}
                      alt="Foto do Perfil"
                      className="
                              w-full
                              rounded-2xl
                            "
                    />
                  </div>

                  {/* Informações Principais */}
                  <div
                    className="
                            flex-1 
                            space-y-4
                          "
                  >
                    <div
                      className="
                              flex 
                              flex-col 
                              gap-3
                            "
                    >
                      <h1
                        className="
                                text-3xl 
                                font-bold 
                                text-slate-800
                              "
                      >
                        {userData.nomePerfil}
                      </h1>
                      <p
                        className="
                                text-slate-500 
                                font-medium
                              "
                      >
                        {userData.cidade} - {userData.estado}
                      </p>
                      <p
                        className="
                                text-brand-primary 
                                md:text-sm 
                                font-semibold 
                                mt-1
                                2xl:text-base
                              "
                      >
                        Nível {userLevel(userData.pontuacao)} -{" "}
                        {userTitle(userLevel(userData.pontuacao))}
                      </p>
                    </div>

                    {/* Resumo de Avaliações */}
                    <div
                      className="
                              grid 
                              grid-cols-2
                            "
                    >
                      <div
                        className="
                                flex 
                                gap-1
                              text-slate-600
                                items-center
                              "
                      >
                        <Grade
                          className="text-amber-400"
                          sx={{ fontSize: 20 }}
                        />
                        <span
                          className="
                                  md:text-sm 
                                  font-medium 
                                  2xl:text-base
                                "
                        >
                          4.7 como{" "}
                          <em className="text-slate-800 not-italic font-bold">
                            Tutor
                          </em>{" "}
                          (123 avaliações)
                        </span>
                      </div>
                      <div
                        className="
                                flex 
                                items-center 
                                gap-1
                                text-slate-600
                              "
                      >
                        <Grade
                          className="text-amber-400"
                          sx={{ fontSize: 20 }}
                        />
                        <span
                          className="
                                  md:text-sm 
                                  font-medium
                                  2xl:text-base
                                "
                        >
                          4.9 como{" "}
                          <em className="text-slate-800 not-italic font-bold">
                            Aprendiz
                          </em>{" "}
                          (45 avaliações)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção de Edição de Informações Pessoais*/}
              <div
                className="
              bg-white 
              rounded-3xl 
              p-8 
              border 
              border-slate-200 
              shadow-sm
              mt-6
              flex
              flex-col
              md:gap-4
              2xl:gap-10
              "
              >
                <h2
                  className="
                  text-3xl 
                  font-bold 
                  text-slate-800 
                  mb-6
                  text-center 
              "
                >
                  Editar Perfil
                </h2>
                <h3
                  className="
                  text-xl 
                  font-bold 
                text-slate-800 
                  mb-6
                  border-b-2
                  pb-2
              "
                >
                  Informações Pessoais
                </h3>
                <section
                  className="
                  flex 
                  flex-col
                  md:block
                "
                >
                  <ImageUpload
                    name="foto"
                    label="Foto de Perfil"
                    required={false}
                  />
                  <label
                    className="
                  flex 
                  flex-col 
                  w-full
                  gap-2
              "
                  >
                    <span
                      className="
                    font-semibold 
                "
                    >
                      Nome<span className="text-rose-500">*</span>
                    </span>
                    <input
                      type="text"
                      {...register("nomePerfil")}
                      defaultValue={userData.nomePerfil}
                      className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                  "
                      placeholder="Digite seu nome e sobrenome"
                    />
                  </label>
                  <div
                    className="
                mt-6
                mb-6 
              "
                  >
                    {errors.nomePerfil && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.nomePerfil.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                flex 
                items-center
              "
                  >
                    <label
                      className="
                flex 
                flex-col 
                mb-4
                w-full
                gap-2
              "
                    >
                      <span className="font-semibold">
                        Estado<span className="text-rose-500">*</span>
                      </span>
                      <select
                        {...register("estado")}
                        className="
                        bg-white  
                          w-full
                        text-slate-900
                          rounded-md
                          py-1
                          border-2
                          border-slate-300"
                        defaultValue={userData.estado}
                      >
                        <option value="" disabled hidden>
                          Selecione uma opção
                        </option>
                        {states?.map((state) => (
                          <option key={state.id} value={state.sigla}>
                            {state.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                 "
                  >
                    <label
                      className="
                      flex 
                      flex-col 
                      w-full
                      gap-2
                    "
                    >
                      <span className="font-semibold">
                        Cidade<span className="text-rose-500">*</span>
                      </span>
                      <select
                        {...register("cidade")}
                        className="
                        bg-white  
                        w-full
                        text-slate-900
                          rounded-md
                          py-1
                          border-2
                        border-slate-300
                        "
                        defaultValue={userData.cidade}
                      >
                        {cities.map((city) => (
                          <option key={city.id} value={city.nome}>
                            {city.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="
                    mt-6
                    mb-6 
                  "
                  >
                    {errors.cidade && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.cidade.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                 "
                  >
                    <label
                      className="
                      flex 
                      flex-col 
                      mb-4
                      w-full
                      gap-2
                    "
                    >
                      <span className="font-semibold">Sobre Mim</span>
                      <textarea
                        rows={6}
                        className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                        overflow-y-scroll
                        resize-none
                    "
                      />
                    </label>
                  </div>
                  <button
                    className="
                    bg-brand-primary 
                    hover:bg-indigo-800 
                    text-white 
                      font-bold 
                      py-2.5 
                      px-6 
                      rounded-xl 
                      transition-all 
                      shadow-lg 
                    shadow-brand-primary/20
                      mt-4
                      mb-4
                      self-end
                      md:relative
                      md:left-[80%]
                  "
                    onClick={openChangePasswordModal}
                  >
                    Alterar Senha
                  </button>
                </section>
                {/* <section>
                  <h3
                    className="
                      text-xl 
                      font-bold 
                    text-slate-800 
                      mb-6
                      border-b-2
                      pb-2
                      mt-8
                  "
                  >
                    Áreas de Interesse como Aprendiz
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {studentAreas.map((area, index) => (
                      <div
                        key={index}
                        className="
                        flex 
                        items-center
                        bg-slate-100 
                        px-4 
                        py-2 
                        rounded-full
                        gap-2
                      "
                      >
                        <span
                          className="
                            text-slate-700 
                            text-sm 
                            font-semibold
                        "
                        >
                          {area.nomeArea}
                        </span>
                        <DeleteIcon
                          onClick={() => {
                            setStudentAreaToDelete(area);
                            setDeleteStudentAreaModalOpen();
                          }}
                          className="
                          text-rose-500
                          cursor-pointer
                          hover:text-[28px]
                          hover:text-rose-900
                          transition-all
                          "
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <AddStudentArea
                      areas={studentAreas}
                      setAreas={setStudentAreas}
                    />
                  </div>
                </section> */}
                <section>
                  <h3
                    className="
                      text-xl 
                      font-bold 
                    text-slate-800 
                      mb-6
                      mt-8
                      border-b-2
                      pb-2
                      2xl:mt-0
                  "
                  >
                    Perfil como Tutor
                  </h3>
                  <h4 className="font-bold 2xl:text-lg mt-6 mb-6">
                    Áreas de Tutoria
                  </h4>
                  <div className="flex items-center gap-2 mb-6">
                    <InfoIcon className="text-indigo-600" />
                    <span>
                      É necessário ter ao menos{" "}
                      <em className="not-italic font-bold">
                        1 área e 1 especialidade
                      </em>{" "}
                      para ser considerado um tutor.
                    </span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <span>
                      <b>Áreas Adicionadas</b>
                    </span>
                    <div className=" mt-4 flex gap-4 flex-wrap mb-10">
                      {tutorAreas.map((area, index) => (
                        <div
                          key={index}
                          className="
                          flex 
                          items-center
                          bg-slate-100 
                          px-4 
                          py-2 
                          rounded-full
                          gap-2
                        "
                        >
                          <span
                            className="
                            text-slate-700 
                            text-sm 
                            font-semibold
                        "
                          >
                            {area.nomeArea}
                          </span>
                          <DeleteIcon
                            onClick={() => {
                              setTutorAreaToDelete(area);
                              setDeleteTutorAreaModalOpen();
                            }}
                            className="
                          text-rose-500
                          cursor-pointer
                          hover:text-[28px]
                          hover:text-rose-900
                          transition-all
                          "
                          />
                        </div>
                      ))}
                    </div>
                    <span>
                      <b>Especialidades Adicionadas</b>
                    </span>
                    <div className="mt-4 flex gap-4 flex-wrap">
                      {specialties.map((specialty) => (
                        <div
                          key={specialty.id}
                          className="
                        flex 
                        items-center
                        bg-slate-100 
                        px-4 
                        py-2 
                        rounded-full
                        gap-2
                      "
                        >
                          <span
                            className="
                            text-slate-700 
                            text-sm 
                            font-semibold
                        "
                          >
                            {specialty.nomeEspecialidade}
                          </span>
                          <DeleteIcon
                            onClick={() => {
                              setSpecialtyToDelete(specialty);
                              setDeleteSpecialtyModalOpen();
                            }}
                            className="
                          text-rose-500
                          cursor-pointer
                          hover:text-[28px]
                          hover:text-rose-900
                          transition-all
                          "
                          />
                        </div>
                      ))}
                    </div>
                    <div className="self-end">
                      <AddSpecialty
                        areas={tutorAreas}
                        setAreas={setTutorAreas}
                        specialties={specialties}
                        setSpecialties={setSpecialties}
                      />
                    </div>
                  </div>
                  <h4
                    className="
                    font-bold 
                    2xl:text-lg 
                    mt-6 
                    mb-6
                  "
                  >
                    Disponibilidade
                  </h4>
                  <div className="flex items-center gap-2 mb-6">
                    <InfoIcon className="text-indigo-600" />
                    <span>
                      É necessário ter ao menos{" "}
                      <em className="not-italic font-bold">
                        1 disponibilidade
                      </em>{" "}
                      para ser considerado um tutor.
                    </span>
                  </div>
                  <AvailabilityManager
                    availabilities={availabilities}
                    setAvailabilities={setAvailabilities}
                  />
                </section>
                <div className="flex justify-between">
                  <Link
                    href={"/meu-perfil"}
                    className="
                      p-4 
                      pb-0 
                      flex 
                      items-center
                    text-brand-primary 
                      hover:font-bold 
                      hover:underline 
                      transition-all
                  "
                  >
                    <ArrowBackIcon className="mr-1" />
                    <span>Voltar para Perfil</span>
                  </Link>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    type="button"
                    className="
                      w-auto 
                      md:w-auto 
                      bg-brand-primary 
                      hover:bg-indigo-800  
                      text-white 
                      font-bold 
                      py-2
                      px-8 
                      rounded-xl 
                      transition-all 
                      shadow-lg 
                      shadow-brand-primary/20 
                  "
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </main>
          </div>
        </FormProvider>
      )}
      <ChangePasswordModal
        isOpen={changePasswordModalIsOpen}
        onClose={closeChangePasswordModal}
      />
      {/* <DeleteStudentAreaModal
        isOpen={openDeleteStudentAreaModal}
        onClose={closeDeleteStudentAreaModal}
        setAreas={setStudentAreas}
        area={studentAreaToDelete}
        areas={studentAreas}
      /> */}
      <DeleteTutorAreaModal
        isOpen={openDeleteTutorAreaModal}
        onClose={closeDeleteTutorAreaModal}
        setAreas={setTutorAreas}
        area={tutorAreaToDelete}
        areas={tutorAreas}
        specialties={specialties}
        setSpecialties={setSpecialties}
      />
      <DeleteSpecialtyModal
        isOpen={openDeleteSpecialtyModal}
        onClose={closeDeleteSpecialtyModal}
        setSpecialties={setSpecialties}
        specialty={specialtyToDelete}
        specialties={specialties}
      />
    </>
  );
}

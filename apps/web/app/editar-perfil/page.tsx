"use client";

import React, { useEffect, useState, useContext } from "react";
import { ClipLoader } from "react-spinners";

import { GetUserDataClient } from "@repo/services/userClient";
import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import { UserData } from "@repo/services/userTypes";

import { redirect } from "next/navigation";
import Link from "next/link";

import { Grade } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from '@mui/icons-material/Info';

import { ChangePasswordModal } from "@repo/ui/changePasswordModal";

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
import { AddArea } from "@repo/ui/addArea";
import { AddSpecialty } from "@repo/ui/AddSpeciality/AddSpecialty";

interface StudentAreas {
  id: number;
  area: string;
}

interface TutorAreas {
  id: number;
  area: string;
}

interface Specialty {
  id: number;
  specialty: string;
}

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
    .refine((file) => file instanceof File, "A foto de perfil é obrigatória."),
  passwordConfirm: z
    .string()
    .min(10, "A senha deve possuir 10 ou mais caracteres.")
    .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
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
    formState: { errors },
  } = methods;

  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);
  const [states, setStates] = useState<StateResult[]>([]);
  const [cities, setCities] = useState<CityResult[]>([]);
  const [studentAreas, setStudentAreas] = useState<StudentAreas[]>([
    { id: 1, area: "Matemática" },
    { id: 2, area: "Física" },
    { id: 3, area: "Programação" },
    { id: 4, area: "UI Design" },
    { id: 5, area: "Algoritmos" },
  ]);

  const [tutorAreas, setTutorAreas] = useState<TutorAreas[]>([
    { id: 1, area: "Matemática" },
    { id: 2, area: "Física" },
    { id: 3, area: "Programação" },
    { id: 4, area: "UI Design" },
    { id: 5, area: "Algoritmos" },
  ]);

  const [specialties, setSpecialties] = useState<Specialty[]>([
    { id: 1, specialty: "Matemática" },
    { id: 2, specialty: "Física" },
    { id: 3, specialty: "Programação" },
    { id: 4, specialty: "UI Design" },
    { id: 5, specialty: "Algoritmos" },
  ]);

  const selectedEstado = watch("estado", userData?.estado);

  const { showNotification } = useContext(NotificationContext);

  const openChangePasswordModal = () => setChangePasswordModalIsOpen(true);
  const closeChangePasswordModal = () => setChangePasswordModalIsOpen(false);

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
                      src={userData.fotoURL}
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
                <section>
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
                      relative
                      left-[80%]
                  "
                    onClick={openChangePasswordModal}
                  >
                    Alterar Senha
                  </button>
                </section>
                <section>
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
                    Áreas de Interesse como Aprendiz
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {/* Tags de exemplo */}
                    {studentAreas.map((area) => (
                      <div
                        key={area.id}
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
                          {area.area}
                        </span>
                        <DeleteIcon
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
                    <AddArea />
                  </div>
                </section>
                <section>
                  <h3
                    className="
                      text-xl 
                      font-bold 
                    text-slate-800 
                      mb-6
                      md:mt-8
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
                    <InfoIcon className="text-indigo-600"/>
                    <span>É necessário ter ao menos <em className="not-italic font-bold">1 área</em> para ser considerado um tutor.</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {/* Tags de exemplo */}
                    {tutorAreas.map((area) => (
                      <div
                        key={area.id}
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
                          {area.area}
                        </span>
                        <DeleteIcon
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
                    <AddArea />
                  </div>
                  <h4 className="font-bold 2xl:text-lg mt-6 mb-6">
                    Especialidades
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {/* Tags de exemplo */}
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
                          {specialty.specialty}
                        </span>
                        <DeleteIcon
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
                    <AddSpecialty />
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
                    <InfoIcon className="text-indigo-600"/>
                    <span>É necessário ter ao menos <em className="not-italic font-bold">1 disponibilidade</em> para ser considerado um tutor.</span>
                  </div>
                  <AvailabilityManager />
                </section>
                <div className="flex justify-between">
                  <Link
                    href={"/perfil"}
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
                    type="button"
                    className="
                      w-full 
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
    </>
  );
}

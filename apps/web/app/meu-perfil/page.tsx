import React from "react";

import {
  GetSchedule,
  GetUserData,
} from "@repo/services/userServer";
import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import { Specialty, TutorArea, UserData } from "@repo/services/userTypes";

import { redirect } from "next/navigation";

import { Grade } from "@mui/icons-material";

import { ReviewSection } from "@repo/ui/reviewSection";
import { EditProfileButton } from "@repo/ui/editProfileButton";
import { AvailabilitySection } from "@repo/ui/availabilitySection";
import { TimeSlot } from "@repo/services/availabilityTypes";

export default async function ProfilePage() {
  let userData: UserData | boolean = false;
  let tutorAreas: TutorArea[] = [];
  let specialties: Specialty[] = [];
  let availabilities: TimeSlot[] = [];

  const results = await GetUserData();

  if (!results.success) {
    if (results.status === 401) {
      redirect("/?session=expired");
    }
  } else {
    userData = results.data;

    if (userData.perfilTutor) {
      specialties = userData.perfilTutor.especialidades;

      tutorAreas = userData.perfilTutor.areas;

      const tutorSchedules = await GetSchedule(userData.perfilTutor.id);

      if (tutorSchedules.success && tutorSchedules.data != undefined) {
        availabilities = tutorSchedules.data;
      }
    }
  }

  return (
    <>
      {!userData && <h1>Não foi possível obter os dados de perfil.</h1>}
      {userData && (
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
          space-y-6
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
                      <Grade className="text-amber-400" sx={{ fontSize: 20 }} />
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
                      <Grade className="text-amber-400" sx={{ fontSize: 20 }} />
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

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <EditProfileButton />
                </div>
              </div>
              <h2
                className="
              text-xl 
              font-bold 
              text-slate-800 
              mb-4
              mt-8
            "
              >
                Sobre Mim
              </h2>
              <p
                className="
              text-slate-600 
              leading-relaxed 
            "
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </section>

            {/* Seção Áreas de Tutoria e Especialidades */}
            {tutorAreas.length >= 1 && specialties.length >= 1 && (
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
                <h2
                  className="
                text-xl 
              font-bold 
              text-slate-800 
              mb-6 
            "
                >
                  Áreas de Tutoria
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tutorAreas.map((area) => (
                    <span
                      key={area.id}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold border border-slate-200"
                    >
                      {area.nomeArea}
                    </span>
                  ))}
                </div>
                <h2
                  className="
                text-xl 
                font-bold 
                text-slate-800 
                mb-6
              mt-8 
            "
                >
                  Especialidades
                </h2>
                <div className="flex flex-wrap gap-3">
                  {specialties.map((specialty) => (
                    <span
                      key={specialty.id}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold border border-slate-200"
                    >
                      {specialty.nomeEspecialidade}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Seção de Disponibilidades */}
            {availabilities.length >= 1 && (
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
                <h2
                  className="
              text-xl 
              font-bold 
              text-slate-800 
              mb-6 
            "
                >
                  Disponibilidade
                </h2>
                <AvailabilitySection
                  availabilities={availabilities}
                  ownProfile={true}
                />
              </section>
            )}
            <ReviewSection />
          </main>
        </div>
      )}
    </>
  );
}

import React from "react";

import {
  GetSchedule,
  GetSpecificUserData,
  GetSpecificTutor,
} from "@repo/services/userServer";
import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import {
  Specialty,
  SpecificUserData,
  TutorArea,
  TutorData,
} from "@repo/services/userTypes";

import { redirect } from "next/navigation";

import { Grade } from "@mui/icons-material";

import { ReviewSection } from "@repo/ui/reviewSection";
import { EditProfileButton } from "@repo/ui/editProfileButton";
import { SendFirstMessageButton } from "@repo/ui/sendFirstMessageButton";
import { AvailabilitySection } from "@repo/ui/availabilitySection";
import { TimeSlot } from "@repo/services/availabilityTypes";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = (await params).id;

  let userData: SpecificUserData | null = null;
  let tutorData: TutorData | null = null;
  let notAvailable: boolean | null = null;

  let tutorAreas: TutorArea[] = [];
  let specialties: Specialty[] = [];
  let availabilities: TimeSlot[] = [];

  const resultsUserData = await GetSpecificUserData(id);

  if (resultsUserData.success) {
    userData = resultsUserData.data!;

    if (userData?.tutorId) {
      const resultsTutor = await GetSpecificTutor(userData?.tutorId);
      if (resultsTutor.success) {
        tutorData = resultsTutor.data!;
        specialties = resultsTutor.data?.especialidades!;

        tutorAreas = resultsTutor.data!.areas;
        specialties = resultsTutor.data!.especialidades;

        const resultsSchedule = await GetSchedule(resultsTutor.data!.id!);

        if (resultsSchedule.success) {
          availabilities = resultsSchedule.data!;
        }
      }
    }
  } else {
    notAvailable = true;
  }

  return (
    <>
      {notAvailable && (
        <h1 className="mx-auto my-auto md:text-xl">
          Não foi possível obter os dados do usuário.
        </h1>
      )}
      {!notAvailable && (
        <div className="bg-slate-50">
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
              <div
                className="
                flex 
                flex-col 
                md:flex-row 
                gap-8 
                items-start
              "
              >
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
                    src={`${userData!.fotoURL}?t=${new Date().getTime()}`}
                    alt="Foto do Perfil"
                    className="w-full rounded-2xl"
                  />
                </div>

                {/* Informações Principais */}
                <div className="flex-1 space-y-4">
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
                      {userData!.nomePerfil}
                    </h1>
                    <p
                      className="text-slate-500 font-medium
                    "
                    >
                      {userData!.cidade} - {userData!.estado}
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
                      Nível {userLevel(userData!.pontuacao)} -{" "}
                      {userTitle(userLevel(userData!.pontuacao))}
                    </p>
                  </div>

                  {/* Resumo de Avaliações */}
                  <div className="grid grid-cols-2">
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
                        {Number.isInteger(userData!.notaAvaliacao)
                          ? userData!.notaAvaliacao.toFixed(1)
                          : userData!.notaAvaliacao.toFixed(2)}{" "}
                        como{" "}
                        <em className="text-slate-800 not-italic font-bold">
                          Aprendiz
                        </em>{" "}
                        ({userData!.totalAvaliacoes} avaliações)
                      </span>
                    </div>
                    {tutorData && (
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
                          {Number.isInteger(tutorData.notaAvaliacao)
                            ? tutorData!.notaAvaliacao.toFixed(1)
                            : tutorData!.notaAvaliacao.toFixed(2)}{" "}
                          como{" "}
                          <em className="text-slate-800 not-italic font-bold">
                            Tutor
                          </em>{" "}
                          ({tutorData.totalAvaliacoes} avaliações)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {userData!.sobremim && (
                <>
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
                    {userData!.sobremim}
                  </p>
                </>
              )}
              {tutorData && (
                <div
                  className="
            flex 
            w-full
            justify-end 
            mt-4
            mb-4
            "
                >
                  <SendFirstMessageButton
                    tutorName={userData!.nomePerfil}
                    tutorId={tutorData.id}
                  />
                </div>
              )}
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
                  ownProfile={false}
                  areas={tutorAreas}
                  specialties={specialties}
                  tutorId={id}
                />
              </section>
            )}
            <ReviewSection
              userId={userData!.id}
              areas={tutorAreas}
              specialties={specialties}
              tutorId={tutorData?.id ?? null}
            />
          </main>
        </div>
      )}
    </>
  );
}

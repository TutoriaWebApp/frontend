import React from "react";

import { GetUserData } from "@repo/services/user";
import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import { UserData } from "@repo/services/userTypes";

import { redirect } from "next/navigation";

import { Grade } from "@mui/icons-material";

import ReviewSection from "@repo/ui/ReviewSection/ReviewSection";

export default async function ProfilePage() {
  let userData: UserData | boolean = false;

  const results = await GetUserData();

  if (!results.success) {
    if (results.status === 401) {
      redirect("/?session=expired");
    }
  } else {
    userData = results.data;
  }

  return (
    <>
      {!userData && <h1>Não foi possível obter os dados de perfil.</h1>}
      {userData && 
      <div className="
      bg-slate-50 
      ">
        <main className="
          max-w-5xl 
          mx-auto 
          px-4 
          pt-8 
          space-y-6
        ">
          {/* Seção de Cabeçalho do Perfil */}
          <section className="
            bg-white 
            rounded-3xl 
            p-8 
            border 
            border-slate-200 
            shadow-sm
          ">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="
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
                <img src={userData.fotoURL} alt="Foto do Perfil" className="
                  w-full
                  rounded-2xl
                "/>
              </div>

              {/* Informações Principais */}
              <div className="
                flex-1 
                space-y-4
              ">
                <div className="
                  flex 
                  flex-col 
                  gap-3
                ">
                  <h1 className="
                    text-3xl 
                    font-bold 
                    text-slate-800
                  ">
                    {userData.nomePerfil}
                  </h1>
                  <p className="
                    text-slate-500 
                    font-medium
                  ">
                    {userData.cidade} - {userData.estado}
                  </p>
                  <p className="
                    text-brand-primary 
                    md:text-sm 
                    font-semibold 
                    mt-1
                    2xl:text-base
                  ">
                    Nível {userLevel(userData.pontuacao)} - {userTitle(userLevel(userData.pontuacao))}
                  </p>
                </div>

                {/* Resumo de Avaliações */}
                <div className="
                  grid 
                  grid-cols-2
                ">
                  <div className="
                    flex 
                    gap-1
                  text-slate-600
                    items-center
                  ">
                    <Grade
                      className="text-amber-400"
                      sx={{ fontSize: 20 }}
                    />
                    <span className="
                      md:text-sm 
                      font-medium 
                      2xl:text-base
                    ">
                      4.7 como <em className="text-slate-800 not-italic font-bold">Tutor</em>{" "}
                      (123 avaliações)
                    </span>
                  </div>
                  <div className="
                    flex 
                    items-center 
                    gap-1
                    text-slate-600
                  ">
                    <Grade
                      className="text-amber-400"
                      sx={{ fontSize: 20 }}
                    />
                    <span className="
                      md:text-sm 
                      font-medium
                      2xl:text-base
                    ">
                      4.9 como{" "}
                      <em className="text-slate-800 not-italic font-bold">Aprendiz</em> (45
                      avaliações)
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="
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
                ">
                  Editar Perfil
                </button>
              </div>
            </div>
          </section>

          {/* Seção Sobre Mim */}
          <section className="
            bg-white 
            rounded-3xl 
            p-8 
            border 
            border-slate-200 
            shadow-sm
          ">
            <h2 className="
              text-xl 
              font-bold 
              text-slate-800 
              mb-4 
            ">
              Sobre Mim
            </h2>
            <p className="
              text-slate-600 
              leading-relaxed 
            ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          {/* Seção Áreas de Conhecimento */}
          <section className="
            bg-white 
            rounded-3xl 
            p-8 
            border 
            border-slate-200 
            shadow-sm
          ">
            <h2 className="
              text-xl 
              font-bold 
              text-slate-800 
              mb-6 
            ">
              Áreas de Conhecimento
            </h2>
            <div className="flex flex-wrap gap-3">
              {/* Tags de exemplo */}
              {[
                "Matemática",
                "Física",
                "Programação",
                "UI Design",
                "Algoritmos",
              ].map((area) => (
                <span
                  key={area}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold border border-slate-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>
    }
    </>
  );
}

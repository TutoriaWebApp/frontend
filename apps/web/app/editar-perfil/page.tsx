"use client";

import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import { GetUserDataClient } from "@repo/services/userClient";
import { userLevel } from "@repo/lib/userLevel";
import { userTitle } from "@repo/lib/userTitle";

import { UserData } from "@repo/services/userTypes";

import { redirect } from "next/navigation";

import { Grade } from "@mui/icons-material";

import { ChangePasswordModal } from "@repo/ui/changePasswordModal";

export default function EditProfilePage() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(false);

  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);

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
              </div>
            </section>

            {/* Seção de Edição de Informações Pessoais*/}
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
              <button onClick={openChangePasswordModal}>Alterar Senha</button>
            </section>
          </main>
        </div>
      )}
      <ChangePasswordModal
        isOpen={changePasswordModalIsOpen}
        onClose={closeChangePasswordModal}
      />
    </>
  );
}

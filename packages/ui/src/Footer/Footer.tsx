import React from "react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactLinksLucas = [
    {icon: "/github-icon.svg", href: "https://github.com/LucasSpinosa", alt: "Ícone GitHub"},
    {icon: "/linkedin-icon.svg", href: "https://www.linkedin.com/in/lucas-spinosa-software/", alt: "Ícone LinkedIn"},
    {icon: "/gmail-icon.svg", href: "mailto:lucasspinosa.software@gmail.com", alt: "Ícone Gmail"},
  ]
    const contactLinksRodrigo = [
    {icon: "/github-icon.svg", href: "https://github.com/Rocsantos", alt: "Ícone GitHub"},
    {icon: "/linkedin-icon.svg", href: "https://www.linkedin.com/in/rodrigosantossoftware/",  alt: "Ícone LinkedIn"},
    {icon: "/gmail-icon.svg", href: "mailto:rodrigocarvalho4675@gmail.com",  alt: "Ícone Gmail"}
  ]

  return (
    <footer className="
      bg-slate-50 
      border-t 
      border-slate-200 
      pt-12 
      pb-8 
      px-8 
      mt-auto
      flex
      flex-col
      gap-6
    ">
      <div className="
        max-w-7xl 
        mx-auto 
        grid
        grid-cols-1 
        md:grid-cols-3
        gap-12
        2xl:gap-64
        ">
        <div className="
          flex 
          flex-col 
          gap-2
          2xl:w-[400px]
        ">
          <div className="
            flex 
            items-center 
            gap-2 
            opacity-80
            grayscale 
            hover:grayscale-0 
            hover:opacity-100 
            transition-all 
            duration-300
          ">
            <Image 
              src={"/logo.svg"} 
              alt="Logo" 
              width={30}
              height={30}
              className="2xl:w-[45px]" 
            />
            <span className="
              font- 
              text-xl 
              text-slate-900 
              tracking-tight 
              font-medium 
              font-montserrat
              2xl:text-2xl
            ">
              Tutoria<span className="text-brand-primary">Web</span>
            </span>
          </div>
          <p className="
            text-slate-500 
            text-sm 
            leading-relaxed
            2xl:text-base
          ">
            Plataforma gamificada focada no encontro de tutores com aprendizes.
          </p>
        </div>

        <div className="
          flex 
          flex-col 
          gap-4
          mb-4
          justify-center
          2xl:w-[600px]
          2xl:gap-4
          2xl:mb-[0px]
          ">
          <h4 className="
            text-slate-900 
            font-bold 
            text-sm 
            uppercase 
            tracking-widest
            2xl:text-base 
            "
          >
            Desenvolvido por
          </h4>
          <ul className="
            text-slate-600 
            text-sm 
            space-y-2
            2xl:text-base
            
          ">
            <li>Lucas de Lima Spinosa dos Santos</li>
            <li>Rodrigo Carvalho dos Santos</li>
          </ul>
        </div>

        <div className="
          flex 
          flex-col 
          gap-4
          justify-center
          ">
          <h4 className="
            text-slate-900 
            font-bold 
            text-sm 
            uppercase 
            tracking-widest
            2xl:text-base 
          ">
            Contato
          </h4>
          <div className="flex gap-4">
            {contactLinksLucas.map((link, index) => (
              <a key={index} href={link.href} target="_blank">
                <Image
                  src={link.icon}
                  alt={link.alt}
                  width={25}
                  height={25}
                  className="
                    opacity-80 
                    grayscale 
                    hover:grayscale-0 
                    hover:opacity-100 
                    transition-all 
                    duration-300
                    2xl:w-[28px]
                  "/>
              </a>
            ))}
          </div>
          <div className="flex gap-4">
            {contactLinksRodrigo.map((link, index) => (
              <a key={index} href={link.href} target="_blank">
                <Image
                  src={link.icon}
                  alt={link.alt}
                  width={25}
                  height={25}
                  className="
                    opacity-80 
                    grayscale 
                    hover:grayscale-0 
                    hover:opacity-100 
                    transition-all 
                    duration-300
                    2xl:w-[28px]
                  "/>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="
        w-full
        mx-auto 
        border-t 
        border-slate-200 
        flex 
        justify-center 
        items-center">
        <p className="
          text-slate-400 
          text-xs 
          text-center
          mt-8
          2xl:text-sm
        ">
          &copy; {currentYear} TutoriaWeb. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

"use client"

import React, { useState, useEffect } from 'react';

const TourModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour_TutoriaWeb');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTour_TutoriaWeb', 'true');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: 'Home',
      description: 'Aqui é o seu painel principal. Acompanhe as novidades e tenha uma visão geral das suas atividades na plataforma. Aqui também ocorrem as avaliações após as sessões.',
      image: '/home.png' 
    },
    {
      title: 'Perfil',
      description: 'Gerencie suas informações pessoais, informações como tutor e ajuste suas configurações de conta.',
      image: '/perfil.png'
    },
    {
      title: 'Conquistas',
      description: 'Acompanhe seu progresso! Aqui você visualiza as conquistas e pontuações que ganhou ao realizar atividades!',
      image: '/conquistas.png'
    },
    {
      title: 'Buscar Tutores',
      description: 'Precisa de ajuda? Encontre o tutor ideal para as disciplinas que você está com dificuldade para agendar uma tutoria!',
      image: '/buscar-tutores.png'
    },
    {
      title: 'Gerenciar Solicitações',
      description: 'Gerencie todos os seus pedidos de tutoria, tanto os que você enviou quanto os que recebeu de outros alunos.',
      image: '/solicitacoes.png'
    },
    {
      title: 'Mensagens',
      description: 'Continue conversas que iniciou com tutores ou que foram iniciadas com você! Fique de olho nas notificações para não perder nada!',
      image: '/mensagens.png'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4">
      {/* Limitada a 95% da altura da tela para celulares muito pequenos */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 truncate mr-2">
            Bem-vindo ao TutoriaWeb!
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold shrink-0 leading-none pb-1">
            &times;
          </button>
        </div>

        {/* Conteúdo com scroll interno se a tela for pequena */}
        <div className="p-4 sm:p-6 flex flex-col items-center text-center overflow-y-auto">
          {/* Altura da imagem reduzida no celular (h-32) e normal (h-48) no desktop */}
          <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden border shrink-0">
            <img 
              src={steps[currentStep]?.image} 
              alt={steps[currentStep]?.title} 
              className="object-contain w-full h-full p-2"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          
          <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">
            {steps[currentStep]!.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 min-h-[60px]">
            {steps[currentStep]!.description}
          </p>
        </div>

        {/* Indicadores de Progresso (Bolinhas) */}
        <div className="flex justify-center gap-2 mb-4 shrink-0">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full transition-colors ${index === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Rodapé e Botões - Empilhados no celular, lado a lado no desktop */}
        <div className="p-3 sm:p-4 border-t flex flex-col-reverse sm:flex-row justify-between items-center bg-gray-50 gap-3 sm:gap-0 shrink-0">
          <button 
            onClick={handleClose} 
            className="text-sm text-gray-500 hover:text-gray-800 font-medium py-2 sm:py-0 w-full sm:w-auto"
          >
            Pular Tour
          </button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-lg text-sm font-bold transition-all ${
                currentStep === 0 
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300 active:scale-95'
              }`}
            >
              Anterior
            </button>
            <button 
              onClick={handleNext}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
            >
              {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TourModal;
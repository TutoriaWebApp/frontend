import AddIcon from "@mui/icons-material/Add";

export const AddSpecialty = () => {
  return (
    <button
      type="button"
      className="
        w-full 
        md:w-auto 
      bg-emerald-600 
      hover:bg-emerald-800  
      text-white 
        font-bold 
        py-2
        px-8 
        rounded-xl 
        transition-all 
        shadow-lg 
        shadow-brand-primary/20
        flex
        items-center
        gap-2
        mt-12
    ">
      <AddIcon />
      <span>Adicionar Especialidade</span>
    </button>
  );
};

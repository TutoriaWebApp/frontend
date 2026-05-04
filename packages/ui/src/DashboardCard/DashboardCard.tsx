import Link from "next/link";

export const DashboardCard = ({ 
  title,
  description, 
  buttonText, 
  icon: Icon, 
  colorClass, 
  btnClass,
  href 
}: any) => (
  <div className={`flex flex-col items-center p-8 rounded-3xl border border-slate-100 shadow-sm ${colorClass} transition-transform hover:scale-[1.02]`}>
    <div className="mb-4">
      <Icon sx={{ fontSize: 40 }} />
    </div>
    <h3 className={`text-lg font-bold mb-3 text-center`}>{title}</h3>
    <p className="text-sm text-slate-600 text-center mb-8 leading-relaxed">
      {description}
    </p>
    <Link href={href} className={`mt-auto px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-95 ${btnClass}`}>
      {buttonText}
    </Link>
  </div>
);

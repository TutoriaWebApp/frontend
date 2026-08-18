export function formatarDataBR(dataIso: string): string {
	if(!dataIso){
        return "";
    } 
	
	const data = new Date(`${dataIso}T00:00:00Z`);
	
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "UTC"
	}).format(data);
}
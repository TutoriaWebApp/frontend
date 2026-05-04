const titlesThreshoulds = [
    {level: 1, title: 'NPC Genérico'},
    {level: 2, title: 'Noob com Orgulho'},
    {level: 3, title: 'Sobrevivi ao Tutorial'},
    {level: 4, title: 'Genin Esforçado'},
    {level: 5, title: 'Jovem Padawan'},
    {level: 10, title: 'Farmador de XP'},
    {level: 15, title: 'Estagiário Sênior'},
    {level: 20, title: 'Faixa Preta de Taubaté'},
    {level: 25, title: 'Caçador de Conquistas'},
    {level: 30, title: 'O miserável é um gênio!'},
    {level: 35, title: 'Super Saiyajin Base'},
    {level: 40, title: 'Sábio dos Seis Caminhos'},
    {level: 45, title: 'Speedrunner do Saber'},
    {level: 50, title: 'Platina Humana'},
]

export const userTitle = (level:number): string => {
    let title: string = "";

    for(let i = 0; i < titlesThreshoulds.length; i++){
        //Tratando o caso do Level 50
        if(titlesThreshoulds[i+1] == undefined){
            title = titlesThreshoulds[i]!.title
            break;
        }
        if(level >= titlesThreshoulds[i]!.level && level < titlesThreshoulds[i+1]!.level){
            title = titlesThreshoulds[i]!.title;
            break;
        }
    }
    return title; 
}
export function formatTime(time: string): string {
    if(!time){
        return "";
    } 
    
    const formattedTime = `${time[0]}${time[1]}:${time[3]}${time[4]}`;
    
    return formattedTime;
}
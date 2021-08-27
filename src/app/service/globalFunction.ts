export function isNumberKey(event) : any {
    console.log(event);
    if(event.charCode >= 48 && event.charCode <= 57){
        return true;
    }
    return false;
}

export function getDateFormat(date) : any {
    let dt = new Date(date);
    let year  = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day   = dt.getDate().toString().padStart(2, "0");
    return year + '-' + month + '-' + day;
}

export function getTimeFormat(time) : any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
}

export function EncodeDecodeBase64(value,changeTo:string){
    if(changeTo == 'encode'){
        return btoa(value);
    }else{
        return atob(value);
    }
}

export function dateDiffInDays(date1:any, date2:any) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.abs(Math.floor((date1 - date2) / _MS_PER_DAY));
}
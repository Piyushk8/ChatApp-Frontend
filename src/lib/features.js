import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

const fileFormat = (url)=>{
    const fileExtension = url.split(".").pop();
 
    if(fileExtension==="mp4" || fileExtension==="webm" || fileExtension=== "ogg"){
        return "video"
    } 
    else if (fileExtension === "mp3" || fileExtension === "wav") {
            return "audio"
    } else if(fileExtension==="png" || fileExtension==="jpeg" || fileExtension==="jpg") {
        return "image"
    }

    return "file";
}
const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
    if (get)
      return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : null;
    else localStorage.setItem(key, JSON.stringify(value));
  };
  

  export function formatDate(updatedAt) {
    const date = new Date(Date.parse(updatedAt));


    if (isToday(date)) {
        // If the date is today, return the time in HH:mm a format (e.g., 02:30 PM)
        return format(date, 'hh:mm a');
    } else if (isYesterday(date)) {
        // If the date is yesterday, return 'Yesterday'
        return 'Yesterday';
    } else {
        // For older dates, return the number of days ago
        const daysAgo = differenceInDays(new Date(), date);
        return `${daysAgo} days ago`;
    }
}

export {fileFormat,transformImage,getOrSaveFromStorage};


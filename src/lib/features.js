const fileFormat = (url)=>{
    const fileExtension = url.split(".").pop();

    if(fileExtension==="mp4" || fileExtension==="webm" || "ogg"){
        return "video"
    } 
    else if (fileExtension === "mp3" || fileExtension === "wav") {
            return "audio"
    } else if(fileExtension==="png" || fileExtension==="jpeg" || fileExtension==="jpg") {
        return "image"
    }

    return "file";
}
const transformImage = (url="")=>url;

const getOrSaveFromStorage = ({ key, value, get }) => {
    if (get)
      return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : null;
    else localStorage.setItem(key, JSON.stringify(value));
  };
  

export {fileFormat,transformImage,getOrSaveFromStorage};


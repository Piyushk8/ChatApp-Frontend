const fileFormat = (url)=>{
    const fileExtension = url.split(".").pop();
  console.log(fileExtension)
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
  

export {fileFormat,transformImage,getOrSaveFromStorage};


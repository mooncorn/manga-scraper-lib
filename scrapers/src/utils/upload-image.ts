import axios from "axios";
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const uploadImageFromUrl = async (
  storage: FirebaseStorage,
  url: string,
  referer: string
) => {
  const buffer = await getImage(url, referer);

  const imgRef = ref(storage, "pages/" + new Date().getTime() + ".jpg");

  const snapshot = await uploadBytes(imgRef, buffer, {
    contentType: "image/jpg",
  });

  return { imgRef, downloadUrl: await getDownloadURL(snapshot.ref) };
};

export const getImage = async (url: string, referer: string) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { Referer: referer },
  });
  return response.data;
};

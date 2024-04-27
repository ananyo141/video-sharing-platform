

export function getCookie(name: string) {
  if (typeof document === "undefined") return;

  const value = "; " + document.cookie;
  const decodedValue = decodeURIComponent(value);
  const parts = decodedValue.split("; " + name + "=");

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}
export interface ImageInput {
    file: File;
  }
  
  async function uploadImage(imageInput: ImageInput): Promise<any> {
    try {
      const JWT_TOKEN = getCookie("jwt-token");
  
      if (!JWT_TOKEN) {
        throw new Error("JWT token is missing");
      }
  
      const token = JWT_TOKEN;
  
      const formData = new FormData();
      formData.append("file", imageInput.file);
  
      const response = await fetch("https://videosite.ddns.net/assets/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      console.log("Image uploaded successfully");
      console.log(response);
  
      return response.json();
    } catch (error) {
      throw new Error("Error uploading image: " + error);
    }
  }
  
  export default uploadImage;
  
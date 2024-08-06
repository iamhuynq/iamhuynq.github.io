function uploadImage(file, success, error) {
  const apiKey = "6d207e02198a847aa98d0a2a901485a5";
  const url = "https://freeimage.host/api/1/upload";
  const formData = new FormData();

  formData.append("key", apiKey);
  formData.append("action", "upload");
  formData.append("source", file);
  formData.append("format", "json");

  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success,
    error,
  });
}
export { uploadImage };

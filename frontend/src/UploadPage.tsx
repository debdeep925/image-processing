import React, { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();

    for (let file of files) {
      formData.append("images", file);
    }

    await axios.post("http://localhost:5000/api/upload", formData);
    alert("Upload successful!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Images</h2>

      <input
        type="file"
        multiple
        webkitdirectory="true"
        onChange={(e: any) => setFiles(e.target.files)}
      />

      <br />
      <br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

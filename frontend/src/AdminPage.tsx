import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get("http://localhost:5000/api/images");
    setImages(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Filename</th>
            <th>Uploaded At</th>
          </tr>
        </thead>

        <tbody>
          {images.map((img, i) => (
            <tr key={i}>
              <td>
                <img src={img.url} width="80" />
              </td>
              <td>{img.originalName}</td>
              <td>{new Date(img.uploadedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

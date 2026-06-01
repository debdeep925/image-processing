import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UploadPage from "./UploadPage";
import AdminPage from "./AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/">Upload</Link> | <Link to="/admin">Admin Panel</Link>
      </nav>

      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

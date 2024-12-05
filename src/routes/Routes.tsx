import CreateAlbum from "../pages/albums/create-album";
import Albums from "../pages/albums/albums";
import Artists from "../pages/artists";
import Home from "../pages/home";
import { Routes, Route } from "react-router-dom";
import EditAlbum from "../pages/albums/edit-album";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artists/" element={<Artists />} />
      <Route path="/albums/" element={<Albums />} />
      <Route path="/albums/create/" element={<CreateAlbum />} />
      <Route path="/albums/edit/" element={<EditAlbum />} />
      <Route path="*" element={<p>404</p>} />
    </Routes>
  );
}

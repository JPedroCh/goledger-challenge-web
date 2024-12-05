import CreateAlbum from "../pages/albums/create-album";
import Albums from "../pages/albums/albums";
import Artists from "../pages/artists";
import Home from "../pages/home";
import { Routes, Route } from "react-router-dom";
import EditAlbum from "../pages/albums/edit-album";
import Songs from "../pages/songs/songs";
import CreateSong from "../pages/songs/create-song";
import ViewSong from "../pages/songs/view-song";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artists/" element={<Artists />} />
      <Route path="/albums/" element={<Albums />} />
      <Route path="/albums/create/" element={<CreateAlbum />} />
      <Route path="/albums/edit/" element={<EditAlbum />} />
      <Route path="/songs/" element={<Songs />} />
      <Route path="/songs/create/" element={<CreateSong />} />
      <Route path="/songs/view/" element={<ViewSong />} />
      <Route path="*" element={<p>404</p>} />
    </Routes>
  );
}

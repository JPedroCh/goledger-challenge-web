import Home from '../pages/home';
import { Routes, Route } from 'react-router-dom';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<p>404</p>} />
    </Routes>
  );
}
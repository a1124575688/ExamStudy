import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Records from "@/pages/Records";
import Calendar from "@/pages/Calendar";
import Backup from "@/pages/Backup";
import Nav from "@/components/Nav";

export default function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/records" element={<Records />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/backup" element={<Backup />} />
      </Routes>
    </Router>
  );
}

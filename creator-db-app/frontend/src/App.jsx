import { Routes, Route, Link } from "react-router-dom";
import AddInfluencer from "./pages/AddInfluencer";
import InfluencerList from "./pages/InfluencerList";
import InfluencerDetail from "./pages/InfluencerDetail";
import EditInfluencer from "./pages/EditInfluencer";
import ImportInfluencers from "./pages/ImportInfluencers";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <div>
      <nav
        style={{
          padding: "10px",
          background: "#eee",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/add">Añadir Influencer</Link>

        <Link to="/influencers">
          Lista de Influencers
        </Link>

        <Link to="/import">
          Carga de Influencers
        </Link>
        <Link to="/categories">
          Categorías
        </Link>
      </nav>



      <Routes>
        <Route path="/add" element={<AddInfluencer />} />
        <Route path="/influencers" element={<InfluencerList />} />
        <Route path="/influencers/:id" element={<InfluencerDetail />} />
        <Route path="/influencers/edit/:id" element={<EditInfluencer />} />
        <Route
          path="/import"
          element={<ImportInfluencers />}
        />
        <Route
          path="/categories"
          element={<Categories />}
        />
      </Routes>
    </div>
  );
}
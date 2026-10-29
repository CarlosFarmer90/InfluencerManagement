import { useEffect, useState } from "react";
import InfluencerForm from "../components/InfluencerForm";
import SuccessMessage from "../components/SuccessMessage";
import { parseFollowers } from "../utils/parseFollowers";
import { normalizeInstagram, normalizeFacebook, normalizeTikTok } from "../utils/normalizeSocialHandle";

export default function AddInfluencer() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    tituloCanal: "",
    agencia: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
    categoriaIds: [],
    handleFb: "",
    seguidoresFb: "",
    handleIg: "",
    seguidoresIg: "",
    handleTt: "",
    seguidoresTt: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleCategoryChange = (categoryId) => {
    setForm((prev) => {
      const alreadySelected = prev.categoriaIds.includes(categoryId);

      return {
        ...prev,
        categoriaIds: alreadySelected
          ? prev.categoriaIds.filter((id) => id !== categoryId)
          : [...prev.categoriaIds, categoryId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("This is where the output starts");
    console.log(form);
    console.log("This is where the output ends");

    const payload = {
      ...form,

      // Normalize social media handles and parse followers
      seguidoresIg: parseFollowers(
        form.seguidoresIg
      ),

      seguidoresFb: parseFollowers(
        form.seguidoresFb
      ),

      seguidoresTt: parseFollowers(
        form.seguidoresTt
      ),

      handleIg: normalizeInstagram(
        form.handleIg
      ),

      handleFb: normalizeFacebook(
        form.handleFb
      ),

      handleTt: normalizeTikTok(
        form.handleTt
      ),
    };

    const response = await fetch("http://localhost:4000/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setMessage(
        "Influencer creado exitosamente"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

      setForm({
        nombre: "",
        tituloCanal: "",
        agencia: "",
        telefono: "",
        email: "",
        direccion: "",

        categoriaIds: [],

        handleFb: "",
        seguidoresFb: "",
        tierFb: "",

        handleIg: "",
        seguidoresIg: "",
        tierIg: "",

        handleTt: "",
        seguidoresTt: "",
        tierTt: "",
      });
    } else {
      setMessage("Error al añadir influencer");
    }
  };


  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px", marginBottom: "40px" }}>
      <h1>Añadir Influencer</h1>

      <>
        <InfluencerForm
          form={form}
          setForm={setForm}
          categories={categories}
          onSubmit={handleSubmit}
          submitText="Añadir Influencer"
        />
        <SuccessMessage message={message} />
      </>
    </div>
  );
}
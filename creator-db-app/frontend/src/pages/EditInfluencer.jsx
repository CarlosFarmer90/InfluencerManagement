import { useEffect, useState } from "react";
import {
    useParams,
    useNavigate,
} from "react-router-dom";
import InfluencerForm from "../components/InfluencerForm";
//import SuccessMessage from "../components/SuccessMessage";
import { parseFollowers } from "../utils/parseFollowers";
import { normalizeInstagram, normalizeFacebook, normalizeTikTok } from "../utils/normalizeSocialHandle";

export default function EditInfluencer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

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

    useEffect(() => {
        fetch("http://localhost:4000/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data));

        fetch(`http://localhost:4000/entries/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    nombre: data.nombre || "",
                    tituloCanal: data.tituloCanal || "",
                    agencia: data.agencia || "",
                    telefono: data.telefono || "",
                    email: data.email || "",
                    direccion: data.direccion || "",
                    notas: data.notas || "",

                    categoriaIds:
                        data.categoria?.map((c) => c.id) || [],

                    handleFb: data.handleFb || "",
                    seguidoresFb: data.seguidoresFb || "",

                    handleIg: data.handleIg || "",
                    seguidoresIg: data.seguidoresIg || "",

                    handleTt: data.handleTt || "",
                    seguidoresTt: data.seguidoresTt || "",
                });
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,

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


        const response = await fetch(
            `http://localhost:4000/entries/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (response.ok) {

            navigate(`/influencers/${id}`, {
                state: {
                    successMessage:
                        "Influencer actualizado exitosamente",
                },
            });
        } else {
            setMessage("Error al actualizar influencer");
        }
    };
    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px", marginBottom: "40px" }}>
            <h1>Editar Influencer</h1>

            {
                <InfluencerForm
                    form={form}
                    setForm={setForm}
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitText="Guardar Cambios"
                    message={message}
                />
            }
        </div>
    );
}

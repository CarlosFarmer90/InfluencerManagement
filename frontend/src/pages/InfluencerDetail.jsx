import { useEffect, useState } from "react";
import {
    useParams,
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { formatFollowers } from "../utils/formatFollowers";
import {
    primaryButtonStyle,
    secondaryButtonStyle,
    dangerButtonStyle,
} from "../styles/buttonStyles";
import SuccessMessage from "../components/SuccessMessage";


export default function InfluencerDetail() {
    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();

    const [influencer, setInfluencer] =
        useState(null);

    const [successMessage, setSuccessMessage] =
        useState(
            location.state?.successMessage || ""
        );

    useEffect(() => {
        fetch(`http://localhost:4000/entries/${id}`)
            .then((res) => res.json())
            .then((data) => setInfluencer(data))
            .catch((err) => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    if (!influencer) {
        return <p>Cargando...</p>;
    }

    const cardStyle = {
        border: "1px solid #ddd",
        paddingLeft: "30%",
        paddingTop: "20px",
        paddingBottom: "20px",
        textAlign: "left",
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `¿Está seguro que desea eliminar a ${influencer.nombre}?`
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `http://localhost:4000/entries/${id}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            navigate("/influencers");
        } else {
            alert(
                "Ocurrió un error al eliminar el influencer."
            );
        }
    };

    return (
        <div
            style={{
                width: "95%",
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <SuccessMessage
                message={successMessage}
            />
            <h1>{influencer.nombre}</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={cardStyle}
                >
                    <h2>Información General</h2>

                    <p><strong>Nombre:</strong> {influencer.nombre}</p>
                    <p><strong>Título:</strong> {influencer.tituloCanal}</p>
                    <p><strong>Agencia:</strong> {influencer.agencia}</p>
                    <p><strong>Teléfono:</strong> {influencer.telefono}</p>
                    <p><strong>Email:</strong>{" "}{
                        influencer.email ? (
                            <a
                                href={`mailto:${influencer.email}`}
                                style={{ color: "#2563eb", textDecoration: "underline" }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {influencer.email}
                            </a>
                        ) : (
                            "N/A"
                        )
                    }</p>
                    <p><strong>Dirección:</strong> {influencer.direccion}</p>
                </div>

                <div style={cardStyle}>
                    <h2>Notas</h2>

                    <p
                        style={{
                            whiteSpace: "pre-wrap",
                            lineHeight: "1.6",
                            paddingRight: "20px",
                        }}
                    >
                        {influencer.notas || "Sin notas"}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h2>Categorías</h2>

                    {influencer.categoria?.map((cat) => (
                        <p key={cat.id}>{cat.name}</p>
                    ))}
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "24px",
                    marginBottom: "24px",
                }}
            >
                <div style={cardStyle}>
                    <h2>Instagram</h2>

                    <p><strong>Handle:</strong> {influencer.handleIg}</p>
                    <p><strong>Seguidores:</strong> {formatFollowers(influencer.seguidoresIg)}</p>
                    <p><strong>Tier:</strong> {influencer.tierIg}</p>
                </div>

                <div style={cardStyle}>
                    <h2>Facebook</h2>

                    <p><strong>Handle:</strong> {influencer.handleFb}</p>
                    <p><strong>Seguidores:</strong> {formatFollowers(influencer.seguidoresFb)}</p>
                    <p><strong>Tier:</strong> {influencer.tierFb}</p>
                </div>

                <div style={cardStyle}>
                    <h2>TikTok</h2>

                    <p><strong>Handle:</strong> {influencer.handleTt}</p>
                    <p><strong>Seguidores:</strong> {formatFollowers(influencer.seguidoresTt)}</p>
                    <p><strong>Tier:</strong> {influencer.tierTt}</p>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                    marginBottom: "24px",
                }}
            >



            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                }}
            >
                <Link to={`/influencers/edit/${influencer.id}`}>
                    <button style={primaryButtonStyle}>Editar</button>
                </Link>

                <button
                    style={dangerButtonStyle}
                    onClick={handleDelete}
                >
                    Eliminar
                </button>

                <Link to="/influencers">
                    <button style={secondaryButtonStyle}>Volver a la Lista</button>
                </Link>
            </div>
        </div>
    );
}
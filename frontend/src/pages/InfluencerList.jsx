import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatFollowers } from "../utils/formatFollowers";
import {
    primaryButtonStyle,
    dangerButtonStyle,
    secondaryButtonStyle,
} from "../styles/buttonStyles";


export default function InfluencerList() {
    const [influencers, setInfluencers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTier, setSelectedTier] = useState("");
    const [hasInstagram, setHasInstagram] = useState(false);
    const [hasFacebook, setHasFacebook] = useState(false);
    const [hasTikTok, setHasTikTok] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [showCategories, setShowCategories] = useState(false);
    const [showColumns, setShowColumns] = useState(false);

    const defaultVisibleColumns = {
        nombre: true,
        tituloCanal: true,
        agencia: true,

        email: true,
        categoria: true,

        handleIg: true,
        seguidoresIg: true,
        tierIg: true,

        handleFb: true,
        seguidoresFb: true,
        tierFb: true,

        handleTt: true,
        seguidoresTt: true,
        tierTt: true,
    };

    const [visibleColumns, setVisibleColumns] =
        useState(() => {
            const savedColumns =
                localStorage.getItem(
                    "visibleColumns"
                );

            if (savedColumns) {
                return {
                    ...defaultVisibleColumns,
                    ...JSON.parse(savedColumns),
                };
            }

            return defaultVisibleColumns;
        });

    useEffect(() => {
        fetch("http://localhost:4000/entries")
            .then((res) => res.json())
            .then((data) => setInfluencers(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "visibleColumns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // Filter influencers based on search term, selected categories, and social media presence
    const filteredInfluencers = influencers.filter((influencer) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            influencer.nombre?.toLowerCase().includes(search) ||
            influencer.tituloCanal?.toLowerCase().includes(search) ||
            influencer.agencia?.toLowerCase().includes(search) ||
            influencer.handleIg?.toLowerCase().includes(search) ||
            influencer.handleFb?.toLowerCase().includes(search) ||
            influencer.handleTt?.toLowerCase().includes(search);

        const matchesCategory =
            selectedCategories.length === 0 ||
            influencer.categoria?.some((cat) =>
                selectedCategories.includes(cat.name)
            );

        const matchesInstagram =
            !hasInstagram ||
            (influencer.handleIg &&
                influencer.handleIg.trim() !== "");

        const matchesFacebook =
            !hasFacebook ||
            (influencer.handleFb &&
                influencer.handleFb.trim() !== "");

        const matchesTikTok =
            !hasTikTok ||
            (influencer.handleTt &&
                influencer.handleTt.trim() !== "");

        const matchesTier =
            selectedTier === "" ||
            influencer.tierIg === selectedTier ||
            influencer.tierFb === selectedTier ||
            influencer.tierTt === selectedTier;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesInstagram &&
            matchesFacebook &&
            matchesTikTok &&
            matchesTier
        );
    });

    const sortedInfluencers = [...filteredInfluencers];

    const handleCategoryFilterChange = (categoryName) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName)
                ? prev.filter((cat) => cat !== categoryName)
                : [...prev, categoryName]
        );
    };

    if (sortBy === "nameAsc") {
        sortedInfluencers.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
        );
    }

    if (sortBy === "nameDesc") {
        sortedInfluencers.sort((a, b) =>
            b.nombre.localeCompare(a.nombre)
        );
    }

    if (sortBy === "channelAsc") {
        sortedInfluencers.sort((a, b) =>
            (a.tituloCanal || "").localeCompare(
                b.tituloCanal || ""
            )
        );
    }

    if (sortBy === "channelDesc") {
        sortedInfluencers.sort((a, b) =>
            (b.tituloCanal || "").localeCompare(
                a.tituloCanal || ""
            )
        );
    }

    if (sortBy === "agencyAsc") {
        sortedInfluencers.sort((a, b) =>
            (a.agencia || "").localeCompare(
                b.agencia || ""
            )
        );
    }

    if (sortBy === "agencyDesc") {
        sortedInfluencers.sort((a, b) =>
            (b.agencia || "").localeCompare(
                a.agencia || ""
            )
        );
    }

    if (sortBy === "instagramAsc") {
        sortedInfluencers.sort((a, b) =>
            (a.handleIg || "").localeCompare(
                b.handleIg || ""
            )
        );
    }

    if (sortBy === "instagramDesc") {
        sortedInfluencers.sort((a, b) =>
            (b.handleIg || "").localeCompare(
                a.handleIg || ""
            )
        );
    }

    if (sortBy === "igFollowersDesc") {
        sortedInfluencers.sort(
            (a, b) =>
                (b.seguidoresIg || 0) -
                (a.seguidoresIg || 0)
        );
    }

    if (sortBy === "igFollowersAsc") {
        sortedInfluencers.sort(
            (a, b) =>
                (a.seguidoresIg || 0) -
                (b.seguidoresIg || 0)
        );
    }

    if (sortBy === "tiktokAsc") {
        sortedInfluencers.sort((a, b) =>
            (a.handleTt || "").localeCompare(
                b.handleTt || ""
            )
        );
    }

    if (sortBy === "tiktokDesc") {
        sortedInfluencers.sort((a, b) =>
            (b.handleTt || "").localeCompare(
                a.handleTt || ""
            )
        );
    }

    if (sortBy === "ttFollowersDesc") {
        sortedInfluencers.sort(
            (a, b) =>
                (b.seguidoresTt || 0) -
                (a.seguidoresTt || 0)
        );
    }

    if (sortBy === "ttFollowersAsc") {
        sortedInfluencers.sort(
            (a, b) =>
                (a.seguidoresTt || 0) -
                (b.seguidoresTt || 0)
        );
    }

    if (sortBy === "facebookAsc") {
        sortedInfluencers.sort((a, b) =>
            (a.handleFb || "").localeCompare(
                b.handleFb || ""
            )
        );
    }

    if (sortBy === "facebookDesc") {
        sortedInfluencers.sort((a, b) =>
            (b.handleFb || "").localeCompare(
                a.handleFb || ""
            )
        );
    }

    if (sortBy === "fbFollowersDesc") {
        sortedInfluencers.sort(
            (a, b) =>
                (b.seguidoresFb || 0) -
                (a.seguidoresFb || 0)
        );
    }

    if (sortBy === "fbFollowersAsc") {
        sortedInfluencers.sort(
            (a, b) =>
                (a.seguidoresFb || 0) -
                (b.seguidoresFb || 0)
        );
    }

    const uniqueCategories = [
        ...new Set(
            influencers.flatMap((influencer) =>
                influencer.categoria?.map((cat) => cat.name) || []
            )
        ),
    ].sort();

    const handleExport = async () => {
        const response = await fetch(
            "http://localhost:4000/entries/export",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    sortedInfluencers
                ),
            }
        );

        const blob =
            await response.blob();

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "Influencers_Export.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    };
    const toggleColumn = (column) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };
    const resetColumns = () => {
        setVisibleColumns(
            defaultVisibleColumns
        );
    };



    return (
        <div style={{ padding: "20px" }}>
            <h1
                style={{
                    marginBottom: "20px",
                }}
            >
                Lista de Influencers
            </h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <p
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    Total de Influencers: {filteredInfluencers.length}
                </p>

                <button

                    onClick={handleExport}
                    style={primaryButtonStyle}
                >
                    Exportar Excel
                </button>

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar influencer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "10px",
                            width: "300px",
                            fontSize: "16px",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setShowCategories(!showCategories)
                            }
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "16px",
                                padding: "5px 0",
                            }}
                        >
                            {showCategories
                                ? `▾ Categorías${selectedCategories.length
                                    ? ` (${selectedCategories.length})`
                                    : ""
                                }`
                                : `▸ Categorías${selectedCategories.length
                                    ? ` (${selectedCategories.length})`
                                    : ""
                                }`}
                        </button>

                        {showCategories && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "5px",
                                    marginTop: "5px",
                                }}
                            >
                                {uniqueCategories.map((category) => (
                                    <label
                                        key={category}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(
                                                category
                                            )}
                                            onChange={() =>
                                                handleCategoryFilterChange(
                                                    category
                                                )
                                            }
                                        />

                                        {category}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setShowColumns(!showColumns)
                            }
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "16px",
                                padding: "5px 0",
                            }}
                        >
                            {showColumns
                                ? "▾ Columnas"
                                : "▸ Columnas"}
                        </button>

                        {showColumns && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                    marginTop: "5px",
                                }}
                            >
                                {Object.entries({
                                    nombre: "Nombre",
                                    tituloCanal: "Título Canal",
                                    agencia: "Agencia",

                                    email: "Email",
                                    categoria: "Categorías",

                                    handleIg: "Instagram",
                                    seguidoresIg: "Seguidores IG",
                                    tierIg: "Tier IG",

                                    handleFb: "Facebook",
                                    seguidoresFb: "Seguidores FB",
                                    tierFb: "Tier FB",

                                    handleTt: "TikTok",
                                    seguidoresTt: "Seguidores TT",
                                    tierTt: "Tier TT",
                                }).map(([key, label]) => (
                                    <label key={key}>
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[key]}
                                            onChange={() =>
                                                toggleColumn(key)
                                            }
                                        />{" "}
                                        {label}
                                    </label>
                                ))}
                                <button
                                    type="button"
                                    onClick={resetColumns}
                                    style={secondaryButtonStyle}
                                >
                                    Restablecer Columnas
                                </button>
                            </div>
                        )}
                    </div>

                    <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            minWidth: "160px",
                        }}
                    >
                        <option value="">Todos los Tiers</option>
                        <option value="Nano">Nano</option>
                        <option value="Micro">Micro</option>
                        <option value="Mid_Tier">Mid-Tier</option>
                        <option value="Macro">Macro</option>
                        <option value="Mega">Mega</option>
                    </select>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={hasInstagram}
                            onChange={(e) =>
                                setHasInstagram(e.target.checked)
                            }
                        />
                        Tiene Instagram
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={hasFacebook}
                            onChange={(e) =>
                                setHasFacebook(e.target.checked)
                            }
                        />
                        Tiene Facebook
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={hasTikTok}
                            onChange={(e) =>
                                setHasTikTok(e.target.checked)
                            }
                        />
                        Tiene TikTok
                    </label>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedCategories([]);
                            setSelectedTier("");
                            setHasInstagram(false);
                            setHasFacebook(false);
                            setHasTikTok(false);
                        }}

                        style={primaryButtonStyle}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>
            <div
                style={{
                    overflowX: "auto",
                    width: "100%",
                }}
            >

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        whiteSpace: "nowrap",
                    }}
                >
                    <thead>
                        <tr>
                            {visibleColumns.nombre && (<th>
                                Nombre{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "nameAsc") {
                                            setSortBy("nameDesc");
                                        } else if (sortBy === "nameDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("nameAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "nameAsc"
                                        ? "↑"
                                        : sortBy === "nameDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.tituloCanal && (<th>
                                Título del Canal{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "channelAsc") {
                                            setSortBy("channelDesc");
                                        } else if (sortBy === "channelDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("channelAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "channelAsc"
                                        ? "↑"
                                        : sortBy === "channelDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.agencia && (<th>
                                Agencia{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "agencyAsc") {
                                            setSortBy("agencyDesc");
                                        } else if (sortBy === "agencyDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("agencyAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "agencyAsc"
                                        ? "↑"
                                        : sortBy === "agencyDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.email && (<th style={{ backgroundColor: "#f3f4f6" }}>Email</th>)}
                            {visibleColumns.categoria && (<th style={{ backgroundColor: "#f3f4f6" }}>Categorías</th>)}

                            {visibleColumns.handleIg && (<th>
                                Instagram{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "instagramAsc") {
                                            setSortBy("instagramDesc");
                                        } else if (sortBy === "instagramDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("instagramAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "instagramAsc"
                                        ? "↑"
                                        : sortBy === "instagramDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}

                            {visibleColumns.seguidoresIg && (<th>
                                Seguidores IG{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "igFollowersDesc") {
                                            setSortBy("igFollowersAsc");
                                        } else if (sortBy === "igFollowersAsc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("igFollowersDesc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "igFollowersDesc"
                                        ? "↓"
                                        : sortBy === "igFollowersAsc"
                                            ? "↑"
                                            : "↕"}
                                </button>
                            </th>)}
                            {<visibleColumns className="tierIg"></visibleColumns> && (<th style={{ backgroundColor: "#f3f4f6" }}>Tier IG</th>)}

                            {visibleColumns.handleFb && (<th>
                                Facebook{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "facebookAsc") {
                                            setSortBy("facebookDesc");
                                        } else if (sortBy === "facebookDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("facebookAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "facebookAsc"
                                        ? "↑"
                                        : sortBy === "facebookDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.seguidoresFb && (<th>
                                Seguidores FB{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "fbFollowersDesc") {
                                            setSortBy("fbFollowersAsc");
                                        } else if (sortBy === "fbFollowersAsc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("fbFollowersDesc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "fbFollowersDesc"
                                        ? "↓"
                                        : sortBy === "fbFollowersAsc"
                                            ? "↑"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.tierFb && (<th style={{ backgroundColor: "#f3f4f6" }}>Tier FB</th>)}

                            {visibleColumns.handleTt && (<th>
                                TikTok{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "tiktokAsc") {
                                            setSortBy("tiktokDesc");
                                        } else if (sortBy === "tiktokDesc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("tiktokAsc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "tiktokAsc"
                                        ? "↑"
                                        : sortBy === "tiktokDesc"
                                            ? "↓"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.seguidoresTt && (<th>
                                Seguidores TT{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (sortBy === "ttFollowersDesc") {
                                            setSortBy("ttFollowersAsc");
                                        } else if (sortBy === "ttFollowersAsc") {
                                            setSortBy("");
                                        } else {
                                            setSortBy("ttFollowersDesc");
                                        }
                                    }}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sortBy === "ttFollowersDesc"
                                        ? "↓"
                                        : sortBy === "ttFollowersAsc"
                                            ? "↑"
                                            : "↕"}
                                </button>
                            </th>)}
                            {visibleColumns.tierTt && (<th style={{ backgroundColor: "#f3f4f6" }}>Tier TT</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedInfluencers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="11"
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    No se encontraron influencers.
                                </td>
                            </tr>
                        ) : (
                            sortedInfluencers.map((influencer) => (
                                <tr key={influencer.id}>
                                    {visibleColumns.nombre && (<td>
                                        <Link
                                            to={`/influencers/${influencer.id}`}
                                            style={{
                                                color: "#2563eb",
                                                textDecoration: "underline",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {influencer.nombre}
                                        </Link>
                                    </td>)}

                                    {visibleColumns.tituloCanal && (<td>{influencer.tituloCanal}</td>)}

                                    {visibleColumns.agencia && (<td>{influencer.agencia}</td>)}

                                    {visibleColumns.email && (<td>{influencer.email}</td>)}

                                    {visibleColumns.categoria && (
                                        <td>
                                            {influencer.categoria
                                                ?.map((cat) => cat.name)
                                                .join(", ")}
                                        </td>
                                    )}

                                    {visibleColumns.handleIg && (<td>{influencer.handleIg}</td>)}
                                    {visibleColumns.seguidoresIg && (
                                        <td>
                                            {formatFollowers(
                                                influencer.seguidoresIg
                                            )}
                                        </td>
                                    )}
                                    {visibleColumns.tierIg && (<td>{influencer.tierIg}</td>)}

                                    {visibleColumns.handleFb && (<td>{influencer.handleFb}</td>)}
                                    {visibleColumns.seguidoresFb && (
                                        <td>
                                            {formatFollowers(
                                                influencer.seguidoresFb
                                            )}
                                        </td>
                                    )}
                                    {visibleColumns.tierFb && (<td>{influencer.tierFb}</td>)}

                                    {visibleColumns.handleTt && (<td>{influencer.handleTt}</td>)}
                                    {visibleColumns.seguidoresTt && (
                                        <td>
                                            {formatFollowers(
                                                influencer.seguidoresTt
                                            )}
                                        </td>
                                    )}
                                    {visibleColumns.tierTt && (<td>{influencer.tierTt}</td>)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

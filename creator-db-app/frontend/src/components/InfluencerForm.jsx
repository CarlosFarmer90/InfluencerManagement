import {
    primaryButtonStyle,
} from "../styles/buttonStyles";
export default function InfluencerForm({
    form,
    setForm,
    categories,
    onSubmit,
    submitText,
    message,
}) {

    const followerHelpText =
        "Formatos aceptados: 1500, 1.5K, 25K, 1.2M";

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setForm((prev) => {
            const alreadySelected =
                prev.categoriaIds.includes(categoryId);

            return {
                ...prev,
                categoriaIds: alreadySelected
                    ? prev.categoriaIds.filter(
                        (id) => id !== categoryId
                    )
                    : [...prev.categoriaIds, categoryId],
            };
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Información General</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <input
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />

                <input
                    name="tituloCanal"
                    placeholder="Título del Canal"
                    value={form.tituloCanal}
                    onChange={handleChange}
                    required
                />

                <input
                    name="agencia"
                    placeholder="Agencia"
                    value={form.agencia}
                    onChange={handleChange}
                />

                <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="direccion"
                    placeholder="Dirección"
                    value={form.direccion}
                    onChange={handleChange}
                />
            </div>

            <h2>Notas</h2>

            <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={5}
                placeholder="Notas internas sobre el influencer..."
                style={{
                    width: "100%",
                    marginBottom: "20px",
                    padding: "10px",
                }}
            />

            <h3>Categorías</h3>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    marginBottom: "20px",
                }}
            >
                {categories.map((cat) => (
                    <label
                        key={cat.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={form.categoriaIds.includes(cat.id)}
                            onChange={() => handleCategoryChange(cat.id)}
                        />
                        {cat.name}
                    </label>
                ))}
            </div>

            <h3>Instagram</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <input
                    name="handleIg"
                    placeholder="Handle Instagram"
                    value={form.handleIg}
                    onChange={handleChange}
                />

                <input
                    name="seguidoresIg"
                    placeholder="Seguidores Instagram"
                    type="text"
                    value={form.seguidoresIg}
                    onChange={handleChange}
                />
                <small
                    style={{
                        color: "#6b7280",
                        //display: "block",
                        //marginBottom: "10px",
                    }}
                >
                    {followerHelpText}
                </small>

            </div>

            <h3>Facebook</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <input
                    name="handleFb"
                    placeholder="Handle Facebook"
                    value={form.handleFb}
                    onChange={handleChange}
                />

                <input
                    name="seguidoresFb"
                    placeholder="Seguidores Facebook"
                    type="text"
                    value={form.seguidoresFb}
                    onChange={handleChange}
                />
                <small
                    style={{
                        color: "#6b7280",
                        //display: "block",
                        //marginBottom: "10px",
                    }}
                >
                    {followerHelpText}
                </small>

            </div>

            <h3>TikTok</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <input
                    name="handleTt"
                    placeholder="Handle TikTok"
                    value={form.handleTt}
                    onChange={handleChange}
                />

                <input
                    name="seguidoresTt"
                    placeholder="Seguidores TikTok"
                    type="text"
                    value={form.seguidoresTt}
                    onChange={handleChange}
                />
                <small
                    style={{
                        color: "#6b7280",
                        //display: "block",
                        //marginBottom: "10px",
                    }}
                >
                    {followerHelpText}
                </small>

            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <button
                    type="submit"
                    style={primaryButtonStyle}
                >
                    {submitText}
                </button>
            </div>

            {message && (
                <p
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginTop: "20px",
                    }}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
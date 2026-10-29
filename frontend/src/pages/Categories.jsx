import {
    useEffect,
    useState,
} from "react";
import {
    primaryButtonStyle,
    secondaryButtonStyle,
    dangerButtonStyle,
} from "../styles/buttonStyles";

export default function Categories() {
    const [categories, setCategories] =
        useState([]);

    const [newCategory, setNewCategory] =
        useState("");

    const loadCategories = async () => {
        const response = await fetch(
            "http://localhost:4000/categories"
        );

        const data =
            await response.json();

        setCategories(data);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async () => {
        if (!newCategory.trim()) {
            return;
        }

        await fetch(
            "http://localhost:4000/categories",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name: newCategory,
                }),
            }
        );

        setNewCategory("");

        loadCategories();
    };

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <h1>Categorías</h1>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                <input
                    value={newCategory}
                    onChange={(e) =>
                        setNewCategory(
                            e.target.value
                        )
                    }
                    placeholder="Nueva categoría"
                />

                <button
                    style={primaryButtonStyle}
                    onClick={handleCreate}
                >
                    Agregar
                </button>
            </div>

            {categories.map(
                (category) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        reload={
                            loadCategories
                        }
                    />
                )
            )}
        </div>
    );
}

function CategoryRow({
    category,
    reload,
}) {
    const [editing, setEditing] =
        useState(false);

    const [name, setName] =
        useState(category.name);

    const save = async () => {
        await fetch(
            `http://localhost:4000/categories/${category.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            }
        );

        setEditing(false);

        reload();
    };

    const remove = async () => {
        const influencerCount =
            category.entries?.length || 0;

        const confirmed = window.confirm(
            `La categoría "${category.name}" está asociada a ${influencerCount} influencer(s).\n\n¿Desea eliminarla?`
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `http://localhost:4000/categories/${category.id}`,
            {
                method: "DELETE",
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            alert(data.error);

            return;
        }

        reload();
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 0",
                minHeight: "30px",
            }}
        >

            <div
                style={{
                    flex: 1,
                    textAlign: "left",
                }}
            >
                {editing ? (
                    <input
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                        }}
                    />
                ) : (
                    <span>
                        {category.name}

                        <span
                            style={{
                                color: "#6b7280",
                                marginLeft: "6px",
                                fontSize: "0.9rem",
                            }}
                        >
                            ({category.entries?.length || 0})
                        </span>
                    </span>
                )}
            </div>

            {editing ? (
                <button
                    style={primaryButtonStyle}
                    onClick={save}
                >
                    Guardar
                </button>
            ) : (
                <button
                    style={secondaryButtonStyle}
                    onClick={() =>
                        setEditing(true)
                    }
                >
                    Editar
                </button>
            )}

            <button
                style={dangerButtonStyle}
                onClick={remove}
            >
                Eliminar
            </button>
        </div>
    );
}
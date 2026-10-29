import { useState } from "react";
import {
    primaryButtonStyle,
    secondaryButtonStyle,
} from "../styles/buttonStyles";
import SuccessMessage from "../components/SuccessMessage";


export default function ImportInfluencers() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [importErrors, setImportErrors] =
        useState([]);
    const [importResults, setImportResults] =
        useState(null);

    const downloadTemplate = () => {
        window.open(
            "http://localhost:4000/entries/template",
            "_blank"
        );
    };

    const handleImport = async () => {
        if (!file) {
            setMessage("Seleccione un archivo.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
            "http://localhost:4000/entries/import",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        if (response.ok) {
            setImportResults(data);

            setImportErrors(data.errors || []);

            setMessage("");
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div
            style={{
                width: "95%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <h1>Importar Influencers</h1>

            <button style={secondaryButtonStyle} onClick={downloadTemplate}>
                Descargar Plantilla Excel
            </button>

            <div style={{ marginTop: "30px" }}>
                <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <button style={primaryButtonStyle} onClick={handleImport}>
                    Importar
                </button>
            </div>

            <SuccessMessage
                message={message}
            />

            {importResults && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        textAlign: "left",
                    }}
                >
                    <h3>Importación Completada</h3>

                    <p>
                        ✅ {importResults.importedCount} influencer(s)
                        importado(s)
                    </p>

                    <p>
                        ⚠️ {importResults.duplicateCount || 0}{" "}
                        duplicado(s)
                    </p>

                    <p>
                        ❌ {importResults.errorCount || 0}{" "}
                        error(es)
                    </p>
                </div>
            )}

            {importResults?.duplicates?.length > 0 && (
                <div
                    style={{
                        marginTop: "20px",
                        textAlign: "left",
                    }}
                >
                    <h3>Duplicados</h3>

                    <ul>
                        {importResults.duplicates.map(
                            (duplicate, index) => (
                                <li key={index}>
                                    Fila {duplicate.row}:{" "}
                                    {duplicate.message}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {importErrors.length > 0 && (
                <div
                    style={{
                        marginTop: "30px",
                        textAlign: "left",
                    }}
                >
                    <h3>Errores</h3>

                    <ul>
                        {importErrors.map(
                            (error, index) => (
                                <li key={index}>
                                    Fila {error.row}:{" "}
                                    {error.message}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
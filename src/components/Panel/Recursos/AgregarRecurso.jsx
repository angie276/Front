import { useState } from "react";

const AgregarRecurso = ({ onAgregarRecurso }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("url"); // "url" o "archivo"
    const [url, setUrl] = useState("");
    const [archivoNombre, setArchivoNombre] = useState("");
    const [archivoData, setArchivoData] = useState("");
    const [categoria, setCategoria] = useState("url"); // "pdf", "url", "doc", "csv", "ppt", "otros"

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setArchivoNombre(file.name);
        
        // Auto-detect category from file extension
        const ext = file.name.split('.').pop().toLowerCase();
        let cat = "otros";
        if (ext === "pdf") cat = "pdf";
        else if (["doc", "docx"].includes(ext)) cat = "doc";
        else if (["xls", "xlsx", "csv"].includes(ext)) cat = "csv";
        else if (["ppt", "pptx"].includes(ext)) cat = "ppt";
        else if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) cat = "otros";
        
        setCategoria(cat);

        // If nombre is empty, suggest the file name (without extension)
        if (nombre.trim() === "") {
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            setNombre(nameWithoutExt);
        }

        // Read as data URL
        const reader = new FileReader();
        reader.onload = () => {
            setArchivoData(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() === "") return;

        let finalUrl = "";
        if (tipo === "url") {
            finalUrl = url;
            // If user did not specify protocol, add https://
            if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
                finalUrl = "https://" + finalUrl;
            }
        } else {
            finalUrl = archivoData || "#";
        }

        onAgregarRecurso({
            id: Date.now(),
            nombre: nombre,
            url: finalUrl,
            categoria: tipo === "url" ? (categoria === "url" ? "url" : categoria) : categoria,
            esArchivo: tipo === "archivo",
            archivoNombre: tipo === "archivo" ? archivoNombre : null
        });

        // Reset fields
        setNombre("");
        setUrl("");
        setArchivoNombre("");
        setArchivoData("");
        setCategoria("url");
    };

    return (
        <form className="ingresar-recurso" onSubmit={handleSubmit}>
            {/* Fila: Nombre del Recurso + Categoría */}
            <div className="fila-nombre-categoria">
                <div className="nombre-recurso" style={{ flex: 2 }}>
                    <p>Nombre del recurso</p>
                    <input 
                        className="input-nombre" 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Nombre del recurso..." 
                        required
                    />
                </div>
                
                <div className="categoria-recurso" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p>Categoría</p>
                    <select 
                        className="select-categoria"
                        value={categoria} 
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="url">URL</option>
                        <option value="pdf">PDF</option>
                        <option value="doc">DOC</option>
                        <option value="csv">CSV</option>
                        <option value="ppt">PPT</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
            </div>

            {/* Toggle Tipo: URL / Archivo */}
            <div className="toggle-tipo-recurso">
                <button 
                    type="button" 
                    className={`btn-toggle ${tipo === 'url' ? 'activo' : ''}`}
                    onClick={() => {
                        setTipo('url');
                        if (categoria === 'otros') setCategoria('url');
                    }}
                >
                    Enlace URL
                </button>
                <button 
                    type="button" 
                    className={`btn-toggle ${tipo === 'archivo' ? 'activo' : ''}`}
                    onClick={() => {
                        setTipo('archivo');
                        if (categoria === 'url') setCategoria('pdf'); // default to PDF for file uploads
                    }}
                >
                    Subir Archivo
                </button>
            </div>

            {/* Input dinámico según tipo */}
            <div className="contenedor-url-grande">
                <p>{tipo === 'url' ? 'URL del recurso' : 'Seleccionar Archivo'}</p>
                <div className="contenedor-url">
                    {tipo === 'url' ? (
                        <input 
                            className="input-url" 
                            type="text" 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                            placeholder="https://ejemplo.com..." 
                            required={tipo === 'url'}
                        />
                    ) : (
                        <div className="contenedor-file-input">
                            <label className="label-file-input">
                                <span>{archivoNombre ? '📎 ' + archivoNombre : 'Elegir archivo...'}</span>
                                <input 
                                    type="file" 
                                    className="input-file-hidden" 
                                    onChange={handleFileChange}
                                    required={tipo === 'archivo' && !archivoData}
                                />
                            </label>
                        </div>
                    )}
                    <button type="submit" className="añadir">+</button>
                </div>
            </div>
        </form>
    );
};

export default AgregarRecurso;
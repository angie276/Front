import React, { useState, useMemo } from "react";
import "./CalendarioGeneral.css";

const DIAS_SEMANA = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MESES = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const COLORES_PROYECTO = [
    "#8b7eff", "#f472b6", "#34d399", "#fb923c", "#60a5fa",
    "#a78bfa", "#f87171", "#4ade80", "#facc15", "#38bdf8"
];

const CalendarioGeneral = ({ proyectos = [], onSelectProyecto }) => {
    const hoy = new Date();
    const [anio, setAnio] = useState(hoy.getFullYear());
    const [mes, setMes] = useState(hoy.getMonth()); // 0-indexed
    const [busqueda, setBusqueda] = useState("");
    const [proyectoFiltro, setProyectoFiltro] = useState(null); // null = todos

    // ── Asignar color único a cada proyecto ──
    const colorPorProyecto = useMemo(() => {
        const map = {};
        proyectos.forEach((p, i) => {
            map[p.id] = COLORES_PROYECTO[i % COLORES_PROYECTO.length];
        });
        return map;
    }, [proyectos]);

    // ── Consolidar todas las tareas ──
    const todasLasTareas = useMemo(() => {
        const lista = [];
        proyectos.forEach(p => {
            (p.tareas || []).forEach(t => {
                lista.push({ ...t, proyectoId: p.id, proyectoTitle: p.title, proyectoTag: p.tag });
            });
        });
        return lista;
    }, [proyectos]);

    // ── Filtrar tareas ──
    const tareasFiltradas = useMemo(() => {
        return todasLasTareas.filter(t => {
            const matchProyecto = proyectoFiltro === null || t.proyectoId === proyectoFiltro;
            const matchBusqueda = !busqueda || (t.titulo || "").toLowerCase().includes(busqueda.toLowerCase());
            return matchProyecto && matchBusqueda;
        });
    }, [todasLasTareas, proyectoFiltro, busqueda]);

    // ── Navegación de mes ──
    const irMesAnterior = () => {
        if (mes === 0) { setMes(11); setAnio(a => a - 1); }
        else setMes(m => m - 1);
    };
    const irMesSiguiente = () => {
        if (mes === 11) { setMes(0); setAnio(a => a + 1); }
        else setMes(m => m + 1);
    };

    // ── Construir grilla del mes ──
    const diasDelMes = useMemo(() => {
        const primerDia = new Date(anio, mes, 1).getDay(); // 0=dom
        const totalDias = new Date(anio, mes + 1, 0).getDate();

        // Días del mes anterior para rellenar
        const diasMesAnterior = new Date(anio, mes, 0).getDate();
        const celdas = [];

        for (let i = primerDia - 1; i >= 0; i--) {
            celdas.push({ dia: diasMesAnterior - i, esActual: false });
        }
        for (let d = 1; d <= totalDias; d++) {
            celdas.push({ dia: d, esActual: true });
        }
        // Rellenar hasta múltiplo de 7
        const restante = 7 - (celdas.length % 7);
        if (restante < 7) {
            for (let i = 1; i <= restante; i++) {
                celdas.push({ dia: i, esActual: false });
            }
        }
        return celdas;
    }, [anio, mes]);

    // ── Mapear tareas por día ──
    const tareasPorDia = useMemo(() => {
        const map = {};
        tareasFiltradas.forEach(t => {
            if (!t.fechaLimite) return;
            const f = new Date(t.fechaLimite + "T00:00:00");
            if (f.getFullYear() === anio && f.getMonth() === mes) {
                const d = f.getDate();
                if (!map[d]) map[d] = [];
                map[d].push(t);
            }
        });
        return map;
    }, [tareasFiltradas, anio, mes]);

    // ── Mapear proyectos activos por día (rango startDateRaw..endDateRaw) ──
    const proyectosPorDia = useMemo(() => {
        const map = {};
        const totalDias = new Date(anio, mes + 1, 0).getDate();
        const proyectosFiltrados = proyectoFiltro
            ? proyectos.filter(p => p.id === proyectoFiltro)
            : proyectos;

        proyectosFiltrados.forEach(p => {
            if (!p.startDateRaw) return;
            const inicio = new Date(p.startDateRaw + "T00:00:00");
            const fin = p.endDateRaw ? new Date(p.endDateRaw + "T00:00:00") : null;

            for (let d = 1; d <= totalDias; d++) {
                const fecha = new Date(anio, mes, d);
                const despuesDeInicio = fecha >= inicio;
                const antesDeFinOsinFin = !fin || fecha <= fin;
                if (despuesDeInicio && antesDeFinOsinFin) {
                    if (!map[d]) map[d] = [];
                    const esInicio = fecha.toDateString() === inicio.toDateString();
                    const esFin = fin && fecha.toDateString() === fin.toDateString();
                    map[d].push({ ...p, esInicio, esFin });
                }
            }
        });
        return map;
    }, [proyectos, proyectoFiltro, anio, mes]);

    // ── Estadísticas ──
    const entregadas = tareasFiltradas.filter(t => t.check).length;
    const pendientes = tareasFiltradas.filter(t => !t.check).length;

    // ── Próximas tareas (sin fecha o futuras, no completadas) ──
    const proximasTareas = useMemo(() => {
        const hoyMs = new Date().setHours(0, 0, 0, 0);
        return tareasFiltradas
            .filter(t => !t.check && t.fechaLimite && new Date(t.fechaLimite + "T00:00:00") >= hoyMs)
            .sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))
            .slice(0, 5);
    }, [tareasFiltradas]);

    const esHoy = (dia) =>
        dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();

    const formatFechaCorta = (dateStr) => {
        if (!dateStr) return "";
        const f = new Date(dateStr + "T00:00:00");
        return `${f.getDate()} ${MESES[f.getMonth()].slice(0, 3).toLowerCase()}`;
    };

    return (
        <div className="cal-wrapper">
            {/* ══════════════ PANEL IZQUIERDO ══════════════ */}
            <aside className="cal-sidebar">

                {/* Header mes/año + navegación */}
                <div className="cal-mes-nav">
                    <button className="cal-nav-btn" onClick={irMesAnterior} title="Mes anterior">‹</button>
                    <span className="cal-mes-label">
                        {MESES[mes]} <strong>{anio}</strong>
                    </span>
                    <button className="cal-nav-btn" onClick={irMesSiguiente} title="Mes siguiente">›</button>
                </div>


                {/* Filtro por proyecto */}
                <div className="cal-filtro-section">
                    <span className="cal-filtro-titulo">TUS ESPACIOS / PROYECTOS</span>
                    <div className="cal-proyectos-lista">
                        <button
                            className={`cal-proyecto-chip ${proyectoFiltro === null ? "activo" : ""}`}
                            onClick={() => setProyectoFiltro(null)}
                            style={proyectoFiltro === null ? { borderColor: "#8b7eff", color: "#8b7eff" } : {}}
                        >
                            <span className="cal-chip-dot" style={{ background: "#8b7eff" }}></span>
                            Ver Todos
                            <span className="cal-chip-count">{todasLasTareas.length}</span>
                        </button>
                        {proyectos.map(p => (
                            <button
                                key={p.id}
                                className={`cal-proyecto-chip ${proyectoFiltro === p.id ? "activo" : ""}`}
                                onClick={() => setProyectoFiltro(proyectoFiltro === p.id ? null : p.id)}
                                style={proyectoFiltro === p.id ? { borderColor: colorPorProyecto[p.id], color: colorPorProyecto[p.id] } : {}}
                            >
                                <span className="cal-chip-dot" style={{ background: colorPorProyecto[p.id] }}></span>
                                {p.title}
                                <span className="cal-chip-count">{(p.tareas || []).length}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Próximas entregas */}
                <div className="cal-filtro-section cal-proximas">
                    <span className="cal-filtro-titulo">
                        PRÓXIMAS ACADÉMICAS
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ marginLeft: 6, color: "#f39c12" }}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                    </span>
                    {proximasTareas.length === 0 ? (
                        <p className="cal-empty-proximas">No hay entregas pendientes</p>
                    ) : (
                        <div className="cal-proximas-lista">
                            {proximasTareas.map(t => (
                                <div key={t.id} className="cal-proxima-item">
                                    <span
                                        className="cal-proxima-dot"
                                        style={{ background: colorPorProyecto[t.proyectoId] }}
                                    ></span>
                                    <div className="cal-proxima-info">
                                        <span className="cal-proxima-titulo">{t.titulo}</span>
                                        <span className="cal-proxima-fecha">{formatFechaCorta(t.fechaLimite)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Estadísticas */}
                <div className="cal-stats">
                    <div className="cal-stat-item">
                        <span className="cal-stat-label">ENTREGADOS</span>
                        <span className="cal-stat-valor verde">{entregadas}</span>
                    </div>
                    <div className="cal-stat-item">
                        <span className="cal-stat-label">PENDIENTES</span>
                        <span className="cal-stat-valor rojo">{pendientes}</span>
                    </div>
                </div>
            </aside>

            {/* ══════════════ GRILLA CALENDARIO ══════════════ */}
            <div className="cal-main">
                {/* Cabecera días de semana */}
                <div className="cal-grid-header">
                    {DIAS_SEMANA.map(d => (
                        <div key={d} className="cal-dia-nombre">{d}</div>
                    ))}
                </div>

                {/* Celdas */}
                <div className="cal-grid">
                    {diasDelMes.map((celda, idx) => {
                        const tareasDia = celda.esActual ? (tareasPorDia[celda.dia] || []) : [];
                        const proysDia = celda.esActual ? (proyectosPorDia[celda.dia] || []) : [];
                        const esDiaHoy = celda.esActual && esHoy(celda.dia);
                        return (
                            <div
                                key={idx}
                                className={`cal-celda ${!celda.esActual ? "otro-mes" : ""} ${esDiaHoy ? "hoy" : ""}`}
                            >
                                <span className={`cal-num-dia ${esDiaHoy ? "hoy-badge" : ""}`}>
                                    {celda.dia}
                                </span>

                                {/* Barras de proyectos */}
                                {proysDia.length > 0 && (
                                    <div className="cal-proyectos-dia">
                                        {proysDia.map(p => (
                                            <div
                                                key={p.id}
                                                className={`cal-proyecto-barra ${p.esInicio ? 'inicio' : ''} ${p.esFin ? 'fin' : ''}`}
                                                style={{
                                                    background: `${colorPorProyecto[p.id]}33`,
                                                    borderColor: colorPorProyecto[p.id],
                                                    color: colorPorProyecto[p.id],
                                                }}
                                                title={`${p.title}\n${p.startDate} → ${p.endDate}`}
                                            >
                                                {(p.esInicio || p.esFin) && (
                                                    <span className="cal-proyecto-nombre">
                                                        {p.esInicio ? '▶ ' : '■ '}{p.tag}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Chips de tareas */}
                                <div className="cal-tareas-dia">
                                    {tareasDia.slice(0, 2).map(t => (
                                        <div
                                            key={t.id}
                                            className="cal-tarea-chip"
                                            style={{
                                                background: `${colorPorProyecto[t.proyectoId]}22`,
                                                borderLeft: `3px solid ${colorPorProyecto[t.proyectoId]}`,
                                                color: colorPorProyecto[t.proyectoId],
                                            }}
                                            title={`${t.titulo} — ${t.proyectoTitle}`}
                                        >
                                            {t.titulo}
                                        </div>
                                    ))}
                                    {tareasDia.length > 2 && (
                                        <div className="cal-mas-tareas">+{tareasDia.length - 2} más</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarioGeneral;

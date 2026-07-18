import "./Icons.css";

export const GraduationIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
);

export const BookIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

export const ArrowRightIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export const UserIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export const CalendarIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export const CodeIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

export const DesignIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
);

export const PlusIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const CloseIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

/* ── Iconos para tabs y switchers ── */

export const GridIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

export const TimelineIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" />
        <rect x="5" y="3" width="6" height="6" rx="1" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <rect x="11" y="9" width="8" height="6" rx="1" />
        <line x1="3" y1="18" x2="21" y2="18" />
        <rect x="7" y="15" width="5" height="6" rx="1" />
    </svg>
);

export const WorkloadIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <path d="M2 20h20" />
        <rect x="4" y="12" width="3" height="8" rx="1" />
        <rect x="10.5" y="7" width="3" height="13" rx="1" />
        <rect x="17" y="4" width="3" height="16" rx="1" />
    </svg>
);

export const ListIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3.5" cy="6" r="1.5" />
        <circle cx="3.5" cy="12" r="1.5" />
        <circle cx="3.5" cy="18" r="1.5" />
    </svg>
);

export const ChartIcon = () => (
    <svg className="espacio-trabajo-icon" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="13" y2="18" />
    </svg>
);

export const TrashIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

export const AlertDeadlineIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2C8.5 2 6 5 6 8c0 2.5 1 4.5 2.5 6L12 22l3.5-8C17 12.5 18 10.5 18 8c0-3-2.5-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
    </svg>
);

export const ArrowRightSmallIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);
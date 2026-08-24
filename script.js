:root {
    --bg-app: #fbf7f5;
    --panel-white: rgba(255, 255, 255, 0.85);
    --glass-border: 1px solid rgba(255, 255, 255, 0.6);
    --primary-cute: #ffb7b2;
    --primary-hover: #ff9aa2;
    --text-main: #5d5451;
    --text-muted: #8e827e;
    --border-color: #f0eae6;
    --input-bg: #faf8f7;
    --header-gradient: linear-gradient(135deg, #ffcad4 0%, #b5e2fa 100%);
    --header-text-color: #4a3e3d;
    --pill-bg: #eae3df;
    
    --badge-ativo-bg: #e2f0cb;
    --badge-ativo-txt: #5b7037;
    --badge-manutencao-bg: #ffdac1;
    --badge-manutencao-txt: #b0622b;
    --badge-inativo-bg: #ffb7b2;
    --badge-inativo-txt: #80302b;

    /* Cores dos Toasts */
    --toast-success: #e2f0cb;
    --toast-success-txt: #47582b;
    --toast-warning: #ffdac1;
    --toast-warning-txt: #945120;
    --toast-error: #ffb7b2;
    --toast-error-txt: #702521;
}

[data-theme="dark"] {
    --bg-app: #19161a;
    --panel-white: rgba(42, 34, 42, 0.85);
    --glass-border: 1px solid rgba(255, 255, 255, 0.05);
    --primary-cute: #fbc4ab;
    --primary-hover: #ffb7b2;
    --text-main: #f3e9dc;
    --text-muted: #b7a7b8;
    --border-color: #3d303e;
    --input-bg: #322833;
    --header-gradient: linear-gradient(135deg, #3d2a3a 0%, #172433 100%);
    --header-text-color: #f3e9dc;
    --pill-bg: #3f3340;
    
    --badge-ativo-bg: #2d3f2f;
    --badge-ativo-txt: #a3e0b2;
    --badge-manutencao-bg: #4a3221;
    --badge-manutencao-txt: #e6be9a;
    --badge-inativo-bg: #4d2323;
    --badge-inativo-txt: #e69a9a;

    --toast-success: #2d3f2f;
    --toast-success-txt: #a3e0b2;
    --toast-warning: #4a3221;
    --toast-warning-txt: #e6be9a;
    --toast-error: #4d2323;
    --toast-error-txt: #e69a9a;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease, transform 0.2s, box-shadow 0.3s;
}

body {
    background-color: var(--bg-app);
    color: var(--text-main);
    font-family: 'Quicksand', sans-serif;
    font-weight: 600;
    padding: 30px 20px;
    background-image: radial-gradient(var(--border-color) 1.5px, transparent 1.5px);
    background-size: 24px 24px;
}

/* ANIMAÇÕES */
.animate-pop { animation: popIn 0.4s ease-out; }
.animate-fade { animation: slideUp 0.5s ease-out both; }
@keyframes popIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* INTERFACE PRINCIPAL */
.panel {
    background: var(--panel-white);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: var(--glass-border);
    padding: 25px;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.015);
    margin-bottom: 25px;
}
.panel:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 35px rgba(255, 183, 178, 0.12);
}

.app-header { background: var(--header-gradient); padding: 25px 30px; border-radius: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; border: var(--glass-border); }
.header-content { display: flex; align-items: center; gap: 20px; }
.header-icon { font-size: 2.8rem; background: rgba(255,255,255,0.25); padding: 8px; border-radius: 50%; }
.app-header h1 { font-family: 'Fredoka', sans-serif; color: var(--header-text-color); font-size: 1.8rem; }
.app-header p { color: var(--header-text-color); opacity: 0.9; }

.btn-theme { background: var(--panel-white); color: var(--text-main); border: var(--glass-border); padding: 12px 18px; border-radius: 14px; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.btn-theme:hover { transform: scale(1.1) rotate(6deg); }

.dashboard-top-grid { display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 5px; }
@media (min-width: 992px) { .dashboard-top-grid { grid-template-columns: 2fr 1fr; } }

/* CONTADORES METRICAS */
.metrics-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; height: 100%; }
.card-metric { background: var(--panel-white); border: var(--glass-border); backdrop-filter: blur(8px); padding: 18px; border-radius: 20px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.01); border-bottom: 4px solid transparent; display: flex; flex-direction: column; justify-content: center; }
.card-metric h3 { font-size: 0.85rem; color: var(--text-muted); }
.card-metric p { font-size: 2rem; font-family: 'Fredoka', sans-serif; color: var(--text-main); margin-top: 3px; }
.card-metric.total { border-bottom-color: #b5e2fa; }
.card-metric.ativo { border-bottom-color: var(--badge-ativo-txt); }
.card-metric.manutencao { border-bottom-color: var(--badge-manutencao-txt); }
.card-metric.inativo { border-bottom-color: var(--badge-inativo-txt); }

/* GRÁFICO */
.chart-panel h3 { font-family: 'Fredoka', sans-serif; font-size: 1.1rem; margin-bottom: 15px; color: var(--text-main); text-align: center;}
.chart-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; }
.donut-chart { position: relative; width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--primary-cute) 0deg, var(--border-color) 0deg); display: flex; align-items: center; justify-content: center; }
.donut-hole { width: 85px; height: 85px; background-color: var(--bg-app); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
#chart-percentage { font-family: 'Fredoka', sans-serif; font-size: 1.4rem; color: var(--text-main); }
.chart-legend { text-align: center; font-size: 0.85rem; }
.chart-legend .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
.chart-legend .dot.ativo { background-color: var(--primary-cute); }
.chart-legend small { color: var(--text-muted); display: block; margin-top: 2px; }

.main-layout { display: grid; grid-template-columns: 1fr; gap: 30px; max-width: 1400px; margin: 0 auto; }
@media (min-width: 992px) { .main-layout { grid-template-columns: 380px 1fr; } }
.panel h2 { font-family: 'Fredoka', sans-serif; font-size: 1.3rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }

/* ENTRADAS */
.field-group { margin-bottom: 18px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
label { display: block; margin-bottom: 8px; font-size: 0.9rem; }
input[type="text"], select, textarea {
    width: 100%; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 14px;
    background-color: var(--input-bg); color: var(--text-main); font-family: inherit; font-weight: 600; outline: none; resize: none;
}
input[type="text"]:focus, select:focus, textarea:focus { border-color: var(--primary-cute); box-shadow: 0 0 0 4px rgba(255, 183, 178, 0.2); }

.btn-submit { width: 100%; padding: 14px; background-color: var(--primary-cute); color: #4a3e3d; border: none; border-radius: 12px; font-size: 1rem; font-family: 'Fredoka', sans-serif; cursor: pointer; box-shadow: 0 4px 10px rgba(255, 183, 178, 0.3); }
.btn-submit:hover { background-color: var(--primary-hover); transform: translateY(-2px); }
.btn-cancel { width: 100%; padding: 12px; background-color: transparent; border: 2px dashed var(--border-color); color: var(--text-muted); border-radius: 12px; margin-top: 10px; cursor: pointer; font-family: inherit; font-weight: bold; }

/* FILTROS PÍLULAS */
.filter-pills-container { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; padding-bottom: 5px; }
.pill-btn { background-color: var(--pill-bg); color: var(--text-main); border: none; padding: 8px 14px; border-radius: 20px; font-family: inherit; font-size: 0.85rem; font-weight: 700; cursor: pointer; }
.pill-btn:hover { transform: scale(1.05); }
.pill-btn.active { background-color: var(--primary-cute); color: #4a3e3d; box-shadow: 0 4px 10px rgba(255, 183, 178, 0.25); }

/* TABELA E BALÃO EXPANSÍVEL (NOTES) */
.table-header-actions { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; }
.action-row { display: flex; gap: 10px; width: 100%; max-width: 500px; }
.btn-export { background: #b5e2fa; border: none; color: #2c4a5e; padding: 10px 16px; border-radius: 12px; font-family: inherit; cursor: pointer; font-weight: 700; }
.btn-export:hover { transform: translateY(-2px); background: #9ad1f0; }

.scrollable-table { overflow-x: auto; width: 100%; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { padding: 15px; color: var(--text-muted); font-size: 0.85rem; border-bottom: 2px solid var(--border-color); }
td { padding: 15px; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; color: var(--text-main); position: relative; }
tbody tr:hover { background-color: rgba(255, 183, 178, 0.02); }

/* BALÃO NOTA TÉCNICA */
.note-indicator {
    display: inline-block; font-size: 0.75rem; color: var(--text-muted); font-weight: bold;
    background-color: var(--input-bg); padding: 2px 6px; border-radius: 6px; width: fit-content; margin-top: 4px; cursor: help;
}
.note-indicator:hover::after {
    content: attr(data-note); position: absolute; background: var(--panel-white); color: var(--text-main);
    padding: 8px 12px; border-radius: 12px; font-size: 0.85rem; border: 2px solid var(--primary-cute);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08); width: 220px; z-index: 99; left: 15px; top: 35px; display: block;
}

.btn-edit, .btn-action-delete { background: none; border: none; cursor: pointer; font-size: 1.05rem; padding: 6px; border-radius: 8px; }
.btn-edit:hover { background: rgba(0,0,0,0.05); transform: scale(1.1); }
.btn-action-delete:hover { background: #ffe3e1; transform: scale(1.1); }

.badge { padding: 6px 14px; border-radius: 30px; font-size: 0.8rem; font-weight: 700; display: inline-block; }
.badge-ativo { background: var(--badge-ativo-bg); color: var(--badge-ativo-txt); }
Use o código com cuidado..badge-manutencao { background: var(--badge-manutencao-bg); color: var(--badge-manutencao-txt); }.badge-inativo { background: var(--badge-inativo-bg); color: var(--badge-inativo-txt); }/* LOGS */.log-list { list-style: none; max-height: 160px; overflow-y: auto; font-size: 0.9rem; }.log-item { padding: 10px 14px; border-left: 4px solid var(--primary-cute); margin-bottom: 8px; background: var(--input-bg); border-radius: 0 10px 10px 0; color: var(--text-main); }.empty-log { color: var(--text-muted); text-align: center; font-style: italic; padding: 10px; }/* MODAL */.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }.modal-overlay.active { opacity: 1; pointer-events: auto; }.modal-card { background: var(--panel-white); border: var(--glass-border); padding: 30px; border-radius: 24px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1); transform: scale(0.95); transition: transform 0.3s ease; }.modal-overlay.active .modal-card { transform: scale(1); }.modal-icon { font-size: 3rem; margin-bottom: 12px; }.modal-card h3 { font-family: 'Fredoka', sans-serif; font-size: 1.4rem; color: var(--text-main); margin-bottom: 10px; }.modal-card p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; }.modal-buttons { display: flex; gap: 12px; justify-content: center; }.btn-modal-confirm { background: var(--primary-cute); color: #4a3e3d; border: none; padding: 12px 22px; border-radius: 12px; font-family: inherit; font-weight: 700; cursor: pointer; }.btn-modal-cancel { background: var(--input-bg); color: var(--text-main); border: 2px solid var(--border-color); padding: 12px 22px; border-radius: 12px; font-family: inherit; font-weight: 700; cursor: pointer; }/* TOASTS COLORIDOS */.toast-container { position: fixed; bottom: 25px; right: 25px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; }.toast-box {color: var(--text-main); font-weight: bold; font-size: 0.9rem; padding: 15px 22px; border-radius: 14px;box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;}.toast-box.success { background-color: var(--toast-success); border-left: 5px solid var(--badge-ativo-txt); color: var(--toast-success-txt); }.toast-box.warning { background-color: var(--toast-warning); border-left: 5px solid var(--badge-manutencao-txt); color: var(--toast-warning-txt); }.toast-box.error { background-color: var(--toast-error); border-left: 5px solid var(--badge-inativo-txt); color: var(--toast-error-txt); }@keyframes toastIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }.toast-fade-out { animation: toastOut 0.25s ease-in forwards !important; }@keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(40px); opacity: 0; } }.empty-state { text-align: center; padding: 40px; color: var(--text-muted); display: none; }
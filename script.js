## ⚙️ 3. Lógica Sem Falhas (`script.js`)

```javascript
// 📦 ESTADO GLOBAL DA APLICAÇÃO
let inventario = JSON.parse(localStorage.getItem('tech_cute_inventory')) || [];
let logs = JSON.parse(localStorage.getItem('tech_cute_logs')) || [];
let callbackModal = null; 
let filtroAtivo = 'all'; 

// 🎯 REFERÊNCIAS DO DOM
const form = document.getElementById('form-inventario');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const listaTabela = document.getElementById('lista-tabela');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const logList = document.getElementById('log-list');
const toastContainer = document.getElementById('toast-container');

// CONTADORES E GRÁFICO
const totalItensEl = document.getElementById('total-itens');
const totalAtivosEl = document.getElementById('total-ativos');
const totalManutencaoEl = document.getElementById('total-manutencao');
const totalInativosEl = document.getElementById('total-inativos');
const donutChart = document.getElementById('donut-chart');
const chartPercentage = document.getElementById('chart-percentage');

// BOTÕES ESPECÍFICOS E MODAIS
const themeToggle = document.getElementById('theme-toggle');
const btnExport = document.getElementById('btn-export');
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtnConfirm = document.getElementById('modal-btn-confirm');
const modalBtnCancel = document.getElementById('modal-btn-cancel');

// 🚀 EVENTO DE INICIALIZAÇÃO DA PÁGINA
window.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('cute_theme') || 'light';
    document.documentElement.setAttribute('data-theme', temaSalvo);
    themeToggle.textContent = temaSalvo === 'light' ? '✨ 🌙' : '✨ ☀️';

    inicializarFiltrosPilulas();
    renderApp();
    renderLogs();
});

// 🌓 GERENCIADOR DO MODO ESCURO
themeToggle.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme');
    const novoTema = atual === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', novoTema);
    localStorage.setItem('cute_theme', novoTema);
    themeToggle.textContent = novoTema === 'light' ? '✨ 🌙' : '✨ ☀️';
    
    registrarLog(`Mudou o visual do painel para o modo ${novoTema === 'light' ? 'Claro' : 'Escuro'} 🎨`);
    spawnToast("Visual alterado com sucesso! ✨", "success");
});

// 📝 SUBMIT DO FORMULÁRIO (SALVAR / ATUALIZAR)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const idEdicao = editIdInput.value;
    const nome = document.getElementById('nome').value.trim();
    const patrimonio = document.getElementById('patrimonio').value.trim();
    const categoria = document.getElementById('categoria').value;
    const status = document.getElementById('status').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    // TRAVA ANTI-DUPLICAÇÃO DE PATRIMÔNIO
    const patrimonioExistente = inventario.some(item => item.patrimonio.toLowerCase() === patrimonio.toLowerCase() && item.id !== idEdicao);
    if (patrimonioExistente) {
        spawnToast("Esse código de patrimônio já existe! ❌", "error");
        return;
    }

    if (idEdicao) {
        // Modo Edição
        inventario = inventario.map(item => {
            if (item.id === idEdicao) {
                return { id: idEdicao, nome, patrimonio, categoria, status, observacoes };
            }
            return item;
        });
        registrarLog(`Modificou as propriedades do item: "${nome}" ✏️`);
        spawnToast("🎀 Registro atualizado!", "success");
        encerrarModoEdicao();
    } else {
        // Modo Cadastro
        const novoEquipamento = {
            id: 'EQ-' + Date.now().toString().slice(-6),
            nome, patrimonio, categoria, status, observacoes
        };
        inventario.push(novoEquipamento);
        registrarLog(`Adicionou um novo item ao acervo: "${nome}" 📦`);
        spawnToast("✨ Salvo com sucesso!", "success");
    }

    sincronizarStorage();
    renderApp();
    form.reset();
    searchInput.value = ''; 
});

// ✏️ ACIONAR MODO EDIÇÃO
window.prepararEdicao = function(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    editIdInput.value = item.id;
    document.getElementById('nome').value = item.nome;
    document.getElementById('patrimonio').value = item.patrimonio;
    document.getElementById('categoria').value = item.categoria;
    document.getElementById('status').value = item.status;
    document.getElementById('observacoes').value = item.observacoes || '';

    formTitle.innerHTML = `<span>⚙️</span> Editando Item`;
    btnSubmit.textContent = "Atualizar Dados ✨";
    btnCancelEdit.style.display = 'block';
    
    window.scrollTo({ top: form.offsetTop - 20, behavior: 'smooth' });
};

btnCancelEdit.addEventListener('click', encerrarModoEdicao);

function encerrarModoEdicao() {
    form.reset();
    editIdInput.value = '';
    formTitle.innerHTML = `<span>✏️</span> Novo Registro`;
    btnSubmit.textContent = "Salvar no Sistema ✨";
    btnCancelEdit.style.display = 'none';
}

// 🗑️ DISPARAR DELEÇÃO COM MODAL CUTE
window.deletarItem = function(id) {
    if (editIdInput.value === id) {
        encerrarModoEdicao();
    }

    const item = inventario.find(i => i.id === id);
    const nomeItem = item ? item.nome : 'o equipamento';

    mostrarModal(
        "✨ Deseja mesmo remover?", 
        `O item "${nomeItem}" será permanentemente retirado da listagem do laboratório.`, 
        () => {
            inventario = inventario.filter(item => item.id !== id);
            registrarLog(`Removeu permanentemente do acervo: "${nomeItem}" 🗑️`);
            spawnToast("Item excluído com sucesso!", "warning");
            sincronizarStorage();
            renderApp();
        }
    );
};

// 🔍 PESQUISA POR INPUT TEXTO
searchInput.addEventListener('input', function(e) {
    renderApp(e.target.value.toLowerCase().trim());
});

// 💊 FILTROS POR PÍLULAS
function inicializarFiltrosPilulas() {
    const pilulas = document.querySelectorAll('.pill-btn');
    pilulas.forEach(pill => {
        pill.addEventListener('click', (e) => {
            pilulas.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            
            filtroAtivo = e.target.getAttribute('data-filter-type');
            renderApp(searchInput.value.toLowerCase().trim());
        });
    });
}

// 📈 ENGINE DO GRÁFICO DONUT
function atualizarGraficoDonut(total, ativos) {
    if (total === 0) {
        chartPercentage.textContent = "0%";
        donutChart.style.background = `conic-gradient(var(--border-color) 360deg, var(--border-color) 360deg)`;
        return;
    }
    const porcentagem = Math.round((ativos / total) * 100);
    chartPercentage.textContent = `${porcentagem}%`;
    const graus = (porcentagem / 100) * 360;
    donutChart.style.background = `conic-gradient(var(--primary-cute) ${graus}deg, var(--border-color) ${graus}deg)`;
}

// 📥 EXPORTAÇÃO CSV
btnExport.addEventListener('click', () => {
    if (inventario.length === 0) {
        mostrarModal("🌸 Opa!", "Não existem dados disponíveis para exportação no momento.", null);
        return;
    }

    let csvContent = "\uFEFFPatrimonio;Nome;Categoria;Status;Observacoes\n";
    inventario.forEach(item => {
        csvContent += `"${item.patrimonio}";"${item.nome}";"${item.categoria}";"${item.status}";"${item.observacoes || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_laboratorio_${Date.now()}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    registrarLog(`Exportou a lista de registros em arquivo .CSV 📥`);
    spawnToast("📊 Planilha baixada com sucesso!", "success");
});

// 🍞 TOASTS COLORIDOS DINÂMICOS
function spawnToast(mensagem, tipo = "success") {
    const toast = document.createElement('div');
    toast.className = `toast-box ${tipo}`;
    
    let icone = "✨";
    if (tipo === "warning") icone = "🔧";
    if (tipo === "error") icone = "🌸";

    toast.innerHTML = `<span>${icone}</span> ${mensagem}`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// 🪟 MODAL
function mostrarModal(titulo, mensagem, acaoConfirmar) {
    modalTitle.textContent = titulo;
    modalMessage.textContent = mensagem;
    customModal.classList.add('active');
    callbackModal = acaoConfirmar;
}

modalBtnConfirm.addEventListener('click', () => {
    if (callbackModal) callbackModal();
    fecharModal();
});

modalBtnCancel.addEventListener('click', fecharModal);

function fecharModal() {
    customModal.classList.remove('active');
    callbackModal = null;
}

// 🔄 RENDERIZADOR CENTRAL REATIVO
function renderApp(buscaTexto = '') {
    const dadosFiltrados = inventario.filter(item => {
        const atendeTexto = item.nome.toLowerCase().includes(buscaTexto) || item.patrimonio.toLowerCase().includes(buscaTexto);
        let atendePilula = true;
        if (filtroAtivo !== 'all') {
            const [tipoFiltro, valorFiltro] = filtroAtivo.split('-');
            if (tipoFiltro === 'cat') atendePilula = (item.categoria === valorFiltro);
            if (tipoFiltro === 'status') atendePilula = (item.status === valorFiltro);
        }
return atendeTexto && atendePilula;});listaTabela.innerHTML = '';if (dadosFiltrados.length === 0) {emptyState.style.display = 'block';} else {emptyState.style.display = 'none';dadosFiltrados.forEach(item => {const tr = document.createElement('tr');let classeBadge = item.status === 'Ativo' ? 'badge-ativo' : (item.status === 'Em Manutenção' ? 'badge-manutencao' : 'badge-inativo');const stringNota = item.observacoes ? <span class="note-indicator" data-note="${item.observacoes}">📝 Ver Notas</span> : '';tr.innerHTML = `${item.patrimonio}${stringNota}${item.categoria}${item.status}`;listaTabela.appendChild(tr);});}const totalGeral = inventario.length;const totalAtivos = inventario.filter(i => i.status === 'Ativo').length;const totalManutencao = inventario.filter(i => i.status === 'Em Manutenção').length;const totalInativos = inventario.filter(i => i.status === 'Inativo').length;totalItensEl.textContent = totalGeral;totalAtivosEl.textContent = totalAtivos;totalManutencaoEl.textContent = totalManutencao;totalInativosEl.textContent = totalInativos;atualizarGraficoDonut(totalGeral, totalAtivos);}// 📜 LOGSfunction registrarLog(texto) {const agora = new Date();const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });const novoLog = [${horaFormatada}] ${texto};logs.unshift(novoLog);if (logs.length > 25) logs.pop();localStorage.setItem('tech_cute_logs', JSON.stringify(logs));renderLogs();}function renderLogs() {logList.innerHTML = '';if (logs.length === 0) {logList.innerHTML = <li class="empty-log">Nenhuma atividade registrada ainda... ✨</li>;return;}logs.forEach(log => {const li = document.createElement('li');li.className = 'log-item';li.textContent = log;logList.appendChild(li);});}function sincronizarStorage() {localStorage.setItem('tech_cute_inventory', JSON.stringify(inventario));}
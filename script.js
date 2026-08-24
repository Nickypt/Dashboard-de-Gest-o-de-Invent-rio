// 📦 Estado da Aplicação
let inventario = JSON.parse(localStorage.getItem('tech_cute_inventory')) || [];
let logs = JSON.parse(localStorage.getItem('tech_cute_logs')) || [];
let callbackModal = null; // Guardará o que fazer quando o modal for confirmado

// 🎯 Seleção de Elementos
const form = document.getElementById('form-inventario');
const editIdInput = document.getElementById('edit-id');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const listaTabela = document.getElementById('lista-tabela');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const logList = document.getElementById('log-list');

// Estatísticas
const totalItensEl = document.getElementById('total-itens');
const totalAtivosEl = document.getElementById('total-ativos');
const totalManutencaoEl = document.getElementById('total-manutencao');
const totalInativosEl = document.getElementById('total-inativos');

// Modais e Temas
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtnConfirm = document.getElementById('modal-btn-confirm');
const modalBtnCancel = document.getElementById('modal-btn-cancel');
const themeToggle = document.getElementById('theme-toggle');

// 🚀 Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carrega tema salvo
    const temaSalvo = localStorage.getItem('cute_theme') || 'light';
    document.documentElement.setAttribute('data-theme', temaSalvo);
    themeToggle.textContent = temaSalvo === 'light' ? '✨ 🌙' : '✨ ☀️';
    
    renderApp();
    renderLogs();
});

// 🌓 Alternar Modo Escuro / Claro
themeToggle.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme');
    const novoTema = atual === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', novoTema);
    localStorage.setItem('cute_theme', novoTema);
    themeToggle.textContent = novoTema === 'light' ? '✨ 🌙' : '✨ ☀️';
    registrarLog(`Mudou o visual do painel para o modo ${novoTema === 'light' ? 'Claro' : 'Escuro'} 🎨`);
});

// ✨ Criar ou Editar Registro (Submit do Form)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const idEdicao = editIdInput.value;
    const nome = document.getElementById('nome').value.trim();
    const patrimonio = document.getElementById('patrimonio').value.trim();
    const categoria = document.getElementById('categoria').value;
    const status = document.getElementById('status').value;

    if (idEdicao) {
        // Modo Edição (UPDATE)
        const itemIndex = inventario.findIndex(i => i.id === idEdicao);
        if (itemIndex > -1) {
            inventario[itemIndex] = { id: idEdicao, nome, patrimonio, categoria, status };
            registrarLog(`Modificou as propriedades do item: "${nome}" ✏️`);
        }
        encerrarModoEdicao();
    } else {
        // Modo Cadastro (CREATE)
        const novoEquipamento = {
            id: 'EQ-' + Date.now().toString().slice(-6),
            nome, patrimonio, categoria, status
        };
        inventario.push(novoEquipamento);
        registrarLog(`Adicionou um novo item ao acervo: "${nome}" 📦`);
    }

    sincronizarStorage();
    renderApp();
    form.reset();
});

// ✏️ Ativar Modo Edição no Formulário
function prepararEdicao(id) {
    const item = inventario.find(i => i.id === id);
    if (!item) return;

    editIdInput.value = item.id;
    document.getElementById('nome').value = item.nome;
    document.getElementById('patrimonio').value = item.patrimonio;
    document.getElementById('categoria').value = item.categoria;
    document.getElementById('status').value = item.status;

    formTitle.innerHTML = `<span>⚙️</span> Editando Item`;
    btnSubmit.textContent = "Atualizar Dados ✨";
    btnCancelEdit.style.display = 'block';
    
    // Rola a tela suavemente para o formulário no mobile
    form.scrollIntoView({ behavior: 'smooth' });
}

btnCancelEdit.addEventListener('click', encerrarModoEdicao);

function encerrarModoEdicao() {
    form.reset();
    editIdInput.value = '';
    formTitle.innerHTML = `<span>✏️</span> Novo Registro`;
    btnSubmit.textContent = "Salvar no Sistema ✨";
    btnCancelEdit.style.display = 'none';
}

// 🪟 Gerenciador de Modais Customizados (Substitutos de alerts/confirms)
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

// 🗑️ Operação de Exclusão usando Modal Customizado
function deletarItem(id) {
    const item = inventario.find(i => i.id === id);
    const nomeItem = item ? item.nome : 'o equipamento';

    mostrarModal(
        "✨ Deseja mesmo remover?", 
        `O item "${nomeItem}" será permanentemente retirado da listagem do laboratório.`, 
        () => {
            inventario = inventario.filter(item => item.id !== id);
            registrarLog(`Removeu permanentemente do acervo: "${nomeItem}" 🗑️`);
            sincronizarStorage();
            renderApp();
        }
    );
}

// 🔍 Filtro em tempo real
searchInput.addEventListener('input', function(e) {
    renderApp(e.target.value.toLowerCase());
});

// 🔄 Renderizador da Tabela e Estatísticas
function renderApp(filtro = '') {
    const dadosFiltrados = inventario.filter(item => 
        item.nome.toLowerCase().includes(filtro) || 
        item.patrimonio.toLowerCase().includes(filtro)
    );

    listaTabela.innerHTML = '';

    if (dadosFiltrados.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        dadosFiltrados.forEach(item => {
            const tr = document.createElement('tr');
            let classeBadge = item.status === 'Ativo' ? 'badge-ativo' : (item.status === 'Em Manutenção' ? 'badge-manutencao' : 'badge-inativo');

            tr.innerHTML = `
                <td><code style="background:var(--border-color); padding:3px 6px; border-radius:6px; font-size:0.85rem;">${item.patrimonio}</code></td>
                <td><strong>${item.nome}</strong></td>
                <td>${item.categoria}</td>
                <td><span class="badge ${classeBadge}">${item.status}</span></td>
                <td>
                    <button class="btn-edit" title="Editar Item" onclick="prepararEdicao('${item.id}')">✏️</button>
                    <button class="btn-action-delete" title="Excluir Registro" onclick="deletarItem('${item.id}')">🗑️</button>
                </td>
            `;
            listaTabela.appendChild(tr);
        });
    }

    // Contadores
    totalItensEl.textContent = inventario.length;
    totalAtivosEl.textContent = inventario.filter(i => i.status === 'Ativo').length;
    totalManutencaoEl.textContent = inventario.filter(i => i.status === 'Em Manutenção').length;
    totalInativosEl.textContent = inventario.filter(i => i.status === 'Inativo').length;
}

// 📜 Gerenciamento de Histórico (Logs)
function registrarLog(texto) {
    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const novoLog = `[${horaFormatada}] ${texto}`;
    logs.unshift(novoLog); // Adiciona no início da lista

    if(logs.length > 20) logs.pop(); // Limita em 20 registros

    localStorage.setItem('tech_cute_logs', JSON.stringify(logs));
    renderLogs();
}

function renderLogs() {
    logList.innerHTML = '';
    if(logs.length === 0) {
        logList.innerHTML = `<li class="empty-log">Nenhuma atividade registrada ainda... ✨</li>`;
        return;
    }
    logs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'log-item';
        li.textContent = log;
        logList.appendChild(li);
    });
}

// 📥 Exportação de Dados para Excel/CSV Reais
document.getElementById('btn-export').addEventListener('click', () => {
    if(inventario.length === 0) {
        mostrarModal("🌸 Opa!", "Não existem dados disponíveis para exportação no momento.", null);
        return;
    }

    // Cabeçalho do arquivo CSV
    let csvContent = "\uFEFFPatrimonio;Nome;Categoria;Status\n";

    // Mapeia e insere as linhas
    inventario.forEach(item => {
        csvContent += `"${item.patrimonio}";"${item.nome}";"${item.categoria}";"${item.status}"\n`;
    });

    // Criação do link invisível para download do arquivo gerado
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_laboratorio_${Date.now()}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    registrarLog(`Exportou a lista de registros em arquivo .CSV 📥`);
});

// 💾 Sincronização Geral
function sincronizarStorage() {
    localStorage.setItem('tech_cute_inventory', JSON.stringify(inventario));
}


// 📦 Inicialização do Estado (Lê do localStorage ou começa vazio se não houver registros)
let inventario = JSON.parse(localStorage.getItem('tech_cute_inventory')) || [];

// 🎯 Elementos do DOM mapeados
const form = document.getElementById('form-inventario');
const listaTabela = document.getElementById('lista-tabela');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');

// Elementos dos Contadores/Cards
const totalItensEl = document.getElementById('total-itens');
const totalAtivosEl = document.getElementById('total-ativos');
const totalManutencaoEl = document.getElementById('total-manutencao');
const totalInativosEl = document.getElementById('total-inativos');

// 🚀 Evento Inicial: Renderizar a página carregando o que está salvo
document.addEventListener('DOMContentLoaded', renderApp);

// ✨ Ouvinte do Formulário (Ação de Criar)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const novoEquipamento = {
        id: 'EQ-' + Date.now().toString().slice(-6), // ID fofo simplificado baseado no timestamp
        nome: document.getElementById('nome').value.trim(),
        patrimonio: document.getElementById('patrimonio').value.trim(),
        categoria: document.getElementById('categoria').value,
        status: document.getElementById('status').value
    };

    // Adiciona ao array principal
    inventario.push(novoEquipamento);
    
    // Salva o novo array atualizado no navegador
    sincronizarStorage();
    
    // Atualiza a tela inteira
    renderApp();
    form.reset();
});

// 🔍 Mecanismo de Filtro/Busca em Tempo Real
searchInput.addEventListener('input', function(e) {
    const termoBusca = e.target.value.toLowerCase();
    renderApp(termoBusca);
});

// 🔄 Função Centralizadora da Interface
function renderApp(filtro = '') {
    // 1. Filtragem de dados caso haja busca ativa
    const dadosFiltrados = inventario.filter(item => 
        item.nome.toLowerCase().includes(filtro) || 
        item.patrimonio.toLowerCase().includes(filtro)
    );

    // 2. Limpar corpo atual da tabela antes do laço
    listaTabela.innerHTML = '';

    // 3. Controle de Estado Vazio
    if (dadosFiltrados.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        // 4. Inserção Dinâmica via laço forEach
        dadosFiltrados.forEach(item => {
            const tr = document.createElement('tr');
            
            // Tratamento visual para as Badges fofas de status
            let classeBadge = 'badge-ativo';
            if(item.status === 'Em Manutenção') classeBadge = 'badge-manutencao';
            if(item.status === 'Inativo') classeBadge = 'badge-inativo';

            tr.innerHTML = `
                <td><code style="background:#f0eae6; padding:3px 6px; border-radius:6px; font-size:0.85rem;">${item.patrimonio}</code></td>
                <td><strong>${item.nome}</strong></td>
                <td>${item.categoria}</td>
                <td><span class="badge ${classeBadge}">${item.status}</span></td>
                <td>
                    <button class="btn-action-delete" title="Excluir Registro" onclick="deletarItem('${item.id}')">🗑️</button>
                </td>
            `;
            listaTabela.appendChild(tr);
        });
    }

    // 5. Atualização de Dados nos Painéis Estatísticos (Uso Avançado do reduce e filter)
    atualizarPainelEstatisticas();
}

// 🧮 Processador de Indicadores (Estatísticas)
function atualizarPainelEstatisticas() {
    totalItensEl.textContent = inventario.length;
    totalAtivosEl.textContent = inventario.filter(i => i.status === 'Ativo').length;
    totalManutencaoEl.textContent = inventario.filter(i => i.status === 'Em Manutenção').length;
    totalInativosEl.textContent = inventario.filter(i => i.status === 'Inativo').length;
}

// 🗑️ Operação de Deleção
function deletarItem(id) {
    // Alerta fofo e contextualizado
    if (confirm("✨ Deseja mesmo remover este item do inventário do laboratório?")) {
        inventario = inventario.filter(item => item.id !== id);
        sincronizarStorage();
        renderApp();
    }
}

// 💾 Função Utilitária para Persistência no LocalStorage
function sincronizarStorage() {
    localStorage.setItem('tech_cute_inventory', JSON.stringify(inventario));
}

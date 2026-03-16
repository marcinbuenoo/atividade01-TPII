const leadList = document.getElementById("leadList");
const leadDetail = document.getElementById("leadDetail");
const leadCount = document.getElementById("leadCount");
const progressBar = document.getElementById("progressBar");
const apiStatus = document.getElementById("apiStatus");
const refreshButton = document.getElementById("refreshButton");
const form = document.getElementById("leadForm");
const formMessage = document.getElementById("formMessage");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const template = document.getElementById("leadCardTemplate");

let leads = [];
let selectedLead = null;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(data.error || "Erro desconhecido");
  }
  return response.json();
}

function renderLeads() {
  leadList.innerHTML = "";
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const filtered = leads.filter((lead) => {
    const matchesQuery =
      lead.name.toLowerCase().includes(query) ||
      lead.vehicle.toLowerCase().includes(query);
    const matchesStatus = status === "all" || lead.status === status;
    return matchesQuery && matchesStatus;
  });

  if (filtered.length === 0) {
    leadList.innerHTML =
      '<p class="muted">Nenhuma lead encontrada com os filtros atuais.</p>';
    return;
  }

  filtered.forEach((lead) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".lead-name").textContent = lead.name;
    card.querySelector(
      ".lead-meta"
    ).textContent = `${lead.vehicle} · ${lead.origin}`;
    card.querySelector(".tag.stage").textContent = lead.stage;
    card.querySelector(".tag.status").textContent = lead.status;
    card.querySelector("button").addEventListener("click", () => {
      selectedLead = lead;
      renderDetail();
    });
    leadList.appendChild(card);
  });
}

function renderDetail() {
  if (!selectedLead) {
    leadDetail.innerHTML = '<p class="muted">Selecione uma lead para visualizar.</p>';
    return;
  }

  leadDetail.innerHTML = `
    <div>
      <h4>${selectedLead.name}</h4>
      <p class="muted">${selectedLead.vehicle}</p>
    </div>
    <div class="detail-row"><span>Telefone</span><strong>${selectedLead.phone}</strong></div>
    <div class="detail-row"><span>Origem</span><strong>${selectedLead.origin}</strong></div>
    <div class="detail-row"><span>Estágio</span><strong>${selectedLead.stage}</strong></div>
    <div class="detail-row"><span>Status</span><strong>${selectedLead.status}</strong></div>
    <div class="actions">
      <button id="advanceButton">Avançar estágio</button>
      <button class="ghost" id="saleButton">Finalizar com venda</button>
      <button class="ghost" id="noSaleButton">Finalizar sem venda</button>
    </div>
  `;

  document.getElementById("advanceButton").addEventListener("click", handleAdvance);
  document.getElementById("saleButton").addEventListener("click", () =>
    handleFinalize("sale")
  );
  document.getElementById("noSaleButton").addEventListener("click", () =>
    handleFinalize("no_sale")
  );
}

function updateHeader() {
  leadCount.textContent = `${leads.length} leads`;
  const negotiating = leads.filter((lead) => lead.status === "Em negociacao").length;
  const percentage = leads.length ? Math.round((negotiating / leads.length) * 100) : 0;
  progressBar.style.width = `${Math.max(10, percentage)}%`;
}

async function loadLeads() {
  try {
    apiStatus.textContent = "Sincronizando...";
    leads = await api("/leads");
    renderLeads();
    renderDetail();
    updateHeader();
    apiStatus.textContent = "Online";
  } catch (error) {
    apiStatus.textContent = "Offline";
    leadList.innerHTML =
      '<p class="muted">Não foi possível carregar as leads.</p>';
  }
}

async function handleAdvance() {
  if (!selectedLead) return;
  try {
    const updated = await api(`/leads/${selectedLead.id}/advance`, {
      method: "PATCH",
    });
    syncLead(updated);
  } catch (error) {
    alert(error.message);
  }
}

async function handleFinalize(outcome) {
  if (!selectedLead) return;
  try {
    const updated = await api(`/leads/${selectedLead.id}/finalize`, {
      method: "PATCH",
      body: JSON.stringify({ outcome }),
    });
    syncLead(updated);
  } catch (error) {
    alert(error.message);
  }
}

function syncLead(updated) {
  leads = leads.map((lead) => (lead.id === updated.id ? updated : lead));
  selectedLead = updated;
  renderLeads();
  renderDetail();
  updateHeader();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const created = await api("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    leads = [created, ...leads];
    selectedLead = created;
    renderLeads();
    renderDetail();
    updateHeader();
    form.reset();
    formMessage.textContent = "Lead cadastrada com sucesso.";
    formMessage.classList.add("ok");
  } catch (error) {
    formMessage.textContent = error.message;
    formMessage.classList.add("error");
  }
});

searchInput.addEventListener("input", renderLeads);
statusFilter.addEventListener("change", renderLeads);
refreshButton.addEventListener("click", loadLeads);

loadLeads();


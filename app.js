const API_URL = "https://script.google.com/macros/s/AKfycbyEhEfPtpQOg9XDkr3MtzJNMH0Fd7Pk5rFH85oPgvkqtrDS1uoz_CPpKXcOMBvr3ucArA/exec";

let alunos = [];

const modalidadesPadrao = ["Dança", "Ginástica", "Futsal", "Jiu-Jitsu", "Judô"];

const turmas = [
  { modalidade: "Dança", nome: "Dança Matutino - Sexta 08:00 às 10:30 - Dança 2", vagas: 12 },
  { modalidade: "Dança", nome: "Dança Matutino - Ter/Qui 08:30 às 09:20 - Dança 1", vagas: 12 },
  { modalidade: "Dança", nome: "Dança Matutino - Ter/Qui 09:30 às 10:20 - Preparatório", vagas: 12 },
  { modalidade: "Dança", nome: "Dança Matutino - Ter/Qui 10:30 às 11:15 - Baby Class", vagas: 14 },
  { modalidade: "Dança", nome: "Dança Vespertino - Ter/Qui 14:00 às 14:50 - Preparatório", vagas: 12 },
  { modalidade: "Dança", nome: "Dança Vespertino - Ter/Qui 15:00 às 15:45 - Baby Class", vagas: 14 },
  { modalidade: "Dança", nome: "Dança Vespertino - Ter/Qui 16:00 às 16:50 - Dança 1", vagas: 12 },
  { modalidade: "Dança", nome: "Dança Vespertino - Ter/Qui/Sex 17:00 às 17:50 - Dança 2", vagas: 12 },

  { modalidade: "Ginástica", nome: "Ginástica Matutino - Ter/Qui 07:30 às 08:20", vagas: 30 },
  { modalidade: "Ginástica", nome: "Ginástica Noturno - Seg/Qua/Sex 18:00 às 18:50", vagas: 35 },
  { modalidade: "Ginástica", nome: "Ginástica Noturno - Seg/Qua/Sex 19:00 às 19:50", vagas: 35 },

  { modalidade: "Futsal", nome: "Futsal Matutino - Seg/Qua/Sex 07:30 às 08:20", vagas: 10 },
  { modalidade: "Futsal", nome: "Futsal Matutino - Seg/Qua/Sex 08:30 às 09:20", vagas: 10 },
  { modalidade: "Futsal", nome: "Futsal Matutino - Seg/Qua/Sex 09:30 às 10:20", vagas: 10 },
  { modalidade: "Futsal", nome: "Futsal Vespertino - Seg/Qua/Sex 16:00 às 17:00", vagas: 20 },
  { modalidade: "Futsal", nome: "Futsal Vespertino - Seg/Qua/Sex 17:00 às 18:00", vagas: 30 },

  { modalidade: "Jiu-Jitsu", nome: "Jiu-Jitsu Matutino - Qua/Qui 08:00 às 08:50", vagas: 16 },
  { modalidade: "Jiu-Jitsu", nome: "Jiu-Jitsu Vespertino - Qua/Qui 14:00 às 14:50", vagas: 16 },
  { modalidade: "Jiu-Jitsu", nome: "Jiu-Jitsu Noturno - Ter/Qua/Qui 18:00 às 18:50", vagas: 16 },
  { modalidade: "Jiu-Jitsu", nome: "Jiu-Jitsu Noturno - Ter/Qua/Qui 19:00 às 19:50", vagas: 17 },

  { modalidade: "Judô", nome: "Judô Matutino - Seg/Qua/Sex 08:00 às 09:50", vagas: 15 },
  { modalidade: "Judô", nome: "Judô Matutino - Seg/Qua/Sex 10:00 às 10:50", vagas: 15 },
  { modalidade: "Judô", nome: "Judô Vespertino - Seg/Qua/Sex 14:00 às 14:50", vagas: 15 },
  { modalidade: "Judô", nome: "Judô Vespertino - Seg/Qua/Sex 15:00 às 16:50", vagas: 15 }
];

function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getValue(obj, names) {
  const keys = Object.keys(obj);

  for (const name of names) {
    const foundKey = keys.find(k => normalizeText(k) === normalizeText(name));
    if (foundKey) return obj[foundKey];
  }

  return "";
}

function isListaEspera(valor) {
  const texto = normalizeText(valor);
  return (
    texto.includes("lista de espera") ||
    texto.includes("cadastro reserva") ||
    texto.includes("reserva")
  );
}

function isClassificado(valor) {
  return normalizeText(valor).includes("classificado");
}

async function loadData() {
  try {
    const response = await fetch(API_URL);
    alunos = await response.json();

    fillTurmaSelect();
    fillFilters();
    updateDashboard();
    renderTurmas();
  } catch (error) {
    alert("Erro ao carregar os dados. Verifique a URL do Apps Script.");
    console.error(error);
  }
}

function fillTurmaSelect() {
  const select = document.getElementById("turmaFinal");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione a turma</option>';

  turmas.forEach(turma => {
    select.innerHTML += `<option value="${turma.nome}">${turma.nome}</option>`;
  });
}

function fillFilters() {
  const modalidadeSelect = document.getElementById("filtroModalidade");
  const turmaSelect = document.getElementById("filtroTurma");
  const pesquisaModalidade = document.getElementById("filtroPesquisaModalidade");

  if (modalidadeSelect) {
    modalidadeSelect.innerHTML = '<option value="">Todas as modalidades</option>';
    modalidadesPadrao.forEach(m => {
      modalidadeSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });
  }

  if (pesquisaModalidade) {
    pesquisaModalidade.innerHTML = '<option value="">Todas as modalidades</option>';
    modalidadesPadrao.forEach(m => {
      pesquisaModalidade.innerHTML += `<option value="${m}">${m}</option>`;
    });
  }

  if (turmaSelect) {
    turmaSelect.innerHTML = '<option value="">Todas as turmas</option>';
    turmas.forEach(turma => {
      turmaSelect.innerHTML += `<option value="${turma.nome}">${turma.nome}</option>`;
    });
  }
}

function updateDashboard() {
  if (document.getElementById("totalAlunos")) {
    document.getElementById("totalAlunos").textContent = alunos.length;
  }

  const classificados = alunos.filter(a =>
    isClassificado(getValue(a, ["Validação Final", "Validacao Final", "Status"]))
  ).length;

  const efetivadas = alunos.filter(a =>
    normalizeText(getValue(a, ["Matrícula", "Matricula"])) === "efetivada"
  ).length;

  const pendentes = alunos.filter(a => {
    const matricula = normalizeText(getValue(a, ["Matrícula", "Matricula"]));
    const documentacao = normalizeText(getValue(a, ["Documentação", "Documentacao"]));

    return (
      matricula === "pendente" ||
      documentacao === "pendente" ||
      documentacao === "incompleta"
    );
  }).length;

  const espera = alunos.filter(a =>
    isListaEspera(getValue(a, ["Validação Final", "Validacao Final", "Status"]))
  ).length;

  const desistentes = alunos.filter(a =>
    normalizeText(getValue(a, ["Matrícula", "Matricula"])) === "desistente"
  ).length;

  if (document.getElementById("totalClassificados")) {
    document.getElementById("totalClassificados").textContent = classificados;
  }

  if (document.getElementById("totalEfetivadas")) {
    document.getElementById("totalEfetivadas").textContent = efetivadas;
  }

  if (document.getElementById("totalPendentes")) {
    document.getElementById("totalPendentes").textContent = pendentes;
  }

  if (document.getElementById("totalEspera")) {
    document.getElementById("totalEspera").textContent = espera;
  }

  if (document.getElementById("totalDesistentes")) {
    document.getElementById("totalDesistentes").textContent = desistentes;
  }
}

function renderTurmas() {
  const container = document.getElementById("turmasContainer");
  if (!container) return;

  const filtro = document.getElementById("filtroTurmaModalidade")?.value || "";
  container.innerHTML = "";

  const turmasFiltradas = filtro
    ? turmas.filter(t => t.modalidade === filtro)
    : turmas;

  let totalVagas = 0;
  let totalOcupadas = 0;

  turmasFiltradas.forEach(turma => {
    totalVagas += turma.vagas;

    const ocupadas = alunos.filter(a =>
      getValue(a, ["Turma Final"]) === turma.nome &&
      normalizeText(getValue(a, ["Matrícula", "Matricula"])) === "efetivada"
    ).length;

    totalOcupadas += ocupadas;

    const disponiveis = turma.vagas - ocupadas;

    const percentual = turma.vagas > 0
      ? Math.min((ocupadas / turma.vagas) * 100, 100)
      : 0;

    let status = "DISPONÍVEL";
    let classe = "status-disponivel";

    if (disponiveis <= 0) {
      status = "LOTADA";
      classe = "status-lotada";
    } else if (disponiveis <= 3) {
      status = "ATENÇÃO";
      classe = "status-atencao";
    }

    const nomeTurmaSeguro = turma.nome.replace(/'/g, "\\'");

    container.innerHTML += `
      <div class="turma-card turma-click" onclick="showStudentsByTurma('${nomeTurmaSeguro}')">
        <div class="turma-topo">
          <h3>${turma.nome}</h3>
          <span class="turma-modalidade">${turma.modalidade}</span>
        </div>

        <div class="turma-info">
          <div>
            <strong>${turma.vagas}</strong>
            <small>Vagas</small>
          </div>

          <div>
            <strong>${ocupadas}</strong>
            <small>Ocupadas</small>
          </div>

          <div>
            <strong>${disponiveis}</strong>
            <small>Livres</small>
          </div>
        </div>

        <div class="barra">
          <div class="progresso" style="width:${percentual}%"></div>
        </div>

        <span class="status-turma ${classe}">${status}</span>
      </div>
    `;
  });

  const totalDisponiveis = totalVagas - totalOcupadas;

  const percentualGeral = totalVagas > 0
    ? Math.round((totalOcupadas / totalVagas) * 100)
    : 0;

  if (document.getElementById("totalVagasProjeto")) {
    document.getElementById("totalVagasProjeto").textContent = totalVagas;
  }

  if (document.getElementById("totalOcupadasProjeto")) {
    document.getElementById("totalOcupadasProjeto").textContent = totalOcupadas;
  }

  if (document.getElementById("totalDisponiveisProjeto")) {
    document.getElementById("totalDisponiveisProjeto").textContent = totalDisponiveis;
  }

  if (document.getElementById("percentualOcupacaoProjeto")) {
    document.getElementById("percentualOcupacaoProjeto").textContent = percentualGeral + "%";
  }
}

function searchStudent() {
  const termo = normalizeText(document.getElementById("searchInput").value);
  const modalidadeFiltro = document.getElementById("filtroPesquisaModalidade")?.value || "";
  const resultsBox = document.getElementById("searchResults");

  if (resultsBox) resultsBox.innerHTML = "";

  if (!termo && !modalidadeFiltro) {
    alert("Digite o nome do aluno ou selecione uma modalidade.");
    return;
  }

  const resultados = alunos.filter(a => {
    const nome = normalizeText(getValue(a, [
      "Nome do candidato",
      "Nome do aluno",
      "Nome",
      "Aluno",
      "Candidato"
    ]));

    const modalidade = normalizeText(getValue(a, ["Modalidade"]));

    return nome.includes(termo) &&
      (!modalidadeFiltro || modalidade.includes(normalizeText(modalidadeFiltro)));
  });

  if (resultados.length === 0) {
    if (resultsBox) {
      resultsBox.innerHTML = "<p>Nenhum aluno encontrado.</p>";
    }
    return;
  }

  let html = `
    <h3>Resultado da busca: ${resultados.length} registro(s)</h3>
    <div class="search-list">
  `;

  resultados.forEach(a => {
    const linha = a.linha;

    html += `
      <div class="search-card">
        <strong>${getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])}</strong>
        <p><b>Modalidade:</b> ${getValue(a, ["Modalidade"])}</p>
        <p><b>Turma identificada:</b> ${getValue(a, ["Turma identificada", "Turma Identificada"])}</p>
        <p><b>Validação:</b> ${getValue(a, ["Validação Final", "Validacao Final", "Status"])}</p>
        <p><b>Matrícula:</b> ${getValue(a, ["Matrícula", "Matricula"])}</p>
        <p><b>Documentação:</b> ${getValue(a, ["Documentação", "Documentacao"])}</p>
        <p><b>Linha:</b> ${linha}</p>
        <button onclick="selectStudent(${linha})">Selecionar</button>
      </div>
    `;
  });

  html += "</div>";

  if (resultsBox) {
    resultsBox.innerHTML = html;
  }
}

function selectStudent(linha) {
  const aluno = alunos.find(a => Number(a.linha) === Number(linha));

  if (!aluno) {
    alert("Registro não encontrado.");
    return;
  }

  document.getElementById("formTitle").textContent = "Editar Aluno";
  document.getElementById("modoFormulario").value = "editar";
  document.getElementById("studentBox").classList.remove("hidden");

  document.getElementById("linha").value = aluno.linha;
  document.getElementById("nome").value = getValue(aluno, [
    "Nome do candidato",
    "Nome do aluno",
    "Nome",
    "Aluno",
    "Candidato"
  ]);

  document.getElementById("modalidade").value = getValue(aluno, ["Modalidade"]);
  document.getElementById("turmaIdentificada").value = getValue(aluno, [
    "Turma identificada",
    "Turma Identificada"
  ]);
  document.getElementById("validacaoFinal").value = getValue(aluno, [
    "Validação Final",
    "Validacao Final",
    "Status"
  ]);
  document.getElementById("matricula").value = getValue(aluno, [
    "Matrícula",
    "Matricula"
  ]);
  document.getElementById("documentacao").value = getValue(aluno, [
    "Documentação",
    "Documentacao"
  ]);
  document.getElementById("turmaFinal").value = getValue(aluno, ["Turma Final"]);
  document.getElementById("observacao").value = getValue(aluno, [
    "Observação",
    "Observacao"
  ]);
}

function newStudent() {
  document.getElementById("formTitle").textContent = "Adicionar Aluno Avulso";
  document.getElementById("modoFormulario").value = "adicionar";
  document.getElementById("studentBox").classList.remove("hidden");

  document.getElementById("linha").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("modalidade").value = "";
  document.getElementById("turmaIdentificada").value = "";
  document.getElementById("validacaoFinal").value = "Classificado";
  document.getElementById("matricula").value = "";
  document.getElementById("documentacao").value = "";
  document.getElementById("turmaFinal").value = "";
  document.getElementById("observacao").value = "";
}

async function saveStudent() {
  const modo = document.getElementById("modoFormulario").value;
  const linha = document.getElementById("linha").value;

  if (modo === "editar" && !linha) {
    alert("Pesquise e selecione um aluno antes de salvar.");
    return;
  }

  const payload = {
    acao: modo,
    linha: linha,
    "Nome do candidato": document.getElementById("nome").value,
    "Modalidade": document.getElementById("modalidade").value,
    "Turma identificada": document.getElementById("turmaIdentificada").value,
    "Validação Final": document.getElementById("validacaoFinal").value,
    "Matrícula": document.getElementById("matricula").value,
    "Documentação": document.getElementById("documentacao").value,
    "Turma Final": document.getElementById("turmaFinal").value,
    "Observação": document.getElementById("observacao").value,
    "Data Matrícula": new Date().toLocaleDateString("pt-BR")
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    alert(
      modo === "adicionar"
        ? "Aluno avulso enviado para cadastro."
        : "Alteração enviada com sucesso."
    );

    setTimeout(async () => {
      await loadData();
      clearSearch();
    }, 1500);

  } catch (error) {
    alert("Erro ao salvar. Verifique o Apps Script.");
    console.error(error);
  }
}

function clearSearch() {
  if (document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = "";
  }

  if (document.getElementById("filtroPesquisaModalidade")) {
    document.getElementById("filtroPesquisaModalidade").value = "";
  }

  if (document.getElementById("searchResults")) {
    document.getElementById("searchResults").innerHTML = "";
  }

  if (document.getElementById("studentBox")) {
    document.getElementById("studentBox").classList.add("hidden");
  }
}

function clearFilters() {
  if (document.getElementById("filtroModalidade")) {
    document.getElementById("filtroModalidade").value = "";
  }

  if (document.getElementById("filtroTurma")) {
    document.getElementById("filtroTurma").value = "";
  }

  if (document.getElementById("filtroSituacao")) {
    document.getElementById("filtroSituacao").value = "";
  }

  if (document.getElementById("reportResult")) {
    document.getElementById("reportResult").innerHTML = "";
  }
}

function getFilteredReport() {
  const modalidade = document.getElementById("filtroModalidade")?.value || "";
  const turma = document.getElementById("filtroTurma")?.value || "";
  const situacao = document.getElementById("filtroSituacao")?.value || "";

  return alunos.filter(a => {
    const mod = normalizeText(getValue(a, ["Modalidade"]));
    const turmaFinal = getValue(a, ["Turma Final"]);
    const matricula = normalizeText(getValue(a, ["Matrícula", "Matricula"]));
    const validacao = getValue(a, [
      "Validação Final",
      "Status",
      "Validacao Final"
    ]);
    const situacaoNormalizada = normalizeText(situacao);

    return (
      (!modalidade || mod.includes(normalizeText(modalidade))) &&
      (!turma || turmaFinal === turma) &&
      (
        !situacao ||
        matricula === situacaoNormalizada ||
        normalizeText(validacao) === situacaoNormalizada ||
        (situacaoNormalizada === "lista de espera" && isListaEspera(validacao)) ||
        (situacaoNormalizada === "cadastro reserva" && isListaEspera(validacao))
      )
    );
  });
}

function showReport() {
  const dados = getFilteredReport();
  const resultBox = document.getElementById("reportResult");

  if (dados.length === 0) {
    resultBox.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  let html = `
    <h3>Resultado: ${dados.length} aluno(s)</h3>
    <div style="overflow-x:auto;">
      <table class="report-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Modalidade</th>
            <th>Turma Final</th>
            <th>Matrícula</th>
            <th>Documentação</th>
            <th>Validação</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
  `;

  dados.forEach(a => {
    html += `
      <tr>
        <td>${getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])}</td>
        <td>${getValue(a, ["Modalidade"])}</td>
        <td>${getValue(a, ["Turma Final"])}</td>
        <td>${getValue(a, ["Matrícula", "Matricula"])}</td>
        <td>${getValue(a, ["Documentação", "Documentacao"])}</td>
        <td>${getValue(a, ["Validação Final", "Status", "Validacao Final"])}</td>
        <td>${getValue(a, ["Observação", "Observacao"])}</td>
      </tr>
    `;
  });

  html += "</tbody></table></div>";
  resultBox.innerHTML = html;
}

function downloadExcel() {
  const dados = getFilteredReport();

  if (dados.length === 0) {
    alert("Nenhum dado para exportar.");
    return;
  }

  const planilha = dados.map(a => ({
    Classificacao: getValue(a, ["Classificação", "Classificacao"]),
    Nome: getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]),
    Modalidade: getValue(a, ["Modalidade"]),
    Turma_Identificada: getValue(a, ["Turma identificada", "Turma Identificada"]),
    Turma_Final: getValue(a, ["Turma Final"]),
    Matricula: getValue(a, ["Matrícula", "Matricula"]),
    Documentacao: getValue(a, ["Documentação", "Documentacao"]),
    Validacao_Final: getValue(a, ["Validação Final", "Status", "Validacao Final"]),
    Observacao: getValue(a, ["Observação", "Observacao"])
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(planilha);

  XLSX.utils.book_append_sheet(wb, ws, "Relatório Matrículas");
  XLSX.writeFile(wb, "relatorio_matriculas_imp.xlsx");
}

function downloadPDF() {
  const dados = getFilteredReport();

  if (dados.length === 0) {
    alert("Nenhum dado para exportar.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape");

  doc.setFontSize(16);
  doc.text("Relatório de Matrículas - IMP 2026", 14, 15);

  doc.setFontSize(10);
  doc.text(`Total de registros: ${dados.length}`, 14, 23);

  const linhas = dados.map(a => [
    getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]),
    getValue(a, ["Modalidade"]),
    getValue(a, ["Turma Final"]),
    getValue(a, ["Matrícula", "Matricula"]),
    getValue(a, ["Documentação", "Documentacao"]),
    getValue(a, ["Validação Final", "Status", "Validacao Final"])
  ]);

  doc.autoTable({
    head: [["Nome", "Modalidade", "Turma Final", "Matrícula", "Documentação", "Validação"]],
    body: linhas,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [168, 0, 0] }
  });

  doc.save("relatorio_matriculas_imp.pdf");
}
function showStudentsByTurma(nomeTurma) {
  const alunosTurma = alunos.filter(a =>
    getValue(a, ["Turma Final"]) === nomeTurma &&
    normalizeText(getValue(a, ["Matrícula", "Matricula"])) === "efetivada"
  );

  let html = `
    <h3>Alunos da turma: ${nomeTurma}</h3>
    <p>Total: ${alunosTurma.length}</p>
    <div style="overflow-x:auto;">
      <table class="report-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Modalidade</th>
            <th>Matrícula</th>
            <th>Documentação</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
  `;

  alunosTurma.forEach(a => {
    html += `
      <tr>
        <td>${getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])}</td>
        <td>${getValue(a, ["Modalidade"])}</td>
        <td>${getValue(a, ["Matrícula", "Matricula"])}</td>
        <td>${getValue(a, ["Documentação", "Documentacao"])}</td>
        <td>${getValue(a, ["Observação", "Observacao"])}</td>
      </tr>
    `;
  });

  html += "</tbody></table></div>";

  const box = document.getElementById("reportResult");
  if (box) {
    box.innerHTML = html;
    box.scrollIntoView({ behavior: "smooth" });
  }
}

let turmaAtualModal = "";
let alunosTurmaAtual = [];

function showStudentsByTurma(nomeTurma) {
  turmaAtualModal = nomeTurma;

  alunosTurmaAtual = alunos.filter(a =>
    getValue(a, ["Turma Final"]) === nomeTurma &&
    normalizeText(getValue(a, ["Matrícula", "Matricula"])) === "efetivada"
  );

  const turmaInfo = turmas.find(t => t.nome === nomeTurma);
  const vagas = turmaInfo ? turmaInfo.vagas : 0;
  const ocupadas = alunosTurmaAtual.length;
  const livres = vagas - ocupadas;

  document.getElementById("modalTurmaTitulo").textContent = nomeTurma;
  document.getElementById("modalTurmaResumo").textContent =
    `${vagas} vagas | ${ocupadas} alunos matriculados | ${livres} vagas livres`;

  let html = "";

  if (alunosTurmaAtual.length === 0) {
    html = "<p>Nenhum aluno efetivado nesta turma.</p>";
  } else {
    html = `
      <div style="overflow-x:auto;">
        <table class="report-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nome</th>
              <th>Modalidade</th>
              <th>Matrícula</th>
              <th>Documentação</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
    `;

    alunosTurmaAtual.forEach((a, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])}</td>
          <td>${getValue(a, ["Modalidade"])}</td>
          <td>${getValue(a, ["Matrícula", "Matricula"])}</td>
          <td>${getValue(a, ["Documentação", "Documentacao"])}</td>
          <td>${getValue(a, ["Observação", "Observacao"])}</td>
        </tr>
      `;
    });

    html += "</tbody></table></div>";
  }

  document.getElementById("modalTurmaLista").innerHTML = html;
  document.getElementById("turmaModal").classList.remove("hidden");
}

function closeTurmaModal() {
  document.getElementById("turmaModal").classList.add("hidden");
}

function downloadTurmaExcel() {
  if (!alunosTurmaAtual.length) {
    alert("Nenhum aluno para exportar.");
    return;
  }

  const planilha = alunosTurmaAtual.map((a, index) => ({
    Nº: index + 1,
    Nome: getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]),
    Modalidade: getValue(a, ["Modalidade"]),
    Turma_Final: getValue(a, ["Turma Final"]),
    Matricula: getValue(a, ["Matrícula", "Matricula"]),
    Documentacao: getValue(a, ["Documentação", "Documentacao"]),
    Observacao: getValue(a, ["Observação", "Observacao"])
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(planilha);

  XLSX.utils.book_append_sheet(wb, ws, "Alunos da Turma");
  XLSX.writeFile(wb, `alunos_turma_${turmaAtualModal}.xlsx`);
}

function printTurmaList() {
  window.print();
}
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        searchStudent();
      }
    });
  }

  loadData();
});

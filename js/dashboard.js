function fillTurmaSelect() {
  const select = document.getElementById("turmaFinal");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione a turma</option>';

  turmas.forEach((turma) => {
    select.innerHTML += `<option value="${turma.nome}">${turma.nome}</option>`;
  });
}

function fillFilters() {
  const modalidadeSelect = document.getElementById("filtroModalidade");
  const turmaSelect = document.getElementById("filtroTurma");
  const pesquisaModalidade = document.getElementById("filtroPesquisaModalidade");

  if (modalidadeSelect) {
    modalidadeSelect.innerHTML = '<option value="">Todas as modalidades</option>';
    modalidadesPadrao.forEach((modalidade) => {
      modalidadeSelect.innerHTML += `<option value="${modalidade}">${modalidade}</option>`;
    });
  }

  if (pesquisaModalidade) {
    pesquisaModalidade.innerHTML = '<option value="">Todas as modalidades</option>';
    modalidadesPadrao.forEach((modalidade) => {
      pesquisaModalidade.innerHTML += `<option value="${modalidade}">${modalidade}</option>`;
    });
  }

  if (turmaSelect) {
    turmaSelect.innerHTML = '<option value="">Todas as turmas</option>';
    turmas.forEach((turma) => {
      turmaSelect.innerHTML += `<option value="${turma.nome}">${turma.nome}</option>`;
    });
  }
}

function updateDashboard() {
  if (document.getElementById("totalAlunos")) {
    document.getElementById("totalAlunos").textContent = alunos.length;
  }

  const classificados = alunos.filter((aluno) =>
    isClassificado(getValue(aluno, ["Validação Final", "Validacao Final", "Status"]))
  ).length;

  const efetivadas = alunos.filter((aluno) =>
    normalizeText(getValue(aluno, ["Matrícula", "Matricula"])) === "efetivada"
  ).length;

  const pendentes = alunos.filter((aluno) => {
    const matricula = normalizeText(getValue(aluno, ["Matrícula", "Matricula"]));
    const documentacao = normalizeText(getValue(aluno, ["Documentação", "Documentacao"]));

    return (
      matricula === "pendente" ||
      documentacao === "pendente" ||
      documentacao === "incompleta"
    );
  }).length;

  const espera = alunos.filter((aluno) =>
    isListaEspera(getValue(aluno, ["Validação Final", "Validacao Final", "Status"]))
  ).length;

  const desistentes = alunos.filter((aluno) =>
    normalizeText(getValue(aluno, ["Matrícula", "Matricula"])) === "desistente"
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

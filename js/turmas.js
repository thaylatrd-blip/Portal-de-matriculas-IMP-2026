let turmaAtualModal = "";
let alunosTurmaAtual = [];

function renderTurmas() {
  const container = document.getElementById("turmasContainer");
  if (!container) return;

  const filtro = document.getElementById("filtroTurmaModalidade")?.value || "";
  container.innerHTML = "";

  const turmasFiltradas = filtro
    ? turmas.filter((turma) => turma.modalidade === filtro)
    : turmas;

  let totalVagas = 0;
  let totalOcupadas = 0;

  turmasFiltradas.forEach((turma) => {
    totalVagas += turma.vagas;

    const ocupadas = alunos.filter((aluno) =>
      getValue(aluno, ["Turma Final"]) === turma.nome &&
      normalizeText(getValue(aluno, ["Matrícula", "Matricula"])) === "efetivada"
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

function showStudentsByTurma(nomeTurma) {
  turmaAtualModal = nomeTurma;

  alunosTurmaAtual = alunos
    .filter((aluno) =>
      getValue(aluno, ["Turma Final"]) === nomeTurma &&
      normalizeText(getValue(aluno, ["Matrícula", "Matricula"])) === "efetivada"
    )
    .sort((a, b) => {
      const nomeA = formatTextUpper(getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]));
      const nomeB = formatTextUpper(getValue(b, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]));
      return nomeA.localeCompare(nomeB, "pt-BR");
    });

  const turmaInfo = turmas.find((turma) => turma.nome === nomeTurma);
  const vagas = turmaInfo ? turmaInfo.vagas : 0;
  const ocupadas = alunosTurmaAtual.length;
  const livres = vagas - ocupadas;

  document.getElementById("modalTurmaTitulo").textContent = formatTextUpper(nomeTurma);
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
              <th>Idade</th>
              <th>Modalidade</th>
              <th>Matrícula</th>
              <th>Documentação</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
    `;

    alunosTurmaAtual.forEach((aluno, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${formatTextUpper(getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]))}</td>
          <td>${getIdadeAluno(aluno)}</td>
          <td>${formatTextUpper(getValue(aluno, ["Modalidade"]))}</td>
          <td>${formatTextUpper(getValue(aluno, ["Matrícula", "Matricula"]))}</td>
          <td>${formatTextUpper(getValue(aluno, ["Documentação", "Documentacao"]))}</td>
          <td>${formatTextUpper(getValue(aluno, ["Observação", "Observacao"]))}</td>
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

  const planilha = alunosTurmaAtual.map((aluno, index) => ({
    Nº: index + 1,
    Nome: formatTextUpper(getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])),
    Idade: getIdadeAluno(aluno),
    Modalidade: formatTextUpper(getValue(aluno, ["Modalidade"])),
    Turma_Final: formatTextUpper(getValue(aluno, ["Turma Final"])),
    Matricula: formatTextUpper(getValue(aluno, ["Matrícula", "Matricula"])),
    Documentacao: formatTextUpper(getValue(aluno, ["Documentação", "Documentacao"])),
    Observacao: formatTextUpper(getValue(aluno, ["Observação", "Observacao"]))
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(planilha);

  XLSX.utils.book_append_sheet(wb, ws, "Alunos da Turma");
  XLSX.writeFile(wb, `alunos_turma_${turmaAtualModal}.xlsx`);
}

function printTurmaList() {
  window.print();
}

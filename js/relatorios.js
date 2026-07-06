function getFilteredReport() {
  const modalidade = document.getElementById("filtroModalidade")?.value || "";
  const turma = document.getElementById("filtroTurma")?.value || "";
  const situacao = document.getElementById("filtroSituacao")?.value || "";
  const documentacao = document.getElementById("filtroDocumentacao")?.value || "";

  return alunos
    .filter((aluno) => {
      const mod = normalizeText(getValue(aluno, ["Modalidade"]));
      const turmaFinal = getValue(aluno, ["Turma Final"]);
      const matricula = normalizeText(getValue(aluno, ["Matrícula", "Matricula"]));
      const validacao = getValue(aluno, ["Validação Final", "Status", "Validacao Final"]);
      const documentacaoAluno = normalizeText(getValue(aluno, ["Documentação", "Documentacao"]));
      const situacaoNormalizada = normalizeText(situacao);
      const documentacaoNormalizada = normalizeText(documentacao);

      return (
        (!modalidade || mod.includes(normalizeText(modalidade))) &&
        (!turma || turmaFinal === turma) &&
        (!documentacao || documentacaoAluno === documentacaoNormalizada) &&
        (
          !situacao ||
          matricula === situacaoNormalizada ||
          normalizeText(validacao) === situacaoNormalizada ||
          (situacaoNormalizada === "lista de espera" && isListaEspera(validacao)) ||
          (situacaoNormalizada === "cadastro reserva" && isListaEspera(validacao))
        )
      );
    })
    .sort((a, b) => {
      const nomeA = formatTextUpper(getValue(a, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]));
      const nomeB = formatTextUpper(getValue(b, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]));
      return nomeA.localeCompare(nomeB, "pt-BR");
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
            <th>Idade</th>
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

  dados.forEach((aluno) => {
    html += `
      <tr>
        <td>${formatTextUpper(getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"]))}</td>
        <td>${getIdadeAluno(aluno)}</td>
        <td>${formatTextUpper(getValue(aluno, ["Modalidade"]))}</td>
        <td>${formatTextUpper(getValue(aluno, ["Turma Final"]))}</td>
        <td>${formatTextUpper(getValue(aluno, ["Matrícula", "Matricula"]))}</td>
        <td>${formatTextUpper(getValue(aluno, ["Documentação", "Documentacao"]))}</td>
        <td>${formatTextUpper(getValue(aluno, ["Validação Final", "Status", "Validacao Final"]))}</td>
        <td>${formatTextUpper(getValue(aluno, ["Observação", "Observacao"]))}</td>
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

  const planilha = dados.map((aluno) => ({
    Classificacao: formatTextUpper(getValue(aluno, ["Classificação", "Classificacao"])),
    Nome: formatTextUpper(getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])),
    Idade: getIdadeAluno(aluno),
    Modalidade: formatTextUpper(getValue(aluno, ["Modalidade"])),
    Turma_Identificada: formatTextUpper(getValue(aluno, ["Turma identificada", "Turma Identificada"])),
    Turma_Final: formatTextUpper(getValue(aluno, ["Turma Final"])),
    Matricula: formatTextUpper(getValue(aluno, ["Matrícula", "Matricula"])),
    Documentacao: formatTextUpper(getValue(aluno, ["Documentação", "Documentacao"])),
    Validacao_Final: formatTextUpper(getValue(aluno, ["Validação Final", "Status", "Validacao Final"])),
    Observacao: formatTextUpper(getValue(aluno, ["Observação", "Observacao"]))
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

  const linhas = dados.map((aluno) => [
    formatTextUpper(getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])),
    getIdadeAluno(aluno),
    formatTextUpper(getValue(aluno, ["Modalidade"])),
    formatTextUpper(getValue(aluno, ["Turma Final"])),
    formatTextUpper(getValue(aluno, ["Matrícula", "Matricula"])),
    formatTextUpper(getValue(aluno, ["Documentação", "Documentacao"])),
    formatTextUpper(getValue(aluno, ["Validação Final", "Status", "Validacao Final"]))
  ]);

  doc.autoTable({
    head: [["Nome", "Idade", "Modalidade", "Turma Final", "Matrícula", "Documentação", "Validação"]],
    body: linhas,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [168, 0, 0] }
  });

  doc.save("relatorio_matriculas_imp.pdf");
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

  if (document.getElementById("filtroDocumentacao")) {
    document.getElementById("filtroDocumentacao").value = "";
  }

  if (document.getElementById("reportResult")) {
    document.getElementById("reportResult").innerHTML = "";
  }
}

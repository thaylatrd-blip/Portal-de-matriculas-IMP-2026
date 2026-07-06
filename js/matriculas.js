function searchStudent() {
  const termo = normalizeText(document.getElementById("searchInput").value);
  const modalidadeFiltro = document.getElementById("filtroPesquisaModalidade")?.value || "";
  const resultsBox = document.getElementById("searchResults");

  if (resultsBox) resultsBox.innerHTML = "";

  if (!termo && !modalidadeFiltro) {
    alert("Digite o nome do aluno ou selecione uma modalidade.");
    return;
  }

  const resultados = alunos.filter((aluno) => {
    const nome = normalizeText(getValue(aluno, [
      "Nome do candidato",
      "Nome do aluno",
      "Nome",
      "Aluno",
      "Candidato"
    ]));

    const modalidade = normalizeText(getValue(aluno, ["Modalidade"]));

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

  resultados.forEach((aluno) => {
    const linha = aluno.linha;

    html += `
      <div class="search-card">
        <strong>${getValue(aluno, ["Nome do candidato", "Nome do aluno", "Nome", "Aluno", "Candidato"])}</strong>
        <p><b>Modalidade:</b> ${getValue(aluno, ["Modalidade"])}</p>
        <p><b>Turma identificada:</b> ${getValue(aluno, ["Turma identificada", "Turma Identificada"])}</p>
        <p><b>Validação:</b> ${getValue(aluno, ["Validação Final", "Validacao Final", "Status"])}</p>
        <p><b>Matrícula:</b> ${getValue(aluno, ["Matrícula", "Matricula"])}</p>
        <p><b>Documentação:</b> ${getValue(aluno, ["Documentação", "Documentacao"])}</p>
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
  const aluno = alunos.find((item) => Number(item.linha) === Number(linha));

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

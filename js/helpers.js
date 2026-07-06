function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatTextUpper(valor) {
  const texto = String(valor ?? "").trim();
  return texto ? texto.toUpperCase() : "";
}

function getValue(obj, names) {
  const keys = Object.keys(obj || {});

  for (const name of names) {
    const foundKey = keys.find((key) => normalizeText(key) === normalizeText(name));
    if (foundKey) return obj[foundKey];
  }

  return "";
}

function getIdadeAluno(aluno) {
  const keys = Object.keys(aluno || {});

  const idadeKey = keys.find((key) => normalizeText(key) === normalizeText("Idade"));
  if (idadeKey && aluno[idadeKey] !== "" && aluno[idadeKey] !== null && aluno[idadeKey] !== undefined) {
    return String(aluno[idadeKey]).trim();
  }

  const nascimentoKey = keys.find((key) =>
    ["Data de nascimento", "Data Nascimento", "Nascimento"].some((nome) => normalizeText(key) === normalizeText(nome))
  );

  const nascimento = nascimentoKey ? aluno[nascimentoKey] : "";
  if (!nascimento) return "";

  const dataNascimento = new Date(nascimento);
  if (Number.isNaN(dataNascimento.getTime())) {
    const partes = String(nascimento).match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (!partes) return "";

    const [, dia, mes, ano] = partes;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (Number.isNaN(data.getTime())) return "";
    return String(new Date().getFullYear() - data.getFullYear());
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade -= 1;
  }

  return String(idade);
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

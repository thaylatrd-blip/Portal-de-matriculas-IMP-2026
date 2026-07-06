const API_URL = "https://script.google.com/macros/s/AKfycbyEhEfPtpQOg9XDkr3MtzJNMH0Fd7Pk5rFH85oPgvkqtrDS1uoz_CPpKXcOMBvr3ucArA/exec";

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

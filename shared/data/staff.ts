export const staff = [
  {
    id: "staff-1",
    name: "Lic. María René Vargas",
    role: "Directora General & Musicoterapeuta",
    bio: "Especialista en neurorehabilitación con más de 15 años de experiencia en el uso clínico de la música.",
    img: "/personal/josue.jpeg",
  },
  {
    id: "staff-2",
    name: "Dr. Roberto Méndez",
    role: "Coordinador Académico",
    bio: "Investigador en psicología de la música y su impacto en el desarrollo infantil temprano.",
    img: "/personal/erik.jpg",
  },
  {
    id: "staff-3",
    name: "Lic. Claudia Soliz",
    role: "Administración & Atención al Paciente",
    bio: "Encargada de la gestión humana y coordinación de agendas terapéuticas.",
    img: "/galeria/imagen1.jpg",
  },
  {
    id: "staff-4",
    name: "Lic. Javier Rocha",
    role: "Musicoterapeuta Clínico",
    bio: "Especialista en terapias grupales para adultos mayores y prevención del Alzheimer.",
    img: "/galeria/imagen2.jpg",
  },
];

export const therapists = staff.map((s) => s.name);

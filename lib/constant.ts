export const passwordComplexity =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const StudentIDRegex = /^\d{10}$/;
export const StaffIDRegex = /^\d{8}$/;

export const StudentEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.uitm\.edu\.my$/;
export const StaffEmailRegex = /^[a-zA-Z0-9._%+-]+@staff\.uitm\.edu\.my$/;

export const phoneRegex = /^\+?[0-9]{7,15}$/;

export const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Penang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Labuan",
  "Putrajaya",
] as const;

export const UITM_CAMPUS = [
  {
    name: "SELANGOR",
    campuses: [
      "Shah Alam",
      "Puncak Alam",
      "Puncak Perdana",
      "Hospital Sg Buloh",
      "Dengkil",
      "affiliated Colleges"
    ],
  },
  {
    name: "PERLIS",
    campuses: ["Arau"],
  },
  {
    name: "KEDAH",
    campuses: ["Sungai Petani"],
  },
  {
    name: "PENANG",
    campuses: ["Permatang Pauh"],
  },
  {
    name: "PERAK",
    campuses: ["Tapah", "Seri Iskandar"],
  },
  {
    name: "MELAKA",
    campuses: ["Alor Gajah", "Bandaraya Melaka", "Jasin"],
  },
  {
    name: "NEGERI SEMBILAN",
    campuses: ["Seremban 3", "Rembau", "Kuala Pilah Beting"],
  },
  {
    name: "JOHOR",
    campuses: ["Pasir Gudang", "Segamat"],
  },
  {
    name: "PAHANG",
    campuses: ["Raub", "Jenga"],
  },
  {
    name: "TERENGGANU",
    campuses: ["Dungun", "Kuala Terengganu Cendering", "Bukit Besi"],
  },
  {
    name: "KELANTAN",
    campuses: ["Machang", "Kota Bharu"],
  },
  {
    name: "SABAH",
    campuses: ["Kota Kinabalu", "Tawau"],
  },
  {
    name: "SARAWAK",
    campuses: ["Samarahan", "Samarahan 2", "Mukah"],
  }
]

export const UITM_PROGRAMS = [
  "Bachelor of Computer Science (Hons) Software Engineering",
  "Bachelor of Information Technology (Hons) Network Computing",
  "Bachelor of Information Systems (Hons)",
  "Bachelor of Computer Science (Hons) Data Science",
  "Bachelor of Computer Science (Hons) Cyber Security",
  
]

export type MalaysianState = typeof MALAYSIAN_STATES[number];


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
    ]
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


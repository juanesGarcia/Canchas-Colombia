import { Field, Service, navigateElement } from "../types";

export const FIELDS: Field[] = [
  {
    id: "field-1",
    name: "Cancha Principal",
    type: "football",
    price: 50000,
    capacity: 22,
    isPublic: false,
    available: true,
    image:
      "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Cancha de fútbol profesional con césped sintético de última generación",
    features: [
      "Césped sintético",
      "Iluminación LED",
      "Vestuarios",
      "Graderías",
      "Sonido",
    ],
    location: {
      city: "Bogotá",
      country: "Colombia",
      address: "Carrera 15 #85-32,",
      latitude: 12312,
      longitude: 123123,
    },
  },
  {
    id: "field-2",
    name: "Cancha Lateral A",
    type: "football",
    price: 35000,
    isPublic: false,
    capacity: 14,
    available: true,
    image:
      "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Cancha de fútbol 7 ideal para partidos recreativos",
    features: ["Césped sintético", "Iluminación", "Vestuarios"],
    location: {
      city: "Bogotá",
      country: "Colombia",
      address: "Carrera 15 #85-32,",
      latitude: 12312,
      longitude: 123123,
    },
  },
  {
    id: "field-3",
    name: "Cancha Lateral B",
    type: "football",
    price: 35000,
    isPublic: false,
    capacity: 14,
    available: false,
    image:
      "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Cancha de fútbol 7 con excelente ubicación",
    features: ["Césped sintético", "Iluminación", "Vestuarios"],
    location: {
      city: "Bogotá",
      country: "Colombia",
      address: "Carrera 15 #85-32,",
      latitude: 12312,
      longitude: 123123,
    },
  },
  {
    id: "field-4",
    name: "Cancha Múltiple",
    type: "basketball",
    price: 25000,
    isPublic: false,
    capacity: 10,
    available: true,
    image:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Cancha múltiple para básquet y otros deportes",
    features: ["Piso sintético", "Iluminación", "Marcadores"],
    location: {
      city: "Bogotá",
      country: "Colombia",
      address: "Carrera 15 #85-32,",
      latitude: 12312,
      longitude: 123123,
    },
  },
];

export const SERVICES: Service[] = [
  {
    id: "service-1",
    name: "Alquiler de Implementos",
    description: "Balones, conos, petos y todo lo necesario para tu partido",
    price: 5000,
    duration: 60,
    icon: "Zap",
    image:
      "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Balones profesionales",
      "Conos de entrenamiento",
      "Petos",
      "Botiquín básico",
    ],
  },
  {
    id: "service-2",
    name: "Arbitraje Profesional",
    description: "Árbitros certificados para tus partidos importantes",
    price: 80000,
    duration: 90,
    icon: "Users",
    image:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Árbitro certificado",
      "Cronómetro oficial",
      "Tarjetas",
      "Silbato profesional",
    ],
  },
  {
    id: "service-3",
    name: "Transmisión en Vivo",
    description: "Graba y transmite tu partido en vivo",
    price: 120000,
    duration: 120,
    icon: "Video",
    image:
      "https://images.pexels.com/photos/257970/pexels-photo-257970.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Cámara 4K",
      "Transmisión en vivo",
      "Grabación",
      "Edición básica",
    ],
  },
  {
    id: "service-4",
    name: "Catering Deportivo",
    description: "Hidratación y snacks para tu equipo",
    price: 15000,
    duration: 60,
    icon: "Coffee",
    image:
      "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Bebidas hidratantes",
      "Frutas",
      "Snacks energéticos",
      "Agua ilimitada",
    ],
  },
];

export const COMPANY_INFO = {
  name: "CANCHAS COLOMBIA S.A.S.",
  description: "Tu espacio deportivo ideal",
  phone: "+57 (1) 234-5678",
  email: "info@sportspace.com",
  address: "Carrera 15 #85-32, Bogotá, Colombia",
  ogImage: "",
  social: {
    facebook: " ",
    instagram: "",
    twitter: "",
  },
};

export const LEGAL_PAGES: navigateElement[] = [
  { name: "Términos y Condiciones", path: "/terms" },
  { name: "Política de Privacidad", path: "/privacy" },
  { name: "Política de Cancelación", path: "/cancellation" },
  { name: "Preguntas Frecuentes", path: "/faq" },
];

export const NAVIGATION_ITEMS: navigateElement[] = [
  { name: "Inicio", path: "/", public: true },
  { name: "Canchas", path: "/fields", public: true },
  { name: "Servicios", path: "/services", public: true },
  { name: "Contacto", path: "/contact", public: true },
];

export const PRIVATE_NAVIGATION_ITEMS: navigateElement[] = [
  { name: "Dashboard", path: "/dashboard", public: false },
  { name: "Mis Reservas", path: "/bookings", public: false },
  { name: "Perfil", path: "/UserUpdate", public: false },
  { name: "Canchas", path: "/FieldForm", public: false },
  { name: "Registro", path: "/register", public: false },
  { name: "Imagenes", path: "/ImageSelector", public: false },
   { name: "RegistroServicios", path: "/RegisterService", public: false }
];

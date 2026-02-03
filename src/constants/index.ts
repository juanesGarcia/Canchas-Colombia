import { navigateElement } from "../types";

export const COMPANY_INFO = {
  name: "CANCHAS COLOMBIA S.A.S.",
  description: "Tu espacio deportivo ideal",
  phone: "+573186699925",
  email: "juanesgym2018@gmail.com",
  address: "Calle 48 csur #25-94, Bogota, Colombia",
  ogImage: "",
  social: {
    facebook: "https://www.facebook.com/juanesteban.cubillosgarcia.7/?locale=es_LA",
    instagram: "https://www.instagram.com/juanestebancubillos/",
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
  { name: "Promociones", path: "/Promotions", public: true },
    { name: "Contacto", path: "/contact", public: true }
];

export const PRIVATE_NAVIGATION_ITEMS: navigateElement[] = [
  { name: "Dashboard", path: "/dashboard", public: false },
  { name: "Mis Canchas", path: "/bookings", public: false },
  { name: "Reservas", path: "/Reservation", public: false },
  { name: "Perfil", path: "/UserUpdate", public: false },
  { name: "Info Canchas", path: "/FieldForm", public: false },
  { name: "Registro", path: "/register", public: false },
  { name: "Canchas", path: "/courtsAdmin", public: false },
  { name: "Imagenes", path: "/ImageSelectorUser", public: false },
  { name: "Registro Servicios", path: "/RegisterService", public: false },
  { name: "Registro Promociones", path: "/RegisterPromotion", public: false },
  { name: "Promociones o Servicios", path: "/GetPromotions", public: false }
];

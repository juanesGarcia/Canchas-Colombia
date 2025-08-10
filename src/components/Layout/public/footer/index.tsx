import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { COMPANY_INFO, LEGAL_PAGES } from "../../../../constants";

import { LogoSvg } from "../../../UI/icons";
import { capitalizeFirsLetter } from "../../../../utils/functions";
export const Footer: React.FC = () => {
  const { name } = COMPANY_INFO;
  return (
    <footer className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center ">
                <LogoSvg className=" fill-current dark:text-white h-5 w-5 md:h-15 md:w-15" />
              </div>
              <span className="tex-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {`${capitalizeFirsLetter(name.split("S.A.S.")[0])}`}
              </span>
            </div>
            <p className="text-gray-500 dark:text-stone-100  ">
              {COMPANY_INFO.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={COMPANY_INFO.social.facebook}
                className="text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={COMPANY_INFO.social.instagram}
                className="text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                className="text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-500 dark:text-stone-100  hover ">
                  {COMPANY_INFO.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-500 dark:text-stone-100  hover ">
                  {COMPANY_INFO.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <span className="text-gray-500 dark:text-stone-100  hover ">
                  {COMPANY_INFO.address}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicios</h3>
            <div className="space-y-2">
              <Link
                to="/fields"
                className="block text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
              >
                Alquiler de Canchas
              </Link>
              <Link
                to="/services"
                className="block text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
              >
                Servicios Adicionales
              </Link>
              <Link
                to="/contact"
                className="block text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
              >
                Asesoría Personalizada
              </Link>
              <Link
                to="/fields"
                className="block text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
              >
                Eventos Deportivos
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="space-y-2">
              {LEGAL_PAGES.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block text-gray-500 dark:text-stone-100 dark:hover:text-green-500  hover:text-green-400 transition-colors duration-200"
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-stone-100 dark:hover:text-green-500 ">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

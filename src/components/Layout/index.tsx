import { FC } from "react";
import { Header } from "./public/header/Header";
import { Footer } from "./public/footer";
import { Outlet } from "react-router-dom";
import { COMPANY_INFO } from "../../constants";

interface seoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const Layout: FC<seoProps> = ({
  title = "",
  description = "paginas Canchas Colombia ",
  keywords = "Gestiín de espacios deprotivos, canchas, reservas, Colombia",
  canonicalUrl = "lascanchas.com.co",
}) => {
  const { name, ogImage } = COMPANY_INFO;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <head>
        <title>
          {title
            ? `${name.split("S.A.S.")[0]} | ${title}`
            : `${name.split("S.A.S.")[0]} - Tu espacio deportivo ideal`}
        </title>
        <link rel="icon" type="image" href="src/assets/logo V3.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title || name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </head>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

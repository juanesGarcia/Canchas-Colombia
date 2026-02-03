import { useAuth } from "../../contexts/AuthContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Unplug } from "lucide-react";
import { Button } from "../../components/UI/Button";
import { FC, useEffect } from "../../utils/depencies";

const NotFound: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    document.title = "Upss... Página no encontrada";
  });
  return (
    <div className="dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="flex justify-center">
          {" "}
          {/* Cambié justify-right por justify-center */}
          <Unplug size={100} className="text-green-500 dark:text-white" />
        </div>
        {/* 
        <div className="h-[85vh]">
          <MapCustom></MapCustom>
        </div> 
        */}
        <p className="text-green-500 dark:text-white my-4">
          La pagina que busca no está disponible
        </p>
        <Button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
          variant="primary"
          size="md"
          iconPosition="right"
        >
          Volver al incio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

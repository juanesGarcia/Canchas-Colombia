import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";
import { PrivateLayout } from "../components/Layout/private";
import { lazy } from "../utils/depencies";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Pages
const Home = lazy(() =>
  import("../pages/Home/Home").then((module) => ({ default: module.Home }))
);
const FieldsManage = lazy(() =>
  import("../pages/FieldsPrivate").then((module) => ({
    default: module.FieldsManage,
  }))
);
const ImageSelector = lazy(() =>
 import("../pages/images/ImageSelector").then((module) => ({
 default: module.ImageSelector,
 }))
);
const Fields = lazy(() =>
  import("../pages/Fields/Fields").then((module) => ({
    default: module.Fields,
  }))
);
const Services = lazy(() =>
  import("../pages/Services/Services").then((module) => ({
    default: module.Services,
  }))
);

const Contact = lazy(() =>
  import("../pages/Contact/Contact").then((module) => ({
    default: module.Contact,
  }))
);
const Login = lazy(() =>
  import("../pages/Auth/Login").then((module) => ({ default: module.Login }))
);

const Register = lazy(() =>
  import("../pages/Auth/Register").then((module) => ({
    default: module.Register,
  }))
);
const Dashboard = lazy(() =>
  import("../pages/Dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);

const FieldDetailPage = lazy(() =>
  import("../pages/Fields/FieldDetailPage/FieldDetailPage").then((module) => ({
    default: module.FieldDetailPage,
  }))
);

const RegisterService = lazy(() =>
  import("../pages/Services/RegisterService").then((module) => ({
    default: module.RegisterService,
  }))
);

const ReservationRegister = lazy(() =>
  import("../pages/Reservation/ReservationRegister").then((module) => ({
    default: module.ReservationRegister,
  }))
);

const FieldsById = lazy(() =>
  import("../pages/Fields/FieldsById").then((module) => ({
    default: module.FieldsById,
  }))
);
import NotFound from "../pages/NotFound";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/fields/:id" element={<FieldDetailPage/>} />
          {/* Legal Pages */}
          <Route
            path="/terms"
            element={
              <>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Términos y Condiciones
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Contenido próximamente disponible
                    </p>
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/privacy"
            element={
              <>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Política de Privacidad
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Contenido próximamente disponible
                    </p>
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/cancellation"
            element={
              <>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Política de Cancelación
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Contenido próximamente disponible
                    </p>
                  </div>
                </div>
              </>
            }
          />
<Route path="/ReservationRegister/:subcourtId" element={<ReservationRegister />} />
          <Route
            path="/faq"
            element={
              <>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Preguntas Frecuentes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Contenido próximamente disponible
                    </p>
                  </div>
                </div>
              </>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/profile"
              element={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Mi Perfil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Próximamente disponible
                    </p>
                  </div>
                </div>
              }
            />
            <Route path="/fieldsManage" element={<FieldsManage />} />
            <Route
              path="/bookings"
              element={<FieldsById/>}
              
            /><Route path="/register" element={<Register />} />
             <Route path="/ImageSelector" element={<ImageSelector />} />
             <Route path="/RegisterService" element={<RegisterService />} />
            {" "}
          
          </Route>
        </Route>
        {/* Catch all route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

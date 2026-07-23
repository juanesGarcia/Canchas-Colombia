import React, { useEffect, useState } from "react";
import {
  usersFilter,
  activateUser,
  deactivateUser,
} from "../../api/auth";
import { User } from "../../types/types";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { Button } from "../../components/UI/Button";
import { AnimatePresence, motion } from "../../utils/depencies";

export const InactiveUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersFilter();
        setUsers(response);
        console.log("Usuarios cargados:", response);
    } catch (err) {
      setError("No fue posible cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: "all",
      label: "Todos",
    },
    {
      value: "admin",
      label: "Administrador",
    },
    {
      value: "proveedor",
      label: "Proveedor",
    },
  ];

  const filteredUsers = Array.isArray(users) ? users.filter( (user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role?.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  }) : [];

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.state) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                state: !u.state,
              }
            : u
        )
      );
    } catch {
      alert("No fue posible actualizar el estado del usuario.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administración de Usuarios
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">

          <div className="flex flex-col sm:flex-row gap-4">

            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Buscar usuario..."
                className="w-full border rounded-md pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              variant="outline-solid"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>

          </div>

          {showFilters && (
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
              >
                <select
                  className="border rounded-md p-2"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                >
                  {roles.map((role) => (
                    <option
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            Cargando usuarios...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            {error}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-6 py-3 text-left">
                    Usuario
                  </th>

                  <th className="px-6 py-3 text-left">
                    Correo
                  </th>

                  <th className="px-6 py-3 text-left">
                    Rol
                  </th>

                  <th className="px-6 py-3 text-center">
                    Estado
                  </th>

                  <th className="px-6 py-3 text-center">
                    Acción
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b"
                  >

                    <td className="px-6 py-4">
                      {user.name}
                    </td>

                    <td className="px-6 py-4">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 capitalize">
                      {user.role}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.state
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.state
                          ? "Activo"
                          : "Inactivo"}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                      <button
                        onClick={() =>
                          handleToggleStatus(user)
                        }
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${
                          user.state
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {user.state ? (
                          <>
                            <UserX size={18} />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck size={18} />
                            Activar
                          </>
                        )}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        ) : (
          <div className="text-center py-20">
            <Users
              className="mx-auto mb-4 text-gray-400"
              size={60}
            />
            <p>No se encontraron usuarios.</p>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

// Define la interfaz para las reservas existentes del backend
interface ExistingReservation {
    reservation_date: string;
    reservation_time: string;
    duration: number;
}

interface SubcourtCalendarProps {
    subcourtId: string;
    onDateSelect: (date: Date) => void;
    selectedDate: Date | null;
}

const SubcourtCalendar: React.FC<SubcourtCalendarProps> = ({ subcourtId, onDateSelect, selectedDate }) => {
    const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (subcourtId) {
            fetchOccupiedDates(subcourtId);
        }
    }, [subcourtId]);

    const fetchOccupiedDates = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get<ExistingReservation[]>(`/api/subcourt/${id}/reservations`);
            const reservations = response.data;
            const dates = reservations.map(r => new Date(r.reservation_date));
            setOccupiedDates(dates);
            setError(null);
        } catch (err) {
            console.error('Error al obtener las fechas ocupadas:', err);
            setError("No se pudieron cargar las fechas disponibles. Intenta de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Deshabilita fechas pasadas
        if (date < today) {
            return true;
        }

        // Deshabilita fechas ocupadas
        return occupiedDates.some(occupiedDate =>
            occupiedDate.getFullYear() === date.getFullYear() &&
            occupiedDate.getMonth() === date.getMonth() &&
            occupiedDate.getDate() === date.getDate()
        );
    };

    if (loading) {
        return <div className="text-center text-gray-500">Cargando calendario...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="my-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecciona una fecha disponible
            </label>
            <Calendar
                onChange={(value) => {
                    if (value instanceof Date) {
                        onDateSelect(value);
                    }
                }}
                value={selectedDate}
                locale="es-ES"
                tileDisabled={({ date, view }) => view === 'month' && isDateDisabled(date)}
            />
        </div>
    );
};

export default SubcourtCalendar;
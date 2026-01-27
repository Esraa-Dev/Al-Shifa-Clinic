import type { RecentAppointmentsProps } from "../../../types/types";
import { DashboardTable } from "../dashboard/DashboardTable";

export const RecentAppointments = ({ appointments }: RecentAppointmentsProps) => {
    const columns = [
        { header: "Patient Name", key: "patientName" },
        { header: "Phone", key: "patientPhone" },
        { header: "Date", key: "date" },
        { header: "Time", key: "time" },
        { header: "Mode", key: "mode" },
        { header: "Status", key: "status" },
        { header: "Fees", key: "consultationFees" },
    ];

    const data = appointments.map(appointment => ({
        ...appointment,
        date: new Date(appointment.date).toLocaleDateString()
    }));

    return (
        <DashboardTable
            columns={columns}
            data={data}
            title="Recent Appointments"
        />
    );
};
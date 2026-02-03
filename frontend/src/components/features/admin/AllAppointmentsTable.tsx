import type { Appointment, UserBasicInfo, DoctorBasicInfo } from "../../../types/types";
import { DashboardTable } from "../dashboard/DashboardTable";

type ExtendedAppointment = Appointment & {
    paymentStatus: string;
};

export const AllAppointmentsTable = ({ appointments }: { appointments: ExtendedAppointment[] }) => {
    const getPatientName = (patientId: string | UserBasicInfo): string => {
        if (typeof patientId === 'string') return 'Patient';
        return `${patientId.firstName || ''} ${patientId.lastName || ''}`.trim() || 'Patient';
    };

    const getDoctorName = (doctorId: string | DoctorBasicInfo): string => {
        if (typeof doctorId === 'string') return 'Doctor';
        return `${doctorId.firstName || 'Dr.'} ${doctorId.lastName || ''}`.trim() || 'Doctor';
    };

    const columns = [
        { header: "Patient", key: "patient" },
        { header: "Doctor", key: "doctor" },
        { header: "Date", key: "date" },
        { header: "Time", key: "time" },
        { header: "Type", key: "type" },
        { header: "Status", key: "status" },
        { header: "Fee", key: "fee" },
        { header: "Payment", key: "payment" },
    ];

    const data = appointments.map(appointment => ({
        patient: getPatientName(appointment.patientId),
        doctor: getDoctorName(appointment.doctorId),
        date: new Date(appointment.appointmentDate).toLocaleDateString(),
        time: `${appointment.startTime} - ${appointment.endTime}`,
        type: appointment.type ? appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1) : 'N/A',
        status: appointment.status,
        fee: `$${appointment.fee}`,
        payment: appointment.paymentStatus,
    }));

    return (
        <DashboardTable
            columns={columns}
            data={data}
            title="All Appointments"
        />
    );
};
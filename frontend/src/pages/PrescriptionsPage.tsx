import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/ui/Pagination";
import { Button } from "../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import { PrescriptionModal } from "../components/features/doctor/PrescriptionModal";
import type { Appointment, Prescription, UserBasicInfo, TableColumn, PrescriptionTableRow } from "../types/types";
import { DashboardTable } from "../components/features/dashboard/DashboardTable";
import { usePrescriptions } from "../hooks/prescription/usePrescriptions";
import { useDeletePrescription } from "../hooks/prescription/useDeletePrescription";
import { DashboardTableSkeleton } from "../components/features/dashboard/DashboardTableSkeleton";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  prescriptionId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (id: string) => void; 
  prescriptionId: string;
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("prescription:deleteConfirmation")}
              </h3>
              <p className="text-gray-600 mt-1">
                {t("prescription:deleteConfirmationMessage")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              {t("common:cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm(prescriptionId);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {t("common:delete")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrescriptionsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<string>("");
  
  const { user } = useAuth();
  const { data, isLoading, refetch } = usePrescriptions({
    page: currentPage,
    limit: 10,
  });
  const { mutate: deletePrescription } = useDeletePrescription();
  const { t } = useTranslation();

  const prescriptions: Prescription[] = data?.data?.prescriptions || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };
  const isDoctor = user?.role === "doctor";

  const handleEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowEditModal(true);
  };

  const handleDeleteClick = (prescriptionId: string) => {
    setPrescriptionToDelete(prescriptionId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (prescriptionId: string) => {
    deletePrescription(prescriptionId, {
      onSuccess: () => {
        refetch();
        setPrescriptionToDelete("");
      },
      onError: () => {
        setPrescriptionToDelete("");
      }
    });
  };

  const handleSuccess = () => {
    refetch();
    setShowEditModal(false);
  };

  const getPatientName = (patientId: UserBasicInfo | string): string => {
    if (typeof patientId === "string") return "";
    return `${patientId.firstName || ""} ${patientId.lastName || ""}`.trim();
  };

  const getAppointmentId = (appointmentId: Appointment | string): string => {
    if (typeof appointmentId === "string") return appointmentId;
    return appointmentId._id;
  };

  const columns: TableColumn<PrescriptionTableRow>[] = [
    { header: t("prescription:patient"), key: "patient" },
    { header: t("prescription:date"), key: "date" },
    { header: t("prescription:diagnosis"), key: "diagnosis" },
    { header: t("prescription:medications"), key: "medications" },
    { header: t("prescription:followUpDate"), key: "followUpDate" },
    { header: t("common:actions"), key: "actions" },
  ];

  const dataTable: PrescriptionTableRow[] = prescriptions.map((prescription: Prescription) => ({
    patient: getPatientName(prescription.patientId),
    date: new Date(prescription.createdAt).toLocaleDateString(),
    diagnosis: prescription.diagnosis.length > 50 
      ? `${prescription.diagnosis.substring(0, 50)}...` 
      : prescription.diagnosis,
    medications: prescription.medicines.length,
    followUpDate: prescription.followUpDate 
      ? new Date(prescription.followUpDate).toLocaleDateString() 
      : "-",
    actions: (
      <div className="flex items-center gap-2">
        {isDoctor && (
          <>
            <Button
              onClick={() => handleEdit(prescription)}
              className="gap-1"            >
              <Edit size={14} />
              {t("common:edit")}
            </Button>
            <Button
              onClick={() => handleDeleteClick(prescription._id)}
              className="gap-1 bg-red-600 hover:bg-red-700"            >
              <Trash2 size={14} />
              {t("common:delete")}
            </Button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primaryText mb-2">
          {isDoctor ? t("prescription:doctorPrescriptions") : t("prescription:myPrescriptions")}
        </h1>
        <p className="text-gray-600">
          {isDoctor ? t("prescription:doctorSubtitle") : t("prescription:patientSubtitle")}
        </p>
      </div>

      {isLoading ? (
        <DashboardTableSkeleton/>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-primaryBorder">
          <div className="text-gray-500">
            {isDoctor ? t("prescription:noPrescriptionsCreated") : t("prescription:noPrescriptions")}
          </div>
        </div>
      ) : (
        <>
          <DashboardTable
            columns={columns}
            data={dataTable}
            title=""
          />

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {showEditModal && selectedPrescription && isDoctor && (
        <PrescriptionModal
          appointmentId={getAppointmentId(selectedPrescription.appointmentId)}
          patientName={getPatientName(selectedPrescription.patientId)}
          patientId={typeof selectedPrescription.patientId === "string" ? selectedPrescription.patientId : selectedPrescription.patientId._id}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
          existingPrescription={selectedPrescription}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPrescriptionToDelete("");
        }}
        onConfirm={handleDeleteConfirm}
        prescriptionId={prescriptionToDelete}
      />
    </div>
  );
};

export default PrescriptionsPage;
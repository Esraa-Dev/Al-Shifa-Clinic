import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { TextInput } from "../../ui/TextInput";
import { Textarea } from "../../ui/Textarea";
import { useTranslation } from "react-i18next";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PrescriptionModalProps } from "../../../types/types";
import { useCreatePrescription } from "../../../hooks/prescription/useCreatePrescription";
import { useUpdatePrescription } from "../../../hooks/prescription/useUpdatePrescription";
import { prescriptionSchema, type PrescriptionFormData } from "../../../validations/prescriptionSchema";

export const PrescriptionModal = ({
  appointmentId,
  patientName,
  isOpen,
  onClose,
  onSuccess,
  existingPrescription
}: PrescriptionModalProps) => {
  const { t } = useTranslation(["prescription", "common", "validation"]);
  
  const createValidationSchema = prescriptionSchema();
  
  const { mutate: createMutate, isPending: isCreating } = useCreatePrescription();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePrescription();
  const isPending = isCreating || isUpdating;
  
  const getDefaultMedicines = () => {
    if (existingPrescription?.medicines && existingPrescription.medicines.length > 0) {
      return existingPrescription.medicines;
    }
    return [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }];
  };

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<PrescriptionFormData>({
    resolver: zodResolver(createValidationSchema),
    defaultValues: {
      diagnosis: existingPrescription?.diagnosis || "",
      medicines: getDefaultMedicines(),
      notes: existingPrescription?.notes || "",
      followUpDate: existingPrescription?.followUpDate
        ? new Date(existingPrescription.followUpDate).toISOString().split('T')[0]
        : ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines"
  });
  
  const onSubmit = (data: PrescriptionFormData) => {
    const formData: any = {
      diagnosis: data.diagnosis,
      medicines: data.medicines?.map(medicine => ({
        name: medicine.name,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        duration: medicine.duration,
        instructions: medicine.instructions || ""
      })) || [],
      notes: data.notes || ""
    };

    if (data.followUpDate?.trim()) {
      formData.followUpDate = data.followUpDate;
    }

    if (existingPrescription) {
      const prescriptionId = existingPrescription?._id;

      if (prescriptionId) {
        updateMutate(
          {
            prescriptionId,
            data: formData
          },
          {
            onSuccess: () => {
              reset();
              onSuccess();
              onClose();
            }
          }
        );
      }
    } else {
      createMutate(
        {
          appointmentId,
          ...formData
        },
        {
          onSuccess: () => {
            reset();
            onSuccess();
            onClose();
          }
        }
      );
    }
  };

  const handleAddMedicine = () => {
    append({ name: "", dosage: "", frequency: "", duration: "", instructions: "" });
  };

  const handleRemoveMedicine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-4xl border-t-6 border-primary shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <div>
            <h3 className="text-2xl font-bold text-primaryText">
              {existingPrescription
                ? t("prescription:updatePrescription")
                : t("prescription:createPrescription")
              }
            </h3>
            <p className="text-primaryText mt-1">
              {t("prescription:forPatient")}: <span className="font-semibold">{patientName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white bg-black/80 rounded-full p-2 transition-colors cursor-pointer"
            aria-label={t("common:close")}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Textarea
                    label={t("prescription:diagnosis")}
                    placeholder={t("prescription:diagnosisPlaceholder")}
                    rows={3}
                    register={register("diagnosis")}
                    error={errors.diagnosis}
                    requiredInput
                  />
                </div>

                <div>
                  <div className="flex justify-end items-center mb-4">
                    <Button
                      type="button"
                      onClick={handleAddMedicine}
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      {t("prescription:addMedicine")}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">
                            {t("prescription:medicine")} #{index + 1}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => handleRemoveMedicine(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                          <TextInput
                            label={t("prescription:medicineName")}
                            placeholder={t("prescription:medicineNamePlaceholder")}
                            register={register(`medicines.${index}.name`)}
                            error={errors.medicines?.[index]?.name}
                            requiredInput
                          />
                          <TextInput
                            label={t("prescription:dosage")}
                            placeholder={t("prescription:dosagePlaceholder")}
                            register={register(`medicines.${index}.dosage`)}
                            error={errors.medicines?.[index]?.dosage}
                            requiredInput
                          />
                          <TextInput
                            label={t("prescription:frequency")}
                            placeholder={t("prescription:frequencyPlaceholder")}
                            register={register(`medicines.${index}.frequency`)}
                            error={errors.medicines?.[index]?.frequency}
                            requiredInput
                          />
                          <TextInput
                            label={t("prescription:duration")}
                            placeholder={t("prescription:durationPlaceholder")}
                            register={register(`medicines.${index}.duration`)}
                            error={errors.medicines?.[index]?.duration}
                            requiredInput
                          />
                          <div className="md:col-span-2">
                            <TextInput
                              label={t("prescription:instructions")}
                              placeholder={t("prescription:instructionsPlaceholder")}
                              register={register(`medicines.${index}.instructions`)}
                              error={errors.medicines?.[index]?.instructions}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Textarea
                    label={t("prescription:additionalNotes")}
                    placeholder={t("prescription:notesPlaceholder")}
                    rows={2}
                    register={register("notes")}
                    error={errors.notes}
                  />
                </div>

                <div>
                  <TextInput
                    label={t("prescription:followUpDate")}
                    type="date"
                    register={register("followUpDate")}
                    error={errors.followUpDate}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-primaryBorder bg-white p-6 rounded-b-4xl">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary"
              disabled={isPending}
            >
              {t("common:cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? t("common:saving") :
                existingPrescription ? t("prescription:updatePrescription") :
                  t("prescription:createPrescription")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
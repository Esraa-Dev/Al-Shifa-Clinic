import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2 } from "lucide-react";
import { useChangePassword } from "../hooks/auth/useChangePassword";
import { TextInput } from "../components/ui/TextInput";
import { Button } from "../components/ui/Button";
import { changePasswordSchema, type ChangePasswordFormData } from "../validations/changePasswordSchema";

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const { mutate, isPending } = useChangePassword();

    const onSubmit = (data: ChangePasswordFormData) => {
        mutate(data, {
            onSuccess: () => {
                reset();
            }
        });
    };
    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Change Password
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Update your account password</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="ltr">
                        <div className="space-y-4 text-left!">
                            <TextInput
                                label="Current Password"
                                Icon={Lock}
                                type="password"
                                placeholder="Enter your current password"
                                register={register("currentPassword")}
                                error={errors.currentPassword}
                                id="currentPassword"
                                requiredInput
                                isDashboard
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <TextInput
                                    label="New Password"
                                    Icon={Lock}
                                    type="password"
                                    placeholder="Enter new password"
                                    register={register("newPassword")}
                                    error={errors.newPassword}
                                    id="newPassword"
                                    requiredInput
                                    isDashboard
                                />

                                <TextInput
                                    label="Confirm Password"
                                    Icon={Lock}
                                    type="password"
                                    placeholder="Confirm new password"
                                    register={register("confirmPassword")}
                                    error={errors.confirmPassword}
                                    id="confirmPassword"
                                    requiredInput
                                    isDashboard

                                />
                            </div>
                        </div>


                        <div className="flex gap-3 pt-4 justify-end">

                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            <Button
                                type="button"
                                className="bg-secondary"
                                onClick={() => reset()}
                                disabled={isPending}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
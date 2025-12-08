import type { AppFormProps } from "../../types/types";

const AppForm = ({ title, children }: AppFormProps) => {
    return (
        <div className="bg-background flex items-center justify-center py-12 md:py-20">
            <div className="max-w-lg md:max-w-xl w-full container">

                {title && <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-primaryText mb-3 w-fit mx-auto border-b-4 border-primary pb-2">
                        {title}
                    </h1>
                </div>}

                <div className="bg-white rounded-2xl shadow-lg px-8 py-16 border border-primaryBorder">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default AppForm;

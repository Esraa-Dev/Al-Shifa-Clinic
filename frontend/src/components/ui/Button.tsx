interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export const Button = ({
    type = 'button',
    className = '',
    children,
    onClick,
    disabled = false
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`
                flex items-center justify-center font-semibold rounded-sm text-sm shadow-lg transform 
                cursor-pointer transition duration-200 px-6 py-2 bg-primary text-white hover:bg-primary/80
                ${className}
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};


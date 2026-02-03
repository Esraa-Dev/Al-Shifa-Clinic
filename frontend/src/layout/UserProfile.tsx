import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const UserProfile = () => {
  const { user } = useAuth();
  if (!user) return null;

  const userName = user.role === "doctor" 
    ? `Dr. ${user.firstName} ${user.lastName}`
    : `${user.firstName} ${user.lastName}`;
console.log(user)
  return (
    <Link to={user.role==="doctor"?"profile-settings":""} className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
        {user.image ? (
          <img 
            src={user.image} 
            alt={userName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User size={20} className="text-white" />
        )}
      </div>
      
      <div className="hidden md:block">
        <p className="text-sm font-medium text-gray-900">{userName}</p>
        <p className="text-xs text-gray-500">
          {user.role === "doctor" ? "Doctor" : 
           user.role === "admin" ? "Administrator" : "Patient"}
        </p>
      </div>
    </Link>
  );
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { useTranslation } from "react-i18next";
import { Phone, PhoneOff } from "lucide-react";

const IncomingCallModal = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!socket) return;
    socket.on("incoming-call", (data) => {
      setIncomingCall(data);
      const audio = new Audio("/ringtone.mp3");
      audio.play().catch(() => console.log("Audio block by browser"));
    });

    return () => {
      socket.off("incoming-call");
    };
  }, [socket]);

  if (!incomingCall) return null;

  const handleAccept = () => {
    navigate(`/video-call/${incomingCall.roomId}?type=${incomingCall.type}&role=patient&doctorName=${incomingCall.doctorName}`);
    setIncomingCall(null);
  };

  const handleDecline = () => {
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-bounce-in">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Phone size={40} className="text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-primaryText mb-2">{t("appointment:call.incoming")}</h2>
        <p className="text-gray-600 mb-8 text-lg font-medium">
          {incomingCall.doctorName} {t("appointment:call.callingNow")}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleAccept}
            className="flex-1 bg-primary hover:bg-primary/80 cursor-pointer text-white py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold"
          >
            <Phone size={20} />
            {t("appointment:call.answer")}
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-secondary hover:bg-secondary/80 cursor-pointer text-white py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold"
          >
            <PhoneOff size={20} />
            {t("appointment:call.decline")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
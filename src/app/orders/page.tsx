import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profile?tab=orders", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vortexBuy border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default OrdersPage;

import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    console.log("Order received:", order); // Debugging
    if (!order) {
      toast.error("Order not created. Please try again.");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "credits payment",
      description: "credits payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const data = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Credits Added Successfully");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
      prefill: {
        name: user?.name || "Guest",
        email: user?.email || "",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
      }
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "#d1d1d1" }}
        whileTap={{ scale: 0.95 }}
        className="border border-gray-400 px-10 py-2 rounded-full mb-6"
      >
        Our Plans
      </motion.button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10 ">
        Choose the plan
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
            className="bg-gradient-to-b from-[#E2F5E1] to-[#C9EACB] drop-shadow-lg border border-[#28A745] rounded-lg py-12 px-8 text-gray-800 transition-all duration-300"
          >
            <img src={assets.logo_icon} alt="" width={40} />
            <p className="mt3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">&#8377;{item.price}</span>/{" "}
              {item.credits} credits
            </p>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#333333" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;

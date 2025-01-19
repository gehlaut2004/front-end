import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const GenerateBtn = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-16 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16"
      >
        See The Magic
      </motion.h1>
      <motion.button
        className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-110 transition-all duration-300"
        onClick={onClickHandler}
        whileHover={{
          scale: 1.1,
          backgroundColor: "#1F2937",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        Generate Images
        <motion.img
          src={assets.star_group}
          alt="Stars"
          className="h-6"
          whileHover={{
            rotate: 360,
            transition: { duration: 0.8 },
          }}
        />
      </motion.button>
    </motion.div>
  );
};

export default GenerateBtn;

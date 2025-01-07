import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Description = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 p-6 md:px-28"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Create AI images
      </h1>
      <p className="text-gray-500 mb-8 ">
        Turn your ideas into stunning images with AI
      </p>
      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center ">
        <img
          className="w-80 xl:w-96 rounded-lg "
          src={assets.sample_img_1}
          alt=""
        />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            Introducing the AI-Powered text to Image Generator
          </h2>
          <p className="text-gray-600 mb-4">
            Transform your ideas into captivating visuals with our powerful
            text-to-image generator! Simply describe your vision, and let our AI
            create stunning, high-quality images tailored to your words. Perfect
            for creatives, storytellers, and innovators
          </p>
          <p className="text-gray-600">
            Bring your imagination to life with our advanced text-to-image
            generator! Type in a detailed description, and watch as AI crafts
            unique, eye-catching visuals that match your vision. Ideal for
            creators and dreamers alikez
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;

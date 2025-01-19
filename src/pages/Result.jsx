import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const generatedImage = await generateImage(input);
      if (generatedImage) {
        setImage(generatedImage);
        setIsImageLoaded(true);
      }
    }
    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div className="relative">
        {/* Image Container */}
        <img
          src={image}
          alt="Generated"
          className={`max-w-sm rounded transition-all ${
            loading ? "blur-md" : "blur-none"
          }`}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/40 rounded">
            <img
              src={assets.loading} // Replace with your actual SVG path
              alt="Loading..."
              className="w-12 h-12 animate-spin"
            />
          </div>
        )}
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20"
          />
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#555555" }}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </motion.button>
        </div>
      )}
      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <motion.p
            whileHover={{
              scale: 1.1,
              color: "#ffffff",
              backgroundColor: "#1a1a1a",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsImageLoaded(false); // Reset image loaded state
              setInput(""); // Clear the input field
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.1, backgroundColor: "#444444" }}
            whileTap={{ scale: 0.95 }}
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </motion.a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;

import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-scroll";
import girl2Image from "../assets/girl2.png";
import orangeImage from "../assets/orange.png";
import BurgerImage from "../assets/Burger.png";

function Hero() {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 
                 min-h-screen flex flex-col md:flex-row items-center justify-between 
                 px-4 sm:px-6 md:px-12 lg:px-16 py-10 md:py-0 font-poppins overflow-x-hidden"
    >
      {/* Left Content */}
      <div className="flex-1 space-y-4 md:space-y-6 mt-10 md:mt-0 order-2 md:order-1 z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 
                     px-3 py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-semibold"
        >
          <span>🍇 More than Faster</span>
        </motion.div>

        {/* Heading with Typewriter */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                     font-extrabold text-gray-900 leading-tight md:leading-snug 
                     h-auto md:min-h-[200px] flex items-center font-montserrat"
        >
          <span className="inline-block">
            <Typewriter
              words={[
                "Be The Fastest In Delivering Your Food",
                "Be The Fastest In Delivering Your Burger",
                "Be The Fastest In Delivering Your Pizza",
              ]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </motion.h1>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base max-w-lg font-poppins">
          "Enjoy delicious food delivered quickly to your doorstep. Fresh ingredients and tasty meals, made just for you."
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Link to="menu" smooth={true} duration={300}>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white 
                               rounded-full shadow-md hover:bg-purple-700 transition 
                               text-sm md:text-base font-semibold font-poppins">
              Order Now
            </button>
          </Link>

          <Link to="menu" smooth={true} duration={300}>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-white text-purple-700 
                               rounded-full shadow-md hover:bg-purple-100 transition 
                               text-sm md:text-base font-semibold font-poppins">
              Order Process →
            </button>
          </Link>
        </div>
      </div>

      {/* Right Side with Girl + Cards */}
      <div className="flex-1 relative mt-6 md:mt-0 flex items-center justify-center order-1 md:order-2 min-h-[400px] md:min-h-[600px]">
        {/* Girl Image */}
        <motion.img
          src={girl2Image}
          alt="Food Delivery Girl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-64 sm:w-80 md:w-[350px] lg:w-[400px] xl:w-[450px] z-10 relative"
        />

        {/* Orange Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-4 right-0 md:top-10 md:right-10 lg:top-16 lg:right-16
                     backdrop-blur-md bg-white/10 shadow-lg rounded-lg md:rounded-xl 
                     p-2 md:p-3 lg:p-4 flex items-center gap-2 md:gap-3 z-20 
                     w-[140px] sm:w-[160px] md:w-[180px] font-poppins"
        >
          <img src={orangeImage} alt="Orange" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
          <div>
            <p className="text-xs font-semibold font-montserrat">Fresh Orange</p>
            <p className="text-[10px] text-gray-500">$44.60 Free Shipping</p>
          </div>
        </motion.div>

        {/* Delivery Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-1/2 right-0 md:top-1/2 md:right-4
                     backdrop-blur-md bg-white/10 shadow-lg rounded-lg md:rounded-xl 
                     p-2 md:p-3 flex items-center gap-2 z-20 font-poppins
                     w-auto"
        >
          <span className="text-green-500 text-sm md:text-base">⏱</span>
          <p className="text-xs font-medium">Delivery 30 Min</p>
        </motion.div>

        {/* Burger Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-10 left-0 md:bottom-16 md:left-10 lg:bottom-20 lg:left-16
                     backdrop-blur-md bg-white/10 shadow-lg rounded-lg md:rounded-xl 
                     p-2 md:p-3 lg:p-4 flex items-center gap-2 md:gap-3 z-10 
                     w-[140px] sm:w-[160px] md:w-[180px] font-poppins"
        >
          <img src={BurgerImage} alt="Burger" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded" />
          <div>
            <p className="text-xs font-semibold font-montserrat">American Burger</p>
            <p className="text-[10px] text-black">$8.75</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

function Hero() {
  return (
    <>
      <section
        id="home"
        className="h-screen flex items-center justify-center text-yellow-100 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')`,
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* Typewriter Text */}
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-4xl md:text-6xl font-extrabold z-10 leading-snug px-4"
        >
          <Typewriter
            words={[
              "Welcome to SpiceHub!",
              "Delicious Food Awaits 🍽️",
              "Made With Love ❤️"
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </motion.h1>
      </section>
    </>);
}

export default Hero;

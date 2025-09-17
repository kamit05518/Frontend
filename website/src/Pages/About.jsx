import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 12000, label: "Happy Customers Served" },
  { value: 45, label: "Indian Dishes" },
  { value: 98, label: "Customer Satisfaction Rate" },
];

const About = () => {
  const [chefs, setChefs] = useState([]);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/chefs");
        setChefs(response.data.chefs);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    };

    fetchChefs();
  }, []);

  return (
    <section className="min-h-screen py-20 bg-gradient-to-tr from-rose-50 via-purple-50 to-amber-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-rose-200/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full -translate-x-1/4 translate-y-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 mt-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-rose-700 mb-4">Spice Garden</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Experience the authentic flavors of India in every bite. Our chefs craft traditional dishes with a modern twist, using recipes passed down through generations.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          ref={countRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl shadow-xl mb-20"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse delay-500" />
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 via-violet-300 to-yellow-200 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="relative z-10 bg-white/80 backdrop-blur-lg p-8 md:p-12 rounded-3xl">
            <h2 className="text-4xl font-bold text-center text-rose-600 mb-10">
              Our Journey in Numbers
            </h2>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {stats.map(({ value, label }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center bg-white/90 rounded-2xl px-6 py-8 shadow-md border border-pink-100 hover:shadow-pink-200 transition-all"
                >
                  <div
                    className="text-4xl md:text-5xl font-extrabold mb-2"
                    style={{
                      background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {isInView && (
                      <CountUp
                        start={0}
                        end={value}
                        duration={2.5}
                        suffix={i === 2 ? "%" : "+"}
                      />
                    )}
                  </div>
                  <p className="text-gray-700 text-lg font-medium">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Our Story Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-10 mb-20"
        >
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-rose-600 mb-6">Our Story</h2>
            <p className="text-gray-700 text-lg mb-4">
              Founded in 2010, Spice Garden began as a small family restaurant with a simple mission: to share the authentic flavors of India with our community. What started as a humble kitchen with just five tables has now grown into a beloved culinary destination.
            </p>
            <p className="text-gray-700 text-lg">
              We take pride in using traditional cooking methods, sourcing the freshest ingredients, and creating dishes that tell a story of India's diverse culinary heritage. Each recipe has been perfected over generations, bringing you an unforgettable dining experience.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Restaurant interior" 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Meet Our Chefs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-rose-600 mb-4">Meet Our Chefs</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-3xl mx-auto">
            Our talented chefs bring decades of experience and passion to your plate, crafting each dish with precision and love.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {chefs.map((chef, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(244,114,182,0.5)",
                }}
                
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-pink-200 transition-all border-2 border-transparent hover:border-pink-300 flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg border-4 border-rose-100"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {chef.experience } years
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-700 mb-1">{chef.name}</h3>
                <p className="text-gray-600 mb-3">{chef.role || "Master Chef"}</p>
                <p className="text-sm text-gray-500">Specializes in {chef.specialty || "Regional Cuisines"}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
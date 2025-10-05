import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import images
import PhoneImage from "../assets/phone.png";
import GirlImage from "../assets/girl2.png";
import GooglePlayImage from "../assets/googleplay.png";
import AppStoreImage from "../assets/appstore.png";

const About = () => {
  const [chefs, setChefs] = useState([]);

  // Testimonial data
  const testimonials = [
    {
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Sagittis non quisque elementum vehicula id.",
      name: "Melissa Carson",
      location: "America, U.S.A",
      image: GirlImage
    },
    {
      text: "This app has completely changed how I shop for groceries. The quality is fantastic and the delivery is always on time!",
      name: "John Doe",
      location: "Canada",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=300&q=80"
    },
    {
      text: "I love the variety of fresh produce available. The chefs' recipes are a bonus and have inspired me to cook more at home.",
      name: "Jane Smith",
      location: "United Kingdom",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=300&q=80"
    },
  ];

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get("https://backend-1mxo.onrender.com/api/chefs");
        setChefs(response.data.chefs);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    };
    fetchChefs();
  }, []);

  return (
    <section className="min-h-screen py-10 md:py-20 bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 relative overflow-hidden">
      {/* Custom Swiper CSS */}
      <style>
        {`
          .swiper-button-next, .swiper-button-prev {
            width: 30px !important;
            height: 30px !important;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 14px !important;
            color: #7e22ce;
            font-weight: bold;
          }
          .testimonial-card {
            border: 2px solid #e9d5ff !important;
          }
          @media (max-width: 640px) {
            .swiper-button-next, .swiper-button-prev {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/*  Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 mb-3 md:mb-4">
            About Us
          </h2>
          <p className="text-purple-700 max-w-2xl mx-auto text-sm md:text-base px-2">
            "Welcome to our website, where ideas turn into reality. Explore modern designs, easy navigation, and a smooth user experience created just for you."
          </p>

         {/* Swiper Slider */}
          <div className="mt-8 md:mt-12 max-w-5xl mx-auto px-2">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{ 640: { spaceBetween: 40 } }}
              className="pb-12"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="testimonial-card bg-gradient-to-br from-white to-purple-50 rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-10 transition-all mx-auto max-w-full hover:shadow-2xl hover:shadow-purple-300 border-2 border-purple-200">
                    <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-8">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="relative w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-purple-300 shadow-xl"
                        />
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <div className="mb-4">
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-purple-300 mx-auto sm:mx-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-base md:text-lg mb-4 md:mb-5 leading-relaxed italic">
                          "{testimonial.text}"
                        </p>
                        <div className="border-t-2 border-purple-200 pt-3 md:pt-4">
                          <h4 className="font-bold text-purple-700 text-lg md:text-xl">{testimonial.name}</h4>
                          <span className="text-purple-500 text-sm md:text-base flex items-center justify-center sm:justify-start gap-1 mt-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {testimonial.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
        
        {/*  Meet Our Chefs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-700 mb-3 md:mb-4">
            Meet Our Chefs
          </h2>
          <p className="text-purple-700 text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-3xl mx-auto px-2">
            Our talented chefs bring decades of experience and passion to your plate, crafting each dish with love.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
            {chefs.map((chef, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(167,139,250,0.5)",
                }}
                className="bg-white p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl shadow-md hover:shadow-purple-200 transition-all border-2 border-transparent hover:border-purple-300 flex flex-col items-center text-center"
              >
                <div className="relative mb-3 md:mb-4">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto rounded-full object-cover shadow-lg border-4 border-purple-100"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs md:text-sm font-semibold">
                    {chef.experience} years
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-purple-700 mb-1">
                  {chef.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3">{chef.role || "Master Chef"}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  Specializes in {chef.specialty || "Regional Cuisines"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/*  Mobile App Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center mt-20 gap-6 md:gap-10 bg-purple-50 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-lg mb-10 md:mb-10"
        >
          {/* Mobile Image */}
          <div className="md:w-1/2 flex justify-center order-2 md:order-1">
            <img
              src={PhoneImage}
              alt="Mobile App"
              className="w-40 md:w-60 lg:w-72 drop-shadow-lg"
            />
          </div>

          {/* App Content */}
          <div className="md:w-1/2 text-center md:text-left order-1 md:order-2">
            <p className="text-xs md:text-sm text-purple-600 font-medium mb-1 md:mb-2">
              Download our app
            </p>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-800 mb-3 md:mb-4">
              Get The Spicehub App <br /> Order More Easily.
            </h3>
            <p className="text-purple-700 text-sm md:text-base mb-4 md:mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare ut morbi volutpat facilisi tortor.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 md:gap-4">
              <img
                src={GooglePlayImage}
                alt="Google Play"
                className="w-28 md:w-36 cursor-pointer mx-auto md:mx-0"
              />
              <img
                src={AppStoreImage}
                alt="App Store"
                className="w-28 md:w-36 cursor-pointer mx-auto md:mx-0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

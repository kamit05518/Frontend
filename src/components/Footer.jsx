import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden py-12"
    >
      {/* Animated background elements */}
      <div className="absolute -top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10 z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500 rounded-full blur-3xl opacity-10 z-0 animate-pulse-slower"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-5 z-0"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              SpiceHub
            </h2>
            <p className="text-gray-300 mb-4">
              Delivering authentic flavors straight to your doorstep. Experience the taste of tradition with every bite.
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-xl">
              <motion.a
                href="https://facebook.com/spicehub"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-500 transition-colors"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a
                href="https://instagram.com/spicehub"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full hover:from-purple-500 hover:to-pink-500 transition-colors"
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 p-3 rounded-full hover:bg-green-500 transition-colors"
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col items-center">
              <div className="bg-orange-500 p-3 rounded-full mb-3">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">📍 Our Location</h3>
              <p className="text-gray-300">123 Food Street</p>
              <p className="text-gray-300">Spice City, India - 110001</p>
              <p className="text-gray-300 mt-2">Open: 10 AM - 11 PM</p>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <div className="flex flex-col items-center md:items-end">
              <div className="bg-blue-500 p-3 rounded-full mb-3">
                <FaPhone className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">📞 Contact Info</h3>
              <p className="text-gray-300 flex items-center gap-2 justify-center md:justify-end">
                <FaPhone className="text-orange-400" />
                +91 9876543210
              </p>
              <p className="text-gray-300 flex items-center gap-2 justify-center md:justify-end">
                <FaEnvelope className="text-orange-400" />
                contact@spicehub.com
              </p>
              <p className="text-gray-300 mt-2">24/7 Support Available</p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SpiceHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Careers</a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </motion.footer>
  );
};

export default Footer;
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
    >
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-blue-600">
        Go Home
      </Link>
    </motion.div>
  );
};

export default NotFound;

"use client";

import React from "react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

const ModalScreen = ({ children, visible, onClose }: Props) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full p-10 absolute top-0 left-0 flex items-center justify-center bg-black bg-opacity-80 z-20"
        >
          <motion.div
            className="bg-white h-full w-full z-50 p-2 rounded shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="hover:bg-slate-600 hover:text-white rounded-full p-2"
              >
                <IoMdClose size={30} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalScreen;

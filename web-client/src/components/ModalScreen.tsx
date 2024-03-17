import React from "react";
import { IoMdClose } from "react-icons/io";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

const ModalScreen = ({ children, visible = true, onClose }: Props) => {
  return (
    <div
      className={`h-screen z-50 w-full p-10 absolute top-0 left-0 flex items-center justify-center
       ${
        visible ? "" : "hidden"
      } bg-black bg-opacity-80 z-20`}
      onClick={onClose}
    >
      <div className="bg-white h-full w-full z-50 p-2 rounded shadow-xl">
        <div className="flex  justify-end">
          <button
            onClick={onClose}
            className="hover:bg-slate-600 hover:text-white rounded-full p-2"
          >
            <IoMdClose size={30} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalScreen;

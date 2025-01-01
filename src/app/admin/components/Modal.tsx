import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  size?: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, size }) => {
  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className={`bg-white p-6 rounded-lg shadow-lg relative ${
            size || "max-w-lg w-full"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;

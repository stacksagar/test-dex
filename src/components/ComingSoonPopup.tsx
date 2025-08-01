"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ComingSoonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonPopup: React.FC<ComingSoonPopupProps> = ({
  isOpen,
  onClose,
}) => {
  // Close popup when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Wallet integration is currently under development. We're working
            hard to bring you a seamless connection experience.
          </p>

          {/* Features list */}
          <div className="text-left mb-6 space-y-2">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>Multiple wallet support</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>Secure transactions</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>Real-time portfolio tracking</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all duration-200 transform hover:scale-105"
          >
            Got it!
          </button>

          {/* Footer text */}
          <p className="text-xs text-gray-500 mt-4">
            Stay tuned for updates on our progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPopup;

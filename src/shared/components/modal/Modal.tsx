'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from './ModalProvider';

export function Modal() {
  const { isOpen, content, closeModal } = useModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
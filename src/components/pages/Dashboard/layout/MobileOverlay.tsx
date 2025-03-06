interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/20 z-30 sm:hidden"
      onClick={onClose}
    />
  );
} 
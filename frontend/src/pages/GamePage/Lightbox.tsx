import { getImg } from "./utils";

interface LightboxProps {
  imgId: string | null;
  onClose: () => void;
}

export const Lightbox = ({ imgId, onClose }: LightboxProps) => {
  if (!imgId) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out transition-opacity duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-50 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
          aria-label="Close fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img
          src={getImg(imgId, "1080p")}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          alt="Fullscreen screenshot"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

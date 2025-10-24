export const BUTTON_STYLES = {
  primary: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all duration-200 hover:scale-105 active:scale-95",
  secondary: "bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 hover:border-red-300 active:border-red-400",
  icon: "text-white hover:text-red-200 active:text-red-300 transition-all duration-300 p-2 rounded-full hover:bg-red-700 active:bg-red-800 hover:scale-110 active:scale-95",
  disabled: "disabled:bg-gray-300 disabled:cursor-not-allowed"
} as const;

export const INPUT_STYLES = {
  textarea: "w-full h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm touch-manipulation",
  button: "bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 flex-shrink-0 h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center touch-manipulation"
} as const;

export const CONTAINER_STYLES = {
  chatWidget: "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
  chatButton: "bg-red-600/80 hover:bg-red-600 active:bg-red-700 text-white rounded-full p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200 touch-manipulation",
  sidebar: "bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 transform-gpu transition-all duration-300",
  header: "bg-red-600 text-white p-4 sm:p-5 rounded-t-xl flex justify-between items-center",
  messages: "flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50",
  input: "p-3 sm:p-5 border-t border-gray-200"
} as const;

export const ANIMATION_STYLES = {
  fadeIn: "animate-in fade-in duration-300",
  slideIn: "animate-in slide-in-from-bottom-4 slide-in-from-right-4 fade-in duration-300",
  zoomIn: "animate-in zoom-in-95 slide-in-from-bottom-4 slide-in-from-right-4 fade-in duration-300",
  quickActions: "animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300"
} as const;

import React, { useState, useEffect } from "react";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { useCollection } from "../hooks/useCollection";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

interface CollectButtonProps {
  id: string;
  name: string;
  type: "attraction" | "event" | "food";
  variant?: "icon" | "full"; // icon for popups, full for cards
}

const CollectButton: React.FC<CollectButtonProps> = ({
  id,
  name,
  type,
  variant = "full",
}) => {
  const { isCollected, addToCollection, removeFromCollection } =
    useCollection();
  const { user } = useAuth();
  const navigate = useNavigate();
  const collected = isCollected(id);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (collected && showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [collected, showAnimation]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Check if user is signed in
    if (!user) {
      // Redirect to sign-in page if not authenticated
      navigate("/login");
      return;
    }

    if (collected) {
      removeFromCollection(id);
    } else {
      addToCollection({ id, name, type, collectedAt: Date.now() });
      setShowAnimation(true);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-center rounded-full p-2 transition-all duration-300 ${
          collected
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-600"
        }`}
        aria-label={
          !user
            ? "Sign in to collect"
            : collected
              ? "Remove from collection"
              : "Add to collection"
        }
        title={
          !user
            ? "Sign in to collect places"
            : collected
              ? "Remove from collection"
              : "Add to collection"
        }
      >
        {collected ? (
          <HeartIcon className="h-5 w-5" />
        ) : (
          <HeartOutlineIcon className="h-5 w-5" />
        )}

        {/* Animation sparkles */}
        {showAnimation && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="h-8 w-8 animate-ping text-yellow-400" />
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative flex w-32 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-all duration-300 ${
        collected
          ? "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl"
          : "bg-white/90 text-gray-800 shadow-md hover:bg-white hover:text-red-600 hover:shadow-lg"
      }`}
      aria-label={
        !user
          ? "Sign in to collect"
          : collected
            ? "Remove from collection"
            : "Add to collection"
      }
      title={!user ? "Sign in to collect places" : undefined}
    >
      {collected ? (
        <>
          <HeartIcon className="h-5 w-5" />
          <span className="text-sm">Collected</span>
        </>
      ) : (
        <>
          <HeartOutlineIcon className="h-5 w-5" />
          <span className={!user ? "text-xs" : "text-sm"}>
            {!user ? "Sign in to Collect" : "Collect"}
          </span>
        </>
      )}

      {/* Animation sparkles */}
      {showAnimation && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SparklesIcon className="h-12 w-12 animate-ping text-yellow-400" />
        </div>
      )}
    </button>
  );
};

export default CollectButton;

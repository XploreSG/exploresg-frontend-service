import React from "react";
import { useAuth } from "../contexts/useAuth";
import { FaBookmark, FaRegHeart } from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Please sign in to view your profile.
          </h1>
        </div>
      </div>
    );
  }

  const fullName = [user.givenName, user.familyName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={user.picture || "/assets/default-avatar.png"}
              alt={fullName || user.email}
              className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover shadow-md"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-md text-gray-600">{user.email}</p>
              <div className="mt-2 flex items-center justify-center gap-4 sm:justify-start">
                <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column for Details */}
          <div className="md:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Your Details
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Phone:</strong> {user.phone || "Not provided"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {user.dateOfBirth || "Not provided"}
                </p>
                <p>
                  <strong>Driver's License:</strong>{" "}
                  {user.drivingLicenseNumber || "Not provided"}
                </p>
                <p>
                  <strong>Country:</strong>{" "}
                  {user.countryOfResidence || "Not provided"}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {user.preferredLanguage || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column for Bookmarks and Collections */}
          <div className="md:col-span-2">
            <div className="space-y-8">
              {/* Your Bookmarks Section */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <FaBookmark className="text-xl text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Bookmarks
                  </h2>
                </div>
                <div className="text-center text-gray-500">
                  <p>You haven't bookmarked any items yet.</p>
                  <p className="text-sm">
                    Explore rentals and attractions to save them here!
                  </p>
                </div>
              </div>

              {/* Your Collections Section */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <FaRegHeart className="text-xl text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Collections
                  </h2>
                </div>
                <div className="text-center text-gray-500">
                  <p>
                    Create collections of your favorite places and activities.
                  </p>
                  <button className="mt-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                    Create a New Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

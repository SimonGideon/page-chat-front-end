import { Breadcrumb, Loader, NavBar } from "@/components";
import { useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/lib";
import { ProfileActivities } from "./Profile/components";

const Profile = () => {
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const formattedDOB = user?.date_of_birth
    ? formatDate(user.date_of_birth)
    : "Not specified";
  const userExists = Boolean(user);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb />
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Sidebar - Full width on mobile, 1/3 on desktop */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col items-center">
                  <h3 className="mb-4 text-base sm:text-lg font-bold text-primaryAccent text-center">
                    Welcome Back{userExists ? `, ${user?.first_name}` : ""}!
                  </h3>

                  {userExists ? (
                    user?.avatar_url ? (
                      <div className="mb-4">
                        <img
                          src={user.avatar_url}
                          alt="User Avatar"
                          className="rounded-full h-24 w-24 sm:h-32 sm:w-32 object-cover border-4 border-gray-100"
                        />
                      </div>
                    ) : (
                      <div className="rounded-full h-20 w-20 sm:h-24 sm:w-24 bg-downy/10 border-2 border-downy flex items-center justify-center text-downy text-xl sm:text-2xl font-semibold mb-4">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </div>
                    )
                  ) : (
                    <div className="animate-pulse rounded-full h-24 w-24 sm:h-32 sm:w-32 bg-gray-200 mb-4" />
                  )}

                  {userExists && (
                    <div className="text-center mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {user?.first_name} {user?.last_name}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1 break-all">
                        {user?.email}
                      </p>
                    </div>
                  )}
                </div>

                <hr className="my-4 border-gray-200" />

                {userExists && (
                  <div className="mb-4 rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Date of Birth
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {formattedDOB}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Gender
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium capitalize">
                          {user?.gender || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Phone
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {user?.phone || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {userExists && (
                  <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Location
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Country
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {user?.country || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          City
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          {user?.city || "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-gray-500 mb-1">
                          Address
                        </span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium break-words">
                          {user?.address || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main content - Full width on mobile, 2/3 on desktop */}
            <div className="w-full lg:w-2/3">
              <ProfileActivities />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

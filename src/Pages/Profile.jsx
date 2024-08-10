import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/redux/features/authSlice";
import { Loader, NavBar, ProfileActivities } from "@/components";
import { formatDate } from "../lib";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user details when component mounts
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Check if user exists once
  const userExists = user !== null && user !== undefined;

  const formattedDOB = user ? formatDate(user.date_of_birth) : "";
  loading && <Loader />;
  error && <p className="text-red-500">Error: {error.message}</p>;
  return (
    <>
      <NavBar />
      <div className="container flex flex-col md:flex-row md:gap-10 bg-gray-100 min-h-screen shadow-lg p-8 ">
        <div className="bg-white rounded-xl w-full   md:w-1/3 shadow-lg p-6 mb-8 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg mt-3 text-downy font-bold mb-4">
              Welcome Back{userExists ? `, ${user && user.first_name}` : ""}!
            </h3>
            {userExists ? (
              user.avatar_url ? (
                <div className="flex flex-col items-center justify-center mb-4">
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="rounded-full h-32 w-32 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-full h-20 w-20 bg-gray-200 flex items-center justify-center text-downy text-xl font-semibold">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </div>
              )
            ) : (
              <div className=" animate-pulse rounded-full h-32 w-32 flex items-center justify-center text-2xl font-semibold text-gray-700">
                {" "}
              </div>
            )}

            {userExists && (
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-normal">
                  <span className=" text-slate-400 ">DOB:</span> {formattedDOB}{" "}
                  <br /> 13 🚀 Reads
                </p>
              </div>
            )}
          </div>
          <hr className="w-full border-gray-300 my-2" />
          {userExists && (
            <div className="w-full rounded-lg p-4 mb-3">
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-slate-400">Email:</span>
                {"  "}
                {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-slate-400">Phone:</span>
                {"  "}
                {user.phone}
              </p>
            </div>
          )}

          {userExists && (
            <div className="w-full rounded-lg p-2">
              <h3 className="text-lg font-semibold mb-2">
                Residence Information
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-slate-400">
                  Area of Stay:
                </span>{" "}
                {user.residence}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-slate-400">Town</span>
                {"  "}
                {user.city}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-slate-400">Home Church:</span>
                {"  "}
                {user.home_church}
              </p>
              <div className="relative flex flex-row gap-3 cursor-pointer justify-between items-center mt-6 text-center bg-slate-50 p-5 rounded-xl">
                <span className="absolute top-0 left-0 bg-downy text-white text-xs px-2 py-1 rounded-br-lg">
                  H.C Lead
                </span>
                <img
                  src="https://gravatar.com/avatar/bcda4739021bdf3112a19865f654683f?s=200&d=robohash&r=x"
                  alt="Home Church Lead"
                  className="rounded-full h-10 w-10 mx-auto mb-2"
                />
                <div className="text-sm text-left">
                  <p className="text-gray-800 font-semibold">Mercy Masika</p>
                  <p className="text-gray-600">
                    Zion Home Church <br /> (54 Members)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* profile activities*/}
        <ProfileActivities />
      </div>
    </>
  );
};

export default Profile;

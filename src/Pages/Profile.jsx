import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/redux/features/authSlice";
import { Loader, NavBar } from "@/components";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user details when component mounts
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Check if user exists once
  const userExists = user !== null && user !== undefined;
  loading && <Loader />;
  error && <p className="text-red-500">Error: {error.message}</p>;
  return (
    <>
      <NavBar />
      <div className="container flex flex-col md:flex-row md:gap-10 bg-gray-100 min-h-screen shadow-lg p-8 ">
        <div className="bg-white rounded-xl w-full   md:w-1/3 shadow-lg p-6 mb-8 flex flex-col items-center">
          <div>
            {userExists ? (
              user.avatar_url ? (
                <div className="flex flex-col items-center justify-center mb-4">
                  <h3 className="text-lg mt-3 text-downy font-bold mb-4">
                    Welcome Back{userExists ? `, ${user.first_name}` : ""}!
                  </h3>
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="rounded-full h-32 w-32 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-full h-32 w-32  flex items-center justify-center text-2xl font-semibold text-gray-700">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </div>
              )
            ) : (
              <div className="rounded-full h-32 w-32 flex items-center justify-center text-2xl font-semibold text-gray-700">
                N/A
              </div>
            )}
          </div>

          {userExists && (
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-500 mt-2">
                <span className="font-medium  ">DOB:</span> {user.date_of_birth}
              </p>
            </div>
          )}
          <hr className="w-full border-gray-300 my-4" />
          {userExists && (
            <div className="w-full rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> {user.phone}
              </p>
            </div>
          )}

          {userExists && (
            <div className="w-full rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">
                Residence Information
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Area of Stay:</span>{" "}
                {user.residence}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Town:</span> {user.city}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Home Church:</span>{" "}
                {user.home_church}
              </p>
              <div className="flex flex-row gap-3 cursor-pointer justify-between items-center mt-4 text-center bg-slate-200 p-3 rounded-xl">
                <img
                  src="https://gravatar.com/avatar/bcda4739021bdf3112a19865f654683f?s=200&d=robohash&r=x"
                  alt="Home Church Lead"
                  className="rounded-full h-10 w-10 mx-auto mb-2"
                />
                <div className="text-sm text-left">
                  <p className="text-gray-800 font-semibold">Mercy Masika</p>
                  <p className="text-gray-600">Zion Home Church (54 Members)</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Placeholder for user favorites */}
        <div className="bg-white rounded-xl shadow-lg w-full p-6">
          <h3 className="text-xl font-semibold mb-4">Favorites</h3>
          <p className="text-gray-600">
            User favorites will be displayed here.
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;

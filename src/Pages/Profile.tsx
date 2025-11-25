import { Loader, NavBar } from "@/components";
import { useAppSelector } from "@/redux/hooks";
import { formatDate } from "@/lib";
import { ProfileActivities } from "./Profile/components";

const Profile = () => {
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const formattedDOB = user?.date_of_birth
    ? formatDate(user.date_of_birth)
    : "";
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
      <div className="container flex min-h-screen flex-col gap-8 bg-[#faf3e1] p-8 md:flex-row md:gap-10">
        <div className="mb-8 flex w-full flex-col items-center rounded-2xl border border-[#e4d5bb] bg-[#fef9f0] p-6 shadow-sm md:w-1/3">
          <div className="flex flex-col items-center justify-center">
            <h3 className="mb-4 mt-3 text-lg font-bold text-primaryAccent">
              Welcome Back{userExists ? `, ${user?.first_name}` : ""}!
            </h3>
            {userExists ? (
              user?.avatar_url ? (
                <div className="flex flex-col items-center justify-center mb-4">
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="rounded-full h-32 w-32 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-full h-20 w-20 bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-normal">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </div>
              )
            ) : (
              <div className="animate-pulse rounded-full h-32 w-32 flex items-center justify-center text-2xl font-semibold text-gray-700" />
            )}

            {userExists && (
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-normal">
                  <span>DOB:</span> {formattedDOB} <br /> 13 🚀 Reads
                </p>
              </div>
            )}
          </div>
          <hr className="my-2 w-full border-[#eadfc8]" />
          {userExists && (
            <div className="mb-3 w-full rounded-2xl border border-[#eadfc8] bg-[#fff9ef] p-4">
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <p className="text-gray-500 mb-1">
                <span className="font-medium text-slate-400">Email:</span>{" "}
                {user?.email}
              </p>
              <p className="text-gray-500">
                <span className="font-medium text-slate-400">Phone:</span>{" "}
                {user?.phone}
              </p>
            </div>
          )}

          {userExists && (
            <div className="w-full rounded-2xl border border-[#eadfc8] bg-[#fff9ef] p-4">
              <h3 className="text-lg font-semibold mb-2">
                Residence Information
              </h3>
              <p className="text-gray-500 mb-1">
                <span className="font-medium text-slate-400">
                  Area of Stay:
                </span>{" "}
                {user?.residence}
              </p>
              <p className="text-gray-500 mb-1">
                <span className="font-medium text-slate-400">Town</span>{" "}
                {user?.city}
              </p>
              <p className="text-gray-500">
                <span className="font-medium text-slate-400">Home Church:</span>{" "}
                {user?.home_church}
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
                  <p className="text-gray-500">
                    Zion Home Church <br /> (54 Members)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <ProfileActivities />
      </div>
    </>
  );
};

export default Profile;

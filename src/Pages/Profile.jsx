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
  return (
    <>
      <NavBar />
      <div className="container">
        {loading && <Loader />}
        {error && <p>Error: {error.message}</p>}
        {user && <h2>Welcome, {user.first_name}</h2>}
        <h2>Welcome</h2>
      </div>
    </>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader, NavBar, HappyBirthday } from "@/components";

const UserDashboard = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    if (user && user.date_of_birth) {
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const userBirthday = new Date(user.date_of_birth)
        .toISOString()
        .slice(0, 10);
      setIsBirthday(today === userBirthday);
    }
  }, [user]);

  return (
    <>
      {isBirthday && (
        <HappyBirthday
          onClose={() => setIsBirthday(false)}
          firstName={user && user.first_name}
        />
      )}
      <NavBar />
      <div>
        {loading && <Loader />}
        {error && <p>Error: {error.message}</p>}
        {user && (
          <>
            <h2>Welcome, {user.first_name}</h2>
            <p>Email: {user.email}</p>
          </>
        )}
      </div>
    </>
  );
};

export default UserDashboard;

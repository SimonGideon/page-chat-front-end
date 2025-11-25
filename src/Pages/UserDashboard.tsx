import { useEffect, useState } from "react";

import { HappyBirthday, Loader, NavBar } from "@/components";
import { useAppSelector } from "@/redux/hooks";

const UserDashboard = () => {
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    if (user?.date_of_birth) {
      const today = new Date().toISOString().slice(0, 10);
      const userBirthday = new Date(user.date_of_birth)
        .toISOString()
        .slice(0, 10);
      setIsBirthday(today === userBirthday);
    } else {
      setIsBirthday(false);
    }
  }, [user?.date_of_birth]);

  return (
    <>
      {isBirthday && user && (
        <HappyBirthday
          onClose={() => setIsBirthday(false)}
          firstName={user.first_name}
        />
      )}
      <NavBar />
      <div>
        {loading && <Loader />}
        {error && <p>Error: {error}</p>}
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

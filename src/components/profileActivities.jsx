const ProfileActivities = () => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg w-full p-6">
        {/* activity nav */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ul className="flex gap-5">
              <li>Favorite</li>
              <li>Notifications</li>
              <li>Reviews</li>
              <li>Engaugements</li>
              <li>Settings</li>
            </ul>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Favorites</h3>
        <p className="text-gray-600">User favorites will be displayed here.</p>
      </div>
    </>
  );
};

export default ProfileActivities;

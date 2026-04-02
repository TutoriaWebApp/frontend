import React from "react";
import { GetUserData } from "../../../../packages/services/src/user";

export default function Dashboard() {
  const fetchUserData = async () => {
    const results = await GetUserData();

    console.log(results);
  };

  fetchUserData();

  return (
    <div>
      <p>perfil</p>
    </div>
  );
}

import React from "react";

import { EvaluateUserModal } from "@repo/ui/Modals/EvaluateUser/EvaluateUser";

export default function Dashboard(): React.ReactNode {
  return (
    <>
      <div>
        <p>dashboard</p>
      </div>
      <EvaluateUserModal 
        isOpen={true} 
        userName="Xande Picudo" 
        isTutor={false} 
        sessionSubject="Matemática"
        day="19/04/2000"
        time="14:00"
      />
    </>
  );
}

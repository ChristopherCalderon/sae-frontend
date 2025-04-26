import React from "react";

function OrganizationCard({ org, pendingOrg, handleSelected }) {
  return (
    <div
      
      className="bg-background w-full h-24 shadow-md rounded-md py-5 px-8 text-primary flex justify-between items-center gap-2  "
      disabled={pendingOrg === org.orgName}
    >
      <div>
        <h1 className="text-xl font-bold">{org.orgName} </h1>
        <p className="font-medium">Rol: {org.role}</p>
      </div>
      <button onClick={() => handleSelected(org.orgName, org.orgId, org.role)}
      className="flex items-center text-white px-5 py-2 justify-center gap-2 bg-primary hover:bg-primary-hover rounded">
        Acceder
      </button>
      {pendingOrg === org.orgName && "..."}
    </div>
  );
}

export default OrganizationCard;

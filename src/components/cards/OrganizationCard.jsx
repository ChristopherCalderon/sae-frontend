import React from "react";

function OrganizationCard({ org, pendingOrg, handleSelected }) {
  const getFontSize = (text) => {
    const length = text?.length || 0;

    if (length > 50) return "text-sm"; 
    if (length > 40) return "text-base"; 
    if (length > 30) return "text-lg"; 
    return "text-xl"; 
  };
  const fontSizeClass = getFontSize(org.orgName);

  return (
    <div
      className="bg-white w-full h-42 rounded-md p-4 text-primary flex flex-col justify-center gap-5 shadow-[0px_8px_8px_rgba(0,0,0,0.25)]  "
      disabled={pendingOrg === org.orgName}
    >
      <div className="flex flex-col gap-1">
        <div className="bg-white border-2 border-secondary  py-1 px-4 w-fit rounded-lg font-semibold text-sm text-secondary text-center">
          {org.role}
        </div>
        <h1 className={`${fontSizeClass} font-bold break-words whitespace-normal`}>
          {org.orgName}
        </h1>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={() => handleSelected(org.orgName, org.orgId, org.role)}
          className="w-24 flex items-center  text-white px-5 py-2 justify-center gap-2 bg-secondary hover:bg-primary-hover rounded-xl font-semibold"
        >
          Acceder
        </button>
      </div>

      {pendingOrg === org.orgName && "..."}
    </div>
  );
}

export default OrganizationCard;

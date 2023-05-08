import { useEffect, useState } from "react";

import data from "./data/organisations.json";

export default function App() {
  const [organisations, setOrganisations] = useState([]);
  const [categories, setCategories] = useState([]);

  // async function fetchData() {
  //   try {
  //     const serverResponse = await fetch("data/organisation.json", {
  //       method: "GET",
  //     });

  //     if (serverResponse.status == 200) {
  //       const json = await serverResponse.json();

  //       console.log(json);
  //       setOrganisations(json);
  //     } else {
  //       handleOpenToast({
  //         type: "error",
  //         info: "A server error occurred whilst fetching data.",
  //       });
  //     }
  //   } catch (error) {
  //     handleOpenToast({
  //       type: "error",
  //       info: "An error occurred whilst trying to connect to server.",
  //     });
  //   }
  // }

  useEffect(() => {
    // fetchData();
    setOrganisations(data);
    // console.log(organisations);
  }, []);

  return (
    <>
      {organisations.map((organisation) => (
        <div key={organisation.id}>
          <h2>{organisation.name}</h2>
          <ul>
            <li>
              <strong>Description:</strong> {organisation.description}
            </li>
            <li>
              <strong>Contact First Name:</strong>{" "}
              {organisation.contactFirstName}
            </li>
            <li>
              <strong>Contact Last Name:</strong> {organisation.contactLastName}
            </li>
            <li>
              <strong>Contact Email:</strong> {organisation.contactEmail}
            </li>
            <li>
              <strong>Contact Telephone:</strong> {organisation.contactTel}
            </li>
            {organisation.webUrl && (
              <li>
                <strong>Website URL:</strong> {organisation.webUrl}
              </li>
            )}
            {organisation.facebookUrl && (
              <li>
                <strong>Facebook URL:</strong> {organisation.facebookUrl}
              </li>
            )}
            {organisation.instagramUrl && (
              <li>
                <strong>Instagram URL:</strong> {organisation.instagramUrl}
              </li>
            )}
            {organisation.linkedInUrl && (
              <li>
                <strong>LinkedIn URL:</strong> {organisation.linkedInUrl}
              </li>
            )}
            {organisation.references && (
              <li>
                <strong>References:</strong> {organisation.references}
              </li>
            )}
            {organisation.lookingFor && (
              <li>
                <strong>Looking For:</strong> {organisation.lookingFor}
              </li>
            )}
            <li>
              <strong>Address:</strong> {organisation.address}
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}

import { useEffect, useState } from "react";

import data from "./data/organisations.json";

import GMap from "./components/GMap";

const categories = [
  "Industrija",
  "Umjetnost",
  "Organizacija",
  "Fourth category",
];

export default function App() {
  const [organisations, setOrganisations] = useState([]);
  const [activeCategories, setActiveCategories] = useState(categories);

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
    // console.log(activeCategories);
  }, []);

  return (
    <>
      {/* TODO: Add title of app on top of map */}

      {/* TODO: Add multi-option filter by category for organisations */}
      {/* TODO: Add search by organisation name */}

      {/* TODO: Login to have access to add organisation form */}
      {/* TODO: Add button to open form modal etc. */}
      {/* TODO: Add logos to organisations */}
      {/* TODO: Add button to export all organisations */}

      {/* TODO: DEPLOY */}

      <GMap organisations={organisations} />
    </>
  );
}

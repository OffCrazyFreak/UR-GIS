import {
  useMediaQuery,
  Box,
  Typography,
  ButtonGroup,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  Search as SearchIcon,
  PinDrop as PinDropIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  CloudDownload as CloudDownloadIcon,
} from "@material-ui/icons";

import { useEffect, useState } from "react";

import data from "./data/organizations.json";

import GMap from "./components/GMap";

const workDomains = ["Science", "Technology", "Ecology", "Art", "Crafts"];
const legalStatuses = ["For-profit", "Non-profit", "Individual"];

export default function App() {
  const [organizations, setOrganizations] = useState([]);

  const [visibleOrganizations, setVisibleOrganizations] = useState([]);

  const [activeWorkDomains, setActiveWorkDomains] = useState(workDomains);
  const [activeLegalStatuses, setActiveLegalStatuses] = useState(legalStatuses);

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(true);

  const mqSub600 = useMediaQuery("(max-width: 600px)");

  // async function fetchData() {
  //   try {
  //     const serverResponse = await fetch("data/organization.json", {
  //       method: "GET",
  //     });

  //     if (serverResponse.status == 200) {
  //       const json = await serverResponse.json();

  //       console.log(json);
  //       setOrganizations(json);
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
    setOrganizations(data);
  }, []);

  useEffect(() => {
    setVisibleOrganizations(
      organizations.filter((organization) => {
        const organizationWorkDomains = [];

        if (organization.isWorkDomainScience) {
          organizationWorkDomains.push("Science");
        }
        if (organization.isWorkDomainTechnology) {
          organizationWorkDomains.push("Technology");
        }
        if (organization.isWorkDomainEcology) {
          organizationWorkDomains.push("Ecology");
        }
        if (organization.isWorkDomainArt) {
          organizationWorkDomains.push("Art");
        }
        if (organization.isWorkDomainCrafts) {
          organizationWorkDomains.push("Crafts");
        }

        return (
          activeWorkDomains.some((workDomain) =>
            organizationWorkDomains.includes(workDomain)
          ) && activeLegalStatuses.includes(organization.legalStatus)
        );
      })
    );
  }, [organizations, activeWorkDomains, activeLegalStatuses]);

  return (
    <Box
      style={{
        marginInline: "3%",

        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 1000,
      }}
    >
      {/* TODO: Login to have access to add organization form */}
      {/* TODO: Add logos to organizations */}
      {/* TODO: Organization form modal etc. */}
      {/* TODO: Edit and delete organization button functionality */}
      {/* TODO: Export organizations functionality */}

      {/* TODO: DEPLOY */}

      <Typography variant="h2" align="center">
        Restorative Practices Creative Cluster
      </Typography>

      <Box
        style={{
          marginBlock: 16,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexDirection: mqSub600 ? "column" : "row",
        }}
      >
        <Button
          variant="contained"
          startIcon={<PinDropIcon />}
          // href="#"
          // target="_blank"
        >
          Apply
        </Button>

        {userIsLoggedIn && (
          <ButtonGroup
            variant="contained"
            orientation={mqSub600 ? "vertical" : "horizontal"}
          >
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => {
                // TODO:
                // setOrganization();
                // setOpenFormModal(true);
              }}
            >
              Add organization
            </Button>

            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                // TODO: connect to database a download json and csv
              }}
            >
              Export organizations
            </Button>
          </ButtonGroup>
        )}

        <Button
          variant="contained"
          startIcon={!userIsLoggedIn ? <LockOpenIcon /> : <LockIcon />}
          onClick={() => {
            setUserIsLoggedIn(!userIsLoggedIn ? true : false);
          }}
        >
          {!userIsLoggedIn ? "Login" : "Logout"}
        </Button>
      </Box>

      <Box
        style={{
          marginBlock: 16,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexDirection: mqSub600 ? "column" : "row",
        }}
      >
        <TextField
          label="Search organizations"
          size="small"
          variant="filled"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth={mqSub600}
          style={{ flex: 1 }}
          onChange={(e) =>
            setVisibleOrganizations(
              organizations.filter((item) => {
                if (e.target.value)
                  return item.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase());
                else return true;
              })
            )
          }
        />

        <FormControl
          size="small"
          variant="filled"
          fullWidth={mqSub600}
          style={{ flex: 1 }}
        >
          <InputLabel>Legal statuses</InputLabel>

          <Select
            multiple
            value={activeLegalStatuses}
            onChange={(e) => {
              setActiveLegalStatuses(e.target.value);
            }}
            renderValue={(selected) => selected.join(", ")}
          >
            {legalStatuses.map((legalStatus, index) => (
              <MenuItem key={index} value={legalStatus}>
                {legalStatus}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          variant="filled"
          fullWidth={mqSub600}
          style={{ flex: 1 }}
        >
          <InputLabel>Work domains</InputLabel>

          <Select
            multiple
            value={activeWorkDomains}
            onChange={(e) => {
              setActiveWorkDomains(e.target.value);
            }}
            renderValue={(selected) => selected.join(", ")}
          >
            {workDomains.map((workDomain, index) => (
              <MenuItem key={index} value={workDomain}>
                {workDomain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        style={{
          position: "relative",
          // maxHeight: "50%",
          height: "100%",
          // marginBottom: 50,
        }}
      >
        <GMap
          visibleOrganizations={visibleOrganizations}
          setOrganizations={setOrganizations}
        />
      </Box>

      <Box
        style={{
          height: 50,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="p"
          style={{
            fontStyle: "italic",
            color: "#ccc",
            width: 150,
            maxWidth: "30%",
          }}
        >
          Restorative Practices project Ref. Ares (2022) 6461361
        </Typography>

        <img
          src={require("./img/rp.png")}
          alt="Restorative practices logo"
          style={{ width: 150, maxWidth: "30%" }}
        />

        <img
          src={require("./img/eu_flag.png")}
          alt="EU Flag Creative Europe"
          style={{ width: 150, maxWidth: "30%" }}
        />
      </Box>
    </Box>
  );
}

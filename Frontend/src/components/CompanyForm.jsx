import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  Autocomplete,
  MenuItem,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState, useContext, useEffect } from "react";

import ToastContext from "../../context/ToastContext";

import TextInput from "./partial/TextInput";

const abcCategories = [
  { value: "Unknown", label: "Unknown" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

const months = [
  { value: "Unknown", label: "Unknown" },
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export default function CompanyForm({
  company,
  openModal,
  setOpenModal,
  populateCompanies,
}) {
  const { handleOpenToast } = useContext(ToastContext);

  const [existingCompanies, setExistingCompanies] = useState([]);
  const [countriesFromAPI, setCountriesFromAPI] = useState([]);
  // const [townsFromAPI, setTownsFromAPI] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const [name, setName] = useState();
  const [sector, setSector] = useState();
  const [abcCategorization, setAbcCategorization] = useState();
  const [budgetPlanningMonth, setBudgetPlanningMonth] = useState();
  const [country, setCountry] = useState();
  // const [townName, setTownName] = useState();
  const [zipCode, setZipCode] = useState();
  const [address, setAddress] = useState();
  const [url, setUrl] = useState();
  const [description, setDescription] = useState();
  const [contactInFuture, setContactInFuture] = useState();

  const [nameIsValid, setNameIsValid] = useState(false);
  const [sectorIsValid, setSectorIsValid] = useState();
  const [abcCategorizationIsValid, setAbcCategorizationIsValid] = useState();
  const [budgetPlanningMonthIsValid, setBudgetPlanningMonthIsValid] =
    useState();
  const [countryIsValid, setCountryIsValid] = useState(false);
  // const [townNameIsValid, setTownNameIsValid] = useState(false);
  const [zipCodeIsValid, setZipCodeIsValid] = useState(false);
  const [addressIsValid, setAddressIsValid] = useState(false);
  const [urlIsValid, setUrlIsValid] = useState(false);
  const [descriptionIsValid, setDescriptionIsValid] = useState(false);
  const [contactInFutureIsValid, setContactInFutureIsValid] = useState(true);

  async function fetchExistingCompanies() {
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("http://localhost:8080/companies/", {
        method: "GET",
        headers: { googleTokenEncoded: JWToken.credential },
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setExistingCompanies(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies for Sector input field.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }
  async function fetchCountriesFromAPI() {
    try {
      const serverResponse = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2",
        {
          method: "GET",
        }
      );

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setCountriesFromAPI(json);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies for Country input field.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }
  async function fetchTownsFromAPI(inputValue) {
    try {
      const serverResponse = await fetch(
        "http://api.geonames.org/postalCodeSearchJSON?maxRows=250&username=crazyfreak" +
          "&placename_startsWith=" +
          encodeURIComponent(inputValue || " ") +
          "&country=" +
          encodeURIComponent(
            countriesFromAPI.find((c) => c.name.common === country)?.cca2 || ""
          ),
        {
          method: "GET",
        }
      );

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json.postalCodes);
        setTownsFromAPI(json.postalCodes);
      } else {
        handleOpenToast({
          type: "error",
          info: "A server error occurred whilst fetching companies for Town input field.",
        });
      }
    } catch (error) {
      handleOpenToast({
        type: "error",
        info: "An error occurred whilst trying to connect to server.",
      });
    }
  }

  async function submit() {
    if (
      !nameIsValid ||
      !sectorIsValid ||
      !abcCategorizationIsValid ||
      !budgetPlanningMonthIsValid ||
      !countryIsValid ||
      // !townNameIsValid ||
      !zipCodeIsValid ||
      !addressIsValid ||
      !descriptionIsValid ||
      !contactInFutureIsValid
    ) {
      return;
    }

    setLoadingButton(true);
    const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;
    const companyData = {
      name: name.trim(),
      domain: sector.trim(),
      abcCategory:
        abcCategorization === abcCategories[0].value
          ? null
          : abcCategorization.toUpperCase(),
      budgetPlanningMonth:
        budgetPlanningMonth === months[0].value
          ? null
          : budgetPlanningMonth.toUpperCase(),
      country: country,
      // townName: townName,
      zipCode: zipCode,
      address: address,
      webUrl: url,
      description: description,
      contactInFuture: contactInFuture,
    };

    const request = {
      method: company ? "PUT" : "POST",
      headers: {
        googleTokenEncoded: JWToken.credential,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    };

    const serverResponse = await fetch(
      `http://localhost:8080/companies/${company?.id ?? ""}`,
      request
    );

    if (serverResponse.ok) {
      handleOpenToast({
        type: "success",
        info:
          "Company " +
          companyData.name +
          " " +
          (company ? "updated" : "added") +
          ".",
      });

      setOpenModal(false);
      populateCompanies();
    } else if (serverResponse.status === 400) {
      handleOpenToast({
        type: "error",
        info: "Invalid company details.",
      });
    } else if (serverResponse.status === 403) {
      handleOpenToast({
        type: "error",
        info: "FR responsible privileges are required for manipulating companies.",
      });
    } else if (serverResponse.status === 404) {
      handleOpenToast({
        type: "error",
        info: "Company with id " + company.id + " does not exist.",
      });
    } else {
      handleOpenToast({
        type: "error",
        info:
          "An unknown error occurred whilst trying to " +
          (company ? "update" : "add") +
          " company.",
      });
    }

    setLoadingButton(false);
  }

  useEffect(() => {
    setName(company?.name);
    setSector(company?.domain);
    setAbcCategorization(company?.abcCategorization || abcCategories[0].value);
    setBudgetPlanningMonth(company?.budgetMonth || months[0].value);
    setCountry(company?.country);
    // setTown(company?.townName);
    setZipCode(company?.zipCode);
    setAddress(company?.address);
    setUrl(company?.url);
    setDescription(company?.description);
    setContactInFuture(company?.contactInFuture || true);

    setNameIsValid(company ? true : false);
    setSectorIsValid(company ? true : false);
    setAbcCategorizationIsValid(true);
    setBudgetPlanningMonthIsValid(true);
    setCountryIsValid(company ? true : false);
    // setTownNameIsValid(company ? true : false);
    setZipCodeIsValid(company ? true : false);
    setAddressIsValid(company ? true : false);
    setUrlIsValid(true);
    setDescriptionIsValid(true);
    setContactInFutureIsValid(true);

    fetchExistingCompanies();
    fetchCountriesFromAPI();
    // fetchTownsFromAPI();
  }, [openModal]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        // submit on Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        // close on Escape key
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Fade in={openModal}>
          <FormControl
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",

              maxWidth: "95%",
              width: "30rem",

              maxHeight: "95%",

              borderRadius: "1.5rem",
              padding: "1rem",

              backgroundColor: "whitesmoke",
              boxShadow: "#666 2px 2px 8px",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {!company ? "Add company" : "Update company"}
            </Typography>

            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <TextInput
                labelText={"Company name"}
                placeholderText={"Vision <O>"}
                isRequired
                helperText={{
                  error: "Company name must be between 2 and 35 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 35 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 35;
                }}
                value={name}
                setValue={setName}
                valueIsValid={nameIsValid}
                setValueIsValid={setNameIsValid}
              ></TextInput>

              <Autocomplete
                options={existingCompanies
                  .map((company) => company.domain)
                  .filter(
                    (domain, index, array) => array.indexOf(domain) === index
                  )
                  .sort((a, b) => {
                    return a.localeCompare(b);
                  })}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                clearOnEscape
                openOnFocus
                freeSolo
                inputValue={sector || ""}
                onInputChange={(event, value) => {
                  setSector(value);
                  setSectorIsValid(value.length >= 2 && value.length <= 35);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sector"
                    placeholder="IT"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              <TextField
                label="ABC categorization"
                fullWidth
                select
                margin="dense"
                helperText={
                  !abcCategorizationIsValid && "Invalid ABC categorization"
                }
                value={abcCategorization}
                error={!abcCategorizationIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setAbcCategorizationIsValid(
                    abcCategories
                      .map((category) => category.value)
                      .includes(input)
                  );

                  setAbcCategorization(input);
                }}
              >
                {abcCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Budget planning month"
                fullWidth
                select
                margin="dense"
                helperText={
                  !budgetPlanningMonthIsValid && "Invalid budget planning month"
                }
                value={budgetPlanningMonth}
                error={!budgetPlanningMonthIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setBudgetPlanningMonthIsValid(
                    months.map((month) => month.value).includes(input)
                  );

                  setBudgetPlanningMonth(input);
                }}
              >
                {months.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                options={countriesFromAPI
                  .map((country) => country.name.common)
                  .concat(existingCompanies.map((company) => company.country))
                  .filter(
                    (country, index, array) => array.indexOf(country) === index
                  )
                  .sort((a, b) => {
                    return a.localeCompare(b);
                  })}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                clearOnEscape
                openOnFocus
                freeSolo
                inputValue={country || ""}
                onInputChange={(event, value) => {
                  setCountry(value);
                  setCountryIsValid(value.length >= 4 && value.length <= 56);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    placeholder="Croatia"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              />

              {/* TODO: Replace zip (and town entity) with townName on backend then use this */}
              {/* <Autocomplete
                options={townsFromAPI
                  .map((town) => town.placeName)
                  .filter(
                    (placeName, index, array) =>
                      array.indexOf(placeName) === index
                  )
                  .sort((a, b) => {
                    return a.localeCompare(b);
                  })}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                clearOnEscape
                openOnFocus
                freeSolo
                inputValue={townName || ""}
                onInputChange={(event, value) => {
                  setTownName(value);
                  if (country === "")
                    setCountry(
                      countriesFromAPI.find(
                        (c) =>
                          c.cca2 ===
                          townsFromAPI.find(
                            (town) => town.placeName === value
                          )?.countryCode
                      )?.name.common || ""
                    ); // set country based on chosen town
                  fetchCitiesFromAPI(value);
                  // setTownIsValid(value.length >= 2 && value.length <= 115);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Town"
                    placeholder="El Pueblo de Nuestra Senora, Reina de los Angeles del Rio Porciuncula"
                    required
                    fullWidth
                    margin="dense"
                  />
                )}
              /> */}
              <TextInput
                labelText={"Postal (ZIP) code"}
                isRequired
                inputType={"number"}
                placeholderText={"51300"}
                helperText={{
                  error: "Postal (ZIP) code must be between 1 and 999999",
                  details: "",
                }}
                inputProps={{
                  min: 1,
                  max: 999999,
                  minLength: 1,
                  maxLength: 6,
                }}
                validationFunction={(input) => {
                  return (
                    input >= 1 &&
                    input <= 999999 &&
                    input.length >= 1 &&
                    input.length <= 6
                  );
                }}
                value={zipCode}
                setValue={setZipCode}
                valueIsValid={zipCodeIsValid}
                setValueIsValid={setZipCodeIsValid}
              ></TextInput>

              <TextInput
                labelText={"Address"}
                isRequired
                helperText={{
                  error: "Address must be between 2 and 115 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 115 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 115;
                }}
                value={address}
                setValue={setAddress}
                valueIsValid={addressIsValid}
                setValueIsValid={setAddressIsValid}
              ></TextInput>

              <TextInput
                labelText={"Webpage URL"}
                helperText={{
                  error: "Invalid Webpage URL",
                  details: "",
                }}
                placeholderText={"best.hr"}
                inputProps={{ maxLength: 55 }}
                validationFunction={(input) => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?" + // validate protocol
                      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                      "(\\#[-a-z\\d_]*)?$",
                    "i"
                  ); // validate fragment locator

                  return (
                    input === "" ||
                    (input.length <= 55 && urlPattern.test(input))
                  );
                }}
                value={url}
                setValue={setUrl}
                valueIsValid={urlIsValid}
                setValueIsValid={setUrlIsValid}
              ></TextInput>

              <TextInput
                labelText={"Description"}
                textFieldProps={{
                  multiline: true,
                  minRows: 2,
                  maxRows: 5,
                }}
                helperText={{
                  error: "Description must be under 475 characters",
                  details: "",
                }}
                inputProps={{ maxLength: 475 }}
                validationFunction={(input) => {
                  return input.length <= 475;
                }}
                value={description}
                setValue={setDescription}
                valueIsValid={descriptionIsValid}
                setValueIsValid={setDescriptionIsValid}
              ></TextInput>

              <FormLabel component="legend">Contact in future</FormLabel>
              <RadioGroup
                name="Contact in future"
                required
                row
                value={contactInFuture === true ? "Yes" : "No"}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input === "Yes") {
                    setContactInFuture(true);
                  } else {
                    setContactInFuture(false);
                  }
                }}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box
              sx={{
                marginBlock: "3%",

                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                onClick={submit}
                loading={loadingButton}
                disabled={
                  !(
                    nameIsValid &&
                    sectorIsValid &&
                    abcCategorizationIsValid &&
                    budgetPlanningMonthIsValid &&
                    countryIsValid &&
                    // townNameIsValid &&
                    zipCodeIsValid &&
                    addressIsValid &&
                    urlIsValid &&
                    contactInFutureIsValid
                  )
                }
              >
                {/* span needed because of bug */}
                <span>{!company ? "Add company" : "Update company"}</span>
              </LoadingButton>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}

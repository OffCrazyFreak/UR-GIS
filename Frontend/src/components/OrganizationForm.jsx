import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  Box,
  Checkbox,
  FormGroup,
  FormHelperText,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

import { useState, useEffect } from "react";

import { Map, GoogleApiWrapper } from "google-maps-react";

import CustomTextField from "./partial/CustomTextField";

const workDomains = ["Science", "Technology", "Ecology", "Art", "Crafts"];
const legalStatuses = ["For-profit", "Non-profit", "Individual"];

const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneNumberPattern = /^\+\d{1,3}\s?\d{1,14}$/;
const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$",
  "i"
);

function OrganizationForm({
  google,
  organization,
  openModal,
  setOpenModal,
  fetchOrganizations,
}) {
  const [formData, setFormData] = useState({
    entity: {
      name: null,
      description: null,
      contactName: null,
      contactEmail: null,
      contactTel: null,
      references: null,
      lookingFor: null,
      address: null,
      foundAddress: null,
      webUrl: null,
      instagramUrl: null,
      facebookUrl: null,
      twitterUrl: null,
      linkedInUrl: null,
      legalStatus: null,
      workDomainIncludesScience: false,
      workDomainIncludesTechnology: false,
      workDomainIncludesEcology: false,
      workDomainIncludesArt: false,
      workDomainIncludesCrafts: false,
    },
    validation: {
      nameIsValid: false,
      descriptionIsValid: false,
      contactNameIsValid: false,
      contactEmailIsValid: false,
      contactTelIsValid: false,
      referencesIsValid: true,
      lookingForIsValid: true,
      addressIsValid: false,
      webUrlIsValid: true,
      instagramUrlIsValid: true,
      facebookUrlIsValid: true,
      twitterUrlIsValid: true,
      linkedInUrlIsValid: true,
      legalStatusIsValid: true,
      workDomainIsValid: true,
    },
  });

  async function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean); // all validation rules are fulfilled

    if (!formIsValid) {
      return;
    }

    // Object destructuring for organization data from formData.entity
    const {
      name,
      description,
      contactName,
      contactEmail,
      contactTel,
      references,
      lookingFor,
      foundAddress, // This is the geocoded address
      webUrl,
      instagramUrl,
      facebookUrl,
      twitterUrl,
      linkedInUrl,
      legalStatus,
      workDomainIncludesScience,
      workDomainIncludesTechnology,
      workDomainIncludesEcology,
      workDomainIncludesArt,
      workDomainIncludesCrafts,
    } = formData.entity;

    const organizationData = {
      name: name?.trim(),
      description: description?.trim(),
      contactName: contactName?.trim(),
      contactEmail: contactEmail?.trim(),
      contactTel: contactTel?.trim(),
      references: references?.trim(),
      lookingFor: lookingFor?.trim(),
      address: foundAddress, // Use the geocoded address
      webUrl: webUrl?.trim(),
      instagramUrl: instagramUrl?.trim(),
      facebookUrl: facebookUrl?.trim(),
      twitterUrl: twitterUrl?.trim(),
      linkedInUrl: linkedInUrl?.trim(),
      legalStatus: legalStatus,
      workDomainIncludesScience,
      workDomainIncludesTechnology,
      workDomainIncludesEcology,
      workDomainIncludesArt,
      workDomainIncludesCrafts,
    };

    const request = {
      method: organization ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    };

    try {
      const serverResponse = await fetch(
        "/api/organizations" + (organization ? "/" + organization.id : ""),
        request
      );

      if (serverResponse.ok) {
        console.log(
          "Organization " +
            organizationData.name +
            " " +
            (organization ? "updated" : "added") +
            "."
        );

        fetchOrganizations();
        setOpenModal(false);
      } else if (serverResponse.status === 400) {
        console.error("Invalid organization details.");
      } else if (serverResponse.status === 403) {
        console.error(
          "Admin privileges are required for manipulating organizations."
        );
      } else if (serverResponse.status === 404) {
        console.error(
          "Organization with ID " + organization.id + " does not exist."
        );
      } else {
        console.error(
          "An unknown error occurred whilst trying to " +
            (organization ? "update" : "add") +
            " organization."
        );
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    if (google) {
      const geocoder = new google.maps.Geocoder();

      const currentAddress = formData.entity.address?.trim();

      if (currentAddress?.length < 2) {
        // Address is empty, reset foundAddress and addressIsValid states
        setFormData((prevFormData) => ({
          ...prevFormData,
          entity: {
            ...prevFormData.entity,
            foundAddress: "",
          },
          validation: {
            ...prevFormData.validation,
            addressIsValid: false,
          },
        }));
      } else {
        // Perform geocoding request for non-empty address
        geocoder.geocode({ address: currentAddress }, (results, status) => {
          if (status === "OK") {
            // Handle geocoding result
            const location = results[0].formatted_address;
            setFormData((prevFormData) => ({
              ...prevFormData,
              entity: {
                ...prevFormData.entity,
                foundAddress: location,
              },
              validation: {
                ...prevFormData.validation,
                addressIsValid: true,
              },
            }));
          } else {
            setFormData((prevFormData) => ({
              ...prevFormData,
              validation: {
                ...prevFormData.validation,
                addressIsValid: false,
              },
            }));
          }
        });
      }
    }
  }, [formData.entity.address, google]);

  useEffect(() => {
    // Object destructuring for organization data
    const {
      name,
      description,
      contactName,
      contactEmail,
      contactTel,
      references,
      lookingFor,
      address,
      webUrl,
      instagramUrl,
      facebookUrl,
      twitterUrl,
      linkedInUrl,
      legalStatus,
      workDomainIncludesScience,
      workDomainIncludesTechnology,
      workDomainIncludesEcology,
      workDomainIncludesArt,
      workDomainIncludesCrafts,
    } = organization || {};

    console.log(organization);

    setFormData({
      entity: {
        name: name ?? null,
        description: description ?? null,
        contactName: contactName ?? null,
        contactEmail: contactEmail ?? null,
        contactTel: contactTel ?? null,
        references: references ?? null,
        lookingFor: lookingFor ?? null,
        address: address ?? null,
        foundAddress: address ?? null,
        webUrl: webUrl ?? null,
        instagramUrl: instagramUrl ?? null,
        facebookUrl: facebookUrl ?? null,
        twitterUrl: twitterUrl ?? null,
        linkedInUrl: linkedInUrl ?? null,
        legalStatus: legalStatus ?? legalStatuses[0],
        workDomainIncludesScience: workDomainIncludesScience ?? true,
        workDomainIncludesTechnology: workDomainIncludesTechnology ?? true,
        workDomainIncludesEcology: workDomainIncludesEcology ?? true,
        workDomainIncludesArt: workDomainIncludesArt ?? true,
        workDomainIncludesCrafts: workDomainIncludesCrafts ?? true,
      },
      validation: {
        nameIsValid: !!name,
        descriptionIsValid: !!description,
        contactNameIsValid: !!contactName,
        contactEmailIsValid: !!contactEmail,
        contactTelIsValid: !!contactTel,
        referencesIsValid: true,
        lookingForIsValid: true,
        addressIsValid: !!address,
        webUrlIsValid: true,
        instagramUrlIsValid: true,
        facebookUrlIsValid: true,
        twitterUrlIsValid: true,
        linkedInUrlIsValid: true,
        legalStatusIsValid: true,
        workDomainIsValid: true, // You might want to update this based on work domain logic
      },
    });
  }, [openModal, organization]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // submit on Enter key
            submit();
          } else if (e.key === "Escape") {
            // close on Escape key
            setOpenModal(false);
          }
        }}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Fade in={openModal}>
          <FormControl
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",

              maxWidth: "95%",
              width: "40rem",

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
              style={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {!organization ? "Add organization" : "Update organization"}
            </Typography>

            <Box
              style={{
                overflowY: "auto",
              }}
            >
              <CustomTextField
                labelText={"Organization Name"}
                isRequired
                placeholderText={"Vision <O>"}
                helperText={{
                  error:
                    "Organization name must be between 2 and 120 characters",
                  details: "",
                }}
                inputProps={{
                  name: "name", // This should match the key in your formData.entity
                  minLength: 2,
                  maxLength: 120,
                }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 120;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                isRequired
                labelText={"Description"}
                textFieldProps={{
                  multiline: true,
                  minRows: 3,
                  maxRows: 8,
                }}
                helperText={{
                  error: "Description must be between 2 and 2000 characters",
                  details: "",
                }}
                inputProps={{
                  name: "description", // This should match the key in your formData.entity
                  minLength: 2,
                  maxLength: 2000,
                }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 2000;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              {/* map needed for address geolocation */}
              <Box
                tabIndex="-1"
                style={{
                  display: "none",
                }}
              >
                <Map google={google} />
              </Box>

              <TextField
                label="Address"
                fullWidth
                variant="outlined"
                margin="dense"
                required
                placeholder="Street name and number, City, Country"
                value={formData.entity.address || ""}
                inputProps={{ minLength: 2, maxLength: 120 }}
                error={
                  !formData.validation.addressIsValid && formData.entity.address
                }
                helperText={
                  !formData.validation.addressIsValid && formData.entity.address
                    ? "Invalid address"
                    : formData.entity.foundAddress && (
                        <span style={{ fontSize: "1rem" }}>
                          {"Found address: " + formData.entity.foundAddress}
                        </span>
                      )
                }
                onChange={(e) => {
                  const { value } = e.target;
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    entity: {
                      ...prevFormData.entity,
                      address: value,
                    },
                    validation: {
                      ...prevFormData.validation,
                      addressIsValid: false, // Reset validation status when address changes
                    },
                  }));
                }}
              />

              <TextField
                label="Legal status"
                fullWidth
                select
                variant="outlined"
                margin="dense"
                helperText={
                  !formData.validation.legalStatusIsValid &&
                  "Invalid legal status"
                }
                value={formData.entity.legalStatus}
                error={!formData.validation.legalStatusIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    entity: {
                      ...prevFormData.entity,
                      legalStatus: input,
                    },
                    validation: {
                      ...prevFormData.validation,
                      legalStatusIsValid: legalStatuses.includes(input),
                    },
                  }));
                }}
                SelectProps={{
                  MenuProps: {
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                  },
                  renderValue: (selected) => selected,
                }}
              >
                {legalStatuses.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      paddingBlock: "0",
                    }}
                  >
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio
                          color="primary"
                          checked={formData.entity.legalStatus === option}
                        />
                      }
                      label={option}
                      labelPlacement="end"
                    />
                  </MenuItem>
                ))}
              </TextField>

              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel
                  style={{
                    background: "whitesmoke",
                    paddingInline: "8px",
                    marginLeft: "-8px",
                  }}
                >
                  Work domains
                </InputLabel>
                <Select
                  multiple
                  value={workDomains.filter(
                    (workDomain) =>
                      formData.entity["workDomainIncludes" + workDomain]
                  )}
                  onChange={(e) => {
                    const selectedOptions = e.target.value;
                    const updatedEntity = { ...formData.entity };

                    workDomains.forEach((workDomain) => {
                      updatedEntity["workDomainIncludes" + workDomain] =
                        selectedOptions.includes(workDomain);
                    });

                    setFormData({
                      ...formData,
                      entity: updatedEntity,
                      validation: {
                        ...formData.validation,
                        workDomainIsValid: selectedOptions.length > 0,
                      },
                    });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={{
                    getContentAnchorEl: null, // ensures that the menu is positioned relative to the select input
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left", // required
                    },
                  }}
                >
                  {workDomains.map((workDomain) => (
                    <MenuItem
                      key={workDomain}
                      value={workDomain}
                      style={{ paddingBlock: "0" }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          color="primary"
                          checked={
                            formData.entity["workDomainIncludes" + workDomain]
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          "Work domain includes " + workDomain.toLowerCase()
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!formData.validation.workDomainIsValid}>
                  {formData.validation.workDomainIsValid
                    ? "Select one or more work domains"
                    : "Select at least one work domain"}
                </FormHelperText>
              </FormControl>

              {/* contact fields */}
              <FormGroup>
                <CustomTextField
                  labelText={"Contact Name"}
                  placeholderText={"Jane Doe"}
                  isRequired
                  helperText={{
                    error: "Contact name must be between 2 and 120 characters",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactName",
                    minLength: 2,
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return input.length >= 2 && input.length <= 120;
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Contact Email"}
                  placeholderText={"jane.doe@example.com"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact email",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactEmail",
                    minLength: 2,
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input.length >= 2 &&
                      input.length <= 120 &&
                      emailPattern.test(input)
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Contact Tel"}
                  placeholderText={"+1234567890"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact tel",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactTel",
                    minLength: 2,
                    maxLength: 20,
                  }}
                  validationFunction={(input) => {
                    return (
                      input.length >= 2 &&
                      input.length <= 20 &&
                      phoneNumberPattern.test(input)
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />
              </FormGroup>

              <CustomTextField
                labelText={"References"}
                textFieldProps={{
                  multiline: true,
                  minRows: 1,
                  maxRows: 8,
                }}
                helperText={{
                  error: "References must be under 2000 characters",
                  details: "",
                }}
                inputProps={{
                  name: "references", // This should match the key in your formData.entity
                  maxLength: 2000,
                }}
                validationFunction={(input) => {
                  return input.length <= 2000;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Looking for"}
                textFieldProps={{
                  multiline: true,
                  minRows: 1,
                  maxRows: 8,
                }}
                helperText={{
                  error: "Looking for must be under 2000 characters",
                  details: "",
                }}
                inputProps={{
                  name: "lookingFor", // This should match the key in your formData.entity
                  maxLength: 2000,
                }}
                validationFunction={(input) => {
                  return input.length <= 2000;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              {/* urls */}
              <FormGroup>
                <CustomTextField
                  labelText={"Webpage URL"}
                  placeholderText={"https://restorativepractices.eu/"}
                  helperText={{
                    error: "Invalid Webpage URL",
                    details: "",
                  }}
                  inputProps={{
                    name: "webUrl",
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input === "" ||
                      (input.length <= 120 && urlPattern.test(input))
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Instagram URL"}
                  placeholderText={"https://www.instagram.com/"}
                  helperText={{
                    error: "Invalid Instagram URL",
                    details: "",
                  }}
                  inputProps={{
                    name: "instagramUrl",
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input === "" ||
                      (input.length <= 120 && urlPattern.test(input))
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Facebook URL"}
                  placeholderText={"https://www.facebook.com/"}
                  helperText={{
                    error: "Invalid Facebook URL",
                    details: "",
                  }}
                  inputProps={{
                    name: "facebookUrl",
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input === "" ||
                      (input.length <= 120 && urlPattern.test(input))
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Twitter URL"}
                  placeholderText={"https://www.twitter.com/"}
                  helperText={{
                    error: "Invalid Twitter URL",
                    details: "",
                  }}
                  inputProps={{
                    name: "twitterUrl",
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input === "" ||
                      (input.length <= 120 && urlPattern.test(input))
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"LinkedIn URL"}
                  placeholderText={"https://www.linkedin.com/"}
                  helperText={{
                    error: "Invalid LinkedIn URL",
                    details: "",
                  }}
                  inputProps={{
                    name: "linkedInUrl",
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return (
                      input === "" ||
                      (input.length <= 120 && urlPattern.test(input))
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />
              </FormGroup>
            </Box>

            <Box
              style={{
                marginBlock: "3%",

                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={submit}
                disabled={Object.values(formData.validation).some(
                  (value) => !value
                )}
              >
                {!organization ? "Add organization" : "Update organization"}
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAaCAGajZa5XI9XgOwsEM9sw2sxM0Oawkc",
})(OrganizationForm);

import React, { useState } from "react";
import { WantedReq, TypeToSearch } from "../types";
import AllInOne from "./allInOne";
import {
  Box,
  Container,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MySnackbar from "./snackbar";

const Search = () => {
  const [showPassword, setShowPassword] = useState(false);
  // useId is react hook to generate unique id
  // const identifier = useId();
  // const firstName = useId();
  // const lastName = useId();

  // holds value of input field
  // const [input, setinput] = useState(props?.value ?? "");
  const [input, setinput] = useState<TypeToSearch>({
    identifier: "",
    firstName: "",
    lastName: "",
    dob: "",
    provAcc: "",
    resultsList: [],
  });

  // const [searchQuery, setSearchQuery] = useState<String>("");

  // when false show search bar etc
  const [hasSearched, setHasSearched] = useState(false);

  // for snackbar
  const [snackBarOpen, setSnackbarOpen] = useState(false);

  // has user been cleared
  const [apiKey, setApiKey] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // these are typescript objects representing an ovation req
  // to be sent to main component for processing
  const [stateReqs, setStateReqs] = useState<WantedReq[]>([]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const getSearchQueryString = (): string => {
    let validFields = [];

    for (const [key, value] of Object.entries(input)) {
      if (value.length > 0) {
        // console.log(value);
        // query = `${key}={value}`;
        validFields.push({ key, value });
      }
    }
    console.log(validFields);

    let queryString = "";
    validFields.forEach((field) => {
      queryString += `${field.key}=${field.value}&`;
    });

    return queryString;
  };

  // to handle click of search button with input field value
  const handleSearchClick = async () => {
    // console.log(input);
    // console.log(getSearchQueryString());

    console.log(stateReqs.length);
    try {
      const response = await fetch(
        // `http://localhost:8000/search/${input.firstName}`,
        // `http://localhost:8000/search?${getSearchQueryString()}`,
        // `https://oah-1.herokuapp.com/search?${getSearchQueryString()}`,
        `/search?${getSearchQueryString()}`,
        {
          method: "GET",
          headers: {
            babyboi: `Bearer ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log(JSON.stringify(result.Requisitions[0].requisition, null, 2));

      // for every requistion in the repsonse, make a types/Requisition object
      // from it and add it to stateReqs.
      result.Requisitions.forEach((req: any, _: number) => {
        setStateReqs((previous) => [
          ...previous,
          {
            // requisition
            id: `${req.requisition.id}`,
            identifier: `${req.requisition.identifier}`,
            // labNotes: `${req.requisition.customAttributes.labNotes
            //     ? req.requisition.customAttributes.labNotes
            //     : null
            //   }`,
            lab_notes: `${req.requisition.customAttributes.lab_notes
                ? req.requisition.customAttributes.lab_notes
                : null
              }`,
            projectTemplateId: `${req.requisition.projectTemplateId}`,
            reqTemplate: `${req.requisition.template}`,
            sampCollDate: `${req.requisition.sampleCollectionDate}`,
            // requisition.providerAccount
            provAccId: `${req.requisition.providerAccount.id}`,
            provAccName: `${req.requisition.providerAccount.name}`,
            //requisition.samples
            // sampId: `${req.requisition.samples[0].id}`,
            // requisition.patient
            firstName: `${req.requisition.patient.firstName}`,
            lastName: `${req.requisition.patient.lastName}`,
            streetAddress: `${req.requisition.patient.streetAddress}`,
            city: `${req.requisition.patient.city}`,
            state: `${req.requisition.patient.state}`,
            zipCode: `${req.requisition.patient.zipCode}`,
            dob: `${req.requisition.patient.dateOfBirth}`,
            gender: `${req.requisition.patient.gender}`,
            race: `${req.requisition.patient.race}`,
            ethnicity: `${req.requisition.patient.ethnicity}`,
            // requisition.billingInformation.
            billTo: `${req.requisition.billingInformation.billTo}`,
            // requisition.billingInformation.insuranceInformations [{}]
            primInsurId: `${req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                  .idNumber
                : null
              }`,
            // primInsurType: `${
            //   req.requisition.billingInformation.insuranceInformations
            //     ? req.requisition.billingInformation.insuranceInformations[0]
            //         .insuranceType
            //     : null
            // }`,
            primInsurName: `${req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                  .insuranceProviderName
                : null
              }`,
          },
        ]);
      });

      // console.log(JSON.stringify(result.Requisitions, null, 2));
    } catch (err: any) {
      console.log("WOAH ERROR D:", err.message);
    } finally {
      console.log("finally clause");
    }

    // after fetch, set search state to true to trigger showing main component with grid and all
    setHasSearched(true);
    setinput({
      identifier: "",
      firstName: "",
      lastName: "",
      dob: "",
      provAcc: "",
      resultsList: [],
    });
  };

  const handleSubmitClick = async () => {
    try {
      const response = await fetch(`/auth`, {
        method: "GET",
        headers: {
          babyboi: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.code == 200) {
        setIsLoggedIn(true);
      } else {
        console.log("status code: ", result.code);
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      console.log("error submitting", err.message);
    } finally {
      console.log("finally clause");
    }
  };

  const handleInput = (event: any) => {
    // setinput((event.target as HTMLInputElement).value);
    // setinput({
    //   query: (event.target as HTMLInputElement).value,
    //   resultsList: [],
    // });

    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;

    setinput({
      ...input,
      [name]: value,
    });
  };

  const handleAPIKeyEntry = (event: any) => {
    setApiKey((event.target as HTMLInputElement).value);
  };

  return (
    <React.Fragment>
      <Container maxWidth={"lg"}>
        {isLoggedIn ? (
          <Box maxWidth="lg">
            {hasSearched ? (
              <AllInOne
                parentReturnReqs={stateReqs}
                parentSetReturnReqs={setStateReqs}
                parentHasSearchedState={setHasSearched}
                apiKey={apiKey}
              />
            ) : (
              <Stack
                spacing={1}
                paddingTop={"9%"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <TextField
                  type="search"
                  size="small"
                  label="identifier.."
                  // name={identifier}
                  name="identifier"
                  onInput={handleInput}
                />
                <TextField
                  type="search"
                  size="small"
                  label="first name.."
                  // name={firstName}
                  name="firstName"
                  onInput={handleInput}
                />
                <TextField
                  type="search"
                  size="small"
                  label="last name.."
                  // name={lastName}
                  name="lastName"
                  onInput={handleInput}
                />
                <TextField
                  type="search"
                  size="small"
                  label="yyyy-mm-dd.."
                  // name={lastName}
                  name="dob"
                  onInput={handleInput}
                />
                <TextField
                  type="search"
                  size="small"
                  label="provider acc. name.."
                  // name={lastName}
                  name="provAcc"
                  onInput={handleInput}
                />
                <Button variant="contained" onClick={handleSearchClick}>
                  Search
                </Button>
              </Stack>
            )}
          </Box>
        ) : (
          <Stack
            paddingTop={"9%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <TextField
              type={showPassword ? "text" : "password"}
              label="enter api key.."
              variant="outlined"
              size="small"
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onInput={handleAPIKeyEntry}
            />
            <Button variant="contained" onClick={handleSubmitClick}>
              submit
            </Button>
          </Stack>
        )}
        <MySnackbar
          parentIsOpen={snackBarOpen}
          parentSetIsOpen={setSnackbarOpen}
          message="Invalid Token"
          severity="warning"
        />
      </Container>
    </React.Fragment>
  );
};

export default Search;

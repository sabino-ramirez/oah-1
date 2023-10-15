import React, { useState } from "react";
import { WantedReq, TypeToSearch } from "../types";
import AllInOne from "./allInOne";
import {
  Button,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

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
    middleName: "",
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

  const toast = useToast();

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
    // console.log(stateReqs.length);

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
            lab_notes: `${
              req.requisition.customAttributes.lab_notes
                ? req.requisition.customAttributes.lab_notes
                : ""
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
            middleName: `${
              req.requisition.patient.middleName
                ? req.requisition.patient.middleName
                : ""
            }`,
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
            primBillTo: `${
              req.requisition.billingInformation.billTo
                ? req.requisition.billingInformation.billTo
                : ""
            }`,
            primGroupNum: `${
              req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                    .groupNumber
                  ? req.requisition.billingInformation.insuranceInformations[0]
                      .groupNumber
                  : ""
                : ""
            }`,
            primRTI: `${
              req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                    .relationshipToInsured
                  ? req.requisition.billingInformation.insuranceInformations[0]
                      .relationshipToInsured
                  : ""
                : ""
            }`,
            // requisition.billingInformation.insuranceInformations [{}]
            primInsurId: `${
              req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                    .idNumber
                  ? req.requisition.billingInformation.insuranceInformations[0]
                      .idNumber
                  : ""
                : ""
            }`,
            // primInsurType: `${
            //   req.requisition.billingInformation.insuranceInformations
            //     ? req.requisition.billingInformation.insuranceInformations[0]
            //         .insuranceType
            //     : null
            // }`,
            primInsurName: `${
              req.requisition.billingInformation.insuranceInformations
                ? req.requisition.billingInformation.insuranceInformations[0]
                    .insuranceProviderName
                  ? req.requisition.billingInformation.insuranceInformations[0]
                      .insuranceProviderName
                  : ""
                : ""
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
      middleName: "",
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
      if (result.code === 200) {
        setIsLoggedIn(true);
      } else {
        console.log("status code: ", result.code);
        toast({
          title: "Invalide Token",
          status: "warning",
          position: "bottom-left",
          duration: 3000,
          isClosable: true,
        });
        // setSnackbarOpen(true);
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
      <VStack>
        <Container minH={"6vh"} maxW={"container.sm"} centerContent>
          OAH
        </Container>
        {isLoggedIn ? (
          <Container maxW={"container.md"} maxH={"80vh"} centerContent>
            {hasSearched ? (
              <AllInOne
                parentReturnReqs={stateReqs}
                parentSetReturnReqs={setStateReqs}
                parentHasSearchedState={setHasSearched}
                apiKey={apiKey}
              />
            ) : (
              <VStack spacing={2}>
                <Input
                  size="md"
                  variant="outline"
                  name="identifier"
                  placeholder="identifier.."
                  onChange={handleInput}
                />
                <Input
                  size="md"
                  variant="outline"
                  name="firstName"
                  placeholder="first name.."
                  onInput={handleInput}
                />
                <Input
                  size="md"
                  variant="outline"
                  name="middleName"
                  placeholder="middle name.."
                  onInput={handleInput}
                />
                <Input
                  size="md"
                  variant="outline"
                  name="lastName"
                  placeholder="last name.."
                  onInput={handleInput}
                />
                <Input
                  size="md"
                  variant="outline"
                  name="dob"
                  placeholder="yyyy-mm-dd.."
                  onInput={handleInput}
                />
                <Input
                  size="md"
                  variant="outline"
                  name="provAcc"
                  placeholder="provider acc. name.."
                  onInput={handleInput}
                />
                <Button variant="solid" onClick={handleSearchClick}>
                  search
                </Button>
              </VStack>
            )}
          </Container>
        ) : (
          <Container maxW={"30vw"}>
            <VStack>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="enter api key.."
                  onInput={handleAPIKeyEntry}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    aria-label="show password"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    h="1.75rem"
                    size="sm"
                    onClick={handleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <Button variant="solid" onClick={handleSubmitClick}>
                submit
              </Button>
            </VStack>
          </Container>
        )}
      </VStack>
    </React.Fragment>
  );
};

export default Search;

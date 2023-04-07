import React, { useState } from "react";
import { WantedReq, TypeToSearch } from "../types";
import AllInOne from "./allInOne";

const Search = () => {
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

  // has user been cleared
  const [apiKey, setApiKey] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // these are typescript objects representing an ovation req
  // to be sent to main component for processing
  const [stateReqs, setStateReqs] = useState<WantedReq[]>([]);

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
            labNotes: `${
              req.requisition.customAttributes.labNotes
                ? req.requisition.customAttributes.labNotes
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
            // primInsurName: `${
            //   req.requisition.billingInformation.insuranceInformations
            //     ? req.requisition.billingInformation.insuranceInformations[0]
            //         .insuranceProviderName
            //     : null
            // }`,
            // primInsurId: `${
            //   req.requisition.billingInformation.insuranceInformations
            //     ? req.requisition.billingInformation.insuranceInformations[0]
            //         .idNumber
            //     : null
            // }`,
          },
        ]);
      });

      console.log(JSON.stringify(result.Requisitions, null, 2));
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
      <div
        style={{ paddingLeft: "45%", paddingRight: "40%", paddingTop: "3%" }}
      >
        {isLoggedIn ? (
          <div>
            {!hasSearched ? (
              <div className="input-group">
                <input
                  type="search"
                  // name={identifier}
                  name="identifier"
                  onInput={handleInput}
                  placeholder="identifier.."
                />
                <input
                  type="search"
                  // name={firstName}
                  name="firstName"
                  onInput={handleInput}
                  placeholder="first name..."
                />
                <input
                  type="search"
                  // name={lastName}
                  name="lastName"
                  onInput={handleInput}
                  placeholder="last name..."
                />
                <input
                  type="search"
                  // name={lastName}
                  name="dob"
                  onInput={handleInput}
                  placeholder="yyyy-mm-dd..."
                />
                <input
                  type="search"
                  // name={lastName}
                  name="provAcc"
                  onInput={handleInput}
                  placeholder="provider Account name..."
                />
                <button onClick={handleSearchClick}>search</button>
              </div>
            ) : null}

            <div>
              {hasSearched ? (
                <AllInOne
                  parentReturnReqs={stateReqs}
                  parentSetReturnReqs={setStateReqs}
                  parentHasSearchedState={setHasSearched}
                  apiKey={apiKey}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <input
              type="password"
              placeholder="enter api key.."
              onInput={handleAPIKeyEntry}
            />
            <button onClick={() => setIsLoggedIn(true)}>submit</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Search;

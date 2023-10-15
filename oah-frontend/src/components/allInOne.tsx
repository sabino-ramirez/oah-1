import { useState } from "react";
import {
  ReactGrid,
  Column,
  Row,
  Id,
  CellChange,
  TextCell,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { WantedReq, UpdateReqFormat } from "../types";
import { Button, Flex, VStack, useToast } from "@chakra-ui/react";
import UpdateModel from "./updateModal";

const headerRow: Row = {
  rowId: "header",
  cells: [
    // {
    //   type: "header",
    //   text: "id",
    // },
    {
      type: "header",
      text: "Coll. Date",
    },
    {
      type: "header",
      text: "Identifier",
    },
    {
      type: "header",
      text: "Proj ID",
    },
    {
      type: "header",
      text: "Req Template",
    },
    {
      type: "header",
      text: "Prov. ID",
    },
    {
      type: "header",
      text: "Provider Name",
    },
    {
      type: "header",
      text: "Lab Notes",
    },
    // {
    //   type: "header",
    //   text: "samp id",
    // },
    {
      type: "header",
      text: "First Name",
    },
    {
      type: "header",
      text: "Middle Name",
    },
    {
      type: "header",
      text: "Last Name",
    },
    {
      type: "header",
      text: "DOB",
    },
    {
      type: "header",
      text: "G",
    },
    {
      type: "header",
      text: "Bill To",
    },
    { type: "header", text: "Primary Ins Name" },
    {
      type: "header",
      text: "Primary Ins ID",
    },
    {
      type: "header",
      text: "Group Number",
    },
    {
      type: "header",
      text: "Relat. To Insured",
    },
    {
      type: "header",
      text: "Race",
    },
    {
      type: "header",
      text: "Ethnicity",
    },
    {
      type: "header",
      text: "Address",
    },
    {
      type: "header",
      text: "City",
    },
    {
      type: "header",
      text: "State",
    },
    {
      type: "header",
      text: "Zip",
    },
  ],
};

const getColumns = (): Column[] => [
  // { columnId: "id", width: 100 },
  { columnId: "samepleCollDate", width: 100 },
  { columnId: "identifier", width: 128 },
  { columnId: "projectTemplateId", width: 80 },
  { columnId: "reqTemplate", width: 200, resizable: true },
  { columnId: "provAccId", width: 80 },
  { columnId: "provAccName", width: 300, resizable: true },
  // { columnId: "labNotes", width: 200, resizable: true },
  { columnId: "lab_notes", width: 200, resizable: true },
  { columnId: "firstName", width: 100, resizable: true },
  { columnId: "middleName", width: 100, resizable: true },
  { columnId: "lastName", width: 100, resizable: true },
  { columnId: "dob", width: 120 },
  { columnId: "gender", width: 30 },
  { columnId: "primBillTo", width: 120 },
  { columnId: "primInsurName", width: 180 },
  { columnId: "primInsurId", width: 100 },
  { columnId: "primGroupNum", width: 120 },
  { columnId: "primRTI", width: 120 },
  { columnId: "race", width: 110 },
  { columnId: "ethnicity", width: 110 },
  { columnId: "streetAddress", width: 200, resizable: true },
  { columnId: "city", width: 100, resizable: true },
  { columnId: "state", width: 115 },
  { columnId: "zipCode", width: 75 },
];

const getRows = (reqs: WantedReq[]): Row[] => [
  headerRow,
  ...reqs.map<Row>((req: WantedReq, idx: number) => ({
    rowId: idx,
    cells: [
      // {
      //   type: "text",
      //   text: req.id ? req.id : "nothing",
      //   style: { overflow: "auto", paddingLeft: "2px" },
      // },
      {
        type: "text",
        text: req.sampCollDate ? req.sampCollDate : "",
        style: { paddingLeft: "1px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.identifier,
        style: { paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.projectTemplateId,
        style: { overflow: "auto", paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.reqTemplate ? req.reqTemplate : "",
        style: { overflow: "auto", paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.provAccId ? req.provAccId : "",
        style: { paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.provAccName ? req.provAccName : "",
        style: { paddingLeft: "0px" },
        nonEditable: true,
      },
      {
        type: "text",
        // text: req.labNotes ? req.labNotes : "",
        text: req.lab_notes ? req.lab_notes : "",
        renderer(text) {
          return <div>{text}</div>;
        },
        style: { overflow: "auto", paddingLeft: "0px" },
        rowspan: 1,
      },
      // { type: "text", text: req.sampId ? req.sampId : "" },
      {
        type: "text",
        text: req.firstName ? req.firstName : "",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.middleName ? req.middleName : "",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.lastName ? req.lastName : "",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.dob ? req.dob : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.gender ? req.gender : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primBillTo
          ? req.primBillTo !== ""
            ? req.primBillTo
            : ""
          : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primInsurName
          ? req.primInsurName !== ""
            ? req.primInsurName
            : ""
          : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primInsurId
          ? req.primInsurId !== ""
            ? req.primInsurId
            : ""
          : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primGroupNum
          ? req.primGroupNum !== ""
            ? req.primGroupNum
            : ""
          : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primRTI ? (req.primRTI !== "" ? req.primRTI : "") : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.race ? req.race : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.ethnicity ? req.ethnicity : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.streetAddress ? req.streetAddress : "",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.city ? req.city : "",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.state ? req.state : "",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.zipCode ? req.zipCode : "",
        style: { paddingLeft: "2px" },
      },
    ],
    height: 70,
  })),
];

const applyChangesToReqs = (
  changes: CellChange<TextCell>[],
  prevReqs: WantedReq[]
): WantedReq[] => {
  changes.forEach((change) => {
    const reqIndex = change.rowId as number;
    const fieldName = change.columnId as keyof WantedReq;
    prevReqs[reqIndex][fieldName] = change.newCell.text;
    // console.log(change);
  });

  return [...prevReqs];
};

const organizeReqUpdates = (
  reqs: WantedReq[],
  changes: CellChange<TextCell>[],
  prevUpdates: UpdateReqFormat[]
): any => {
  // --- if the same req has multiple fields updated, add to that json obj
  // instead of making a separate one to avoid multiple /update calls
  const hasReqBeenUpdated = (reqId: number): [boolean, number] => {
    if (
      !(prevUpdates.length === 0) &&
      prevUpdates.some((update) => update.requisition.id === reqId)
    ) {
      return [
        true,
        prevUpdates.findIndex((update) => update.requisition.id === reqId),
      ];
    }
    return [false, 0];
  };

  // --- check what field was updated and format the appropriate json field
  // to be accepted by /update on the backend
  const fieldNameAndStructure = (
    changeRow: number,
    changeColumn: string
  ): [string, Object] => {
    let fieldName = "";
    let structure = {};
    if (changeColumn.includes("prov")) {
      fieldName = "providerAccount";
      structure = {
        id: reqs[changeRow].provAccId,
        name: reqs[changeRow].provAccName,
      };
    } else if (changeColumn.includes("prim")) {
      fieldName = "billingInformation";

      // if (changeColumn.includes("RTI")) {
      structure = {
        billTo:
          reqs[changeRow].primBillTo !== "" ? reqs[changeRow].primBillTo : "",
        insuranceInformations: [
          {
            idNumber:
              reqs[changeRow].primInsurId !== ""
                ? reqs[changeRow].primInsurId
                : "",
            groupNumber:
              reqs[changeRow].primGroupNum !== ""
                ? reqs[changeRow].primGroupNum
                : "",
            relationshipToInsured:
              reqs[changeRow].primRTI !== "" ? reqs[changeRow].primRTI : "",
            insuranceType: "Primary",
            insuranceProviderName:
              reqs[changeRow].primInsurName !== ""
                ? reqs[changeRow].primInsurName
                : "",
          },
        ],
      };
    } else if (changeColumn.includes("lab_notes")) {
      fieldName = "customAttributes";
      // structure = {
      //   labNotes: reqs[changeRow].labNotes,
      // };
      structure = {
        lab_notes: reqs[changeRow].lab_notes,
      };
    } else {
      fieldName = "patient";
      structure = {
        firstName: reqs[changeRow].firstName,
        lastName: reqs[changeRow].lastName,
        middleName: reqs[changeRow].middleName,
        streetAddress: reqs[changeRow].streetAddress,
        city: reqs[changeRow].city,
        state: reqs[changeRow].state,
        zipCode: reqs[changeRow].zipCode,
        dateOfBirth: reqs[changeRow].dob,
        gender: reqs[changeRow].gender,
        race: reqs[changeRow].race,
        ethnicity: reqs[changeRow].ethnicity,
      };
    }
    return [fieldName, structure];
  };

  changes.forEach((change) => {
    // --- there should never be more updates than there are reqs
    let balogni: UpdateReqFormat;
    const [fieldName, structure] = fieldNameAndStructure(
      change.rowId as number,
      change.columnId as keyof WantedReq
    );

    // if req has already been modified, add to it
    // if it is the first, create a new object for it
    // const currChangeRowId = parseInt(reqs[change.rowId as number].id);
    const currChangeRow = change.rowId as number;
    const [hasBeenUpdatedResult, rowNumOfPrevUpdate] = hasReqBeenUpdated(
      parseInt(reqs[currChangeRow].id)
    );

    if (hasBeenUpdatedResult === true) {
      console.log("updating another field on same req");
      // add appropriate key/value pair to existing updatedReq
      // console.log(prevUpdates[rowNumOfPrevUpdate]);
      prevUpdates[rowNumOfPrevUpdate].requisition[fieldName] = structure;
    } else {
      console.log("updating req for first time");
      // const rowNum = change.rowId as number;
      balogni = {
        requisition: {
          id: parseInt(reqs[currChangeRow].id),
          identifier: reqs[currChangeRow].identifier,
          projectTemplateId: parseInt(reqs[currChangeRow].projectTemplateId),
          [fieldName]: structure,
        },
        markAsSigned: true,
      };
      prevUpdates.push(balogni);
    }
  });

  return [...prevUpdates];
};

const AllInOne = (props: {
  parentReturnReqs: WantedReq[];
  parentSetReturnReqs: any;
  parentHasSearchedState: any;
  apiKey: any;
}) => {
  const [reqs, setReqs] = useState<WantedReq[]>(props.parentReturnReqs);
  // const [updateReqs, setUpdateReqs] = useState<string[]>([]);
  const [updateReqs, setUpdateReqs] = useState<UpdateReqFormat[]>([]);

  const [columns, setColumns] = useState<Column[]>(getColumns());

  const toast = useToast();

  const rows = getRows(reqs);
  // const columns = getColumns();

  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
    });
  };

  const handleChanges = (changes: CellChange<any>[]) => {
    setReqs((prevReqs) => applyChangesToReqs(changes, prevReqs));
    setUpdateReqs((prevUpdates) =>
      organizeReqUpdates(reqs, changes, prevUpdates)
    );
  };

  const handleUpdateClick = async () => {
    // updateReqs.forEach((updatedReq) => {
    //   console.log(JSON.stringify(updatedReq));
    // });

    // with Promise.allSettled, return promise always resolves with array
    // of individual promises with status "fulfilled" or "rejected"
    const promiseResults = await Promise.allSettled(
      updateReqs.map(async (updatedReq) => {
        const res = await fetch(`/update`, {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            babyboi: props.apiKey,
          },
          body: JSON.stringify(updatedReq),
        });

        if (res.status !== 200) {
          const errJson = await res.json();
          return Promise.reject(errJson);
        }

        return Promise.resolve(res.json());
      })
    );

    // const rejectionReasons: {}[] = [];
    const rejectionReasons: { identifier: string; [key: string]: any }[] = [];

    promiseResults.forEach((result) => {
      if (result.status === "rejected") {
        rejectionReasons.push(result.reason);
      }
    });

    if (Array.isArray(rejectionReasons) && rejectionReasons.length) {
      toast({
        status: "error",
        title:
          rejectionReasons.length > 1
            ? "some errors occured"
            : "an error occured",
        description: rejectionReasons.map((rr) => {
          return (
            <span key={rr.identifier}>
              {rr.identifier}:{" "}
              {Object.keys(rr)
                .slice(1)
                .map((key, ix) => {
                  return (ix ? ", " : "") + key;
                })}
              <br />
            </span>
          );
        }),
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
      // console.log(rejectionReasons);
    } else {
      toast({
        status: "success",
        title: "update successful!",
        position: "bottom-left",
        duration: 1500,
        isClosable: true,
      });
    }

    // reset updates after user sends updates to /update
    setUpdateReqs([]);
  };

  const handleNewSearchClick = () => {
    toast.closeAll();

    // set hasSearched to false to show the search bar after user selects new search
    props.parentHasSearchedState(false);

    // clear previous search results
    props.parentSetReturnReqs([]);
  };

  return (
    <>
      <Flex overflow={"scroll"} minH={"70vh"} maxW={"85vw"}>
        <ReactGrid
          rows={rows}
          columns={columns}
          onColumnResized={handleColumnResize}
          onCellsChanged={handleChanges}
          stickyTopRows={1}
          stickyLeftColumns={1}
          enableFillHandle
          enableRangeSelection
        />
      </Flex>
      <VStack>
        {updateReqs.length > 0 ? (
          <UpdateModel
            updateAmount={updateReqs.length}
            parentClickHandler={handleUpdateClick}
          />
        ) : (
          <Button
            size={"sm"}
            variant={"solid"}
            isActive={false}
            isDisabled={true}
          >
            update
          </Button>
        )}
        <Button variant="solid" size="sm" onClick={handleNewSearchClick}>
          new search
        </Button>
      </VStack>
    </>
  );
};

export default AllInOne;

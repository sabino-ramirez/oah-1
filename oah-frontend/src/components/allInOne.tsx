import { useState } from "react";
import {
  ReactGrid,
  Column,
  Row,
  Id,
  CellChange,
  TextCell,
} from "@silevis/reactgrid";
import { WantedReq, UpdateReqFormat } from "../types";
import "@silevis/reactgrid/styles.css";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import UpdateDialogue from "./updateDialogue";
import MySnackbar from "./snackbar";

const headerRow: Row = {
  rowId: "header",
  cells: [
    // {
    //   type: "header",
    //   text: "id",
    // },
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
      text: "Coll. Date",
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
    {
      type: "header",
      text: "Primary Ins Name",
    },
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
  { columnId: "identifier", width: 128 },
  { columnId: "projectTemplateId", width: 80 },
  { columnId: "reqTemplate", width: 200, resizable: true },
  { columnId: "samepleCollDate", width: 100 },
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
        text: req.reqTemplate ? req.reqTemplate : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.sampCollDate ? req.sampCollDate : "nothing",
        style: { paddingLeft: "1px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.provAccId ? req.provAccId : "nothin",
        style: { paddingLeft: "2px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.provAccName ? req.provAccName : "nothing",
        style: { paddingLeft: "0px" },
        nonEditable: true,
      },
      {
        type: "text",
        // text: req.labNotes ? req.labNotes : "nothing",
        text: req.lab_notes ? req.lab_notes : "nothing",
        renderer(text) {
          return <div>{text}</div>;
        },
        style: { overflow: "auto", paddingLeft: "0px" },
        rowspan: 1,
      },
      // { type: "text", text: req.sampId ? req.sampId : "nothing" },
      {
        type: "text",
        text: req.firstName ? req.firstName : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.middleName ? req.middleName : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.lastName ? req.lastName : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.dob ? req.dob : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.gender ? req.gender : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primBillTo ? req.primBillTo : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primInsurName ? req.primInsurName : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primInsurId ? req.primInsurId : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primGroupNum ? req.primGroupNum : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.primRTI ? req.primRTI : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.race ? req.race : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.ethnicity ? req.ethnicity : "ntohing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.streetAddress ? req.streetAddress : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.city ? req.city : "nothing",
        style: { overflow: "auto", paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.state ? req.state : "nothing",
        style: { paddingLeft: "2px" },
      },
      {
        type: "text",
        text: req.zipCode ? req.zipCode : "nothing",
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
      structure = {
        billTo: reqs[changeRow].primBillTo,
        insuranceInformations: [
          {
            idNumber: reqs[changeRow].primInsurId,
            groupNumber: reqs[changeRow].primGroupNum,
            // relationshipToInsured: reqs[changeRow].primRTI,
            insuranceType: "Primary",
            insuranceProviderName: reqs[changeRow].primInsurName,
          },
        ],
      };
    } else if (changeColumn.includes("RTI")) {
      fieldName = "billingInformation";
      structure = {
        billTo: reqs[changeRow].primBillTo,
        insuranceInformations: [
          {
            idNumber: reqs[changeRow].primInsurId,
            groupNumber: reqs[changeRow].primGroupNum,
            relationshipToInsured: reqs[changeRow].primRTI,
            insuranceType: "Primary",
            insuranceProviderName: reqs[changeRow].primInsurName,
          },
        ],
      };
    }
    // else if (changeColumn.includes("billTo")) {
    //   fieldName = "billingInformation";
    //   structure = {
    //     billTo: reqs[changeRow].billTo,
    //   };
    //   // } else if (changeColumn.includes("labNotes")) {
    // }
    else if (changeColumn.includes("lab_notes")) {
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

    if (hasBeenUpdatedResult) {
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

  // for snackbar
  const [snackBarOpen, setSnackbarOpen] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState<string[]>([]);

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
    updateReqs.forEach((updatedReq) => {
      console.log(JSON.stringify(updatedReq));
    });

    // with promise.all, the whole array fails after at least one failure
    await Promise.all(
      updateReqs.map(async (updatedReq) => {
        const res = await fetch(`/update`, {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            babyboi: props.apiKey,
          },
          body: JSON.stringify(updatedReq),
        });

        // const j = res;
        const j = await res.json();
        // const obj = JSON.parse(j);

        return { status: res.status, json: j };
        // return await res.json();
      })
    ).then((results) => {
      results.forEach((r) => {
        console.log(r);
        const msgs = [];
        if (r.status !== 200) {
          let msg = "";
          for (const [key, val] of Object.entries(r.json)) {
            // msg += `${key}: ${val}\n`;
            msg = `${key}: ${val}`;
            msgs.push(msg);
          }

          setSnackBarSeverity("error");
          setSnackBarMessage(msgs);
          return;
        } else {
          setSnackBarSeverity("success");
          setSnackBarMessage(["Update Successful!"]);
        }
      });
    });

    // // with Promise.allSettled, all promises return, regardless their
    // // status
    // const promiseResults = await Promise.allSettled(
    //   updateReqs.map(async (updatedReq) => {
    //     const res = await fetch(`/update`, {
    //       method: "POST",
    //       headers: {
    //         // "Content-Type": "application/json",
    //         babyboi: props.apiKey,
    //       },
    //       body: JSON.stringify(updatedReq),
    //     });
    //
    //     return res;
    //     // return await res.json();
    //   })
    // );

    // reset updates after user sends updates to /update
    setUpdateReqs([]);
    setSnackbarOpen(true);
  };

  const handleNewSearchClick = () => {
    // set hasSearched to false to show the search bar after user selects new search
    props.parentHasSearchedState(false);

    // clear previous search results
    props.parentSetReturnReqs([]);
  };

  // do style in div? idk
  return (
    <>
      <Stack paddingTop={"3%"} alignItems={"center"} justifyContent={"center"}>
        <Box
          sx={{
            width: "85vw",
            height: "78vh",
            overflow: "scroll",
            // position: "absolute",
            margin: "auto",
          }}
        >
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
        </Box>
        <ButtonGroup orientation="vertical" size="small">
          {updateReqs.length > 0 ? (
            <UpdateDialogue
              updateAmount={updateReqs.length}
              parentClickHandler={handleUpdateClick}
            />
          ) : null}
          <Button
            variant="contained"
            size="small"
            sx={{ marginTop: "4px" }}
            onClick={handleNewSearchClick}
          >
            New Search
          </Button>
        </ButtonGroup>
        <MySnackbar
          parentIsOpen={snackBarOpen}
          parentSetIsOpen={setSnackbarOpen}
          message={snackBarMessage}
          severity={snackBarSeverity}
          // message={"Update Successful!"}
          // severity="success"
        />
      </Stack>
    </>
  );
};

export default AllInOne;

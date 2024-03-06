import { useState } from "react";
import * as _ from "lodash";
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
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import UpdateModel from "./updateModal";

// set the first row (title/header row)
const headerRow: Row = {
  rowId: "header",
  cells: [
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
      text: "Req Template",
    },
    // {
    //   type: "header",
    //   text: "Prov. ID",
    // },
    {
      type: "header",
      text: "Provider Name",
    },
    {
      type: "header",
      text: "Lab Notes",
    },
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
      text: "Sex",
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
      text: "Prim. Name of Insured",
    },
    {
      type: "header",
      text: "Relat. To Insured",
    },
    {
      type: "header",
      text: "Prim. DOB of Insured",
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

// set id's and styles to columns
const getColumns = (): Column[] => [
  { columnId: "samepleCollDate", width: 100 },
  { columnId: "identifier", width: 180 },
  { columnId: "reqTemplate", width: 300, resizable: true },
  // { columnId: "provAccId", width: 120 },
  { columnId: "provAccName", width: 300, resizable: true },
  { columnId: "lab_notes", width: 200, resizable: true },
  { columnId: "firstName", width: 110, resizable: true },
  { columnId: "middleName", width: 110, resizable: true },
  { columnId: "lastName", width: 110, resizable: true },
  { columnId: "dob", width: 120 },
  { columnId: "sex", width: 50 },
  { columnId: "primBillTo", width: 130 },
  { columnId: "primInsurName", width: 210, resizable: true },
  { columnId: "primInsurId", width: 215, resizable: true },
  { columnId: "primGroupNum", width: 150 },
  { columnId: "primNameOfInsured", width: 150 },
  { columnId: "primRTI", width: 130 },
  { columnId: "primDobOfInsured", width: 150 },
  { columnId: "race", width: 120 },
  { columnId: "ethnicity", width: 120 },
  { columnId: "streetAddress", width: 215, resizable: true },
  { columnId: "city", width: 150, resizable: true },
  { columnId: "state", width: 115 },
  { columnId: "zipCode", width: 75 },
];

// returns array of <Row>s that are usable by ReactGrid
const getRows = (reqs: WantedReq[]): Row[] => [
  headerRow,
  ...reqs.map<Row>((req: WantedReq, idx: number) => ({
    rowId: idx,
    cells: [
      {
        type: "date",
        date: req.sampCollDate,
        style: {
          paddingLeft: "10px",
          // overflow: "auto",
          border: {
            left: {
              color: req.failed ? "red" : "",
              style: req.failed ? "dashed" : "solid",
              width: req.failed ? "3px" : "1px",
            },
            right: {
              color: req.failed ? "red" : "",
              style: req.failed ? "dashed" : "solid",
              width: req.failed ? "3px" : "1px",
            },
            top: {
              color: req.failed ? "red" : "",
              style: req.failed ? "dashed" : "solid",
              width: req.failed ? "3px" : "1px",
            },
            bottom: {
              color: req.failed ? "red" : "",
              style: req.failed ? "dashed" : "solid",
              width: req.failed ? "3px" : "1px",
            },
          },
        },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.identifier,
        style: { paddingLeft: "10px" },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.reqTemplate,
        style: {
          overflow: "auto",
          paddingLeft: "10px",
          paddingRight: "8px",
        },
        nonEditable: true,
      },
      // {
      //   type: "text",
      //   text: req.provAccId,
      //   style: { paddingLeft: "10px" },
      //   nonEditable: true,
      // },
      {
        type: "text",
        text: req.provAccName,
        style: {
          overflow: "auto",
          paddingLeft: "10px",
          paddingRight: "8px",
        },
        nonEditable: true,
      },
      {
        type: "text",
        text: req.lab_notes,
        renderer(text) {
          return <div>{text}</div>;
        },
        style: { overflow: "auto", paddingLeft: "10px" },
        rowspan: 1,
      },
      {
        type: "text",
        text: req.firstName,
        style: { overflow: "auto", paddingLeft: "8px" },
      },
      {
        type: "text",
        text: req.middleName,
        style: { overflow: "auto", paddingLeft: "8px" },
      },
      {
        type: "text",
        text: req.lastName,
        style: { overflow: "auto", paddingLeft: "8px" },
      },
      {
        type: "text",
        text: req.dob,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.sex,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primBillTo,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primInsurName,
        style: { paddingLeft: "10px", paddingRight: "8px" },
      },
      {
        type: "text",
        text: req.primInsurId,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primGroupNum,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primNameOfInsured,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primRTI,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.primDobOfInsured,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.race,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.ethnicity,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.streetAddress,
        style: { overflow: "auto", paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.city,
        style: { overflow: "auto", paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.state,
        style: { paddingLeft: "10px" },
      },
      {
        type: "text",
        text: req.zipCode,
        style: { paddingLeft: "10px" },
      },
    ],
    height: 50,
  })),
];

// helper func returns [reqs + changes to reqs]
const applyNewValue = (
  changes: CellChange<TextCell | any>[],
  prevReqs: WantedReq[],
  usePrevValue: boolean = false,
): WantedReq[] => {
  changes.forEach((change) => {
    const reqIndex = change.rowId as number;
    const fieldName = change.columnId as keyof WantedReq;
    const cell = usePrevValue ? change.previousCell : change.newCell;
    prevReqs[reqIndex][fieldName] = cell.text;
  });

  return [...prevReqs];
};

// actual component
const AllInOne = (props: {
  parentReturnReqs: WantedReq[];
  parentSetReturnReqs: any;
  parentHasSearchedState: any;
  apiKey: any;
}) => {
  const [reqs, setReqs] = useState<WantedReq[]>(props.parentReturnReqs);
  const [rejectedReqs, setRejectedReqs] = useState<WantedReq[]>([]);
  // const [allowShowRejected, setAllowShowRejected] = useState<boolean>(false);
  const [updateReqs, setUpdateReqs] = useState<UpdateReqFormat[]>([]);
  const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
  const [cellChanges, setCellChanges] = useState<CellChange<TextCell>[][]>(
    () => [],
  );
  const [columns, setColumns] = useState<Column[]>(getColumns());
  const rows = getRows(reqs);
  const toast = useToast();

  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
    });
  };

  // works with changes to keep updatedReq objects up to date
  const organizeReqUpdates = (
    reqs: WantedReq[],
    changes: CellChange<TextCell>[],
    prevUpdates: UpdateReqFormat[],
  ): any => {
    // function for checking if this row has been previously modified
    const hasReqBeenUpdated = (reqIdentifier: string): [boolean, number] => {
      if (
        prevUpdates.length &&
        prevUpdates.some(
          (update) => update.requisition.identifier === reqIdentifier,
        )
      ) {
        return [
          true,
          prevUpdates.findIndex(
            (update) => update.requisition.identifier === reqIdentifier,
          ),
        ];
      } else {
        return [false, -1];
      }
    };

    // formats appropriate json data based on updated fields
    const fieldNameAndStructure = (
      changeRow: number,
      changeColumn: any,
    ): [string, Object] => {
      let fieldName = "";
      let structure = {};
      if (changeColumn.includes("prov")) {
        fieldName = "providerAccount";
        structure = {
          // id: reqs[changeRow].provAccId,
          name: reqs[changeRow].provAccName,
        };
      } else if (changeColumn.includes("prim")) {
        fieldName = "billingInformation";
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
              nameOfPersonInsured:
                reqs[changeRow].primNameOfInsured !== ""
                  ? reqs[changeRow].primNameOfInsured
                  : "",
              relationshipToInsured:
                reqs[changeRow].primRTI !== "" ? reqs[changeRow].primRTI : "",
              dobOfInsured:
                reqs[changeRow].primDobOfInsured !== ""
                  ? new Date(
                      reqs[changeRow].primDobOfInsured,
                    ).toLocaleDateString("ko-KR")
                  : "",
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
          // dateOfBirth: reqs[changeRow].dob,
          dateOfBirth: new Date(reqs[changeRow].dob).toLocaleDateString(
            "ko-KR",
          ),
          // dob: new Date(req.patientDateOfBirth)
          //   .toLocaleDateString("en-us")
          //   .replace(/\//g, "."),
          gender: reqs[changeRow].sex,
          race: reqs[changeRow].race,
          ethnicity: reqs[changeRow].ethnicity,
        };
      }
      return [fieldName, structure];
    };

    // actually start processing the changes
    changes.forEach((change) => {
      let balogni: UpdateReqFormat;
      const [fieldName, structure] = fieldNameAndStructure(
        change.rowId as number,
        change.columnId as keyof WantedReq,
      );

      const currChangeRow = change.rowId as number;
      const [hasBeenUpdatedResult, rowNumOfPrevUpdate] = hasReqBeenUpdated(
        reqs[currChangeRow].identifier,
      );

      /*
       * if the same req is updated multiple times, add to the json obj
       * instead of making new one to avoid unnecessary /update calls.
       * there should never be more updates than there are reqs
       * */
      if (hasBeenUpdatedResult === true) {
        console.log("updating another field on same req");
        // add appropriate key/value pair to existing updatedReq obj
        prevUpdates[rowNumOfPrevUpdate].requisition[fieldName] = structure;
      } else {
        // if it is the first update, create a new object for it
        console.log("updating req for first time");
        balogni = {
          requisition: {
            identifier: reqs[currChangeRow].identifier,
            [fieldName]: structure,
          },
          markAsSigned: true,
        };

        // add new object to updated reqs state
        prevUpdates.push(balogni);
      }
    });

    // return [previousUpdates + modified/added updates]
    return [...prevUpdates];
  };

  /*
   * first layer 'changes' helper takes changes and reqs, and
   * calls base helper to apply changes.
   * abstraction necessary for undo/redo functionality.
   * */
  const applyChangesToReqs = (
    changes: CellChange<TextCell>[],
    prevReqs: WantedReq[],
  ): WantedReq[] => {
    const updated = applyNewValue(changes, prevReqs);
    setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  // 'changes' click-handler sends grid changes to grid helpers
  // and also to update req helper
  const handleChanges = (changes: CellChange<any>[]) => {
    setReqs((prevReqs) => applyChangesToReqs(changes, prevReqs));
    setUpdateReqs((prevUpdates) =>
      organizeReqUpdates(reqs, changes, prevUpdates),
    );
  };

  // base helper for undoing changes
  const undoChanges = (
    changes: CellChange<TextCell>[],
    prevReqs: WantedReq[],
  ): WantedReq[] => {
    const updated = applyNewValue(changes, prevReqs, true);
    setCellChangesIndex(cellChangesIndex - 1);
    return updated;
  };

  // undo click-handler triggers undo helper
  const handleUndoChanges = () => {
    if (cellChangesIndex > 0) {
      setReqs((prevReqs) =>
        undoChanges(cellChanges[cellChangesIndex], prevReqs),
      );

      setUpdateReqs((prevUpdates) =>
        organizeReqUpdates(reqs, cellChanges[cellChangesIndex], prevUpdates),
      );
    } else if (cellChangesIndex === 0) {
      setReqs((prevReqs) =>
        undoChanges(cellChanges[cellChangesIndex], prevReqs),
      );
      setUpdateReqs([]);
    }
  };

  // base redo helper
  const redoChanges = (
    changes: CellChange<TextCell>[],
    prevReqs: WantedReq[],
  ): WantedReq[] => {
    const updated = applyNewValue(changes, prevReqs);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  // redo click-handler triggers base helper
  const handleRedoChanges = () => {
    if (cellChangesIndex + 1 <= cellChanges.length - 1) {
      setReqs((prevReqs) =>
        redoChanges(cellChanges[cellChangesIndex + 1], prevReqs),
      );
      setUpdateReqs((prevUpdates) =>
        organizeReqUpdates(
          reqs,
          cellChanges[cellChangesIndex + 1],
          prevUpdates,
        ),
      );
    }
  };

  // update click-handler gets called when user is ready to send updates
  const handleUpdateClick = async (uniqueUpdateRows: number[]) => {
    /*
     * fixes incorrect update amount bug.
     * extract only the reqs whos indentifiers are in one of the
     * rows in `uniqueUpdateRows` array.
     * See <UpdateModal> for info on `uniqueUpdateRows`
     * */
    const uniqueUpdates = updateReqs.filter((uu) => {
      return uniqueUpdateRows.some(
        (urow) => reqs[urow].identifier === uu.requisition.identifier,
      );
    });
    // console.log(uniqueUpdates);

    // with Promise.allSettled, return promise always resolves with array
    // of individual promises with status "fulfilled" or "rejected"
    const promiseResults = await Promise.allSettled(
      // use `uniqueUpdates` instead of `updateReqs` state
      uniqueUpdates.map(async (updatedReq) => {
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
      }),
    );

    // make arrays for rejected and fulfilled promises info
    const rejectionReasons: { identifier: string; [key: string]: any }[] = [];
    const serverUpdatedReqs: any[] = []; // holds raw json objs from server

    // store each result in the appropriate array
    promiseResults.forEach((result) => {
      if (result.status === "rejected") {
        rejectionReasons.push(result.reason);
      } else {
        serverUpdatedReqs.push(result.value);
      }
    });

    // which toast style to show.
    // & logic based on amount of succeeded and/or rejected reqs.
    const maxErrors = 4;
    if (Array.isArray(rejectionReasons) && rejectionReasons.length) {
      toast({
        status: "error",
        title:
          rejectionReasons.length > 1
            ? "some errors occured"
            : "an error occured",
        // only show first {maxErrors} in toast
        description: rejectionReasons.slice(0, maxErrors).map((rr) => {
          return (
            <span key={rr.identifier}>
              {rr.identifier}:{" "}
              {Object.keys(_.omit(rr, "identifier")).map((key, ix) => {
                return (ix ? ", " : "") + key;
              })}
              <br />
              <br />
            </span>
          );
        }),
        position: "bottom-left",
        duration: null,
        isClosable: true,
      });

      // if has rejections AND has successes, this will run
      if (Array.isArray(serverUpdatedReqs) && serverUpdatedReqs.length) {
        // setAllowShowRejected(true);
        /*
         * successes mixed with rejections will re-order the grid.
         * reset the changes and the changes index to treat the new
         * page as a fresh grid with no changes (updates are still active).
         * */
        setCellChangesIndex(() => -1);
        setCellChanges(() => []);

        // convert server response json reqs to grid-usable format
        const svrUpdatesToWantedReqs = serverUpdatedReqs.map(function (req) {
          const d = new Date(req.sampleCollectionDate);
          return {
            identifier: `${req.identifier}`,
            lab_notes: `${req.lab_notes}`,
            reqTemplate: `${req.template}`,
            sampCollDate: new Date(d.getTime() + d.getTimezoneOffset() * 60000),
            // provAccId: `${req.providerID}`,
            provAccName: `${req.providerName}`,
            firstName: `${req.patientFirstName}`,
            middleName: `${req.patientMiddleName}`,
            lastName: `${req.patientLastName}`,
            streetAddress: `${req.patientStreetAddress}`,
            city: `${req.patientCity}`,
            state: `${req.patientState}`,
            zipCode: `${req.patientZipCode}`,
            dob: `${req.patientDateOfBirth}`,
            sex: `${req.patientSex}`,
            race: `${req.patientRace}`,
            ethnicity: `${req.patientEthnicity}`,
            primBillTo: `${req.billTo}`,
            primGroupNum: `${req.primInsGroupNumber}`,
            primNameOfInsured: `${req.primNameOfPersonInsured}`,
            primRTI: `${req.primInsRelationshipToInsured}`,
            primDobOfInsured: `${req.primDobOfInsured}`,
            primInsurId: `${req.primInsIDNumber}`,
            primInsurName: `${req.primInsInsuranceProviderName}`,
          };
        });

        /*
         * return reqs whose identifier's are found in rejectedReasons array
         * to get rejected reqs in correct format.
         * Add the `failed: boolean` field to render as red
         * */
        const rjReqs = reqs
          .filter((req) => {
            return rejectionReasons.some(
              (reason) => reason.identifier === req.identifier,
            );
          })
          .map((rr) => ({
            ...rr,
            failed: true,
          }));

        /*
         * Update `updateReqs` state to only keep the reqs that failed.
         * If a req udpate succeeded, no need to keep the updateReq for it.
         * This keeps update info live even on new grids.
         * */
        setUpdateReqs(
          updateReqs.filter((ur) => {
            return rejectionReasons.some(
              (reason) => reason.identifier === ur.requisition.identifier,
            );
          }),
        );

        // reset the grid with a mixture of successful and rejected reqs
        setReqs([]);
        setReqs([...svrUpdatesToWantedReqs, ...rjReqs]);
      }
    } else {
      // if there are only successful updates, this will run
      toast({
        status: "success",
        title: "update successful!",
        position: "bottom-left",
        duration: 3000,
        isClosable: true,
      });

      // reset everything
      setCellChangesIndex(() => -1);
      setCellChanges(() => []);
      setUpdateReqs([]);

      // reset grid with successfully updated reqs
      setReqs([]);
      serverUpdatedReqs.forEach((req) => {
        const d = new Date(req.sampleCollectionDate);
        setReqs((prev) => [
          ...prev,
          {
            identifier: `${req.identifier}`,
            lab_notes: `${req.lab_notes}`,
            reqTemplate: `${req.template}`,
            sampCollDate: new Date(d.getTime() + d.getTimezoneOffset() * 60000),
            // provAccId: `${req.providerID}`,
            provAccName: `${req.providerName}`,
            firstName: `${req.patientFirstName}`,
            middleName: `${req.patientMiddleName}`,
            lastName: `${req.patientLastName}`,
            streetAddress: `${req.patientStreetAddress}`,
            city: `${req.patientCity}`,
            state: `${req.patientState}`,
            zipCode: `${req.patientZipCode}`,
            dob: `${req.patientDateOfBirth}`,
            sex: `${req.patientSex}`,
            race: `${req.patientRace}`,
            ethnicity: `${req.patientEthnicity}`,
            primBillTo: `${req.billTo}`,
            primGroupNum: `${req.primInsGroupNumber}`,
            primNameOfInsured: `${req.primNameOfPersonInsured}`,
            primRTI: `${req.primInsRelationshipToInsured}`,
            primDobOfInsured: `${req.primDobOfInsured}`,
            primInsurId: `${req.primInsIDNumber}`,
            primInsurName: `${req.primInsInsuranceProviderName}`,
          },
        ]);
      });
    }

    // if update result has successes...
    // if (Array.isArray(serverUpdatedReqs) && serverUpdatedReqs.length) {
    //   // // reset updates after successful update to /update
    //   // setUpdateReqs([]);
    //
    //   // if update result has successes AND failures, this block will run
    //   if (Array.isArray(rejectionReasons) && rejectionReasons.length) {
    //     setAllowShowRejected(true);
    //
    //     // // reset reqs to state before ANY changes
    //     // for (let ix = cellChangesIndex; ix >= 0; ix--) {
    //     //   /*
    //     //     use base 'changes' helper directly, but don't handle
    //     //     changes array or changesIndex state here.
    //     //     state won't work thanks to how react treats batch updates
    //     //   */
    //     //   setReqs((prevReqs) => {
    //     //     const updated = applyNewValue(cellChanges[ix], prevReqs, true);
    //     //     // setCellChangesIndex(cellChangesIndex - 1);
    //     //     return updated;
    //     //   });
    //     // }
    //
    //     /*
    //       fill rejectedReqs state using identifiers found in
    //       rejectionReasons array from update results.
    //
    //       add failed: true to show red in results
    //
    //       thanks to above for-loop, these rows will show info from
    //       BEFORE any updates were made to them.
    //     */
    //     setRejectedReqs(
    //       reqs
    //         .filter((req) => {
    //           return rejectionReasons.some(
    //             (reason) => reason.identifier === req.identifier
    //           );
    //         })
    //         .map((rr) => ({
    //           ...rr,
    //           failed: true,
    //         }))
    //     );
    //   }
    //
    //   // reset cell changes and changesIndex after handling possible
    //   // rejected reqs first
    //   setCellChangesIndex(() => -1);
    //   setCellChanges(() => []);
    //
    //   /*
    //     reset grid reqs to show successfully updated info provided
    //     by ovation and stored in serverUpdatedReqs from update result
    //   */
    //   const svrUpdatesToWantedReqs: WantedReq[] = serverUpdatedReqs.map(
    //     (req) => ({
    //       identifier: `${req.identifier}`,
    //       lab_notes: `${req.lab_notes}`,
    //       reqTemplate: `${req.template}`,
    //       sampCollDate: new Date(req.sampleCollectionDate),
    //       provAccId: `${req.providerID}`,
    //       provAccName: `${req.providerName}`,
    //       firstName: `${req.patientFirstName}`,
    //       middleName: `${req.patientMiddleName}`,
    //       lastName: `${req.patientLastName}`,
    //       streetAddress: `${req.patientStreetAddress}`,
    //       city: `${req.patientCity}`,
    //       state: `${req.patientState}`,
    //       zipCode: `${req.patientZipCode}`,
    //       dob: `${req.patientDateOfBirth}`,
    //       sex: `${req.patientSex}`,
    //       race: `${req.patientRace}`,
    //       ethnicity: `${req.patientEthnicity}`,
    //       primBillTo: `${req.billTo}`,
    //       primGroupNum: `${req.primInsGroupNumber}`,
    //       primRTI: `${req.primInsRelationshipToInsured}`,
    //       primInsurId: `${req.primInsIDNumber}`,
    //       primInsurName: `${req.primInsInsuranceProviderName}`,
    //     })
    //   );
    //
    //   console.log(rejectedReqs);
    //   setReqs([]);
    //   setReqs([...svrUpdatesToWantedReqs, ...rejectedReqs]);
    //
    //   // serverUpdatedReqs.forEach((req) => {
    //   //   setReqs((prev) => [
    //   //     ...prev,
    //   //     {
    //   //       identifier: `${req.identifier}`,
    //   //       lab_notes: `${req.lab_notes}`,
    //   //       reqTemplate: `${req.template}`,
    //   //       sampCollDate: new Date(req.sampleCollectionDate),
    //   //       provAccId: `${req.providerID}`,
    //   //       provAccName: `${req.providerName}`,
    //   //       firstName: `${req.patientFirstName}`,
    //   //       middleName: `${req.patientMiddleName}`,
    //   //       lastName: `${req.patientLastName}`,
    //   //       streetAddress: `${req.patientStreetAddress}`,
    //   //       city: `${req.patientCity}`,
    //   //       state: `${req.patientState}`,
    //   //       zipCode: `${req.patientZipCode}`,
    //   //       dob: `${req.patientDateOfBirth}`,
    //   //       sex: `${req.patientSex}`,
    //   //       race: `${req.patientRace}`,
    //   //       ethnicity: `${req.patientEthnicity}`,
    //   //       primBillTo: `${req.billTo}`,
    //   //       primGroupNum: `${req.primInsGroupNumber}`,
    //   //       primRTI: `${req.primInsRelationshipToInsured}`,
    //   //       primInsurId: `${req.primInsIDNumber}`,
    //   //       primInsurName: `${req.primInsInsuranceProviderName}`,
    //   //     },
    //   //   ]);
    //   // });
    // }
  };

  // new search button handler
  const handleNewSearchClick = () => {
    toast.closeAll();

    // set hasSearched to false to show the search button
    props.parentHasSearchedState(false);

    // clear any previous search results
    props.parentSetReturnReqs([]);
  };

  // // show failed button handler
  // const handleShowFailed = () => {
  //   // add reqs in rejectedReqs state to the successfully
  //   // updated reqs that are already showing
  //   rejectedReqs.forEach((req) => {
  //     setReqs((prevReqs) => [...prevReqs, req]);
  //   });
  //
  //   // deny further use of button, otherwise the same failed
  //   // req will continuously be added
  //   setAllowShowRejected(false);
  // };

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
      <Flex
        mt={3}
        direction={"row"}
        w={"80vw"}
        grow={"1"}
        basis={"0"}
        justifyContent={"space-between"}
        alignItems={"start"}
      >
        <Box w={"120px"}>
          <Center h={"30px"} w={"30px"} bg={"gray.100"} boxShadow={"md"}>
            <Text color={"gray.600"}>{rows.length - 1}</Text>
          </Center>
        </Box>
        <VStack w={"120px"} maxH={"100%"}>
          {/*{updateReqs.length > 0 && !allowShowRejected ? (*/}
          {updateReqs.length > 0 ? (
            <UpdateModel
              parentUpdateReqs={updateReqs}
              parentSetUpdateReqs={setUpdateReqs}
              parentCellChanges={cellChanges}
              parentCellChangesIndex={cellChangesIndex}
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
          <HStack>
            {cellChangesIndex < 0 ? (
              <Button size={"sm"} isDisabled={true}>
                undo
              </Button>
            ) : (
              <Button size={"sm"} onClick={handleUndoChanges}>
                undo
              </Button>
            )}
            {cellChangesIndex >= cellChanges.length - 1 ? (
              <Button size={"sm"} isDisabled={true}>
                redo
              </Button>
            ) : (
              <Button size={"sm"} onClick={handleRedoChanges}>
                redo
              </Button>
            )}
            <Button
              size={"sm"}
              onClick={() => {
                console.log(cellChangesIndex);
                console.log(cellChanges);
                console.log(updateReqs.length);
                console.log(updateReqs);
                console.log(rejectedReqs.length);
                console.log(rejectedReqs);
                console.log(reqs.length);
                console.log(reqs);
                console.log(props.parentReturnReqs.length);
                console.log(props.parentReturnReqs);
              }}
            >
              show
            </Button>
          </HStack>
        </VStack>
        <Button
          w={"120px"}
          size={"sm"}
          // isDisabled={allowShowRejected ? false : true}
          // onClick={handleShowFailed}
          isDisabled={true}
        >
          show failed
        </Button>
      </Flex>
    </>
  );
};

export default AllInOne;

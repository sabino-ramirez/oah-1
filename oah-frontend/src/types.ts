//*TODO* move dob to the front
//*TODO* show lab notes from customAttribues parent level
//*TODO* add providerAccount name in search
//*TODO* escape characters in identifier, provAcc, and dob search fields

//*TODO* cannot edit: identifier, proj id, req template, coll date

import { Cell } from "@silevis/reactgrid";

interface requisition extends Record<string, any> {
  // id: number;
  identifier: string;
  // projectTemplateId: number;
  // customAttribues: {
  //   labNotes: string
  // }
  // providerAccount?: {
  //   id: number;
  //   name: string;
  // };
}

export interface UpdateReqFormat {
  requisition: requisition;
  markAsSigned: boolean;
}

export interface WantedReq extends Record<string, any> {
  identifier: string;
  sampCollDate: Date;
  reqTemplate: string;
  // provAccId: string;
  provAccName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  dob: string;
  sex: string;
  race: string;
  ethnicity: string;
  primBillTo: string;
  primInsurId: string;
  primGroupNum: string;
  primNameOfInsured: string;
  primRTI: string;
  primDobOfInsured: string;
  primInsurName: string;
  secInsurId: string;
  secGroupNum: string;
  secNameOfInsured: string;
  secRTI: string;
  secDobOfInsured: string;
  secInsurName: string;
  lab_notes: string;
  failed?: boolean;
}

export interface TypeToSearch {
  identifier: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  provAcc: string;
  resultsList: string[];
}

export interface WrappingCell extends Cell {
  type: "wrap";
  text: string;
}

export interface ErrorJson {}
// types of billTo
// Bill Insurance, Patient Pay, Facility Pay

// first name
// last name
// dob
// identifier

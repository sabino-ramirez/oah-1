//*TODO* move dob to the front
//*TODO* show lab notes from customAttribues parent level
//*TODO* add providerAccount name in search
//*TODO* escape characters in identifier, provAcc, and dob search fields

//*TODO* cannot edit: identifier, proj id, req template, coll date

import { Cell } from "@silevis/reactgrid";

interface requisition extends Record<string, any> {
  id: number;
  identifier: string;
  projectTemplateId: number;
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

export interface WantedReq {
  // requisition
  id: string;
  identifier: string;
  // labNotes: string;
  lab_notes: string;
  projectTemplateId: string;
  reqTemplate?: string;
  sampCollDate?: string;
  // requisition.providerAccount
  provAccId?: string;
  provAccName?: string;
  // //requisition.samples
  // sampId?: string;
  // requisition.patient
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dob?: string;
  gender?: string;
  race?: string;
  ethnicity?: string;
  // requisition.billingInformation
  billTo?: string;
  // requisition.billingInformation.insuranceInformations [{}]
  primInsurId?: string;
  primInsurType?: string;
  primInsurName?: string;
}

export interface TypeToSearch {
  identifier: string;
  firstName: string;
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

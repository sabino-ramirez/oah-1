package models

import (
	"encoding/json"
	"log"
	"strconv"
	"strings"
	"time"
)

func fixBillTo(old string) string {
	var correct string

	switch old {
	case "Insurance":
		correct = "Bill Insurance"
	case "Institutional Bill":
		correct = "Facility Pay"
	case "Patient Bill":
		correct = "Patient Pay"
	default:
		correct = old
	}

	return correct
}

type CsvReq struct {
	Identifier                   string `csv:"Identifier"                      json:"identifier"`
	SampleCollectionDate         string `csv:"Collection Date"                 json:"sampleCollectionDate"`
	Template                     string `csv:"Template"                        json:"template"`
	ProviderID                   string `csv:"Provider NPI,"                   json:"providerID"`
	ProviderName                 string `csv:"Provider Account,"               json:"providerName"`
	PatientLastName              string `csv:"Patient Last Name,"              json:"patientLastName"`
	PatientFirstName             string `csv:"Patient First Name,"             json:"patientFirstName"`
	PatientMiddleName            string `csv:"Patient Middle Name,"            json:"patientMiddleName"`
	PatientStreetAddress         string `csv:"Patient Address 1,"              json:"patientStreetAddress"`
	PatientCity                  string `csv:"Patient City,"                   json:"patientCity"`
	PatientState                 string `csv:"Patient State/Region/Province,"  json:"patientState"`
	PatientZipCode               string `csv:"Patient Zip/Postal Code,"        json:"patientZipCode"`
	PatientDateOfBirth           string `csv:"Patient Date of Birth,"          json:"patientDateOfBirth"`
	PatientSex                   string `csv:"Patient Sex,"                    json:"patientSex"`
	PatientRace                  string `csv:"Patient Race,"                   json:"patientRace"`
	PatientEthnicity             string `csv:"Patient Ethnicity,"              json:"patientEthnicity"`
	BillTo                       string `csv:"Bill To"                         json:"billTo"`
	PrimInsIDNumber              string `csv:"Primary Insurance ID #"          json:"primInsIDNumber"`
	PrimInsGroupNumber           string `csv:"Primary Insurance Group #"       json:"primInsGroupNumber"`
	PrimInsRelationshipToInsured string `csv:"Primary Relationship to Insured" json:"primInsRelationshipToInsured"`
	PrimInsInsuranceProviderName string `csv:"Primary Insurance"               json:"primInsInsuranceProviderName"`
	LabNotes                     string `csv:"Requisition Lab Notes"           json:"lab_notes"`
}

type CsvReqs struct {
	Reqs []CsvReq
}

func (cr *CsvReq) MarshalJSON() ([]byte, error) {
	type Alias CsvReq

	return json.Marshal(&struct {
		*Alias
		BillTo string `csv:"Bill To"                         json:"billTo"`
	}{
		Alias:  (*Alias)(cr),
		BillTo: fixBillTo(cr.BillTo),
	})
}

type JsonToCsvReq struct {
	Identifier                   string `csv:"Identifier"                      json:"identifier"`
	SampleCollectionDate         string `csv:"Collection Date"                 json:"sampleCollectionDate"`
	Template                     string `csv:"Template"                        json:"template"`
	ProviderID                   string `csv:"Provider NPI,"                   json:"providerID"`
	ProviderName                 string `csv:"Provider Account,"               json:"providerName"`
	PatientLastName              string `csv:"Patient Last Name,"              json:"patientLastName"`
	PatientFirstName             string `csv:"Patient First Name,"             json:"patientFirstName"`
	PatientMiddleName            string `csv:"Patient Middle Name,"            json:"patientMiddleName"`
	PatientStreetAddress         string `csv:"Patient Address 1,"              json:"patientStreetAddress"`
	PatientCity                  string `csv:"Patient City,"                   json:"patientCity"`
	PatientState                 string `csv:"Patient State/Region/Province,"  json:"patientState"`
	PatientZipCode               string `csv:"Patient Zip/Postal Code,"        json:"patientZipCode"`
	PatientDateOfBirth           string `csv:"Patient Date of Birth,"          json:"patientDateOfBirth"`
	PatientSex                   string `csv:"Patient Sex,"                    json:"patientSex"`
	PatientRace                  string `csv:"Patient Race,"                   json:"patientRace"`
	PatientEthnicity             string `csv:"Patient Ethnicity,"              json:"patientEthnicity"`
	BillTo                       string `csv:"Bill To"                         json:"billTo"`
	PrimInsIDNumber              string `csv:"Primary Insurance ID #"          json:"primInsIDNumber"`
	PrimInsGroupNumber           string `csv:"Primary Insurance Group #"       json:"primInsGroupNumber"`
	PrimInsRelationshipToInsured string `csv:"Primary Relationship to Insured" json:"primInsRelationshipToInsured"`
	PrimInsInsuranceProviderName string `csv:"Primary Insurance"               json:"primInsInsuranceProviderName"`
	LabNotes                     string `csv:"Requisition Lab Notes"           json:"lab_notes"`
}

func (c *JsonToCsvReq) UnmarshalJSON(data []byte) error {
	log.Println("nestedJson req to csvReq unmarshaller called")

	var betterReq BetterIndividualReq

	if err := json.Unmarshal(data, &betterReq); err != nil {
		return err
	}

	if len(betterReq.Requisition.BillingInformation.InsuranceInformations) == 0 {
		betterReq.Requisition.BillingInformation.InsuranceInformations = []InsuranceInfoEntry{
			{
				IDNumber:              "",
				GroupNumber:           "",
				RelationshipToInsured: "",
				InsuranceType:         "Primary",
				InsuranceProviderName: "",
			},
		}
	}

	// log.Println("ovation return dob before conversion:", betterReq.Requisition.Patient.DateOfBirth)

	d, err := time.Parse("2006-01-02", betterReq.Requisition.Patient.DateOfBirth)
	if err != nil {
		log.Println("time parse err:", err)
	} else {
		betterReq.Requisition.Patient.DateOfBirth = strings.ReplaceAll(d.Format("01-02-2006"), "-", ".")
	}

	// log.Println("ovation return dob after conversion:", betterReq.Requisition.Patient.DateOfBirth)
	log.Printf("after empty check & dob conversion: %+v\n", betterReq)

	tmp := &JsonToCsvReq{
		Identifier:                   betterReq.Requisition.Identifier,
		SampleCollectionDate:         betterReq.Requisition.SampleCollectionDate,
		Template:                     betterReq.Requisition.Template,
		ProviderID:                   strconv.Itoa(betterReq.Requisition.ProviderAccount.ID),
		ProviderName:                 betterReq.Requisition.ProviderAccount.Name,
		PatientLastName:              betterReq.Requisition.Patient.LastName,
		PatientFirstName:             betterReq.Requisition.Patient.FirstName,
		PatientMiddleName:            betterReq.Requisition.Patient.MiddleName,
		PatientStreetAddress:         betterReq.Requisition.Patient.StreetAddress,
		PatientCity:                  betterReq.Requisition.Patient.City,
		PatientState:                 betterReq.Requisition.Patient.State,
		PatientZipCode:               betterReq.Requisition.Patient.ZipCode,
		PatientDateOfBirth:           betterReq.Requisition.Patient.DateOfBirth,
		PatientSex:                   betterReq.Requisition.Patient.Gender,
		PatientRace:                  betterReq.Requisition.Patient.Race,
		PatientEthnicity:             betterReq.Requisition.Patient.Ethnicity,
		BillTo:                       betterReq.Requisition.BillingInformation.BillTo,
		PrimInsIDNumber:              betterReq.Requisition.BillingInformation.InsuranceInformations[0].IDNumber,
		PrimInsGroupNumber:           betterReq.Requisition.BillingInformation.InsuranceInformations[0].GroupNumber,
		PrimInsRelationshipToInsured: betterReq.Requisition.BillingInformation.InsuranceInformations[0].RelationshipToInsured,
		PrimInsInsuranceProviderName: betterReq.Requisition.BillingInformation.InsuranceInformations[0].InsuranceProviderName,
		LabNotes:                     betterReq.Requisition.CustomAttributes.LabNotes,
	}

	*c = *tmp
	return nil
}

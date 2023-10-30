package models

type ErrorResponse struct {
	Errors map[string]interface{} `json:"errors"`
}

type InsuranceInfoEntry struct {
	IDNumber              string `json:"idNumber,omitempty"`
	GroupNumber           string `json:"groupNumber,omitempty"`
	RelationshipToInsured string `json:"relationshipToInsured,omitempty"`
	InsuranceType         string `json:"insuranceType,omitempty"`
	InsuranceProviderName string `json:"insuranceProviderName,omitempty"`
}

type BetterIndividualReq struct {
	Requisition struct {
		Identifier       string `json:"identifier"`
		CustomAttributes struct {
			LabNotes string `json:"lab_notes,omitempty"`
		} `json:"customAttributes,omitempty"`
		SampleCollectionDate string `json:"sampleCollectionDate,omitempty"`
		ProjectName          string `json:"projectName,omitempty"`
		Template             string `json:"template,omitempty"`
		ProviderAccount      struct {
			ID   int    `json:"id,omitempty"`
			Name string `json:"name,omitempty"`
		} `json:"providerAccount,omitempty"`
		Patient struct {
			Identifier    string `json:"identifier,omitempty"`
			LastName      string `json:"lastName,omitempty"`
			FirstName     string `json:"firstName,omitempty"`
			MiddleName    string `json:"middleName,omitempty"`
			StreetAddress string `json:"streetAddress,omitempty"`
			City          string `json:"city,omitempty"`
			State         string `json:"state,omitempty"`
			ZipCode       string `json:"zipCode,omitempty"`
			DateOfBirth   string `json:"dateOfBirth,omitempty"`
			Gender        string `json:"gender,omitempty"`
			Race          string `json:"race,omitempty"`
			Ethnicity     string `json:"ethnicity,omitempty"`
		} `json:"patient,omitempty"`
		BillingInformation struct {
			BillTo                string               `json:"billTo,omitempty"`
			InsuranceInformations []InsuranceInfoEntry `json:"insuranceInformations"`
		} `json:"billingInformation,omitempty"`
	} `json:"requisition,omitempty"`
	MarkAsSigned bool `json:"markAsSigned,omitempty"`
}

type BetterIndividualReqs struct {
	Requisitions []BetterIndividualReq
}

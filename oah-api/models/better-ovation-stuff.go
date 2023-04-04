package models

// import "time"

type BetterIndividualReq struct {
	Requisition struct {
		ID               int    `json:"id,omitempty"`
		Identifier       string `json:"identifier"`
		CustomAttributes struct {
			LabNotes string `json:"labNotes,omitempty"`
		} `json:"customAttributes,omitempty"`
		SampleCollectionDate string `json:"sampleCollectionDate,omitempty"`
		ProjectName          string `json:"projectName,omitempty"`
		ProjectTemplateID    int    `json:"projectTemplateId"`
		Template             string `json:"template,omitempty"`
		ProviderAccount      struct {
			ID   int    `json:"id,omitempty"`
			Name string `json:"name,omitempty"`
		} `json:"providerAccount,omitempty"`
		// Samples []struct {
		// 	ID                    int       `json:"id,omitempty"`
		// 	Identifier            string    `json:"identifier,omitempty"`
		// 	DateReceived          string    `json:"dateReceived,omitempty"`
		// 	SampleCollectionDate  string    `json:"sampleCollectionDate,omitempty"`
		// 	SampleCollectionTime  string    `json:"sampleCollectionTime,omitempty"`
		// 	CollectionDateTime    time.Time `json:"collectionDateTime,omitempty"`
		// 	ReceivedDateTime      time.Time `json:"receivedDateTime,omitempty"`
		// 	ContainerBarcodeLabel string    `json:"containerBarcodeLabel,omitempty"`
		// 	ContainerType         string    `json:"containerType,omitempty"`
		// 	Position              string    `json:"position,omitempty"`
		// } `json:"samples,omitempty"`
		Patient struct {
			Identifier    string `json:"identifier,omitempty"`
			LastName      string `json:"lastName,omitempty"`
			FirstName     string `json:"firstName,omitempty"`
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
			BillTo string `json:"billTo,omitempty"`
			// InsuranceInformations []struct {
			// 	IDNumber              string `json:"idNumber,omitempty"`
			// 	InsuranceProviderName string `json:"insuranceProviderName,omitempty"`
			// 	InsuranceType         string `json:"insuranceType,omitempty"`
			// } `json:"insuranceInformations,omitempty"`
		} `json:"billingInformation,omitempty"`
	} `json:"requisition,omitempty"`
}

type BetterIndividualReqs struct {
	Requisitions []BetterIndividualReq
}

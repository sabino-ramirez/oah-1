package models

import "time"

type ProjectReq struct {
	ID                    int       `json:"id"`
	Identifier            string    `json:"identifier"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
	Status                string    `json:"status"`
	RequisitionTemplateID int       `json:"requisition_template_id"`
	CustomAttributes      struct {
	} `json:"custom_attributes"`
	AccessionStatus  string `json:"accession_status"`
	ProcessingStatus string `json:"processing_status"`
	BillingStatus    string `json:"billing_status"`
	ReportingStatus  string `json:"reporting_status"`
}

type ProjectReqs struct {
	Requisitions []ProjectReq
	Meta         struct {
		CurrentPage  int
		PerPage      int
		TotalEntries int
	}
}

// type IndividualReq struct {
// 	Requisition struct {
// 		ID             int    `json:"id,omitempty"`
// 		Identifier     string `json:"identifier"`
// 		RequestedTests []struct {
// 			PanelCode string `json:"panelCode,omitempty"`
// 			Tests     []struct {
// 				TestCode string `json:"testCode,omitempty"`
// 			} `json:"tests,omitempty"`
// 		} `json:"requestedTests,omitempty"`
// 		Diagnosis            []string    `json:"diagnosis,omitempty"`
// 		Medications          interface{} `json:"medications,omitempty"`
// 		SampleType           string      `json:"sampleType,omitempty"`
// 		SampleCollectionDate string      `json:"sampleCollectionDate,omitempty"`
// 		Status               string      `json:"status,omitempty"`
// 		AccessionStatus      string      `json:"accessionStatus,omitempty"`
// 		ProcessingStatus     string      `json:"processingStatus,omitempty"`
// 		OrderNotes           interface{} `json:"orderNotes,omitempty"`
// 		BillingStatus        string      `json:"billingStatus,omitempty"`
// 		ReportingStatus      string      `json:"reportingStatus,omitempty"`
// 		CustomAttributes     *struct {
// 		} `json:"customAttributes,omitempty"`
// 		LegacyMedications interface{} `json:"legacyMedications,omitempty"`
// 		Test              bool        `json:"test,omitempty"`
// 		ProjectName       string      `json:"projectName,omitempty"`
// 		ProjectTemplateID int         `json:"projectTemplateId"`
// 		Template          string      `json:"template,omitempty"`
// 		EnteredBy         *struct {
// 			Name  string `json:"name,omitempty"`
// 			Email string `json:"email,omitempty"`
// 		} `json:"enteredBy,omitempty"`
// 		HeldReasons                 []interface{} `json:"heldReasons,omitempty"`
// 		SignedConsent               bool          `json:"signedConsent,omitempty"`
// 		HasSecondaryUseNotification interface{}   `json:"hasSecondaryUseNotification,omitempty"`
// 		SecondaryUseEntitlements    interface{}   `json:"secondaryUseEntitlements,omitempty"`
// 		HasMedicalConsent           interface{}   `json:"hasMedicalConsent,omitempty"`
// 		ProviderAccount             *struct {
// 			ID                    int         `json:"id,omitempty"`
// 			Name                  string      `json:"name,omitempty"`
// 			AccountNumber         interface{} `json:"accountNumber,omitempty"`
// 			StreetAddress         string      `json:"streetAddress,omitempty"`
// 			StreetAddressCity     string      `json:"streetAddressCity,omitempty"`
// 			StreetAddressState    string      `json:"streetAddressState,omitempty"`
// 			StreetAddressZipCode  string      `json:"streetAddressZipCode,omitempty"`
// 			StreetAddressCountry  string      `json:"streetAddressCountry,omitempty"`
// 			MailingAddress        interface{} `json:"mailingAddress,omitempty"`
// 			MailingAddressCity    interface{} `json:"mailingAddressCity,omitempty"`
// 			MailingAddressState   interface{} `json:"mailingAddressState,omitempty"`
// 			MailingAddressZipCode interface{} `json:"mailingAddressZipCode,omitempty"`
// 			PrimaryName           interface{} `json:"primaryName,omitempty"`
// 			PrimaryEmail          interface{} `json:"primaryEmail,omitempty"`
// 			PrimaryPhoneNumber    interface{} `json:"primaryPhoneNumber,omitempty"`
// 			FaxNumber             interface{} `json:"faxNumber,omitempty"`
// 			ExternalIdentifier    interface{} `json:"externalIdentifier,omitempty"`
// 		} `json:"providerAccount,omitempty"`
// 		Provider *struct {
// 			Npi               string `json:"npi,omitempty"`
// 			LicensingRegistry string `json:"licensingRegistry,omitempty"`
// 		} `json:"provider,omitempty"`
// 		Samples []struct {
// 			ID                    int       `json:"id,omitempty"`
// 			Identifier            string    `json:"identifier,omitempty"`
// 			DateReceived          string    `json:"dateReceived,omitempty"`
// 			SampleCollectionDate  string    `json:"sampleCollectionDate,omitempty"`
// 			SampleCollectionTime  string    `json:"sampleCollectionTime,omitempty"`
// 			CollectionDateTime    time.Time `json:"collectionDateTime,omitempty"`
// 			ReceivedDateTime      time.Time `json:"receivedDateTime,omitempty"`
// 			ContainerBarcodeLabel string    `json:"containerBarcodeLabel,omitempty"`
// 			ContainerType         string    `json:"containerType,omitempty"`
// 			Position              string    `json:"position,omitempty"`
// 			CustomAttributes      struct {
// 				CustomAttributesSampleCollectedByDiscoverStaff string `json:"customAttributes.sampleCollectedByDiscoverStaff,omitempty"`
// 			} `json:"customAttributes,omitempty"`
// 		} `json:"samples,omitempty"`
// 		Patient *struct {
// 			Identifier         string      `json:"identifier,omitempty"`
// 			LastName           string      `json:"lastName,omitempty"`
// 			FirstName          string      `json:"firstName,omitempty"`
// 			MiddleName         interface{} `json:"middleName,omitempty"`
// 			StreetAddress      string      `json:"streetAddress,omitempty"`
// 			StreetAddressLine2 interface{} `json:"streetAddressLine2,omitempty"`
// 			City               string      `json:"city,omitempty"`
// 			State              string      `json:"state,omitempty"`
// 			ZipCode            string      `json:"zipCode,omitempty"`
// 			Country            string      `json:"country,omitempty"`
// 			DateOfBirth        string      `json:"dateOfBirth,omitempty"`
// 			PhoneNumber        string      `json:"phoneNumber,omitempty"`
// 			Email              string      `json:"email,omitempty"`
// 			Height             interface{} `json:"height,omitempty"`
// 			Weight             interface{} `json:"weight,omitempty"`
// 			Gender             string      `json:"gender,omitempty"`
// 			Race               string      `json:"race,omitempty"`
// 			Ethnicity          string      `json:"ethnicity,omitempty"`
// 			Mrn                interface{} `json:"mrn,omitempty"`
// 			CustomAttributes   *struct {
// 				PregnantPatient        string `json:"pregnantPatient,omitempty"`
// 				ResidentCongregateCare string `json:"residentCongregateCare,omitempty"`
// 				ICU                    string `json:"iCU,omitempty"`
// 				Hospitalized           string `json:"hospitalized,omitempty"`
// 				Symptomatic            string `json:"symptomatic,omitempty"`
// 				EmployedInHealthcare   string `json:"employedInHealthcare,omitempty"`
// 				FirstCovidTest         string `json:"firstCovidTest,omitempty"`
// 			} `json:"customAttributes,omitempty"`
// 		} `json:"patient,omitempty"`
// 		BillingInformation *struct {
// 			BillTo                string        `json:"billTo,omitempty"`
// 			MemberID              interface{}   `json:"memberId,omitempty"`
// 			Name                  string        `json:"name,omitempty"`
// 			Email                 string        `json:"email,omitempty"`
// 			PhoneNumber           string        `json:"phoneNumber,omitempty"`
// 			DateOfInjury          interface{}   `json:"dateOfInjury,omitempty"`
// 			Street                string        `json:"street,omitempty"`
// 			City                  string        `json:"city,omitempty"`
// 			State                 string        `json:"state,omitempty"`
// 			Zip                   string        `json:"zip,omitempty"`
// 			InsuranceInformations []interface{} `json:"insuranceInformations,omitempty"`
// 		} `json:"billingInformation,omitempty"`
// 		Physician *struct {
// 			Npi               string `json:"npi,omitempty"`
// 			LicensingRegistry string `json:"licensingRegistry,omitempty"`
// 		} `json:"physician,omitempty"`
// 		Reports []struct {
// 			ID               int    `json:"id,omitempty"`
// 			Status           string `json:"status,omitempty"`
// 			Result           string `json:"result,omitempty"`
// 			DocumentName     string `json:"documentName,omitempty"`
// 			SampleIdentifier string `json:"sampleIdentifier,omitempty"`
// 			DisplayName      string `json:"displayName,omitempty"`
// 			DownloadLink     string `json:"downloadLink,omitempty"`
// 			CreatedDate      string `json:"createdDate,omitempty"`
// 			SampleTatHours   int    `json:"sampleTatHours,omitempty"`
// 			SignedBy         []struct {
// 				Name           string    `json:"name,omitempty"`
// 				Email          string    `json:"email,omitempty"`
// 				SignedDateTime time.Time `json:"signedDateTime,omitempty"`
// 			} `json:"signedBy,omitempty"`
// 			WorkflowID   int    `json:"workflowId,omitempty"`
// 			WorkflowName string `json:"workflowName,omitempty"`
// 			DocumentID   int    `json:"document_id,omitempty"`
// 			SampleID     int    `json:"sample_id,omitempty"`
// 		} `json:"reports,omitempty"`
// 		SalesAccount *struct {
// 			ID                    int         `json:"id,omitempty"`
// 			Name                  string      `json:"name,omitempty"`
// 			AccountNumber         interface{} `json:"accountNumber,omitempty"`
// 			StreetAddress         string      `json:"streetAddress,omitempty"`
// 			StreetAddressCity     string      `json:"streetAddressCity,omitempty"`
// 			StreetAddressState    string      `json:"streetAddressState,omitempty"`
// 			StreetAddressZipCode  string      `json:"streetAddressZipCode,omitempty"`
// 			StreetAddressCountry  string      `json:"streetAddressCountry,omitempty"`
// 			MailingAddress        interface{} `json:"mailingAddress,omitempty"`
// 			MailingAddressCity    interface{} `json:"mailingAddressCity,omitempty"`
// 			MailingAddressState   interface{} `json:"mailingAddressState,omitempty"`
// 			MailingAddressZipCode interface{} `json:"mailingAddressZipCode,omitempty"`
// 			PrimaryName           interface{} `json:"primaryName,omitempty"`
// 			PrimaryEmail          interface{} `json:"primaryEmail,omitempty"`
// 			PrimaryPhoneNumber    interface{} `json:"primaryPhoneNumber,omitempty"`
// 			FaxNumber             interface{} `json:"faxNumber,omitempty"`
// 			ExternalIdentifier    interface{} `json:"externalIdentifier,omitempty"`
// 		} `json:"sales_account,omitempty"`
// 		Documents []struct {
// 			ID                    int         `json:"id,omitempty"`
// 			Name                  string      `json:"name,omitempty"`
// 			RequisitionID         int         `json:"requisitionId,omitempty"`
// 			RequisitionIdentifier string      `json:"requisitionIdentifier,omitempty"`
// 			DownloadLink          string      `json:"downloadLink,omitempty"`
// 			CreatedAt             time.Time   `json:"createdAt,omitempty"`
// 			UploadLink            interface{} `json:"uploadLink,omitempty"`
// 		} `json:"documents,omitempty"`
// 	} `json:"requisition"`
// }

// type IndividualReqs struct {
// 	Requisitions []IndividualReq
// }

type ProjectTemp struct {
	Id           int
	ProjectName  string
	TemplateName string
}

type ProjectTemps struct {
	Project_templates []ProjectTemp
}

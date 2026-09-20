export interface OfferDetails {
  waveId: string;
  campaignId: string;
  offerId: string;
}

export interface ConsentDetails {
  consentType: string;
  consentGivenFlag: boolean;
}

export interface PolicyDetails {
  insuranceProductCode: string;
  insuranceProductCurrencyCode: string;
  userApplicationNumber: string;
  insurancePolicyNumber: string;
  insurancePolicyStatus: string;
  insuranceSumAssuredAmount: number;
  insurancePremiumPaymentFrequency: string;
  policyTermType: string;
  policyTerm: number;
  premiumPaymentTermType: string;
  premiumPaymentTerm: number;
  policyBillingMode: string;
  insurancePolicyEffectiveDate: string;
  basePremiumAmount: number;
  addOnPremiumAmount: number;
  totalPremiumAmount: number;
  policyMaturityDate: string;
  vitalityMembershipFee: number;
  vitalityPremiumDiscount: number;
  initialPremiumModal: number;
  insuranceLevyAmount: number;
  consentDetails: ConsentDetails;
  firstPremiumDueDate: string;
}

export interface RiderDetail {
  riderCode: string;
  riderSumAssuredAmount: number;
  addOnPremiumAmount: number;
  riderTermType: string;
  riderTerm: number;
  riderPaymentTermType: string;
  riderPaymentTerm: number;
  riderEffectiveDate: string;
}

export interface PersonName {
  salutation: string;
  givenName: string;
  middleName: string;
  surname: string;
}

export interface IdDocDetail {
  idType: string;
  idNumber: string;
}

export interface Demographics {
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
}

export interface AdditionalData {
  relationshipWithPrimary: string;
}

export interface EmailItem {
  emailAddress: string;
}

export interface AddressItem {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  cityName: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface PhoneItem {
  phoneNumber: string;
  phoneCountryCode: string;
  areaCode: string;
  extension: string;
}

export interface QuestionnaireItem {
  questionId: string;
  answerText: string;
  remarks: string;
}

export interface ApplicantItem {
  name: PersonName;
  identificationDocumentDetails: IdDocDetail[];
  demographics: Demographics;
  ownershipType: string;
  additionalData: AdditionalData;
  email: EmailItem[];
  address: AddressItem[];
  phone: PhoneItem[];
  questionnaire: QuestionnaireItem[];
}

export interface InitialPaymentDetails {
  sourceAccountId: string;
}

export interface PremiumSourceAccount {
  sourceAccountId: string;
}

export interface BeneficiaryItem {
  identificationDocumentDetails: IdDocDetail[];
  name: PersonName;
  demographics: Demographics;
  additionalData: AdditionalData;
  insuranceSumAssuredAllocPercentage: number;
}

export interface InsuranceBookingPayload {
  offerDetails: OfferDetails;
  policyDetails: PolicyDetails;
  riderDetails: RiderDetail[];
  applicant: ApplicantItem[];
  initialPaymentDetails: InitialPaymentDetails;
  premiumSourceAccount: PremiumSourceAccount;
  beneficiary: BeneficiaryItem[];
}

export interface RequestHeadersConfig {
  apiUrl: string;
  clientId: string;
  uuid: string;
  bearerToken: string;
  accept: string;
  contentType: string;
}

export interface ApiCallResult {
  timestamp: string;
  success: boolean;
  status: number;
  statusText: string;
  durationMs: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  data: any;
  error?: string;
  isExampleResponse?: boolean;
}

export const DEFAULT_EXAMPLE_PAYLOAD: InsuranceBookingPayload = {
  offerDetails: {
    waveId: "987654321",
    campaignId: "123456789",
    offerId: "111000125"
  },
  policyDetails: {
    insuranceProductCode: "PR001",
    insuranceProductCurrencyCode: "SGD",
    userApplicationNumber: "83748374389",
    insurancePolicyNumber: "83748374389",
    insurancePolicyStatus: "APPLICATION",
    insuranceSumAssuredAmount: 25000.12,
    insurancePremiumPaymentFrequency: "MONTHLY",
    policyTermType: "MONTH",
    policyTerm: 120,
    premiumPaymentTermType: "MONTH",
    premiumPaymentTerm: 180,
    policyBillingMode: "INTERNAL",
    insurancePolicyEffectiveDate: "2018-11-01",
    basePremiumAmount: 1000.21,
    addOnPremiumAmount: 100.52,
    totalPremiumAmount: 1110.73,
    policyMaturityDate: "2022-07-14",
    vitalityMembershipFee: 100.52,
    vitalityPremiumDiscount: 100.52,
    initialPremiumModal: 100.52,
    insuranceLevyAmount: 100.52,
    consentDetails: {
      consentType: "COUNTER_OFFER_CONSENT",
      consentGivenFlag: true
    },
    firstPremiumDueDate: "2022-07-14"
  },
  riderDetails: [
    {
      riderCode: "TP",
      riderSumAssuredAmount: 25000.11,
      addOnPremiumAmount: 0,
      riderTermType: "MONTHS",
      riderTerm: 60,
      riderPaymentTermType: "MONTHS",
      riderPaymentTerm: 48,
      riderEffectiveDate: "2022-07-14"
    }
  ],
  applicant: [
    {
      name: {
        salutation: "MR.",
        givenName: "Javier",
        middleName: "Perez",
        surname: "de Cuellar"
      },
      identificationDocumentDetails: [
        {
          idType: "PASSPORT",
          idNumber: "Passport- 443431"
        }
      ],
      demographics: {
        gender: "MALE",
        dateOfBirth: "1980-01-01",
        maritalStatus: "SINGLE",
        nationality: "SG"
      },
      ownershipType: "OWNER",
      additionalData: {
        relationshipWithPrimary: "HUSBAND"
      },
      email: [
        {
          emailAddress: "javier@abcd.com"
        }
      ],
      address: [
        {
          addressLine1: "40A Orchard Road",
          addressLine2: "#99-99 Macdonald House",
          addressLine3: "Orchard Avenue 2",
          addressLine4: "Street 65",
          cityName: "Singapore",
          state: "SINGAPORE",
          postalCode: "520189",
          countryCode: "string"
        }
      ],
      phone: [
        {
          phoneNumber: "4567234512",
          phoneCountryCode: "34",
          areaCode: "O",
          extension: "O"
        }
      ],
      questionnaire: [
        {
          questionId: "1",
          answerText: "Yes or No",
          remarks: "Health Declartion"
        }
      ]
    }
  ],
  initialPaymentDetails: {
    sourceAccountId: "3c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d"
  },
  premiumSourceAccount: {
    sourceAccountId: "1234567896f2b4d4d796c344e387563374a476jfhjd23478377889738343d"
  },
  beneficiary: [
    {
      identificationDocumentDetails: [
        {
          idType: "PASSPORT",
          idNumber: "Passport- 443431"
        }
      ],
      name: {
        salutation: "MR.",
        givenName: "Javier",
        middleName: "Perez",
        surname: "de Cuellar"
      },
      demographics: {
        gender: "MALE",
        dateOfBirth: "1980-01-01",
        maritalStatus: "SINGLE",
        nationality: "SG"
      },
      additionalData: {
        relationshipWithPrimary: "HUSBAND"
      },
      insuranceSumAssuredAllocPercentage: 0
    }
  ]
};

export const DEFAULT_HEADERS_CONFIG: RequestHeadersConfig = {
  apiUrl: "https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/insurance/bookings/withOfflinePayments",
  clientId: "8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI",
  uuid: "4fd8eb84-cf25-4be1-ab36-e52c7fc8cb52",
  bearerToken: "",
  accept: "application/json",
  contentType: "application/json"
};

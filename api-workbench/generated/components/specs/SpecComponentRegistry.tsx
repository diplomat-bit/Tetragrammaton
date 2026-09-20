import React from 'react';
import { SpecUI_Access_Online_Transactions_and_Orders } from './SpecUI_Access_Online_Transactions_and_Orders';
import { SpecUI_Account_Statements } from './SpecUI_Account_Statements';
import { SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI } from './SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI';
import { SpecUI_B2B_Virtual_Account_Payment_Method } from './SpecUI_B2B_Virtual_Account_Payment_Method';
import { SpecUI_Broker_API } from './SpecUI_Broker_API';
import { SpecUI_CardAccountBalanceTransferEligibility_OpenAPI } from './SpecUI_CardAccountBalanceTransferEligibility_OpenAPI';
import { SpecUI_Card_on_File_Data_Inquiry } from './SpecUI_Card_on_File_Data_Inquiry';
import { SpecUI_Click_to_Pay } from './SpecUI_Click_to_Pay';
import { SpecUI_Consent_Authorization } from './SpecUI_Consent_Authorization';
import { SpecUI_Corporate_Account_Information } from './SpecUI_Corporate_Account_Information';
import { SpecUI_Custody } from './SpecUI_Custody';
import { SpecUI_Customers_Profiles } from './SpecUI_Customers_Profiles';
import { SpecUI_DPS_Card_and_Account_Services } from './SpecUI_DPS_Card_and_Account_Services';
import { SpecUI_Finicity_API } from './SpecUI_Finicity_API';
import { SpecUI_Foreign_Exchange_Rates } from './SpecUI_Foreign_Exchange_Rates';
import { SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI } from './SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI';
import { SpecUI_Incoming_webhooks } from './SpecUI_Incoming_webhooks';
import { SpecUI_Kernel_in_the_Cloud } from './SpecUI_Kernel_in_the_Cloud';
import { SpecUI_PayPal_APIs } from './SpecUI_PayPal_APIs';
import { SpecUI_RewardLinkageShopWithPoints_OpenAPI } from './SpecUI_RewardLinkageShopWithPoints_OpenAPI';
import { SpecUI_RewardRedemptionSelectAndCredit_OpenAPI } from './SpecUI_RewardRedemptionSelectAndCredit_OpenAPI';
import { SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI } from './SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI';
import { SpecUI_TaxStatement_Digital_Orchestation } from './SpecUI_TaxStatement_Digital_Orchestation';
import { SpecUI_Token_Authorization } from './SpecUI_Token_Authorization';
import { SpecUI_Virtual_Card_Payments } from './SpecUI_Virtual_Card_Payments';
import { SpecUI_VisaNet_Connect_Issuing } from './SpecUI_VisaNet_Connect_Issuing';
import { SpecUI_Visa_Accounts_Receivable_Manager } from './SpecUI_Visa_Accounts_Receivable_Manager';
import { SpecUI_Visa_BIN_Attribute_Sharing_Service } from './SpecUI_Visa_BIN_Attribute_Sharing_Service';
import { SpecUI_Visa_Card_Program_Management } from './SpecUI_Visa_Card_Program_Management';
import { SpecUI_Visa_Consumer_Authentication_Service } from './SpecUI_Visa_Consumer_Authentication_Service';
import { SpecUI_Visa_Credit_Card_Application } from './SpecUI_Visa_Credit_Card_Application';
import { SpecUI_Visa_DCVV2_Generate } from './SpecUI_Visa_DCVV2_Generate';
import { SpecUI_Visa_Direct } from './SpecUI_Visa_Direct';
import { SpecUI_Visa_Direct_Connect } from './SpecUI_Visa_Direct_Connect';
import { SpecUI_Visa_Pay } from './SpecUI_Visa_Pay';
import { SpecUI_Visa_Payment_Passkey } from './SpecUI_Visa_Payment_Passkey';
import { SpecUI_Visa_Travel_Notification_Service } from './SpecUI_Visa_Travel_Notification_Service';
import { SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml } from './SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml';
import { SpecUI_XML_Schema_Common_Groups_xsd_xml } from './SpecUI_XML_Schema_Common_Groups_xsd_xml';

export interface SpecRegistryItem {
  id: string;
  title: string;
  componentName: string;
  fileName: string;
  endpointsCount: number;
  xsdTypesCount: number;
  format: string;
  component: React.FC<any>;
}

export const SPEC_COMPONENTS_MAP: Record<string, React.FC<any>> = {
  "openapi__4__json": SpecUI_Access_Online_Transactions_and_Orders,
  "Statement_Digital_Orchestration_Api-5-swagger_yaml__1_": SpecUI_Account_Statements,
  "Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI-2-swagger__1__yaml": SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI,
  "api_reference__10__json": SpecUI_B2B_Virtual_Account_Payment_Method,
  "Broker_API_postman_collection_json_txt": SpecUI_Broker_API,
  "CardAccountBalanceTransferEligibility_OpenAPI-4-swagger_yaml": SpecUI_CardAccountBalanceTransferEligibility_OpenAPI,
  "api_reference__17__json": SpecUI_Card_on_File_Data_Inquiry,
  "api_reference__13__json": SpecUI_Click_to_Pay,
  "Oauth2_Security_Idp_Api-4-swagger_yaml": SpecUI_Consent_Authorization,
  "openapi__6__json": SpecUI_Corporate_Account_Information,
  "openapi__3__json": SpecUI_Custody,
  "Openbanking_Customerprofile_Orchestrator_Api-5-swagger_yaml": SpecUI_Customers_Profiles,
  "api_reference__3__json": SpecUI_DPS_Card_and_Account_Services,
  "finicity-apimatic-20220106_yaml": SpecUI_Finicity_API,
  "api_reference__16__json": SpecUI_Foreign_Exchange_Rates,
  "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI-3-swagger__1__yaml": SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI,
  "openapi_json": SpecUI_Incoming_webhooks,
  "api_reference__8__json": SpecUI_Kernel_in_the_Cloud,
  "PayPal_APIs_postman_collection_json_txt": SpecUI_PayPal_APIs,
  "RewardLinkageShopWithPoints_OpenAPI-4-swagger_yaml__1_": SpecUI_RewardLinkageShopWithPoints_OpenAPI,
  "RewardRedemptionSelectAndCredit_OpenAPI-5-swagger_yaml__1_": SpecUI_RewardRedemptionSelectAndCredit_OpenAPI,
  "SecurityE2EKeyExchangePreLogin_Partner_OpenAPI-5-swagger_yaml": SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI,
  "TaxStatement_Digital_Orchestration_Api-1-swagger_yaml__1_": SpecUI_TaxStatement_Digital_Orchestation,
  "Auth_Digital_Public_Token_Api-2-swagger__1__yaml": SpecUI_Token_Authorization,
  "openapi__5__json": SpecUI_Virtual_Card_Payments,
  "api_reference__1__json": SpecUI_VisaNet_Connect_Issuing,
  "api_reference__9__json": SpecUI_Visa_Accounts_Receivable_Manager,
  "api_reference__15__json": SpecUI_Visa_BIN_Attribute_Sharing_Service,
  "api_reference__14__json": SpecUI_Visa_Card_Program_Management,
  "api_reference__19__json": SpecUI_Visa_Consumer_Authentication_Service,
  "api_reference__5__json": SpecUI_Visa_Credit_Card_Application,
  "api_reference__11__json": SpecUI_Visa_DCVV2_Generate,
  "api_reference_json": SpecUI_Visa_Direct,
  "api_reference__6__json": SpecUI_Visa_Direct_Connect,
  "api_reference__12__json": SpecUI_Visa_Pay,
  "api_reference__18__json": SpecUI_Visa_Payment_Passkey,
  "api_reference__4__json": SpecUI_Visa_Travel_Notification_Service,
  "Common_ComplexTypes_xsd_xml": SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml,
  "Common_Groups_xsd_xml": SpecUI_XML_Schema_Common_Groups_xsd_xml,
};

export const SPEC_COMPONENTS_BY_NAME: Record<string, React.FC<any>> = {
  "SpecUI_Access_Online_Transactions_and_Orders": SpecUI_Access_Online_Transactions_and_Orders,
  "SpecUI_Account_Statements": SpecUI_Account_Statements,
  "SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI": SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI,
  "SpecUI_B2B_Virtual_Account_Payment_Method": SpecUI_B2B_Virtual_Account_Payment_Method,
  "SpecUI_Broker_API": SpecUI_Broker_API,
  "SpecUI_CardAccountBalanceTransferEligibility_OpenAPI": SpecUI_CardAccountBalanceTransferEligibility_OpenAPI,
  "SpecUI_Card_on_File_Data_Inquiry": SpecUI_Card_on_File_Data_Inquiry,
  "SpecUI_Click_to_Pay": SpecUI_Click_to_Pay,
  "SpecUI_Consent_Authorization": SpecUI_Consent_Authorization,
  "SpecUI_Corporate_Account_Information": SpecUI_Corporate_Account_Information,
  "SpecUI_Custody": SpecUI_Custody,
  "SpecUI_Customers_Profiles": SpecUI_Customers_Profiles,
  "SpecUI_DPS_Card_and_Account_Services": SpecUI_DPS_Card_and_Account_Services,
  "SpecUI_Finicity_API": SpecUI_Finicity_API,
  "SpecUI_Foreign_Exchange_Rates": SpecUI_Foreign_Exchange_Rates,
  "SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI": SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI,
  "SpecUI_Incoming_webhooks": SpecUI_Incoming_webhooks,
  "SpecUI_Kernel_in_the_Cloud": SpecUI_Kernel_in_the_Cloud,
  "SpecUI_PayPal_APIs": SpecUI_PayPal_APIs,
  "SpecUI_RewardLinkageShopWithPoints_OpenAPI": SpecUI_RewardLinkageShopWithPoints_OpenAPI,
  "SpecUI_RewardRedemptionSelectAndCredit_OpenAPI": SpecUI_RewardRedemptionSelectAndCredit_OpenAPI,
  "SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI": SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI,
  "SpecUI_TaxStatement_Digital_Orchestation": SpecUI_TaxStatement_Digital_Orchestation,
  "SpecUI_Token_Authorization": SpecUI_Token_Authorization,
  "SpecUI_Virtual_Card_Payments": SpecUI_Virtual_Card_Payments,
  "SpecUI_VisaNet_Connect_Issuing": SpecUI_VisaNet_Connect_Issuing,
  "SpecUI_Visa_Accounts_Receivable_Manager": SpecUI_Visa_Accounts_Receivable_Manager,
  "SpecUI_Visa_BIN_Attribute_Sharing_Service": SpecUI_Visa_BIN_Attribute_Sharing_Service,
  "SpecUI_Visa_Card_Program_Management": SpecUI_Visa_Card_Program_Management,
  "SpecUI_Visa_Consumer_Authentication_Service": SpecUI_Visa_Consumer_Authentication_Service,
  "SpecUI_Visa_Credit_Card_Application": SpecUI_Visa_Credit_Card_Application,
  "SpecUI_Visa_DCVV2_Generate": SpecUI_Visa_DCVV2_Generate,
  "SpecUI_Visa_Direct": SpecUI_Visa_Direct,
  "SpecUI_Visa_Direct_Connect": SpecUI_Visa_Direct_Connect,
  "SpecUI_Visa_Pay": SpecUI_Visa_Pay,
  "SpecUI_Visa_Payment_Passkey": SpecUI_Visa_Payment_Passkey,
  "SpecUI_Visa_Travel_Notification_Service": SpecUI_Visa_Travel_Notification_Service,
  "SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml": SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml,
  "SpecUI_XML_Schema_Common_Groups_xsd_xml": SpecUI_XML_Schema_Common_Groups_xsd_xml,
};

export const SPEC_COMPONENTS_LIST: SpecRegistryItem[] = [
  {
    id: "openapi__4__json",
    title: "Access Online Transactions and Orders",
    componentName: "SpecUI_Access_Online_Transactions_and_Orders",
    fileName: "SpecUI_Access_Online_Transactions_and_Orders.tsx",
    endpointsCount: 4,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Access_Online_Transactions_and_Orders
  },
  {
    id: "Statement_Digital_Orchestration_Api-5-swagger_yaml__1_",
    title: "Account Statements",
    componentName: "SpecUI_Account_Statements",
    fileName: "SpecUI_Account_Statements.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Account_Statements
  },
  {
    id: "Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI-2-swagger__1__yaml",
    title: "Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI",
    componentName: "SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI",
    fileName: "SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Accounts_AccountTransactions_FinancialDetails_Digital_Domain_OpenAPI
  },
  {
    id: "api_reference__10__json",
    title: "B2B Virtual Account Payment Method",
    componentName: "SpecUI_B2B_Virtual_Account_Payment_Method",
    fileName: "SpecUI_B2B_Virtual_Account_Payment_Method.tsx",
    endpointsCount: 30,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_B2B_Virtual_Account_Payment_Method
  },
  {
    id: "Broker_API_postman_collection_json_txt",
    title: "Broker API",
    componentName: "SpecUI_Broker_API",
    fileName: "SpecUI_Broker_API.tsx",
    endpointsCount: 30,
    xsdTypesCount: 0,
    format: "postman",
    component: SpecUI_Broker_API
  },
  {
    id: "CardAccountBalanceTransferEligibility_OpenAPI-4-swagger_yaml",
    title: "CardAccountBalanceTransferEligibility_OpenAPI",
    componentName: "SpecUI_CardAccountBalanceTransferEligibility_OpenAPI",
    fileName: "SpecUI_CardAccountBalanceTransferEligibility_OpenAPI.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_CardAccountBalanceTransferEligibility_OpenAPI
  },
  {
    id: "api_reference__17__json",
    title: "Card on File Data Inquiry",
    componentName: "SpecUI_Card_on_File_Data_Inquiry",
    fileName: "SpecUI_Card_on_File_Data_Inquiry.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Card_on_File_Data_Inquiry
  },
  {
    id: "api_reference__13__json",
    title: "Click to Pay",
    componentName: "SpecUI_Click_to_Pay",
    fileName: "SpecUI_Click_to_Pay.tsx",
    endpointsCount: 8,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Click_to_Pay
  },
  {
    id: "Oauth2_Security_Idp_Api-4-swagger_yaml",
    title: "Consent Authorization",
    componentName: "SpecUI_Consent_Authorization",
    fileName: "SpecUI_Consent_Authorization.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Consent_Authorization
  },
  {
    id: "openapi__6__json",
    title: "Corporate Account Information",
    componentName: "SpecUI_Corporate_Account_Information",
    fileName: "SpecUI_Corporate_Account_Information.tsx",
    endpointsCount: 16,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Corporate_Account_Information
  },
  {
    id: "openapi__3__json",
    title: "Custody",
    componentName: "SpecUI_Custody",
    fileName: "SpecUI_Custody.tsx",
    endpointsCount: 6,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Custody
  },
  {
    id: "Openbanking_Customerprofile_Orchestrator_Api-5-swagger_yaml",
    title: "Customers Profiles",
    componentName: "SpecUI_Customers_Profiles",
    fileName: "SpecUI_Customers_Profiles.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Customers_Profiles
  },
  {
    id: "api_reference__3__json",
    title: "DPS Card and Account Services",
    componentName: "SpecUI_DPS_Card_and_Account_Services",
    fileName: "SpecUI_DPS_Card_and_Account_Services.tsx",
    endpointsCount: 24,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_DPS_Card_and_Account_Services
  },
  {
    id: "finicity-apimatic-20220106_yaml",
    title: "Finicity API",
    componentName: "SpecUI_Finicity_API",
    fileName: "SpecUI_Finicity_API.tsx",
    endpointsCount: 30,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Finicity_API
  },
  {
    id: "api_reference__16__json",
    title: "Foreign Exchange Rates",
    componentName: "SpecUI_Foreign_Exchange_Rates",
    fileName: "SpecUI_Foreign_Exchange_Rates.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Foreign_Exchange_Rates
  },
  {
    id: "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI-3-swagger__1__yaml",
    title: "IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI",
    componentName: "SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI",
    fileName: "SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI.tsx",
    endpointsCount: 4,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_IAM_TokenManagement_PartnerOauth2AuthorizationCodeManagement_Digital_Domain_OpenAPI
  },
  {
    id: "openapi_json",
    title: "Incoming webhooks",
    componentName: "SpecUI_Incoming_webhooks",
    fileName: "SpecUI_Incoming_webhooks.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Incoming_webhooks
  },
  {
    id: "api_reference__8__json",
    title: "Kernel in the Cloud",
    componentName: "SpecUI_Kernel_in_the_Cloud",
    fileName: "SpecUI_Kernel_in_the_Cloud.tsx",
    endpointsCount: 3,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Kernel_in_the_Cloud
  },
  {
    id: "PayPal_APIs_postman_collection_json_txt",
    title: "PayPal APIs",
    componentName: "SpecUI_PayPal_APIs",
    fileName: "SpecUI_PayPal_APIs.tsx",
    endpointsCount: 30,
    xsdTypesCount: 0,
    format: "postman",
    component: SpecUI_PayPal_APIs
  },
  {
    id: "RewardLinkageShopWithPoints_OpenAPI-4-swagger_yaml__1_",
    title: "RewardLinkageShopWithPoints_OpenAPI",
    componentName: "SpecUI_RewardLinkageShopWithPoints_OpenAPI",
    fileName: "SpecUI_RewardLinkageShopWithPoints_OpenAPI.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_RewardLinkageShopWithPoints_OpenAPI
  },
  {
    id: "RewardRedemptionSelectAndCredit_OpenAPI-5-swagger_yaml__1_",
    title: "RewardRedemptionSelectAndCredit_OpenAPI",
    componentName: "SpecUI_RewardRedemptionSelectAndCredit_OpenAPI",
    fileName: "SpecUI_RewardRedemptionSelectAndCredit_OpenAPI.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_RewardRedemptionSelectAndCredit_OpenAPI
  },
  {
    id: "SecurityE2EKeyExchangePreLogin_Partner_OpenAPI-5-swagger_yaml",
    title: "SecurityE2EKeyExchangePreLogin_Partner_OpenAPI",
    componentName: "SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI",
    fileName: "SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_SecurityE2EKeyExchangePreLogin_Partner_OpenAPI
  },
  {
    id: "TaxStatement_Digital_Orchestration_Api-1-swagger_yaml__1_",
    title: "TaxStatement_Digital_Orchestation",
    componentName: "SpecUI_TaxStatement_Digital_Orchestation",
    fileName: "SpecUI_TaxStatement_Digital_Orchestation.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_TaxStatement_Digital_Orchestation
  },
  {
    id: "Auth_Digital_Public_Token_Api-2-swagger__1__yaml",
    title: "Token Authorization",
    componentName: "SpecUI_Token_Authorization",
    fileName: "SpecUI_Token_Authorization.tsx",
    endpointsCount: 3,
    xsdTypesCount: 0,
    format: "swagger_2",
    component: SpecUI_Token_Authorization
  },
  {
    id: "openapi__5__json",
    title: "Virtual Card Payments",
    componentName: "SpecUI_Virtual_Card_Payments",
    fileName: "SpecUI_Virtual_Card_Payments.tsx",
    endpointsCount: 19,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Virtual_Card_Payments
  },
  {
    id: "api_reference__1__json",
    title: "VisaNet Connect - Issuing",
    componentName: "SpecUI_VisaNet_Connect_Issuing",
    fileName: "SpecUI_VisaNet_Connect_Issuing.tsx",
    endpointsCount: 4,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_VisaNet_Connect_Issuing
  },
  {
    id: "api_reference__9__json",
    title: "Visa Accounts Receivable Manager",
    componentName: "SpecUI_Visa_Accounts_Receivable_Manager",
    fileName: "SpecUI_Visa_Accounts_Receivable_Manager.tsx",
    endpointsCount: 10,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Accounts_Receivable_Manager
  },
  {
    id: "api_reference__15__json",
    title: "Visa BIN Attribute Sharing Service",
    componentName: "SpecUI_Visa_BIN_Attribute_Sharing_Service",
    fileName: "SpecUI_Visa_BIN_Attribute_Sharing_Service.tsx",
    endpointsCount: 8,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_BIN_Attribute_Sharing_Service
  },
  {
    id: "api_reference__14__json",
    title: "Visa Card Program Management",
    componentName: "SpecUI_Visa_Card_Program_Management",
    fileName: "SpecUI_Visa_Card_Program_Management.tsx",
    endpointsCount: 2,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Card_Program_Management
  },
  {
    id: "api_reference__19__json",
    title: "Visa Consumer Authentication Service",
    componentName: "SpecUI_Visa_Consumer_Authentication_Service",
    fileName: "SpecUI_Visa_Consumer_Authentication_Service.tsx",
    endpointsCount: 5,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Consumer_Authentication_Service
  },
  {
    id: "api_reference__5__json",
    title: "Visa Credit Card Application",
    componentName: "SpecUI_Visa_Credit_Card_Application",
    fileName: "SpecUI_Visa_Credit_Card_Application.tsx",
    endpointsCount: 1,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Credit_Card_Application
  },
  {
    id: "api_reference__11__json",
    title: "Visa DCVV2 Generate",
    componentName: "SpecUI_Visa_DCVV2_Generate",
    fileName: "SpecUI_Visa_DCVV2_Generate.tsx",
    endpointsCount: 4,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_DCVV2_Generate
  },
  {
    id: "api_reference_json",
    title: "Visa Direct",
    componentName: "SpecUI_Visa_Direct",
    fileName: "SpecUI_Visa_Direct.tsx",
    endpointsCount: 27,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Direct
  },
  {
    id: "api_reference__6__json",
    title: "Visa Direct Connect",
    componentName: "SpecUI_Visa_Direct_Connect",
    fileName: "SpecUI_Visa_Direct_Connect.tsx",
    endpointsCount: 25,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Direct_Connect
  },
  {
    id: "api_reference__12__json",
    title: "Visa Pay",
    componentName: "SpecUI_Visa_Pay",
    fileName: "SpecUI_Visa_Pay.tsx",
    endpointsCount: 11,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Pay
  },
  {
    id: "api_reference__18__json",
    title: "Visa Payment Passkey",
    componentName: "SpecUI_Visa_Payment_Passkey",
    fileName: "SpecUI_Visa_Payment_Passkey.tsx",
    endpointsCount: 5,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Payment_Passkey
  },
  {
    id: "api_reference__4__json",
    title: "Visa Travel Notification Service",
    componentName: "SpecUI_Visa_Travel_Notification_Service",
    fileName: "SpecUI_Visa_Travel_Notification_Service.tsx",
    endpointsCount: 4,
    xsdTypesCount: 0,
    format: "openapi_3",
    component: SpecUI_Visa_Travel_Notification_Service
  },
  {
    id: "Common_ComplexTypes_xsd_xml",
    title: "XML Schema: Common_ComplexTypes.xsd.xml",
    componentName: "SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml",
    fileName: "SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml.tsx",
    endpointsCount: 0,
    xsdTypesCount: 318,
    format: "xsd",
    component: SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml
  },
  {
    id: "Common_Groups_xsd_xml",
    title: "XML Schema: Common_Groups.xsd.xml",
    componentName: "SpecUI_XML_Schema_Common_Groups_xsd_xml",
    fileName: "SpecUI_XML_Schema_Common_Groups_xsd_xml.tsx",
    endpointsCount: 0,
    xsdTypesCount: 0,
    format: "xsd",
    component: SpecUI_XML_Schema_Common_Groups_xsd_xml
  },
];

export function getSpecComponent(specIdOrName: string): React.FC<any> | null {
  if (!specIdOrName) return null;
  return SPEC_COMPONENTS_MAP[specIdOrName] || SPEC_COMPONENTS_BY_NAME[specIdOrName] || null;
}

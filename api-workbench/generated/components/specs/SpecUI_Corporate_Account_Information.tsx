import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Corporate_Account_InformationProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "openapi__6__json",
  title: "Corporate Account Information",
  version: "2.5.0",
  format: "openapi_3",
  description: "Corporate Accounts API allow clients to: * Retrieve list of accounts(DDA, credit card, trust, and loan accounts) * Retrieve DDA Account balances for current-day and previous-day * Retrieve DDA Transactions for current-day and previous-day *",
  baseUrl: "https://api2.usbank.com/commercial-banking/account-management/v2",
  endpoints: [{"id":"GET__accounts","path":"/accounts","method":"GET","summary":"Get list of accounts for the authorized customer.","operationId":"getAccounts","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountType","in":"query","required":false,"type":"string","description":"1. Type of account list requested 2. If non provided, the list will be defaulted to DDA.","example":"DDA"},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__accounts_current_day","path":"/accounts/current-day","method":"POST","summary":"Get account balances for an array of accounts for current-day.","operationId":"getAccountBalancesOfCurrentDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"}],"hasBody":true,"samplePayload":{}},{"id":"POST__accounts_previous_day","path":"/accounts/previous-day","method":"POST","summary":"Get account balances for an array of accounts for previous-day.","operationId":"getAccountBalancesOfPreviousDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"},{"name":"date","in":"query","required":false,"type":"string","description":"The date for which you want to retrieve transactions. ISO 8601. This endpoint supports only one day of historical data at a time. You can go back and fetch data depending on the retention policy (4,12, or 24 months) enabled on your account;","example":""}],"hasBody":true,"samplePayload":{}},{"id":"GET__accounts__accountID__balance","path":"/accounts/{accountID}/balance","method":"GET","summary":"Get good funds balance for one demand deposit account.","operationId":"getRealTimeAccountBalancesOfCurrentDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"accountID","in":"path","required":true,"type":"string","description":"unique identifier of your DDA account - identifier associated with your account and routing number.","example":"pdr004ldq0007pr285japx0028lm8"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__creditcard_accounts","path":"/creditcard-accounts","method":"POST","summary":"Get Credit Card account balances for an array of accounts.","operationId":"getCreditCardAccountBalances","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"}],"hasBody":true,"samplePayload":{}},{"id":"POST__loan_accounts","path":"/loan-accounts","method":"POST","summary":"Get loan account balances and summary for an array of accounts.","operationId":"getLoanAccountBalancesAndSummary","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":true,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"}],"hasBody":true,"samplePayload":{}},{"id":"GET__accounts__accountID__transactions_current_day","path":"/accounts/{accountID}/transactions/current-day","method":"GET","summary":"Get transactions of an account for current-day.","operationId":"getTransactionsOfCurrentDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":"6220l3igy0003ec299sj98000tria"},{"name":"bankReferenceNumber","in":"query","required":false,"type":"string","description":"Unique transaction identifier","example":893456789744},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__accounts__accountID__transactions_previous_day","path":"/accounts/{accountID}/transactions/previous-day","method":"GET","summary":"Get transactions of an account for prior business days over a date range.","operationId":"getTransactionsOfPreviousDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""},{"name":"startDate","in":"query","required":false,"type":"string","description":"The start date for which you want to retrieve transactions. ISO 8601.","example":""},{"name":"endDate","in":"query","required":false,"type":"string","description":"The end date for which you want to retrieve transactions. ISO 8601.","example":""},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__creditcard_accounts__accountID__transactions","path":"/creditcard-accounts/{accountID}/transactions","method":"GET","summary":"Get transactions of a credit card account over a date range.","operationId":"getTransactionsOnCreditCards","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""},{"name":"startDate","in":"query","required":false,"type":"string","description":"Start date/time to retrieve transactions. ISO 8601.","example":""},{"name":"endDate","in":"query","required":false,"type":"string","description":"End date/time to retrieve transactions. ISO 8601. * When endDate is provided then startDate is also required. * If only startDate is provided then endDate will default to startDate for the range. * If startDate and endDate are not provided ","example":""},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__loan_accounts__accountID__transactions","path":"/loan-accounts/{accountID}/transactions","method":"GET","summary":"Get transactions of a loan account over a date range.","operationId":"getTransactionsOnLoanAccount","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""},{"name":"Client-ID","in":"header","required":true,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"startDate","in":"query","required":false,"type":"string","description":"Start date/time to retrieve transactions. ISO 8601.","example":""},{"name":"endDate","in":"query","required":false,"type":"string","description":"End date/time to retrieve transactions. ISO 8601. * When endDate is provided then startDate is also required. * If only startDate is provided then endDate will default to startDate for the range. * If startDate and endDate are not provided ","example":""},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__accounts__accountID__statements","path":"/accounts/{accountID}/statements","method":"GET","summary":"Get deposit, credit card, trust, and loan account statements list.","operationId":"getAccountStatementsByAccountId","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""},{"name":"startDate","in":"query","required":false,"type":"string","description":"Start time for use in retrieval; ISO 8601 date including zone indicator or combined date time including zone indicator","example":"2019-12-30T01:30:00.000+0000"},{"name":"endDate","in":"query","required":false,"type":"string","description":"End time for use in retrieval; ISO 8601 date including zone indicator or combined date time including zone indicator","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__accounts__accountID__statements__statementID_","path":"/accounts/{accountID}/statements/{statementID}","method":"GET","summary":"Get an account statement image.","operationId":"getAccountStatementByAccountId","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"accountID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""},{"name":"statementID","in":"path","required":true,"type":"string","description":"Unique Statement Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__accounts_statements_requests","path":"/accounts/statements/requests","method":"POST","summary":"Get a requestID for your statement generating request using async workflow.","operationId":"getAccountStatementRequestIDByAccountId","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type","example":""}],"hasBody":true,"samplePayload":{}},{"id":"GET__accounts_statements_requests__requestID_","path":"/accounts/statements/requests/{requestID}","method":"GET","summary":"Get binary PDF statement file using async workflow.","operationId":"getAccountStatementByRequestID","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Accept-Encoding","in":"header","required":false,"type":"string","description":"Indicates compression encodings that are acceptable in the response","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"Client-ID","in":"header","required":false,"type":"string","description":"An attribute which is the client ID of the 3rd party SAAS when they are sending request to the API using authorization_code grant type (3-legged OAuth2.0 token)","example":"VMbARkNrrf6BEvOL0Q9jzBRto4WbRJak"},{"name":"requestID","in":"path","required":true,"type":"string","description":"Unique Account Identifier","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098631","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__accounts_transactions_ach_returns_and_noc_current_day","path":"/accounts/transactions/ach-returns-and-noc/current-day","method":"POST","summary":"Get ACH returns and NOC data for an array of accounts for current-day.","operationId":"getACHReturnsNOCOfCurrentDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"}],"hasBody":true,"samplePayload":{}},{"id":"POST__accounts_transactions_ach_returns_and_noc_previous_day","path":"/accounts/transactions/ach-returns-and-noc/previous-day","method":"POST","summary":"Get ACH returns and NOC data for an array of accounts for previous-day.","operationId":"getACHReturnsNOCOfPreviousDay","parameters":[{"name":"Authorization","in":"header","required":true,"type":"string","description":"Authorization token for accessing the API","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format","example":""},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique Id for a request response pair","example":""},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Content type","example":""},{"name":"On-Behalf-Of","in":"header","required":false,"type":"string","description":"1. Customer Identifier assigned by U.S.Bank 2. When using the client_credentials flow (i.e. 2-legged OAuth) and the API request is from a service provider on behalf of a U.S Bank customer, then this field will hold the customer ID of the U.","example":"480c0089-8c70-4a2c-a738-07a4994b44cf"},{"name":"startDate","in":"query","required":false,"type":"string","description":"Start date/time to retrieve transactions. ISO 8601.","example":""},{"name":"endDate","in":"query","required":false,"type":"string","description":"End date/time to retrieve transactions. ISO 8601. * When endDate is provided, then startDate is a mandatory input. * If only startDate is provided, then endDate will default to startDate for the range. * If startDate and endDate are not pro","example":""},{"name":"pageNumber","in":"query","required":false,"type":"string","description":"Current Page Number from query result to return","example":"1"},{"name":"pageSize","in":"query","required":false,"type":"string","description":"Results page size","example":"20"}],"hasBody":true,"samplePayload":{}}]
};

export const SpecUI_Corporate_Account_Information: React.FC<SpecUI_Corporate_Account_InformationProps> = ({ onExecute }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'execute' | 'code' | 'schema'>('execute');
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [queryParamValues, setQueryParamValues] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test_token_api_workbench'
  });
  const [requestBodyText, setRequestBodyText] = useState<string>('{}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const currentEndpoint = SPEC_META.endpoints[selectedIdx] || SPEC_META.endpoints[0];

  // Initialize defaults on endpoint change
  useEffect(() => {
    if (!currentEndpoint) return;
    const initialPaths: Record<string, string> = {};
    const initialQueries: Record<string, string> = {};

    currentEndpoint.parameters.forEach(p => {
      if (p.in === 'path') {
        initialPaths[p.name] = p.example || '12345';
      } else if (p.in === 'query') {
        initialQueries[p.name] = p.example || '';
      }
    });

    setPathParamValues(initialPaths);
    setQueryParamValues(initialQueries);

    if (currentEndpoint.hasBody) {
      setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload || { sampleKey: 'sampleValue' }, null, 2));
    }
  }, [selectedIdx]);

  // Compute interpolated path
  const resolvedPath = currentEndpoint ? currentEndpoint.path.replace(/\{([^}]+)\}/g, (_, key) => {
    return pathParamValues[key] || `{${key}}`;
  }) : '';

  const handleExecute = async () => {
    if (!currentEndpoint) return;
    setLoading(true);
    const startTime = performance.now();

    try {
      let bodyData: any = undefined;
      if (currentEndpoint.hasBody) {
        try { bodyData = JSON.parse(requestBodyText); } catch { bodyData = requestBodyText; }
      }

      const res = await workbenchSdk.request({
        method: currentEndpoint.method as any,
        path: resolvedPath,
        baseUrl: SPEC_META.baseUrl,
        queryParams: queryParamValues,
        headers: headers,
        body: bodyData
      });

      setResponseOutput(res);
      if (onExecute) onExecute(currentEndpoint, res);
    } catch (err: any) {
      setResponseOutput({
        ok: false,
        status: 500,
        statusText: 'Client Error',
        data: { error: err.message || 'Execution failed' },
        durationMs: Math.round(performance.now() - startTime)
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    if (!currentEndpoint) return '';
    let cmd = `curl -X ${currentEndpoint.method} "${SPEC_META.baseUrl}${resolvedPath}"`;
    const queryParts = Object.entries(queryParamValues).filter(([_, v]) => Boolean(v)).map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
    if (queryParts.length > 0) cmd += `?${queryParts.join('&')}`;
    cmd += `"\\`;
    Object.entries(headers).forEach(([k, v]) => {
      cmd += `\n  -H "${k}: ${v}" \\`;
    });
    if (currentEndpoint.hasBody && requestBodyText.trim()) {
      cmd += `\n  -d '${requestBodyText.replace(/'/g, "\\'")}'`;
    }
    return cmd;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copySnippet = () => {
    if (!currentEndpoint) return;
    const snippet = `import { workbenchSdk } from '../../configs/api-clients';

// Call ${currentEndpoint.operationId} on ${SPEC_META.title}
const response = await workbenchSdk.request({
  method: '${currentEndpoint.method}',
  path: '${resolvedPath}',
  baseUrl: '${SPEC_META.baseUrl}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${currentEndpoint.hasBody ? `body: ${requestBodyText}` : ''}
});

console.log('Status:', response.status);
console.log('Data:', response.data);`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Spec Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{SPEC_META.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              v{SPEC_META.version} • {SPEC_META.format.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{SPEC_META.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCurl}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy cURL</span>
          </button>
          <button
            onClick={copySnippet}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>Copy SDK Code</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector Sidebar + Interactive Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 space-y-1.5 max-h-[520px] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Endpoints ({SPEC_META.endpoints.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Live</span>
          </div>
          {SPEC_META.endpoints.map((ep, idx) => (
            <button
              key={ep.id || idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 ${
                selectedIdx === idx
                  ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                  ep.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                  ep.method === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {ep.method}
                </span>
                <span className="truncate">{ep.path}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-500" />
            </button>
          ))}
        </div>

        {/* Console & Runner */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {currentEndpoint ? (
            <>
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    currentEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                    currentEndpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {currentEndpoint.method}
                  </span>
                  <span className="text-sm font-mono text-white font-bold">{resolvedPath}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Base: {SPEC_META.baseUrl}
                </div>
              </div>

              {currentEndpoint.summary && (
                <p className="text-xs text-gray-300">{currentEndpoint.summary}</p>
              )}

              {/* Mode Tabs */}
              <div className="flex items-center space-x-2 border-b border-[#30363D] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'execute' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Live Runner
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  SDK & cURL
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Parameters ({currentEndpoint.parameters.length})
                </button>
              </div>

              {/* Live Runner Tab */}
              {activeTab === 'execute' && (
                <div className="space-y-4">
                  {/* Path Parameters Inputs */}
                  {Object.keys(pathParamValues).length > 0 && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-gray-300">Path Parameters</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(pathParamValues).map(([paramName, val]) => (
                          <div key={paramName}>
                            <label className="block text-[10px] font-mono text-indigo-400 mb-0.5">{paramName}</label>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setPathParamValues({ ...pathParamValues, [paramName]: e.target.value })}
                              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-2.5 py-1 text-xs text-white font-mono outline-none focus:border-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body (if supported) */}
                  {currentEndpoint.hasBody && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-gray-400 font-medium">Request Payload (JSON)</label>
                        <button
                          onClick={() => setRequestBodyText(JSON.stringify(currentEndpoint.samplePayload, null, 2))}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          Load Sample Payload
                        </button>
                      </div>
                      <textarea
                        value={requestBodyText}
                        onChange={(e) => setRequestBodyText(e.target.value)}
                        rows={4}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg p-2.5 text-xs font-mono text-gray-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Run Button */}
                  <button
                    onClick={handleExecute}
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>Execute {currentEndpoint.method} {resolvedPath}</span>
                  </button>

                  {/* Response Window */}
                  {responseOutput && (
                    <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-xl text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className={`font-bold ${responseOutput.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                          Status: {responseOutput.status} {responseOutput.statusText}
                        </span>
                        <span>{responseOutput.durationMs}ms</span>
                      </div>
                      <pre className="text-gray-200 max-h-48 overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(responseOutput.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">TypeScript SDK Snippet</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-indigo-300 overflow-auto whitespace-pre">
{`import { workbenchSdk } from '../../configs/api-clients';

const response = await workbenchSdk.request({
  method: '${currentEndpoint.method}',
  path: '${resolvedPath}',
  baseUrl: '${SPEC_META.baseUrl}',
  headers: {
    'Accept': 'application/json'
  }${currentEndpoint.hasBody ? `,\n  body: ${requestBodyText}` : ''}
});

console.log(response.data);
`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-300 mb-1">cURL Command</div>
                    <pre className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-emerald-300 overflow-auto whitespace-pre">
{getCurlCommand()}
                    </pre>
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-300">Declared Parameters ({currentEndpoint.parameters.length})</div>
                  {currentEndpoint.parameters.length === 0 ? (
                    <div className="p-4 text-xs text-gray-500 text-center">No explicit query or path parameters declared</div>
                  ) : (
                    currentEndpoint.parameters.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-xs font-mono flex flex-col gap-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400 font-bold">{p.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0D1117] text-amber-400 border border-[#30363D]">{p.in}</span>
                          <span className="text-[10px] text-gray-400">({p.type})</span>
                          {p.required && <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">required</span>}
                        </div>
                        {p.description && <div className="text-[11px] text-gray-400 font-sans">{p.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">Select an endpoint to execute</div>
          )}
        </div>
      </div>
    </div>
  );
};

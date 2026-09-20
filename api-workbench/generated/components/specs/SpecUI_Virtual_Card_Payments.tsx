import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Virtual_Card_PaymentsProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "openapi__5__json",
  title: "Virtual Card Payments",
  version: "2.7.0",
  format: "openapi_3",
  description: "## Overview The Virtual Card Payments API enables client applications to create virtual card payments according to their payment instructions. One can also read the card CVV and change the card status. Please consult the **API developer por",
  baseUrl: "https://apip2.usbank.com/virtual-cards/v2",
  endpoints: [{"id":"POST__cards","path":"/cards","method":"POST","summary":"Create a virtual card.","operationId":"CreateCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"Idempotency-Key","in":"header","required":true,"type":"string","description":"**See the Developer Guide for details regarding when and how to retry a request.** GUID identifier assigned by the caller to each unique request. The key is used by the service to detect any duplicate requests resulting from retries, and as","example":"73hd71d2-e80b-7d73-a4g6-hen83028d73g"}],"hasBody":true,"samplePayload":{}},{"id":"GET__cards__cardID_","path":"/cards/{cardID}","method":"GET","summary":"Retrieve virtual card information.","operationId":"GetVirtualCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PATCH__cards__cardID_","path":"/cards/{cardID}","method":"PATCH","summary":"Modify a virtual card.","operationId":"ModifyCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__cards__cardID__close","path":"/cards/{cardID}/close","method":"POST","summary":"Close a virtual card.","operationId":"CloseVirtualCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__cards__cardID__cancel","path":"/cards/{cardID}/cancel","method":"POST","summary":"Cancel a virtual card.","operationId":"CancelVirtualCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__cards__cardID__remit","path":"/cards/{cardID}/remit","method":"POST","summary":"Send a remittance notice.","operationId":"RemitVirtualCard","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"Idempotency-Key","in":"header","required":true,"type":"string","description":"**See the Developer Guide for details regarding when and how to retry a request.** GUID identifier assigned by the caller to each unique request. The key is used by the service to detect any duplicate requests resulting from retries, and as","example":"73hd71d2-e80b-7d73-a4g6-hen83028d73g"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__cards__cardID__realtime_credit_details","path":"/cards/{cardID}/realtime-credit-details","method":"GET","summary":"Retrieve available credit balance detail for the virtual card.","operationId":"ReadCreditDetails-Card","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__cards__cardID__authorizations","path":"/cards/{cardID}/authorizations","method":"GET","summary":"Return authorizations for this card within a date range.","operationId":"SearchAuthorizations","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""},{"name":"startDate","in":"query","required":false,"type":"string","description":"The start date of the search as YYYY-MM-DD, inclusive. The default is 7 days prior to the endDate. Needed to initiate the search. Not required after first page.","example":"2025-08-09"},{"name":"endDate","in":"query","required":false,"type":"string","description":"The end date of the search as YYYY-MM-DD, inclusive. The default is the current date. Needed to initiate the search. Not required after first page.","example":"2025-08-11"},{"name":"pageSize","in":"query","required":false,"type":"integer","description":"The maximum number of items returned per page. Needed to initiate the search. Not needed after first page.","example":250},{"name":"pageNumber","in":"query","required":false,"type":"integer","description":"The page number to return, 2 to N. Required when retrieving pages 2 and later. Do not use in the first request.","example":2},{"name":"searchKey","in":"query","required":false,"type":"string","description":"The searchKey is returned in the first page response. Required when retrieving pages 2 and later. Do not use in the first request.","example":"koFEcjwQYXn0ZKGc"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__cards__cardID__transactions","path":"/cards/{cardID}/transactions","method":"GET","summary":"List all transactions for this card.","operationId":"ListTransactions","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""},{"name":"pageSize","in":"query","required":false,"type":"integer","description":"The maximum number of items returned per page. Needed to initiate the search. Not needed after first page.","example":250},{"name":"pageNumber","in":"query","required":false,"type":"integer","description":"The page number to return, 2 to N. Required when retrieving pages 2 and later. Do not use in the first request.","example":2}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__cards__cardID__transactions_search","path":"/cards/{cardID}/transactions/search","method":"POST","summary":"Return transactions for this card matching the search criteria.","operationId":"SearchTransactions","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"cardID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to virtual card","example":""},{"name":"pageSize","in":"query","required":false,"type":"integer","description":"The maximum number of items returned per page. Needed to initiate the search. Not needed after first page.","example":250},{"name":"pageNumber","in":"query","required":false,"type":"integer","description":"The page number to return, 2 to N. Required when retrieving pages 2 and later. Do not use in the first request.","example":2}],"hasBody":true,"samplePayload":{}},{"id":"POST__payments","path":"/payments","method":"POST","summary":"Create a new payment.","operationId":"CreatePayment","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"Idempotency-Key","in":"header","required":true,"type":"string","description":"**See the Developer Guide for details regarding when and how to retry a request.** GUID identifier assigned by the caller to each unique request. The key is used by the service to detect any duplicate requests resulting from retries, and as","example":"73hd71d2-e80b-7d73-a4g6-hen83028d73g"}],"hasBody":true,"samplePayload":{}},{"id":"GET__payments__paymentID_","path":"/payments/{paymentID}","method":"GET","summary":"Retrieve payment information.","operationId":"GetPayment","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PATCH__payments__paymentID_","path":"/payments/{paymentID}","method":"PATCH","summary":"Modify a payment.","operationId":"ModifyPayment","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":true,"samplePayload":{}},{"id":"POST__payments__paymentID__send_notification","path":"/payments/{paymentID}/send-notification","method":"POST","summary":"Send an email or fax notification.","operationId":"PaymentNotification","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"Idempotency-Key","in":"header","required":true,"type":"string","description":"**See the Developer Guide for details regarding when and how to retry a request.** GUID identifier assigned by the caller to each unique request. The key is used by the service to detect any duplicate requests resulting from retries, and as","example":"73hd71d2-e80b-7d73-a4g6-hen83028d73g"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__payments__paymentID__close","path":"/payments/{paymentID}/close","method":"POST","summary":"Close a payment.","operationId":"ClosePayment","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098637","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__payments__paymentID__cancel","path":"/payments/{paymentID}/cancel","method":"POST","summary":"Cancel a payment.","operationId":"CancelPayment","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098646","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__payments__paymentID__invoices_add_bulk","path":"/payments/{paymentID}/invoices/add-bulk","method":"POST","summary":"Add invoices in bulk.","operationId":"InvoiceAddBulk","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"Idempotency-Key","in":"header","required":true,"type":"string","description":"**See the Developer Guide for details regarding when and how to retry a request.** GUID identifier assigned by the caller to each unique request. The key is used by the service to detect any duplicate requests resulting from retries, and as","example":"73hd71d2-e80b-7d73-a4g6-hen83028d73g"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""}],"hasBody":true,"samplePayload":{}},{"id":"DELETE__payments__paymentID__invoices__invoiceID_","path":"/payments/{paymentID}/invoices/{invoiceID}","method":"DELETE","summary":"Delete an invoice from a payment.","operationId":"InvoiceDelete","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""},{"name":"invoiceID","in":"path","required":true,"type":"string","description":"Unique client ID assigned to invoice","example":""}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098646","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PATCH__payments__paymentID__invoices__invoiceID_","path":"/payments/{paymentID}/invoices/{invoiceID}","method":"PATCH","summary":"Modify an invoice on a payment.","operationId":"InvoiceUpdate","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Indicates the acceptable response format of 'application/json'","example":"application/json"},{"name":"Authorization","in":"header","required":true,"type":"string","description":"OAuth Bearer token","example":"Bearer kobFjc3EcRedjMHK37wQYXn0ZKGc"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Indicates body format of 'application/json'","example":"application/json"},{"name":"Correlation-ID","in":"header","required":true,"type":"string","description":"Unique client request ID that is echoed in the response, to aid end-to-end tracing. This identifier should change with each request - including retries - so each attempt can be traced.","example":"d6f4dba5-0558-4638-9884-17129b800ebd"},{"name":"Organization-Short-Name","in":"header","required":true,"type":"string","description":"Identifier used to scope the request to a specific organization, a.k.a. Org Short Name. Alphanumeric and special characters permitted.","example":"OrgSN"},{"name":"paymentID","in":"path","required":true,"type":"string","description":"Unique system ID assigned to payment","example":""},{"name":"invoiceID","in":"path","required":true,"type":"string","description":"Unique client ID assigned to invoice","example":""}],"hasBody":true,"samplePayload":{}}]
};

export const SpecUI_Virtual_Card_Payments: React.FC<SpecUI_Virtual_Card_PaymentsProps> = ({ onExecute }) => {
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

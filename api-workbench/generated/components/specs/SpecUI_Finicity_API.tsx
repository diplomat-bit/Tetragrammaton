import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Finicity_APIProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "finicity-apimatic-20220106_yaml",
  title: "Finicity API",
  version: "1.0.0",
  format: "openapi_3",
  description: "Finicity API",
  baseUrl: "https://api.finicity.com",
  endpoints: [{"id":"POST__connect_v2_generate","path":"/connect/v2/generate","method":"POST","summary":"Generate V2 Connect URL","operationId":"GenerateV2ConnectURL","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__connect_v2_generate_lite","path":"/connect/v2/generate/lite","method":"POST","summary":"Generate V2 Lite Connect URL","operationId":"GenerateV2LiteConnectURL","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__connect_v2_generate_fix","path":"/connect/v2/generate/fix","method":"POST","summary":"Generate V2 Fix Connect URL","operationId":"GenerateV2FixConnectURL","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__connect_v2_send_email","path":"/connect/v2/send/email","method":"POST","summary":"Send V2 Connect Email","operationId":"SendV2ConnectEmail","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json","example":"application/json"}],"hasBody":true,"samplePayload":{"partnerId":"1445585709680","customerId":"1005061234","consumerId":"86238nvnw7269e224a4e3de12352d87d","type":"voa","webhook":"https://webhook.site/8d4421a7-d1d1-4f01-bb08-5370aff0321b","webhookContentType":"application/json","analytics":"google:UA-123456789-1","email":{"to":"fin.user@finicity.com","from":"testLender@test.com","supportPhone":"800-555-5555","subject":"Verify your income","firstName":"Bob","brandColor":"#4287f5","brandLogo":"https://acme-lending.com/logo.png","institutionName":"Acme Lending","institutionAddress":"222 Winipeg Drive SLC UT, 84109","signature":["Cindy Mayfield","Senior Loan Officer","Direct 123-456-7890"]},"experience":"default","fromDate":12345678,"reportCustomFields":[{"label":"loanID","value":"12345","shown":true},{"label":"branchID","value":"55555","shown":false}],"singleUseUrl":true}},{"id":"POST__connect_v2_generate_jointBorrower","path":"/connect/v2/generate/jointBorrower","method":"POST","summary":"Generate V2 Connect URL - Joint Borrower","operationId":"GenerateV2ConnectURL-JointBorrower","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"}],"hasBody":true,"samplePayload":{"partnerId":"1445585709680","borrowers":[{"customerId":"1005061234","consumerId":"1973f901305e2ab3ba8840f411f6b057","type":"primary","optionalConsumerInfo":{"ssn":"123412134","dob":315576000}},{"customerId":"1005063558","consumerId":"1973f901305e2ab3ba8840f41112asdf9f","type":"jointBorrower","optionalConsumerInfo":{"ssn":"351225513","dob":625726800}}],"webhook":"https://webhook.site/8d4421a7-d1d1-4f01-bb08-5370aff0321b","webhookContentType":"application/json","experience":"default","fromDate":1607450357,"reportCustomFields":[{"label":"loanID","value":"12345","shown":true},{"label":"branchID","value":"55555","shown":false}],"singleUseUrl":true}},{"id":"POST__connect_v2_send_email_jointBorrower","path":"/connect/v2/send/email/jointBorrower","method":"POST","summary":"Send V2 Connect Email - Joint Borrower","operationId":"SendV2ConnectEmail-JointBorrower","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json","example":"application/json"}],"hasBody":true,"samplePayload":{"partnerId":"1445585709680","borrowers":[{"customerId":"1005061234","consumerId":"1973f901305e2ab3ba8840f411f6b057","type":"primary","optionalConsumerInfo":{"ssn":"123412134","dob":"315576000"}},{"customerId":"1005063558","consumerId":"1973f901305e2ab3ba8840f41112asdf9f","type":"jointBorrower","optionalConsumerInfo":{"ssn":"351225513","dob":"625726800"}}],"experience":"default","webhook":"https://webhook.site/8d4421a7-d1d1-4f01-bb08-5370aff0321b","webhookContentType":"application/json","email":{"to":"fin.user@finicity.com","from":"testLender@test.com","supportPhone":"800-555-5555","subject":"Verify your assets, income and employment","firstName":"Marvin and Jenny","institutionName":"Acme Lending","institutionAddress":"222 Winipeg Drive SLC UT, 84109","signature":["Cindy Mayfield","Senior Loan Officer","Direct 123-456-7890"]},"fromDate":12345678,"reportCustomFields":[{"label":"loanID","value":"12345","shown":true},{"label":"branchID","value":"55555","shown":false}],"singleUseUrl":true}},{"id":"GET__institution_v2_certifiedInstitutions_rssd","path":"/institution/v2/certifiedInstitutions/rssd","method":"GET","summary":"Get Certified Institutions With RSSD","operationId":"GetCertifiedInstitutionsWithRSSD","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"search","in":"query","required":true,"type":"string","description":"Search term, * returns all institutions","example":"finbank"},{"name":"start","in":"query","required":true,"type":"integer","description":"Page (Default: 1)","example":1},{"name":"limit","in":"query","required":true,"type":"integer","description":"Limits the number of results returned (max: 1000)","example":25},{"name":"type","in":"query","required":true,"type":"string","description":"Product types: transAgg, ach, stateAgg, voi, voa, aha, availBalance, accountOwner.","example":"voa"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__institution_v2_institutions","path":"/institution/v2/institutions","method":"GET","summary":"Get Institutions","operationId":"GetInstitutions","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"search","in":"query","required":false,"type":"string","description":"Match the text for the query. URL-encoded required. See Handling Spaces in Queries. **Note**: To get a list of all FIs, leave the *search* parameter out of the body of the API call. If the *search* parameter is in the body of the call but h","example":"finbank"},{"name":"start","in":"query","required":false,"type":"integer","description":"The starting page number of records returned. The default is 1. **Example**: If the limit for each call is 25, then start=1 returns 1-25 records. If start=2 then records 26-51 are returned.","example":1},{"name":"limit","in":"query","required":false,"type":"integer","description":"The maximum number of records per page returned for the search request. The default is 25 records per page.","example":25}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__institution_v2_certifiedInstitutions","path":"/institution/v2/certifiedInstitutions","method":"GET","summary":"Get Certified Institutions","operationId":"GetCertifiedInstitutions","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"search","in":"query","required":true,"type":"string","description":"Text to match or * to return all supported institutions.","example":"finbank"},{"name":"start","in":"query","required":false,"type":"integer","description":"Starting index for this page of results (ignored if returning all institutions). This will default to 1.","example":1},{"name":"limit","in":"query","required":false,"type":"integer","description":"Maximum number of entries for this page of results (ignored if returning all institutions). This will default to 25. Limits the number of results returned to 1000.","example":25},{"name":"type","in":"query","required":false,"type":"string","description":"Product types: transAgg, ach, stateAgg, voi, voa, aha, availBalance, accountOwner.","example":"voa"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__institution_v2_institutions__institutionId_","path":"/institution/v2/institutions/{institutionId}","method":"GET","summary":"Get Institution","operationId":"GetInstitution","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"institutionId","in":"path","required":true,"type":"integer","description":"Finicity’s ID of the institution to retrieve","example":101732}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__institution_v2_institutions__id__branding","path":"/institution/v2/institutions/{id}/branding","method":"GET","summary":"Get Institution Branding","operationId":"GetInstitutionBranding","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"},{"name":"id","in":"path","required":true,"type":"integer","description":"ID of the institution","example":5}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__institution_v2_institutions_subscription","path":"/institution/v2/institutions/subscription","method":"GET","summary":"Get Institution Subscription V2","operationId":"GetInstitutionSubscriptionV2","parameters":[{"name":"Finicity-App-Key","in":"header","required":false,"type":"string","description":"Finicity-App-Key from the Developer Portal","example":""},{"name":"Finicity-App-Token","in":"header","required":false,"type":"string","description":"Token returned from Partner Authentication","example":""},{"name":"Accept","in":"header","required":false,"type":"string","description":"application/json, application/xml","example":"application/json, application/xml"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__decisioning_v1_consumers__consumerId_","path":"/decisioning/v1/consumers/{consumerId}","method":"GET","summary":"GetConsumer","operationId":"GetConsumer","parameters":[{"name":"consumerId","in":"path","required":true,"type":"string","description":"Finicity’s ID of the consumer (UUID with max length 32 characters)","example":"b06cf32dd2222b32e31083221063f561"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"PUT__decisioning_v1_consumers__consumerId_","path":"/decisioning/v1/consumers/{consumerId}","method":"PUT","summary":"ModifyConsumer","operationId":"ModifyConsumer","parameters":[{"name":"consumerId","in":"path","required":true,"type":"string","description":"Finicity ID of the consumer (UUID with max length 32 characters)","example":"b06cf32dd2222b32e31083221063f561"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"GET__decisioning_v1_customers__customerId__consumer","path":"/decisioning/v1/customers/{customerId}/consumer","method":"GET","summary":"GetConsumerForCustomer","operationId":"GetConsumerForCustomer","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity’s ID of the customer","example":1000278253},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"},{"name":"Content-Type","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__decisioning_v1_customers__customerId__consumer","path":"/decisioning/v1/customers/{customerId}/consumer","method":"POST","summary":"Create Consumer","operationId":"CreateConsumer","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity’s ID for the customer","example":1000278253},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__voi","path":"/decisioning/v2/customers/{customerId}/voi","method":"POST","summary":"Generate VOI Report","operationId":"GenerateVOIReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v3_customers__customerId__voa","path":"/decisioning/v3/customers/{customerId}/voa","method":"POST","summary":"GenerateVOAReport","operationId":"GenerateVOAReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"fromDate","in":"query","required":false,"type":"integer","description":"The fromDate parameter is an Epoch Timestamp (in seconds), such as '1494449017'. Without this parameter, the report defaults to 61 days if available. Example: ?fromDate={fromDate}. If included, the epoch timestamp should be 10 digits long a","example":1580558400},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__voaHistory","path":"/decisioning/v2/customers/{customerId}/voaHistory","method":"POST","summary":"GenerateVOAWithIncomeReport","operationId":"GenerateVOAWithIncomeReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity Id of the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"fromDate","in":"query","required":false,"type":"integer","description":"The fromDate parameter is an Epoch Timestamp (in seconds), such as ?1494449017?. Without this parameter, the report defaults to 61 days if available. This will limit the amount of credit and debit transactions included in the report up to t","example":1580558400},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__preQualVoa","path":"/decisioning/v2/customers/{customerId}/preQualVoa","method":"POST","summary":"Generate Prequalification Report","operationId":"GeneratePrequalificationReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity's ID of the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__assetSummary","path":"/decisioning/v2/customers/{customerId}/assetSummary","method":"POST","summary":"Generate Asset Summary Report","operationId":"GenerateAssetSummaryReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity's ID of the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__payStatement","path":"/decisioning/v2/customers/{customerId}/payStatement","method":"POST","summary":"GeneratePayStatementReport","operationId":"GeneratePayStatementReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID of the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"Replace 'json' with 'xml' if preferred","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__voieTxVerify_withInterview","path":"/decisioning/v2/customers/{customerId}/voieTxVerify/withInterview","method":"POST","summary":"Generate VOIE - Paystub (with TXVerify) Report","operationId":"GenerateVOIE-Paystub(withTXVerify)Report","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json or application/xml","example":"application/json"}],"hasBody":true,"samplePayload":{"accountIds":"1028361677","voieWithInterviewData":{"txVerifyInterview":[{"assetId":"7eb57060-6d98-4449-992d-4dd4490448f3-1236011097"}]},"reportCustomFields":[{"label":"loanID","value":"123456","shown":true}]}},{"id":"POST__decisioning_v2_customers__customerId__voiePayroll","path":"/decisioning/v2/customers/{customerId}/voiePayroll","method":"POST","summary":"Refresh VOIE - Payroll Report","operationId":"RefreshVOIE-PayrollReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json","example":"application/json"}],"hasBody":true,"samplePayload":{}},{"id":"POST__decisioning_v2_customers__customerId__voieTxVerify_withStatement","path":"/decisioning/v2/customers/{customerId}/voieTxVerify/withStatement","method":"POST","summary":"Generate VOIE - Paystub Report","operationId":"GenerateVOIE-PaystubReport","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer","example":1003413624},{"name":"callbackUrl","in":"query","required":false,"type":"string","description":"The Report Listener URL to receive notifications (optional, must be URL-encoded).","example":"https://finicity-test/webhook"},{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json","example":"application/json"}],"hasBody":true,"samplePayload":{"voieWithStatementData":{"assetIds":["d50ed92f-543b-431c-8286-c8b8f6556679"]},"reportCustomFields":[{"label":"loanID","value":"123456","shown":true},{"label":"trackingID","value":"5555","shown":true}]}},{"id":"GET__aggregation_v1_customers__customerId__institutionLogins__institutionLoginId__accounts","path":"/aggregation/v1/customers/{customerId}/institutionLogins/{institutionLoginId}/accounts","method":"GET","summary":"Get Customer Accounts By Institution Login","operationId":"GetCustomerAccountsByInstitutionLogin","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"customerId","in":"path","required":true,"type":"integer","description":"Finicity ID for the customer whose accounts are to be retrieved","example":1005061234},{"name":"institutionLoginId","in":"path","required":true,"type":"integer","description":"The institution login ID (from the account record)","example":1007302745}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POST__aggregation_v1_customers__customerId__institutionLogins__institutionLoginId__accounts","path":"/aggregation/v1/customers/{customerId}/institutionLogins/{institutionLoginId}/accounts","method":"POST","summary":"Refresh Customer Accounts By Institution Login","operationId":"RefreshCustomerAccountsByInstitutionLogin","parameters":[{"name":"Content-Length","in":"header","required":true,"type":"integer","description":"Must be 0 (this request has no body)","example":""},{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"interactive","in":"header","required":true,"type":"boolean","description":"False","example":""},{"name":"customerId","in":"path","required":true,"type":"string","description":"The ID of the customer who owns the accounts","example":"1005061234"},{"name":"institutionLoginId","in":"path","required":true,"type":"string","description":"The institution login ID from the account records","example":"1007302745"}],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"DELETE__aggregation_v1_customers__customerId__institutionLogins__institutionLoginId_","path":"/aggregation/v1/customers/{customerId}/institutionLogins/{institutionLoginId}","method":"DELETE","summary":"Delete Customer Accounts By Institution Login","operationId":"DeleteCustomerAccountsByInstitutionLogin","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"The ID of the customer whose accounts are to be deleted","example":1005061234},{"name":"institutionLoginId","in":"path","required":true,"type":"integer","description":"The Finicity ID of the Institution Login for the set of accounts to be deleted","example":1007302745}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"GET__aggregation_v1_customers__customerId__accounts__accountId_","path":"/aggregation/v1/customers/{customerId}/accounts/{accountId}","method":"GET","summary":"Get Customer Account","operationId":"GetCustomerAccount","parameters":[{"name":"Accept","in":"header","required":true,"type":"string","description":"application/json, application/xml","example":"application/json"},{"name":"customerId","in":"path","required":true,"type":"integer","description":"The ID of the customer who owns the account","example":1005061234},{"name":"accountId","in":"path","required":true,"type":"integer","description":"Finicity’s ID of the account to be retrieved","example":1014136057}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"DELETE__aggregation_v1_customers__customerId__accounts__accountId_","path":"/aggregation/v1/customers/{customerId}/accounts/{accountId}","method":"DELETE","summary":"Delete Customer Account","operationId":"DeleteCustomerAccount","parameters":[{"name":"customerId","in":"path","required":true,"type":"integer","description":"The ID of the customer who owns the account","example":1005061234},{"name":"accountId","in":"path","required":true,"type":"integer","description":"Finicity’s ID of the account to be deleted","example":1014136057}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098633","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}}]
};

export const SpecUI_Finicity_API: React.FC<SpecUI_Finicity_APIProps> = ({ onExecute }) => {
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

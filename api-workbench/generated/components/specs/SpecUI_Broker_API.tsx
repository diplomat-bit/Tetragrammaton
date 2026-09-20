import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, RefreshCw, Layers, Terminal, Globe, 
  Code2, ChevronRight, Send, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { workbenchSdk } from '../../configs/api-clients';

export interface SpecUI_Broker_APIProps {
  onExecute?: (endpoint: any, response: any) => void;
}

const SPEC_META = {
  id: "Broker_API_postman_collection_json_txt",
  title: "Broker API",
  version: "2.1.0",
  format: "postman",
  description: "Open brokerage accounts, enable stock, options and crypto trading. Manage the ongoing user experience and brokerage customer lifecycle with the Alpaca Broker API Contact Support: Name: Alpaca Support Email: support@alpaca.markets",
  baseUrl: "https://sandbox.api.example.com",
  endpoints: [{"id":"POSTMAN_Get_All_Accounts","path":"/v1/accounts","method":"GET","summary":"Get All Accounts","operationId":"Get All Accounts","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Create_an_Account","path":"/v1/accounts","method":"POST","summary":"Create an Account","operationId":"Create an Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"contact":{"email_address":"<email>","street_address":["<string>","<string>"],"city":"<string>","country":"<string>","phone_number":"<string,null>","postal_code":"<string>","state":"<string>","unit":"<string>"},"identity":{"given_name":"<string>","family_name":"<string>","date_of_birth":"<date>","tax_id_type":"ISR_TAX_ID","country_of_tax_residence":"<string>","funding_source":["savings","business_income"],"annual_income_max":"<number>","annual_income_min":"<number>","country_of_birth":"<string>","country_of_citizenship":"<string>","date_of_departure_from_usa":"<date>","investment_experience_with_options":"1_to_5_years","investment_experience_with_stocks":"over_5_years","investment_objective":"balance_preserve_wealth_with_growth","investment_time_horizon":"more_than_10_years","liquid_net_worth_max":"<number>","liquid_net_worth_min":"<number>","liquidity_needs":"important","marital_status":"SINGLE","middle_name":"<string>","number_of_dependents":"<integer>","permanent_resident":"<boolean>","risk_tolerance":"moderate","tax_id":"<string>","total_net_worth_max":"<number>","total_net_worth_min":"<number>","visa_expiration_date":"<date>","visa_type":"<string>"},"disclosures":{"is_control_person":"<boolean>","is_affiliated_exchange_or_finra":"<boolean>","is_politically_exposed":"<boolean>","immediate_family_exposed":"<boolean>","context":null,"employer_address":"<string>","employer_name":"<string>","employment_position":"<string>","employment_sector":"self_employed","employment_status":"retired"},"agreements":[{"agreement":"crypto_agreement","signed_at":"<dateTime>","ip_address":"<ipv4>","revision":"<string>"},{"agreement":"customer_agreement","signed_at":"<dateTime>","ip_address":"<ipv4>","revision":"<string>"}],"account_sub_type":"traditional","account_type":"donor_advised","allow_instant_ach":false,"beneficiaries":[{"given_name":"<string>","middle_name":"<string>","family_name":"<string>","date_of_birth":"<string>","tax_id":"<string>","tax_id_type":"<string>","relationship":"<string>","type":"<string>","share_pct":"<string>"},{"given_name":"<string>","middle_name":"<string>","family_name":"<string>","date_of_birth":"<string>","tax_id":"<string>","tax_id_type":"<string>","relationship":"<string>","type":"<string>","share_pct":"<string>"}],"cash_interest":{"USD":{"apr_tier_name":"<string>","status":"<string>"}},"documents":[{"document_type":"tax_id_verification","content":"<string>","content_data":{"country_citizen":"<string>","date":"<date>","date_of_birth":"<date>","full_name":"<string>","ip_address":"<string>","permanent_address_city_state":"<string>","permanent_address_country":"<string>","permanent_address_street":"<string>","revision":"<string>","timestamp":"<time>","signer_full_name":"<string>","additional_conditions":"<string>","foreign_tax_id":"<string>","ftin_not_required":"<boolean>","income_type":"<string>","mailing_address_city_state":"<string>","mailing_address_country":"<string>","mailing_address_street":"<string>","paragraph_number":"<string>","percent_rate_withholding":"<integer>","reference_number":"<string>","residency":"<string>","tax_id_ssn":"<string>"},"document_sub_type":"<string>","mime_type":"<string>"},{"document_type":"tax_id_verification","content":"<string>","content_data":{"country_citizen":"<string>","date":"<date>","date_of_birth":"<date>","full_name":"<string>","ip_address":"<string>","permanent_address_city_state":"<string>","permanent_address_country":"<string>","permanent_address_street":"<string>","revision":"<string>","timestamp":"<time>","signer_full_name":"<string>","additional_conditions":"<string>","foreign_tax_id":"<string>","ftin_not_required":"<boolean>","income_type":"<string>","mailing_address_city_state":"<string>","mailing_address_country":"<string>","mailing_address_street":"<string>","paragraph_number":"<string>","percent_rate_withholding":"<integer>","reference_number":"<string>","residency":"<string>","tax_id_ssn":"<string>"},"document_sub_type":"<string>","mime_type":"<string>"}],"enabled_assets":["crypto","ipo"],"fpsl":{"US":{"tier_id":"<uuid>"}},"investment_objective":"balance_preserve_wealth_with_growth","investment_time_horizon":"more_than_10_years","liquidity_needs":"very_important","primary_account_holder_id":"<uuid>","risk_tolerance":"significant_risk","trading_configurations":{"disable_overnight_trading":"<boolean>","fractional_trading":"<boolean>","max_margin_multiplier":"<string>","max_options_trading_level":3,"no_shorting":"<boolean>","ptp_no_exception_entry":"<string>","suspend_trade":"<boolean>","trade_confirm_email":"all"},"trusted_contact":{"given_name":"<string>","family_name":"<string>","city":"<string>","country":"<string>","email_address":"<email>","phone_number":"<string>","postal_code":"<string>","state":"<string>","street_address":["<string>","<string>"]}}},{"id":"POSTMAN_Get_An_Account_by_ID","path":"/v1/accounts/:account_id","method":"GET","summary":"Get An Account by ID","operationId":"Get An Account by ID","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Update_an_Account","path":"/v1/accounts/:account_id","method":"PATCH","summary":"Update an Account","operationId":"Update an Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"agreements":[{"agreement":"account_agreement","signed_at":"<dateTime>","ip_address":"<ipv4>","revision":"<string>"},{"agreement":"account_agreement","signed_at":"<dateTime>","ip_address":"<ipv4>","revision":"<string>"}],"allow_instant_ach":"<boolean>","beneficiaries":[{"given_name":"<string>","middle_name":"<string>","family_name":"<string>","date_of_birth":"<string>","tax_id":"<string>","tax_id_type":"<string>","relationship":"<string>","type":"<string>","share_pct":"<string>"},{"given_name":"<string>","middle_name":"<string>","family_name":"<string>","date_of_birth":"<string>","tax_id":"<string>","tax_id_type":"<string>","relationship":"<string>","type":"<string>","share_pct":"<string>"}],"cash_interest":{"USD":{"apr_tier_name":"<string>","status":"<string>"}},"contact":{"email_address":"<email>","street_address":["<string>","<string>"],"city":"<string>","country":"<string>","phone_number":"<string,null>","postal_code":"<string>","state":"<string>","unit":"<string>"},"disclosures":{"is_control_person":"<boolean>","is_affiliated_exchange_or_finra":"<boolean>","is_politically_exposed":"<boolean>","immediate_family_exposed":"<boolean>","context":null,"employer_address":"<string>","employer_name":"<string>","employment_position":"<string>","employment_sector":"self_employed","employment_status":"retired"},"fpsl":{"US":{"status":"<string>","tier_id":"<uuid>"}},"identity":{"given_name":"<string>","family_name":"<string>","date_of_birth":"<date>","tax_id_type":"BRA_CPF","country_of_tax_residence":"<string>","funding_source":["investments","savings"],"annual_income_max":"<number>","annual_income_min":"<number>","country_of_birth":"<string>","country_of_citizenship":"<string>","date_of_departure_from_usa":"<date>","investment_experience_with_options":"over_5_years","investment_experience_with_stocks":"over_5_years","investment_objective":"generate_income","investment_time_horizon":"more_than_10_years","liquid_net_worth_max":"<number>","liquid_net_worth_min":"<number>","liquidity_needs":"does_not_matter","marital_status":"SINGLE","middle_name":"<string>","number_of_dependents":"<integer>","permanent_resident":"<boolean>","risk_tolerance":"conservative","tax_id":"<string>","total_net_worth_max":"<number>","total_net_worth_min":"<number>","visa_expiration_date":"<date>","visa_type":"<string>"},"primary_account_holder_id":"<uuid>","trusted_contact":{"given_name":"<string>","family_name":"<string>","city":"<string>","country":"<string>","email_address":"<email>","phone_number":"<string>","postal_code":"<string>","state":"<string>","street_address":["<string>","<string>"]}}},{"id":"POSTMAN_Close_an_Account","path":"/v1/accounts/:account_id/actions/close","method":"POST","summary":"Close an Account","operationId":"Close an Account","parameters":[],"hasBody":true,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Request_options_trading_for_an_account__BETA_","path":"/v1/accounts/:account_id/options/approval","method":"POST","summary":"Request options trading for an account (BETA)","operationId":"Request options trading for an account (BETA)","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"level":3}},{"id":"POSTMAN_Retrieve_Bank_Relationships_for_an_Account","path":"/v1/accounts/:account_id/recipient_banks","method":"GET","summary":"Retrieve Bank Relationships for an Account","operationId":"Retrieve Bank Relationships for an Account","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Create_a_Bank_Relationship_for_an_Account","path":"/v1/accounts/:account_id/recipient_banks","method":"POST","summary":"Create a Bank Relationship for an Account","operationId":"Create a Bank Relationship for an Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"name":"<string>","bank_code":"<string>","bank_code_type":"ABA","account_number":"<string>","city":"<string>","country":"<string>","extra_fields":{"intermediary_bank1_bic":"<string>","intermediary_bank2_bic":"<string>","intermediary_bank3_bic":"<string>"},"postal_code":"<string>","state_province":"<string>","street_address":"<string>"}},{"id":"POSTMAN_Request_a_New_Transfer","path":"/v1/accounts/:account_id/transfers","method":"POST","summary":"Request a New Transfer","operationId":"Request a New Transfer","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"transfer_type":"wire","amount":"<string>","direction":"INCOMING","additional_information":"<string,null>","bank_id":"<uuid>","fee_payment_method":"<string>","ira":{"distribution_reason":"<string>","tax_withholding":{"fed_pct":"<string>","state_pct":"<string>"},"tax_year":"<string>"},"relationship_id":"<uuid>","timing":"immediate"}},{"id":"POSTMAN_Retrieve_Account_Activities","path":"/v1/accounts/activities","method":"GET","summary":"Retrieve Account Activities","operationId":"Retrieve Account Activities","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_Account_Activities_of_Specific_Type","path":"/v1/accounts/activities/:activity_type","method":"GET","summary":"Retrieve Account Activities of Specific Type","operationId":"Retrieve Account Activities of Specific Type","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_options_level_approval_requests__BETA_","path":"/v1/accounts/options/approvals","method":"GET","summary":"Retrieve options level approval requests (BETA)","operationId":"Retrieve options level approval requests (BETA)","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_Trading_Details_for_an_Account","path":"/v1/trading/accounts/:account_id/account","method":"GET","summary":"Retrieve Trading Details for an Account","operationId":"Retrieve Trading Details for an Account","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Get_a_single_activity__V2__event_by_event_id_ULID_","path":"/v2beta1/accounts/:account_id/events/activities/:event_id","method":"GET","summary":"Get a single activity (V2) event by event_id ULID.","operationId":"Get a single activity (V2) event by event_id ULID.","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"text/event-stream"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_a_List_of_Account_Documents","path":"/v1/accounts/:account_id/documents","method":"GET","summary":"Retrieve a List of Account Documents","operationId":"Retrieve a List of Account Documents","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Download_an_Account_Document","path":"/v1/accounts/:account_id/documents/:document_id/download","method":"GET","summary":"Download an Account Document","operationId":"Download an Account Document","parameters":[],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Upload_Owner_Documents_for_an_Existing_Account","path":"/v1/accounts/:account_id/documents/upload","method":"POST","summary":"Upload Owner Documents for an Existing Account","operationId":"Upload Owner Documents for an Existing Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":[{"document_type":"w9","content":"<string>","content_data":{"country_citizen":"<string>","date":"<date>","date_of_birth":"<date>","full_name":"<string>","ip_address":"<string>","permanent_address_city_state":"<string>","permanent_address_country":"<string>","permanent_address_street":"<string>","revision":"<string>","timestamp":"<time>","signer_full_name":"<string>","additional_conditions":"<string>","foreign_tax_id":"<string>","ftin_not_required":"<boolean>","income_type":"<string>","mailing_address_city_state":"<string>","mailing_address_country":"<string>","mailing_address_street":"<string>","paragraph_number":"<string>","percent_rate_withholding":"<integer>","reference_number":"<string>","residency":"<string>","tax_id_ssn":"<string>"},"document_sub_type":"<string>","mime_type":"<string>"},{"document_type":"entity_registration","content":"<string>","content_data":{"country_citizen":"<string>","date":"<date>","date_of_birth":"<date>","full_name":"<string>","ip_address":"<string>","permanent_address_city_state":"<string>","permanent_address_country":"<string>","permanent_address_street":"<string>","revision":"<string>","timestamp":"<time>","signer_full_name":"<string>","additional_conditions":"<string>","foreign_tax_id":"<string>","ftin_not_required":"<boolean>","income_type":"<string>","mailing_address_city_state":"<string>","mailing_address_country":"<string>","mailing_address_street":"<string>","paragraph_number":"<string>","percent_rate_withholding":"<integer>","reference_number":"<string>","residency":"<string>","tax_id_ssn":"<string>"},"document_sub_type":"<string>","mime_type":"<string>"}]},{"id":"POSTMAN_Download_the_W8BEN_document_for_the_primary_owner_of_an_account","path":"/v1/accounts/:account_id/documents/w8ben/:document_id/download","method":"GET","summary":"Download the W8BEN document for the primary owner of an account","operationId":"Download the W8BEN document for the primary owner of an account","parameters":[],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Bulk_Fetch_All_Accounts_Positions","path":"/v1/accounts/positions","method":"GET","summary":"Bulk Fetch All Accounts Positions","operationId":"Bulk Fetch All Accounts Positions","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Update_Trading_Configurations_for_an_Account","path":"/v1/trading/accounts/:account_id/account/configurations","method":"PATCH","summary":"Update Trading Configurations for an Account","operationId":"Update Trading Configurations for an Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"disable_overnight_trading":"<boolean>","fractional_trading":"<boolean>","max_margin_multiplier":"<string>","max_options_trading_level":2,"no_shorting":"<boolean>","ptp_no_exception_entry":"<string>","suspend_trade":"<boolean>","trade_confirm_email":"none"}},{"id":"POSTMAN_Retrieve_real_time_Trading_Limits_for_an_Account","path":"/v1/trading/accounts/:account_id/limits","method":"GET","summary":"Retrieve real-time Trading Limits for an Account","operationId":"Retrieve real-time Trading Limits for an Account","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Cancel_all_Open_Orders_For_an_Account","path":"/v1/trading/accounts/:account_id/orders","method":"DELETE","summary":"Cancel all Open Orders For an Account","operationId":"Cancel all Open Orders For an Account","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_a_List_of_Orders","path":"/v1/trading/accounts/:account_id/orders","method":"GET","summary":"Retrieve a List of Orders","operationId":"Retrieve a List of Orders","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Create_an_Order_for_an_Account","path":"/v1/trading/accounts/:account_id/orders","method":"POST","summary":"Create an Order for an Account","operationId":"Create an Order for an Account","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"type":"stop_limit","time_in_force":"fok","advanced_instructions":{"algorithm":"DMA","destination":"MEMX","display_qty":"<string>"},"client_order_id":"<string>","commission":"<string>","commission_bps":"<string>","commission_type":"notional","extended_hours":"<boolean>","instructions":"<string>","legs":[{"symbol":"<string>","ratio_qty":"<string>","position_intent":"buy_to_open","side":"undisclosed"},{"symbol":"<string>","ratio_qty":"<string>","position_intent":"sell_to_open","side":"cross"}],"limit_price":"<string>","notional":"<string>","order_class":"simple","position_intent":"sell_to_open","qty":"<string>","side":"undisclosed","source":"<string>","stop_loss":{"limit_price":"<string>","stop_price":"<string>"},"stop_price":"<string>","subtag":"<string>","swap_fee_bps":"<string>","symbol":"<string>","take_profit":{"limit_price":"<string>"},"trail_percent":"<string>","trail_price":"<string>"}},{"id":"POSTMAN_Cancel_an_Open_Order","path":"/v1/trading/accounts/:account_id/orders/:order_id","method":"DELETE","summary":"Cancel an Open Order","operationId":"Cancel an Open Order","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Retrieve_an_Order_by_its_ID","path":"/v1/trading/accounts/:account_id/orders/:order_id","method":"GET","summary":"Retrieve an Order by its ID","operationId":"Retrieve an Order by its ID","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Replace_an_Order","path":"/v1/trading/accounts/:account_id/orders/:order_id","method":"PATCH","summary":"Replace an Order","operationId":"Replace an Order","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"advanced_instructions":{"algorithm":"DMA","destination":"IEX","display_qty":"<string>"},"client_order_id":"<string>","limit_price":"<string>","notional":"<string>","qty":"<string>","stop_price":"<string>","time_in_force":"cls","trail":"<string>"}},{"id":"POSTMAN_Estimate_an_Order","path":"/v1/trading/accounts/:account_id/orders/estimation","method":"POST","summary":"Estimate an Order","operationId":"Estimate an Order","parameters":[{"name":"Content-Type","in":"header","required":false,"type":"string","description":"","example":"application/json"},{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":true,"samplePayload":{"notional":"<string>","side":"buy","swap_fee_bps":"<integer>","symbol":"<string>","time_in_force":"ioc","type":"stop"}},{"id":"POSTMAN_Retrieves_a_single_order_specified_by_the_client_order_ID_","path":"/v1/trading/accounts/:account_id/orders:by_client_order_id","method":"GET","summary":"Retrieves a single order specified by the client order ID.","operationId":"Retrieves a single order specified by the client order ID.","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}},{"id":"POSTMAN_Close_All_Positions_for_an_Account","path":"/v1/trading/accounts/:account_id/positions","method":"DELETE","summary":"Close All Positions for an Account","operationId":"Close All Positions for an Account","parameters":[{"name":"Accept","in":"header","required":false,"type":"string","description":"","example":"application/json"}],"hasBody":false,"samplePayload":{"referenceId":"REF-1789424098622","status":"PENDING","metadata":{"client":"API_WORKBENCH_SDK"}}}]
};

export const SpecUI_Broker_API: React.FC<SpecUI_Broker_APIProps> = ({ onExecute }) => {
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

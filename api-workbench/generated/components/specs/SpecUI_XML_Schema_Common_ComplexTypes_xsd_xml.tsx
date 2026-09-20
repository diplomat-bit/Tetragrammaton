import React, { useState } from 'react';
import { 
  FileCode, Copy, Check, Search, Layers, Box, Code2, 
  ChevronRight, ChevronDown, Sparkles, Filter, Database
} from 'lucide-react';

export interface SpecUI_XML_Schema_Common_ComplexTypes_xsd_xmlProps {
  onSelectType?: (typeName: string) => void;
}

const XSD_META = {
  id: "Common_ComplexTypes_xsd_xml",
  title: "XML Schema: Common_ComplexTypes.xsd.xml",
  version: "5.0.1",
  format: "xsd",
  description: "Target Namespace: urn:us:gov:treasury. Defined 318 complex types, 0 simple types, 204 global elements, 0 groups, 0 attribute groups.",
  complexTypes: [{"name":"AccountClassification_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":4,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ProgramData","type":"string","minOccurs":"0","maxOccurs":"unbounded"},{"name":"TradingPartnerExtensions","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountClassification_CollectionReportingClassification_ComplexType","documentation":"","baseType":"AccountClassification_Baseline_ComplexType","elementsCount":2,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountClassification_Collections_ComplexType","documentation":"","baseType":"CollectionsAccountClassification_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"Ckey","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TAS_BETC","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ProgramData","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"AccountClassification_Collections_ComplexType_x","documentation":"","baseType":"CollectionsAccountClassification_Baseline_ComplexType_x","elementsCount":3,"elements":[{"name":"Ckey","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TAS_BETC","type":"string","minOccurs":"0","maxOccurs":1},{"name":"PgmDta","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"AccountClassification_ComplexType","documentation":"","baseType":"AccountClassification_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TradingPartnerExtensions","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountClassification_InterGovernmentalReportingClassification_ComplexType","documentation":"","baseType":"AccountClassification_ReportingSummary_ComplexType","elementsCount":0,"elements":[]},{"name":"AccountClassification_PaymentClassification_ComplexType","documentation":"","baseType":"AccountClassification_Baseline_ComplexType","elementsCount":2,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountClassification_PaymentReportingClassification_ComplexType","documentation":"","baseType":"AccountClassification_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TradingPartnerExtensions","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountClassification_ReportingSummary_ComplexType","documentation":"","baseType":"AccountClassification_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"TreasuryAccountSymbol","type":"string","minOccurs":"0","maxOccurs":1},{"name":"BusinessEventType","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TradingPartnerExtensions","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AccountingReportingStatus_Baseline_ComplexType","documentation":"","baseType":"BusinessTransactionType_ComplexType","elementsCount":0,"elements":[]},{"name":"AccountingReportingStatus_ComplexType","documentation":"","baseType":"AccountingReportingStatus_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_ACH_EntryReference_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_ACH_Reference_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_ACH_ReportingDetail_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_ACH_ReportingReturns_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":3,"elements":[{"name":"ACH_Batch","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Record","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Addendum","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"ACH_Detail_Baseline_ComplexType_x","documentation":"","baseType":"","elementsCount":3,"elements":[{"name":"ACH_Btch","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Rec","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Addn","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"ACH_Detail_CheckACH_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"ACH_Detail_CheckACH_ComplexType_x","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType_x","elementsCount":0,"elements":[]},{"name":"ACH_Detail_ComplexType","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"ACH_Batch","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Record","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Addendum","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"ACH_Detail_ComplexType_x","documentation":"","baseType":"ACH_Detail_Baseline_ComplexType_x","elementsCount":3,"elements":[{"name":"ACH_Btch","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Rec","type":"string","minOccurs":"0","maxOccurs":1},{"name":"ACH_Addn","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"Addenda_ComplexType","documentation":"","baseType":"","elementsCount":1,"elements":[{"name":"ACH_Addendum","type":"string","minOccurs":1,"maxOccurs":"unbounded"}]},{"name":"Addendum_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":2,"elements":[{"name":"ACH_Record","type":"string","minOccurs":"0","maxOccurs":1},{"name":"OtherData","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"Addendum_Baseline_ComplexType_x","documentation":"","baseType":"","elementsCount":1,"elements":[{"name":"ACH_Rec","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"Addendum_ComplexType","documentation":"","baseType":"Addendum_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"ACH_Record","type":"string","minOccurs":1,"maxOccurs":1}]},{"name":"Addendum_ComplexType_x","documentation":"","baseType":"Addendum_Baseline_ComplexType_x","elementsCount":1,"elements":[{"name":"ACH_Rec","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"Addendum_PaymentAddendum_ComplexType","documentation":"","baseType":"Addendum_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"Address_AgencyAddress_ComplexType","documentation":"","baseType":"Address_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"AddressLineText","type":"string","minOccurs":"0","maxOccurs":"5"}]},{"name":"Address_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":2,"elements":[{"name":"AddressLineText","type":"string","minOccurs":"0","maxOccurs":"unbounded"},{"name":"PayeeAddressLine","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"Address_Baseline_ComplexType_x","documentation":"","baseType":"","elementsCount":1,"elements":[{"name":"AddrLnTxt","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"Address_ComplexType","documentation":"","baseType":"Address_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"AddressLineText","type":"string","minOccurs":"0","maxOccurs":"5"}]},{"name":"Address_ComplexType_x","documentation":"","baseType":"Address_Baseline_ComplexType_x","elementsCount":1,"elements":[{"name":"AddrLnTxt","type":"string","minOccurs":"0","maxOccurs":"5"}]},{"name":"Address_PaymentAddressOld_ComplexType","documentation":"","baseType":"Address_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"PayeeAddressLine","type":"string","minOccurs":"0","maxOccurs":"4"}]},{"name":"Agency_AgencyLocationCodeRecord_ComplexType","documentation":"","baseType":"Agency_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"AgencyAddress","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AgencyContactInfo","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AccountingReportingStatus","type":"string","minOccurs":"0","maxOccurs":"4"}]},{"name":"Agency_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":6,"elements":[{"name":"OrganizationLevels","type":"string","minOccurs":"0","maxOccurs":1},{"name":"CashFlowReference","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Address","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AgencyAddress","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AgencyContactInfo","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AccountingReportingStatus","type":"string","minOccurs":"0","maxOccurs":"unbounded"}]},{"name":"Agency_BillingAgency_ComplexType","documentation":"","baseType":"Agency_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"Agency_ComplexType","documentation":"","baseType":"Agency_Baseline_ComplexType","elementsCount":3,"elements":[{"name":"OrganizationLevels","type":"string","minOccurs":"0","maxOccurs":1},{"name":"CashFlowReference","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Address","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"Agency_OriginatingAgency_ComplexType","documentation":"","baseType":"Agency_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"Agency_OwningAgency_ComplexType","documentation":"","baseType":"Agency_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"AgencyContactInfo_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":2,"elements":[{"name":"PersonName","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Phone","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AgencyContactInfo_ComplexType","documentation":"","baseType":"AgencyContactInfo_Baseline_ComplexType","elementsCount":2,"elements":[{"name":"PersonName","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Phone","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"AppropriationPaymentRemarks_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":1,"elements":[{"name":"AppropriationPaymentRemark","type":"string","minOccurs":1,"maxOccurs":"4"}]},{"name":"AppropriationPaymentRemarks_ComplexType","documentation":"","baseType":"AppropriationPaymentRemarks_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"AppropriationPaymentRemark","type":"string","minOccurs":1,"maxOccurs":"4"}]},{"name":"BankDetail_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":5,"elements":[{"name":"GovernmentDepositAccount","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AgentBank","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TreasuryAccountDetail","type":"string","minOccurs":"0","maxOccurs":1},{"name":"DepositaryDetail","type":"string","minOccurs":"0","maxOccurs":"unbounded"},{"name":"SummaryCashManagement","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"BankDetail_ComplexType","documentation":"","baseType":"BankDetail_Baseline_ComplexType","elementsCount":4,"elements":[{"name":"GovernmentDepositAccount","type":"string","minOccurs":"0","maxOccurs":1},{"name":"AgentBank","type":"string","minOccurs":"0","maxOccurs":1},{"name":"TreasuryAccountDetail","type":"string","minOccurs":"0","maxOccurs":1},{"name":"SummaryCashManagement","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"BankInfo_ACH_PayeeBankInfo_ComplexType","documentation":"","baseType":"BankInfo_Baseline_ComplexType","elementsCount":0,"elements":[]},{"name":"BankInfo_BankDepositaryInfo_ComplexType","documentation":"","baseType":"BankInfo_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"Branch","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"BankInfo_Baseline_ComplexType","documentation":"","baseType":"","elementsCount":2,"elements":[{"name":"Address","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Branch","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"BankInfo_Baseline_ComplexType_x","documentation":"","baseType":"","elementsCount":2,"elements":[{"name":"Addr","type":"string","minOccurs":"0","maxOccurs":1},{"name":"Brnch","type":"string","minOccurs":"0","maxOccurs":1}]},{"name":"BankInfo_ComplexType","documentation":"","baseType":"BankInfo_Baseline_ComplexType","elementsCount":1,"elements":[{"name":"Address","type":"string","minOccurs":"0","maxOccurs":1}]}],
  simpleTypes: [],
  groups: []
};

export const SpecUI_XML_Schema_Common_ComplexTypes_xsd_xml: React.FC<SpecUI_XML_Schema_Common_ComplexTypes_xsd_xmlProps> = () => {
  const [activeTab, setActiveTab] = useState<'complex' | 'simple' | 'groups' | 'xml'>('complex');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeName, setSelectedTypeName] = useState<string>(XSD_META.complexTypes[0]?.name || '');
  const [copied, setCopied] = useState(false);

  const filteredComplexTypes = XSD_META.complexTypes.filter(ct => 
    ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ct.documentation && ct.documentation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSimpleTypes = XSD_META.simpleTypes.filter(st =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = XSD_META.groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedComplexType = XSD_META.complexTypes.find(ct => ct.name === selectedTypeName) || XSD_META.complexTypes[0];

  const handleCopyXml = () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:iso:std:iso:20022:tech:xsd" elementFormDefault="qualified">
  <!-- ${XSD_META.title} Schema Definition -->
  <xs:complexType name="${selectedComplexType?.name || 'Item'}">
    <xs:sequence>
${(selectedComplexType?.elements || []).map(el => `      <xs:element name="${el.name}" type="${el.type || 'xs:string'}" minOccurs="${el.minOccurs}" maxOccurs="${el.maxOccurs}"/>`).join('\n')}
    </xs:sequence>
  </xs:complexType>
</xs:schema>`;
    navigator.clipboard.writeText(sampleXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-white space-y-6 shadow-xl">
      {/* Spec Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileCode className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{XSD_META.title}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              XSD XML SCHEMA
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{XSD_META.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyXml}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded-lg border border-[#30363D] transition font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy XML Schema</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('complex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'complex' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Complex Types ({XSD_META.complexTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'simple' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Simple Types ({XSD_META.simpleTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'groups' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Model Groups ({XSD_META.groups.length})
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'xml' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            XML Preview
          </button>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schema elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white focus:border-indigo-500 outline-none w-56"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Type Navigator */}
        <div className="lg:col-span-4 bg-[#0D1117] border border-[#30363D] rounded-xl p-3 max-h-[480px] overflow-y-auto space-y-1 scrollbar-thin">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            Schema Definitions
          </div>
          {activeTab === 'complex' && filteredComplexTypes.map((ct) => (
            <button
              key={ct.name}
              onClick={() => setSelectedTypeName(ct.name)}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-2 ${
                selectedTypeName === ct.name
                  ? 'bg-[#1F242C] border border-indigo-500/60 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-[#161B22] hover:text-gray-200'
              }`}
            >
              <div className="truncate">
                <div className="text-indigo-300 font-semibold truncate">{ct.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{ct.elementsCount} sub-elements</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </button>
          ))}
          {activeTab === 'simple' && filteredSimpleTypes.map((st) => (
            <div key={st.name} className="p-2.5 rounded-lg text-xs font-mono bg-[#161B22] border border-[#30363D]">
              <div className="text-amber-300 font-semibold">{st.name}</div>
              <div className="text-[10px] text-gray-400">Base: {st.baseType || 'xs:string'}</div>
              {st.enumerations.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {st.enumerations.map((val) => (
                    <span key={val} className="px-1.5 py-0.2 bg-black/40 text-[9px] rounded text-emerald-300 border border-[#30363D]">
                      {val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {activeTab === 'groups' && filteredGroups.map((g) => (
            <div key={g.name} className="p-2.5 rounded-lg text-xs font-mono bg-[#161B22] border border-[#30363D]">
              <div className="text-purple-300 font-semibold">{g.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">Elements: {g.elements.join(', ') || 'none'}</div>
            </div>
          ))}
        </div>

        {/* Selected Type Inspector */}
        <div className="lg:col-span-8 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
          {activeTab === 'xml' ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-300">Generated XML Schema Definition</div>
              <pre className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg text-xs font-mono text-indigo-300 max-h-[400px] overflow-auto whitespace-pre">
{`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:citi:financial:schema:v1" elementFormDefault="qualified">
  <!-- ${XSD_META.title} -->
${XSD_META.complexTypes.map(ct => `  <xs:complexType name="${ct.name}">
    <xs:sequence>
${ct.elements.map(el => `      <xs:element name="${el.name}" type="${el.type || 'xs:string'}" minOccurs="${el.minOccurs}" maxOccurs="${el.maxOccurs}"/>`).join('\n')}
    </xs:sequence>
  </xs:complexType>`).join('\n\n')}
</xs:schema>`}
              </pre>
            </div>
          ) : selectedComplexType ? (
            <div className="space-y-4">
              <div className="border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-indigo-400 font-bold">ComplexType:</span>
                  <span className="text-base font-bold text-white font-mono">{selectedComplexType.name}</span>
                </div>
                {selectedComplexType.documentation && (
                  <p className="text-xs text-gray-400 mt-1">{selectedComplexType.documentation}</p>
                )}
                {selectedComplexType.baseType && (
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">Base Type: {selectedComplexType.baseType}</div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-gray-300 mb-2">Child Elements ({selectedComplexType.elements.length})</div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedComplexType.elements.map((el, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-emerald-400 font-bold">{el.name}</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-indigo-300">{el.type || 'xs:string'}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-[#30363D]">
                        [{el.minOccurs}..{el.maxOccurs}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500">Select a schema type to inspect attributes</div>
          )}
        </div>
      </div>
    </div>
  );
};

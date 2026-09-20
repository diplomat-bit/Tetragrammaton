import React from 'react';
import { ApplicantItem, IdDocDetail, EmailItem, AddressItem, PhoneItem, QuestionnaireItem } from '../types';
import { User, Plus, Trash2, Mail, Phone, Home, HelpCircle, FileBadge } from 'lucide-react';

interface ApplicantFormProps {
  applicants: ApplicantItem[];
  onChange: (updated: ApplicantItem[]) => void;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  applicants,
  onChange,
}) => {
  const currentApplicant = applicants[0] || {
    name: { salutation: 'MR.', givenName: 'Javier', middleName: 'Perez', surname: 'de Cuellar' },
    identificationDocumentDetails: [{ idType: 'PASSPORT', idNumber: 'Passport- 443431' }],
    demographics: { gender: 'MALE', dateOfBirth: '1980-01-01', maritalStatus: 'SINGLE', nationality: 'SG' },
    ownershipType: 'OWNER',
    additionalData: { relationshipWithPrimary: 'HUSBAND' },
    email: [{ emailAddress: 'javier@abcd.com' }],
    address: [{
      addressLine1: '40A Orchard Road',
      addressLine2: '#99-99 Macdonald House',
      addressLine3: 'Orchard Avenue 2',
      addressLine4: 'Street 65',
      cityName: 'Singapore',
      state: 'SINGAPORE',
      postalCode: '520189',
      countryCode: 'SG'
    }],
    phone: [{ phoneNumber: '4567234512', phoneCountryCode: '34', areaCode: 'O', extension: 'O' }],
    questionnaire: [{ questionId: '1', answerText: 'Yes or No', remarks: 'Health Declartion' }]
  };

  const updateApplicant = (updater: (prev: ApplicantItem) => ApplicantItem) => {
    const updated = [...applicants];
    if (updated.length === 0) {
      updated.push(currentApplicant);
    }
    updated[0] = updater(updated[0]);
    onChange(updated);
  };

  // Name updates
  const handleNameChange = (field: keyof typeof currentApplicant.name, value: string) => {
    updateApplicant(prev => ({
      ...prev,
      name: { ...prev.name, [field]: value }
    }));
  };

  // Demographics
  const handleDemographicsChange = (field: keyof typeof currentApplicant.demographics, value: string) => {
    updateApplicant(prev => ({
      ...prev,
      demographics: { ...prev.demographics, [field]: value }
    }));
  };

  // ID Docs
  const handleIdDocChange = (index: number, field: keyof IdDocDetail, value: string) => {
    updateApplicant(prev => {
      const docs = [...prev.identificationDocumentDetails];
      docs[index] = { ...docs[index], [field]: value };
      return { ...prev, identificationDocumentDetails: docs };
    });
  };

  const handleAddIdDoc = () => {
    updateApplicant(prev => ({
      ...prev,
      identificationDocumentDetails: [...prev.identificationDocumentDetails, { idType: 'PASSPORT', idNumber: '' }]
    }));
  };

  const handleRemoveIdDoc = (index: number) => {
    updateApplicant(prev => ({
      ...prev,
      identificationDocumentDetails: prev.identificationDocumentDetails.filter((_, i) => i !== index)
    }));
  };

  // Email
  const handleEmailChange = (index: number, value: string) => {
    updateApplicant(prev => {
      const list = [...prev.email];
      list[index] = { emailAddress: value };
      return { ...prev, email: list };
    });
  };

  const handleAddEmail = () => {
    updateApplicant(prev => ({
      ...prev,
      email: [...prev.email, { emailAddress: '' }]
    }));
  };

  const handleRemoveEmail = (index: number) => {
    updateApplicant(prev => ({
      ...prev,
      email: prev.email.filter((_, i) => i !== index)
    }));
  };

  // Address
  const handleAddressChange = (index: number, field: keyof AddressItem, value: string) => {
    updateApplicant(prev => {
      const addresses = [...prev.address];
      addresses[index] = { ...addresses[index], [field]: value };
      return { ...prev, address: addresses };
    });
  };

  // Phone
  const handlePhoneChange = (index: number, field: keyof PhoneItem, value: string) => {
    updateApplicant(prev => {
      const phones = [...prev.phone];
      phones[index] = { ...phones[index], [field]: value };
      return { ...prev, phone: phones };
    });
  };

  // Questionnaire
  const handleQuestionnaireChange = (index: number, field: keyof QuestionnaireItem, value: string) => {
    updateApplicant(prev => {
      const q = [...prev.questionnaire];
      q[index] = { ...q[index], [field]: value };
      return { ...prev, questionnaire: q };
    });
  };

  const handleAddQuestionnaire = () => {
    updateApplicant(prev => ({
      ...prev,
      questionnaire: [...prev.questionnaire, {
        questionId: String(prev.questionnaire.length + 1),
        answerText: 'Yes',
        remarks: ''
      }]
    }));
  };

  const handleRemoveQuestionnaire = (index: number) => {
    updateApplicant(prev => ({
      ...prev,
      questionnaire: prev.questionnaire.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <User className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Applicant Information (applicant[0])
        </h3>
      </div>

      {/* Full Name */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          1. Legal Name
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Salutation
            </label>
            <select
              id="select-applicant-salutation"
              value={currentApplicant.name.salutation}
              onChange={(e) => handleNameChange('salutation', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="MR.">MR.</option>
              <option value="MS.">MS.</option>
              <option value="MRS.">MRS.</option>
              <option value="MDM.">MDM.</option>
              <option value="DR.">DR.</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Given Name <span className="text-red-400">*</span>
            </label>
            <input
              id="input-applicant-given-name"
              type="text"
              value={currentApplicant.name.givenName}
              onChange={(e) => handleNameChange('givenName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="Javier"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Middle Name
            </label>
            <input
              id="input-applicant-middle-name"
              type="text"
              value={currentApplicant.name.middleName}
              onChange={(e) => handleNameChange('middleName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="Perez"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Surname <span className="text-red-400">*</span>
            </label>
            <input
              id="input-applicant-surname"
              type="text"
              value={currentApplicant.name.surname}
              onChange={(e) => handleNameChange('surname', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="de Cuellar"
            />
          </div>
        </div>
      </div>

      {/* Demographics & Ownership */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          2. Demographics & Relationship
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Gender
            </label>
            <select
              id="select-applicant-gender"
              value={currentApplicant.demographics.gender}
              onChange={(e) => handleDemographicsChange('gender', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Date of Birth
            </label>
            <input
              id="input-applicant-dob"
              type="date"
              value={currentApplicant.demographics.dateOfBirth}
              onChange={(e) => handleDemographicsChange('dateOfBirth', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Marital Status
            </label>
            <select
              id="select-applicant-marital"
              value={currentApplicant.demographics.maritalStatus}
              onChange={(e) => handleDemographicsChange('maritalStatus', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="SINGLE">SINGLE</option>
              <option value="MARRIED">MARRIED</option>
              <option value="DIVORCED">DIVORCED</option>
              <option value="WIDOWED">WIDOWED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Nationality (ISO)
            </label>
            <input
              id="input-applicant-nationality"
              type="text"
              value={currentApplicant.demographics.nationality}
              onChange={(e) => handleDemographicsChange('nationality', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="SG"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Ownership Type
            </label>
            <select
              id="select-applicant-ownership"
              value={currentApplicant.ownershipType}
              onChange={(e) => updateApplicant(prev => ({ ...prev, ownershipType: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="OWNER">OWNER</option>
              <option value="INSURED">INSURED</option>
              <option value="PAYOR">PAYOR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Relationship with Primary
            </label>
            <input
              id="input-applicant-relationship"
              type="text"
              value={currentApplicant.additionalData.relationshipWithPrimary}
              onChange={(e) => updateApplicant(prev => ({
                ...prev,
                additionalData: { relationshipWithPrimary: e.target.value }
              }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="HUSBAND"
            />
          </div>
        </div>
      </div>

      {/* ID Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileBadge className="w-3.5 h-3.5" />
            3. Identification Documents
          </h4>
          <button
            type="button"
            onClick={handleAddIdDoc}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3 h-3" /> Add ID Document
          </button>
        </div>

        <div className="space-y-3">
          {currentApplicant.identificationDocumentDetails.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="w-1/3">
                <label className="block text-[11px] text-slate-400 mb-1">ID Type</label>
                <select
                  value={doc.idType}
                  onChange={(e) => handleIdDocChange(idx, 'idType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="PASSPORT">PASSPORT</option>
                  <option value="NRIC">NRIC / NATIONAL_ID</option>
                  <option value="FIN">FIN (Employment Pass)</option>
                  <option value="DRIVING_LICENSE">DRIVING_LICENSE</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] text-slate-400 mb-1">ID Number</label>
                <input
                  type="text"
                  value={doc.idNumber}
                  onChange={(e) => handleIdDocChange(idx, 'idNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  placeholder="Passport- 443431"
                />
              </div>
              {currentApplicant.identificationDocumentDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIdDoc(idx)}
                  className="mt-5 p-1 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              4. Email Address
            </h4>
            <button
              type="button"
              onClick={handleAddEmail}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Email
            </button>
          </div>
          <div className="space-y-2">
            {currentApplicant.email.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="email"
                  value={item.emailAddress}
                  onChange={(e) => handleEmailChange(idx, e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  placeholder="javier@abcd.com"
                />
                {currentApplicant.email.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(idx)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Phone className="w-3.5 h-3.5" />
            5. Phone Details
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Country Code</label>
              <input
                type="text"
                value={currentApplicant.phone[0]?.phoneCountryCode || '34'}
                onChange={(e) => handlePhoneChange(0, 'phoneCountryCode', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="34"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={currentApplicant.phone[0]?.phoneNumber || '4567234512'}
                onChange={(e) => handlePhoneChange(0, 'phoneNumber', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="4567234512"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Home className="w-3.5 h-3.5" />
          6. Residential / Contact Address
        </h4>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Address Line 1</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.addressLine1 || ''}
                onChange={(e) => handleAddressChange(0, 'addressLine1', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="40A Orchard Road"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Address Line 2</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.addressLine2 || ''}
                onChange={(e) => handleAddressChange(0, 'addressLine2', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="#99-99 Macdonald House"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Address Line 3</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.addressLine3 || ''}
                onChange={(e) => handleAddressChange(0, 'addressLine3', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Orchard Avenue 2"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Address Line 4</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.addressLine4 || ''}
                onChange={(e) => handleAddressChange(0, 'addressLine4', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Street 65"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">City</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.cityName || ''}
                onChange={(e) => handleAddressChange(0, 'cityName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Singapore"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">State / Province</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.state || ''}
                onChange={(e) => handleAddressChange(0, 'state', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="SINGAPORE"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Postal Code</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.postalCode || ''}
                onChange={(e) => handleAddressChange(0, 'postalCode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="520189"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Country Code</label>
              <input
                type="text"
                value={currentApplicant.address[0]?.countryCode || ''}
                onChange={(e) => handleAddressChange(0, 'countryCode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="SG"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Health / Questionnaire */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            7. Underwriting Questionnaire
          </h4>
          <button
            type="button"
            onClick={handleAddQuestionnaire}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Plus className="w-3 h-3" /> Add Question
          </button>
        </div>

        <div className="space-y-3">
          {currentApplicant.questionnaire.map((q, idx) => (
            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Question ID</label>
                <input
                  type="text"
                  value={q.questionId}
                  onChange={(e) => handleQuestionnaireChange(idx, 'questionId', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Answer Text</label>
                <input
                  type="text"
                  value={q.answerText}
                  onChange={(e) => handleQuestionnaireChange(idx, 'answerText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Yes or No"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Remarks</label>
                <input
                  type="text"
                  value={q.remarks}
                  onChange={(e) => handleQuestionnaireChange(idx, 'remarks', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Health Declaration"
                />
              </div>
              <div className="flex justify-end">
                {currentApplicant.questionnaire.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestionnaire(idx)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

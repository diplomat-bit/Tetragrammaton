import React from 'react';
import { BeneficiaryItem, IdDocDetail } from '../types';
import { Users, Plus, Trash2, Copy, Percent } from 'lucide-react';

interface BeneficiaryFormProps {
  beneficiaries: BeneficiaryItem[];
  onChange: (updated: BeneficiaryItem[]) => void;
}

export const BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({
  beneficiaries,
  onChange,
}) => {
  const handleBeneficiaryChange = (
    index: number,
    updater: (prev: BeneficiaryItem) => BeneficiaryItem
  ) => {
    const updated = [...beneficiaries];
    updated[index] = updater(updated[index]);
    onChange(updated);
  };

  const handleAddBeneficiary = () => {
    const newBen: BeneficiaryItem = {
      identificationDocumentDetails: [{ idType: 'PASSPORT', idNumber: 'Passport- 443431' }],
      name: { salutation: 'MR.', givenName: 'Javier', middleName: 'Perez', surname: 'de Cuellar' },
      demographics: { gender: 'MALE', dateOfBirth: '1980-01-01', maritalStatus: 'SINGLE', nationality: 'SG' },
      additionalData: { relationshipWithPrimary: 'HUSBAND' },
      insuranceSumAssuredAllocPercentage: 100,
    };
    onChange([...beneficiaries, newBen]);
  };

  const handleRemoveBeneficiary = (index: number) => {
    onChange(beneficiaries.filter((_, i) => i !== index));
  };

  const handleDuplicateBeneficiary = (index: number) => {
    const duplicate = { ...beneficiaries[index] };
    onChange([...beneficiaries, duplicate]);
  };

  const totalAllocation = beneficiaries.reduce(
    (sum, b) => sum + (Number(b.insuranceSumAssuredAllocPercentage) || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Beneficiary Designations (beneficiary: {beneficiaries.length})
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
            totalAllocation === 100
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            Total Allocation: {totalAllocation}%
          </span>
          <button
            id="btn-add-beneficiary"
            type="button"
            onClick={handleAddBeneficiary}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-pink-950 text-pink-300 border border-pink-800 hover:bg-pink-900 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Beneficiary
          </button>
        </div>
      </div>

      {beneficiaries.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">No beneficiaries configured.</p>
          <button
            type="button"
            onClick={handleAddBeneficiary}
            className="mt-2 text-xs text-pink-400 hover:underline"
          >
            Add a default beneficiary
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {beneficiaries.map((b, index) => (
            <div
              key={index}
              id={`beneficiary-item-${index}`}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-semibold text-pink-300 font-mono flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-pink-900/60 border border-pink-700/50 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  {b.name.salutation} {b.name.givenName} {b.name.surname} ({b.additionalData.relationshipWithPrimary || 'Beneficiary'})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicateBeneficiary(index)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Duplicate Beneficiary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBeneficiary(index)}
                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Remove Beneficiary"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Salutation</label>
                  <select
                    value={b.name.salutation}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      name: { ...prev.name, salutation: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value="MR.">MR.</option>
                    <option value="MS.">MS.</option>
                    <option value="MRS.">MRS.</option>
                    <option value="MDM.">MDM.</option>
                    <option value="DR.">DR.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Given Name</label>
                  <input
                    type="text"
                    value={b.name.givenName}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      name: { ...prev.name, givenName: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-pink-500"
                    placeholder="Javier"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={b.name.middleName}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      name: { ...prev.name, middleName: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-pink-500"
                    placeholder="Perez"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Surname</label>
                  <input
                    type="text"
                    value={b.name.surname}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      name: { ...prev.name, surname: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-pink-500"
                    placeholder="de Cuellar"
                  />
                </div>
              </div>

              {/* Demographics & Alloc */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Gender</label>
                  <select
                    value={b.demographics.gender}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, gender: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={b.demographics.dateOfBirth}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, dateOfBirth: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nationality</label>
                  <input
                    type="text"
                    value={b.demographics.nationality}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, nationality: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-pink-500"
                    placeholder="SG"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    value={b.additionalData.relationshipWithPrimary}
                    onChange={(e) => handleBeneficiaryChange(index, prev => ({
                      ...prev,
                      additionalData: { relationshipWithPrimary: e.target.value }
                    }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-pink-500"
                    placeholder="HUSBAND"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                    <Percent className="w-3 h-3 text-pink-400" />
                    Allocation %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={b.insuranceSumAssuredAllocPercentage}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value);
                      handleBeneficiaryChange(index, prev => ({
                        ...prev,
                        insuranceSumAssuredAllocPercentage: isNaN(num) ? 0 : num
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-semibold font-mono focus:outline-none focus:border-pink-500"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* ID Docs */}
              <div className="pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-1/3">
                    <label className="block text-[11px] text-slate-400 mb-1">ID Type</label>
                    <select
                      value={b.identificationDocumentDetails[0]?.idType || 'PASSPORT'}
                      onChange={(e) => handleBeneficiaryChange(index, prev => {
                        const docs = [...prev.identificationDocumentDetails];
                        if (docs.length === 0) docs.push({ idType: 'PASSPORT', idNumber: '' });
                        docs[0] = { ...docs[0], idType: e.target.value };
                        return { ...prev, identificationDocumentDetails: docs };
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                    >
                      <option value="PASSPORT">PASSPORT</option>
                      <option value="NRIC">NRIC / NATIONAL_ID</option>
                      <option value="FIN">FIN</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-slate-400 mb-1">ID Number</label>
                    <input
                      type="text"
                      value={b.identificationDocumentDetails[0]?.idNumber || ''}
                      onChange={(e) => handleBeneficiaryChange(index, prev => {
                        const docs = [...prev.identificationDocumentDetails];
                        if (docs.length === 0) docs.push({ idType: 'PASSPORT', idNumber: '' });
                        docs[0] = { ...docs[0], idNumber: e.target.value };
                        return { ...prev, identificationDocumentDetails: docs };
                      })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-pink-500"
                      placeholder="Passport- 443431"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

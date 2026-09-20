import React, { useState } from 'react';
import { FileCode, ChevronRight, ChevronDown, Copy, Check, Sparkles } from 'lucide-react';

export interface XsdTypeNode {
  name: string;
  documentation?: string;
  elements?: Array<{ name: string; type?: string; documentation?: string; minOccurs?: any; maxOccurs?: any }>;
  attributes?: Array<{ name: string; type?: string; documentation?: string }>;
}

export interface GeneratedXsdViewerProps {
  schemaName: string;
  targetNamespace?: string;
  complexTypes: XsdTypeNode[];
}

export const GeneratedXsdViewer: React.FC<GeneratedXsdViewerProps> = ({
  schemaName,
  targetNamespace,
  complexTypes,
}) => {
  const [selectedType, setSelectedType] = useState<XsdTypeNode | null>(complexTypes[0] || null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = complexTypes.filter(ct =>
    ct.name.toLowerCase().includes(search.toLowerCase()) ||
    (ct.documentation && ct.documentation.toLowerCase().includes(search.toLowerCase()))
  );

  const generateSampleXml = (node: XsdTypeNode): string => {
    const attrs = (node.attributes || []).map(a => ` ${a.name}="sample_${a.type || 'string'}"`).join('');
    if (!node.elements || node.elements.length === 0) {
      return `<${node.name}${attrs}>SampleValue</${node.name}>`;
    }
    const children = node.elements.map(el => `  <${el.name}>${el.type || 'string_value'}</${el.name}>`).join('\n');
    return `<${node.name}${attrs}>\n${children}\n</${node.name}>`;
  };

  const copyXml = () => {
    if (!selectedType) return;
    navigator.clipboard.writeText(generateSampleXml(selectedType));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 text-white space-y-4">
      <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
        <div>
          <h3 className="font-semibold text-base flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-purple-400" />
            <span>{schemaName}</span>
          </h3>
          {targetNamespace && <p className="text-xs text-gray-400">Namespace: {targetNamespace}</p>}
        </div>
        <span className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-mono">
          {complexTypes.length} Types
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left List */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Filter types..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-1.5 text-xs text-gray-200 outline-none"
          />
          <div className="max-h-96 overflow-y-auto space-y-1 pr-1">
            {filtered.map(ct => (
              <button
                key={ct.name}
                onClick={() => setSelectedType(ct)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs truncate transition ${
                  selectedType?.name === ct.name
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                    : 'text-gray-300 hover:bg-[#21262D]'
                }`}
              >
                {ct.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Details */}
        <div className="md:col-span-2 bg-[#0D1117] border border-[#30363D] rounded-lg p-4 space-y-3">
          {selectedType ? (
            <>
              <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
                <div>
                  <h4 className="font-mono text-sm text-purple-300 font-semibold">{selectedType.name}</h4>
                  {selectedType.documentation && (
                    <p className="text-xs text-gray-400 mt-1">{selectedType.documentation}</p>
                  )}
                </div>
                <button
                  onClick={copyXml}
                  className="flex items-center space-x-1 px-2 py-1 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded border border-[#30363D]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy XML</span>
                </button>
              </div>

              {/* Elements Table */}
              <div>
                <h5 className="text-xs font-semibold text-gray-300 mb-1.5">Child Elements ({selectedType.elements?.length || 0})</h5>
                <div className="max-h-48 overflow-y-auto border border-[#30363D] rounded divide-y divide-[#30363D]">
                  {(selectedType.elements || []).map(el => (
                    <div key={el.name} className="p-2 text-xs flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-medium">{el.name}</span>
                      <span className="text-gray-400 font-mono text-[11px]">{el.type || 'string'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated XML Preview */}
              <div>
                <h5 className="text-xs font-semibold text-gray-300 mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Synthesized Sample XML</span>
                </h5>
                <pre className="bg-[#161B22] p-3 rounded text-[11px] font-mono text-amber-300 max-h-40 overflow-auto border border-[#30363D]">
                  {generateSampleXml(selectedType)}
                </pre>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500">Select a type on the left to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
};

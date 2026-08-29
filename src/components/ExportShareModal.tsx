import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Printer,
  FileText,
  Check,
  Download,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const { profile, shoppingList, budgetBreakdown, signatureDrink } = currentPlan;
  const totalGuests = profile.adultsCount + (profile.kidsCount || 0);

  // Generate Markdown Text
  const generateMarkdown = () => {
    let md = `# ${profile.title} — Curated Event Blueprint\n`;
    md += `**Theme:** ${profile.theme} | **Guests:** ${totalGuests} (${profile.adultsCount} Adults, ${profile.kidsCount || 0} Youths) | **Duration:** ${profile.durationHours} hrs\n`;
    md += `**Target Budget:** $${profile.targetBudget} | **Estimated Total:** $${budgetBreakdown.totalEstimated.toFixed(2)}\n\n`;

    if (signatureDrink) {
      md += `### Signature Beverage: ${signatureDrink.name}\n`;
      md += `${signatureDrink.description}\n`;
      md += `*Ingredients:* ${signatureDrink.ingredients.join(', ')}\n\n`;
    }

    md += `## Provision & Sourcing Manifest\n\n`;

    // Group by store
    const storeMap: Record<string, typeof shoppingList> = {};
    shoppingList.forEach((item) => {
      const st = item.suggestedStore || 'General Grocery';
      if (!storeMap[st]) storeMap[st] = [];
      storeMap[st].push(item);
    });

    Object.entries(storeMap).forEach(([store, items]) => {
      md += `### ${store}\n`;
      items.forEach((i) => {
        const check = i.isPurchased ? '[x]' : '[ ]';
        md += `- ${check} **${i.name}** (${i.quantity} ${i.unit}) — ~$${i.estimatedPrice.toFixed(2)} [${i.aisle || i.subcategory}]\n`;
        if (i.portionExplanation) md += `  - *Portion Math:* ${i.portionExplanation}\n`;
      });
      md += `\n`;
    });

    return md;
  };

  // Generate SMS Summary for Co-Hosts
  const generateSmsSummary = () => {
    let text = `Party Provision List for ${profile.title} (${totalGuests} guests):\n\n`;
    text += `Estimated Total: $${budgetBreakdown.totalEstimated.toFixed(2)} (Target: $${profile.targetBudget})\n\n`;

    const remaining = shoppingList.filter((i) => !i.isPurchased);
    text += `Provisions remaining to source (${remaining.length}):\n`;
    remaining.slice(0, 10).forEach((i) => {
      text += `• ${i.name} (${i.quantity} ${i.unit}) @ ${i.suggestedStore}\n`;
    });

    if (remaining.length > 10) {
      text += `...and ${remaining.length - 10} more provisions.\n`;
    }

    return text;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a]">Export & Dispatch Manifest</h3>
              <p className="text-[10px] uppercase font-mono tracking-wider text-black/50">
                Print physical checklists, copy markdown dossiers, or dispatch co-host summaries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {/* Print Checklist Action */}
          <div className="bg-[#FAF9F6] p-4 border border-black/15 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[#C5A059]" />
                Print-Formatted Provision Manifest
              </h4>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                High-contrast typography formatted for physical store clipboards & market runs
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-black hover:bg-[#C5A059] hover:text-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap border border-black"
            >
              Print Manifest
            </button>
          </div>

          {/* Copy Markdown */}
          <div className="bg-[#FAF9F6] p-4 border border-black/15 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#C5A059]" />
                Copy Markdown Dossier
              </h4>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                Complete event blueprint with store aisles and portion math for Notion, Obsidian, or Docs
              </p>
            </div>

            <button
              onClick={() => handleCopy(generateMarkdown(), 'markdown')}
              className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-black/20 text-black text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 whitespace-nowrap"
            >
              {copiedType === 'markdown' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[#8C6D2B]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#C5A059]" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* Copy SMS / Co-Host Text */}
          <div className="bg-[#FAF9F6] p-4 border border-black/15 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                Dispatch Text Summary
              </h4>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                Concise message formatted to text co-hosts and friends assisting with shopping runs
              </p>
            </div>

            <button
              onClick={() => handleCopy(generateSmsSummary(), 'sms')}
              className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-black/20 text-black text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 whitespace-nowrap"
            >
              {copiedType === 'sms' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[#8C6D2B]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#C5A059]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Download JSON Backup */}
          <div className="bg-[#FAF9F6] p-4 border border-black/15 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-serif font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#C5A059]" />
                Export Raw JSON Dossier
              </h4>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                Export complete structured event data for archive preservation or offline reload
              </p>
            </div>

            <button
              onClick={handleDownloadJson}
              className="px-4 py-2 bg-white hover:bg-black hover:text-white border border-black/20 text-black text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 whitespace-nowrap"
            >
              <Download className="w-3 h-3 text-[#C5A059]" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


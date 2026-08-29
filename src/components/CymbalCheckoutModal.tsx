import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Store,
  Truck,
  ShoppingBag,
  Calendar,
  Clock,
  QrCode,
  DollarSign,
  Printer,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Tag,
  Share2,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface CymbalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  onLaunchInStoreMode: () => void;
}

export const CymbalCheckoutModal: React.FC<CymbalCheckoutModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onLaunchInStoreMode,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery' | 'instore'>('pickup');
  const [selectedSlot, setSelectedSlot] = useState<string>('today_afternoon');
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [orderId] = useState<string>(() => `CYM-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedType, setCopiedType] = useState<'sms' | 'dossier' | null>(null);

  if (!isOpen) return null;

  const { profile, budgetBreakdown, shoppingList } = currentPlan;
  const totalGuests = profile.adultsCount + (profile.kidsCount || 0);

  // Financial calculations
  const subtotal = budgetBreakdown.totalEstimated;
  const cymbalClubDiscount = Number((subtotal * 0.12).toFixed(2)); // 12% Cymbal Club Member savings
  const estimatedTax = Number(((subtotal - cymbalClubDiscount) * 0.0825).toFixed(2));
  const fulfillmentFee = fulfillmentType === 'delivery' ? 7.99 : 0.0;
  const finalTotal = Number((subtotal - cymbalClubDiscount + estimatedTax + fulfillmentFee).toFixed(2));

  const remainingItems = shoppingList.filter((i) => !i.isPurchased);

  const handlePlaceOrder = () => {
    if (fulfillmentType === 'instore') {
      onClose();
      onLaunchInStoreMode();
    } else {
      setIsOrderPlaced(true);
    }
  };

  const handleCopyText = (text: string, type: 'sms' | 'dossier') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const generateSmsSummary = () => {
    let text = `🛒 CymbalMart Party Provision Order for "${profile.title}" (${totalGuests} guests)\n`;
    text += `Order Ref: ${orderId} | Total: $${finalTotal.toFixed(2)}\n`;
    text += `Fulfillment: ${
      fulfillmentType === 'pickup'
        ? 'Curbside Pickup (CymbalMart #104 - West Valley)'
        : 'Express Doorstep Delivery'
    }\n\n`;
    text += `Key Sourced Items (${shoppingList.length} items):\n`;
    shoppingList.slice(0, 8).forEach((item) => {
      text += `• ${item.name} (${item.quantity} ${item.unit}) - $${item.estimatedPrice.toFixed(2)}\n`;
    });
    if (shoppingList.length > 8) {
      text += `...and ${shoppingList.length - 8} more curated provisions.\n`;
    }
    return text;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#8C6D2B]">
                  CymbalMart Fulfillment
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#C5A059]/15 text-[#8C6D2B] border border-[#C5A059]/30">
                  Step 3: Refine & Checkout
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] tracking-tight">
                {isOrderPlaced ? 'Order Confirmed & Dispatched' : 'Review & Finalize Sourcing Order'}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-black/40 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isOrderPlaced ? (
          <div className="overflow-y-auto flex-1 py-4 space-y-5 pr-1">
            {/* Fulfillment Options */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-2">
                Select Fulfillment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Curbside Pickup */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 text-left transition-all border ${
                    fulfillmentType === 'pickup'
                      ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                      : 'bg-[#FAF9F6] text-[#1a1a1a] border-black/15 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Store className={`w-4 h-4 ${fulfillmentType === 'pickup' ? 'text-[#C5A059]' : 'text-black'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 bg-white/10 text-[#C5A059]">
                      Free Pickup
                    </span>
                  </div>
                  <div className="font-serif font-bold text-sm">Curbside Pickup</div>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-sans">
                    CymbalMart Store #104 • Ready in 2 hrs
                  </p>
                </button>

                {/* Express Delivery */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3 text-left transition-all border ${
                    fulfillmentType === 'delivery'
                      ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                      : 'bg-[#FAF9F6] text-[#1a1a1a] border-black/15 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Truck className={`w-4 h-4 ${fulfillmentType === 'delivery' ? 'text-[#C5A059]' : 'text-black'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 bg-white/10 text-[#C5A059]">
                      $7.99
                    </span>
                  </div>
                  <div className="font-serif font-bold text-sm">Express Delivery</div>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-sans">
                    Temperature-controlled cold-chain van
                  </p>
                </button>

                {/* In-Store Shopper Mode */}
                <button
                  type="button"
                  onClick={() => setFulfillmentType('instore')}
                  className={`p-3 text-left transition-all border ${
                    fulfillmentType === 'instore'
                      ? 'bg-[#1a1a1a] text-[#C5A059] border-black shadow-xs'
                      : 'bg-[#FAF9F6] text-[#1a1a1a] border-black/15 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <QrCode className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#C5A059]/20 text-[#C5A059]">
                      In-Store HUD
                    </span>
                  </div>
                  <div className="font-serif font-bold text-sm text-white sm:text-inherit">Shop in Person</div>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-sans">
                    Interactive Aisle-by-Aisle Navigator
                  </p>
                </button>
              </div>
            </div>

            {/* Time Slot Picker (if pickup or delivery) */}
            {fulfillmentType !== 'instore' && (
              <div className="bg-[#FAF9F6] p-3.5 border border-black/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    Fulfillment Window:
                  </span>
                  <span className="text-[10px] font-mono text-black/50">Today, Aug 29</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'today_afternoon', time: '2:00 PM – 4:00 PM', tag: 'Fastest' },
                    { id: 'today_evening', time: '5:00 PM – 7:00 PM', tag: 'Popular' },
                    { id: 'tomorrow_morning', time: 'Tomorrow 9:00 AM – 11:00 AM', tag: 'Fresh Wave' },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-2 text-left border transition-all text-xs ${
                        selectedSlot === slot.id
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white text-black/80 border-black/15 hover:border-black'
                      }`}
                    >
                      <div className="font-mono text-[11px]">{slot.time}</div>
                      <div className="text-[9px] text-[#C5A059] uppercase tracking-wider">{slot.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order Ledger & Cymbal Member Savings */}
            <div className="bg-[#1a1a1a] text-[#FAF9F6] p-5 border border-black">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#C5A059] mb-3 pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cymbal Rewards Member Ledger
                </span>
                <span>{shoppingList.length} Provisions</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/70">Estimated Retail Provisions Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#C5A059]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Cymbal Select & Bulk Member Discounts (12%)
                  </span>
                  <span className="font-mono font-bold">-${cymbalClubDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white/70">
                  <span>Estimated Local Sales Tax</span>
                  <span className="font-mono">${estimatedTax.toFixed(2)}</span>
                </div>

                {fulfillmentFee > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Express Cold-Chain Delivery</span>
                    <span className="font-mono">${fulfillmentFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 mt-3 border-t border-white/15 flex justify-between items-baseline">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider text-white">Final Estimated Total</div>
                    <div className="text-[10px] text-white/50 font-serif italic">
                      Target Budget: ${profile.targetBudget.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-2xl font-serif italic text-white font-bold">
                    ${finalTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sourced Items Quick Peek */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-black/60 mb-2">
                Cart Overview ({shoppingList.length} items for {totalGuests} guests)
              </div>
              <div className="bg-[#FAF9F6] border border-black/15 p-3 max-h-36 overflow-y-auto space-y-1.5 text-xs font-serif">
                {shoppingList.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-0.5 border-b border-black/5 last:border-0">
                    <span className="truncate pr-2">
                      {item.name} <span className="text-[10px] font-mono text-black/50 not-italic">({item.quantity} {item.unit})</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-black shrink-0">
                      ${item.estimatedPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black"
              >
                Return to Editing
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-[#C5A059] hover:text-black text-white text-xs font-black uppercase tracking-[0.2em] border-2 border-black transition-colors flex items-center justify-center space-x-2"
              >
                {fulfillmentType === 'instore' ? (
                  <>
                    <QrCode className="w-4 h-4 text-[#C5A059]" />
                    <span>Launch In-Store Navigator</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                    <span>Place Order & Reserve Slot</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="overflow-y-auto flex-1 py-4 space-y-6 text-center">
            <div className="w-14 h-14 bg-black text-[#C5A059] mx-auto flex items-center justify-center border-2 border-[#C5A059] shadow-lg">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8C6D2B]">
                Order Confirmed • Ready for Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] mt-1">
                Order #{orderId}
              </h2>
              <p className="text-xs text-stone-600 mt-1.5 max-w-md mx-auto font-serif italic">
                Your party sourcing manifest has been routed to CymbalMart Store #104. Curated provisions are being batched for your event.
              </p>
            </div>

            {/* QR Barcode Mockup */}
            <div className="bg-[#FAF9F6] border border-black/20 p-5 max-w-sm mx-auto">
              <div className="text-[9px] font-mono uppercase tracking-widest text-black/50 mb-2">
                Digital Sourcing Pass & Pickup Barcode
              </div>
              <div className="flex justify-center py-2">
                <div className="font-mono text-xl tracking-[0.4em] font-bold text-black bg-white px-4 py-2 border border-black/30">
                  ||| | |||| | || ||| || |||
                </div>
              </div>
              <div className="text-[10px] font-mono font-bold text-black mt-2">
                Ref: {orderId} • {shoppingList.length} Items • ${finalTotal.toFixed(2)}
              </div>
            </div>

            {/* Quick Actions: Dispatch to Co-Host & In-Store Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={() => handleCopyText(generateSmsSummary(), 'sms')}
                className="px-4 py-2.5 bg-white hover:bg-black hover:text-white text-black border border-black/20 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
              >
                {copiedType === 'sms' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[#8C6D2B]">Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Text Co-Hosts</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchInStoreMode();
                }}
                className="px-4 py-2.5 bg-black hover:bg-[#C5A059] hover:text-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 border border-black"
              >
                <QrCode className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Open In-Store Mode</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

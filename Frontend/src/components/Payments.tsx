import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  History, 
  CheckCircle, 
  ArrowLeft, 
  QrCode, 
  ArrowUpRight, 
  Receipt, 
  HelpCircle,
  Smartphone,
  Wallet
} from 'lucide-react';
import { Mod, Purchase } from '../types';

interface PaymentsProps {
  purchases: Purchase[];
  pendingCheckoutMod: Mod | null;
  onClearPendingCheckout: () => void;
  onConfirmPurchase: (mod: Mod, method: 'Google Pay' | 'UPI' | 'PhonePe' | 'Card') => void;
  isAudioOn: boolean;
}

export default function Payments({
  purchases,
  pendingCheckoutMod,
  onClearPendingCheckout,
  onConfirmPurchase,
  isAudioOn
}: PaymentsProps) {
  const [selectedMethod, setSelectedMethod] = useState<'Google Pay' | 'UPI' | 'PhonePe' | 'Card'>('Card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [upiId, setUpiId] = useState('adspm2323@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardHolder, setCardHolder] = useState('ADSPM DRIVER');
  const [cardExpiry, setCardExpiry] = useState('09/29');

  const handlePay = () => {
    if (!pendingCheckoutMod) return;

    setPaymentStatus('processing');
    
    // Audio alert
    if (window.speechSynthesis && isAudioOn) {
      const utterance = new SpeechSynthesisUtterance('Processing payment transaction');
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setPaymentStatus('success');
      
      // Audio alert
      if (window.speechSynthesis && isAudioOn) {
        const utterance = new SpeechSynthesisUtterance('Payment successful, Scania license key injected');
        window.speechSynthesis.speak(utterance);
      }

      setTimeout(() => {
        onConfirmPurchase(pendingCheckoutMod, selectedMethod);
        setPaymentStatus('idle');
      }, 2500);
    }, 2000);
  };

  return (
    <div id="payments-view" className="space-y-6 relative min-h-[500px]">
      
      {/* 3D Success Processing Overlay Animation */}
      {paymentStatus !== 'idle' && (
        <div className="absolute inset-0 bg-[#0B0F19]/95 z-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center backdrop-blur-md animate-in fade-in duration-300">
          
          {paymentStatus === 'processing' && (
            <div className="space-y-6">
              {/* Spinning cyan radar disk animation */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#12CFCE]/10 border-t-[#12CFCE] animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-[#10B981]/10 border-b-[#10B981] animate-reverse-spin" />
                <QrCode className="w-10 h-10 text-[#12CFCE] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-sans font-black text-[#FFFFFF] tracking-tight uppercase">Authorizing Transaction</h3>
                <p className="text-xs text-[#94A3B8] font-mono">Connecting to secure ModMarket gateway via UPI-Secure 2.0...</p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="space-y-6 animate-scale-up">
              {/* Expanding check animation */}
              <div className="w-20 h-20 rounded-full bg-[#10B981]/10 border border-[#10B981] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(16,185,129,0.3)] animate-pulse">
                <CheckCircle className="w-10 h-10 text-[#10B981]" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-xl font-sans font-black text-[#FFFFFF] tracking-tight uppercase">Payment Success!</h3>
                <p className="text-xs text-[#10B981] font-mono font-bold">LICENSE SEAT INJECTED</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                  The files have been unlocked. "{pendingCheckoutMod?.title}" has been authorized for immediate high-speed CDN download.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-5 rounded-2xl border border-[#232F4C] backdrop-blur-md">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#12CFCE] uppercase font-bold">Billing & Invoices</span>
          <h2 className="text-lg font-sans font-black text-[#FFFFFF] tracking-tight">Purchase Logs and Secure Checkout</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage software seat ownerships and payment methods for high-fidelity accessories.
          </p>
        </div>
      </div>

      {/* 2. Main split page content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Checkout Area or payment methods */}
        <div className="lg:col-span-7 space-y-4">
          
          {pendingCheckoutMod ? (
            /* ACTIVE CHECKOUT INSTRUCTIONS */
            <div className="bg-[#151D30]/60 border border-[#12CFCE]/30 p-5 rounded-2xl relative shadow-2xl">
              <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-[#12CFCE] bg-[#12CFCE]/10 border border-[#12CFCE]/20 px-2 py-0.5 rounded">
                SECURE CHECKOUT
              </span>
              
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={onClearPendingCheckout}
                  className="p-1 hover:bg-[#1B2945] rounded-lg text-[#94A3B8] hover:text-[#FFFFFF]"
                  title="Cancel checkout"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-sans font-black text-sm text-[#FFFFFF] tracking-tight">Order Summary</h3>
              </div>

              {/* Mod Checkout card */}
              <div className="bg-[#151D30] border border-[#232F4C] p-4 rounded-xl flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 h-12 bg-cover bg-center rounded-lg border border-[#232F4C] shrink-0" style={{ backgroundImage: `url('${pendingCheckoutMod.thumbnail}')` }} referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#FFFFFF] truncate pr-2">{pendingCheckoutMod.title}</h4>
                    <span className="text-[10px] font-mono text-[#94A3B8]">Developer license seat license</span>
                  </div>
                </div>
                <span className="text-sm font-black text-[#FFFFFF] shrink-0">${pendingCheckoutMod.price}</span>
              </div>

              {/* Method selection tabs */}
              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-2">
                Select Secure Payment Method
              </span>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
                {([
                  { id: 'Card', label: 'Credit Card', icon: CreditCard },
                  { id: 'UPI', label: 'BHIM UPI', icon: QrCode },
                  { id: 'Google Pay', label: 'Google Pay', icon: Wallet },
                  { id: 'PhonePe', label: 'PhonePe', icon: Smartphone }
                ] as const).map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#12CFCE]/10 border-[#12CFCE] text-[#FFFFFF] shadow-[0_0_12px_rgba(18,207,206,0.15)]'
                          : 'bg-[#151D30] border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#12CFCE]" />
                      <span className="text-[10px] font-bold">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic form based on method */}
              <div className="bg-[#151D30] border border-[#232F4C] p-4 rounded-xl space-y-3.5 mb-5">
                {selectedMethod === 'Card' ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#94A3B8] uppercase">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#94A3B8] uppercase">Cardholder Name</label>
                        <input 
                          type="text" 
                          value={cardHolder} 
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#94A3B8] uppercase">Expiry (MM/YY)</label>
                        <input 
                          type="text" 
                          value={cardExpiry} 
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-[#94A3B8] uppercase">Virtual Payment Address (VPA / UPI ID)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] outline-none" 
                      />
                      <span className="bg-[#1B2945] border border-[#232F4C] rounded-lg px-3 py-1.5 text-xs text-[#FFFFFF] font-mono font-bold flex items-center shrink-0">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-[9px] text-[#94A3B8]">
                      A collect request notification will be pushed automatically to your {selectedMethod} mobile device.
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase total summary and pay trigger */}
              <div className="space-y-3.5 border-t border-[#232F4C] pt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
                  <span>Subtotal</span>
                  <span>${pendingCheckoutMod.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
                  <span>Gateway Taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="flex items-center justify-between font-sans font-black text-[#FFFFFF] text-sm">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#12CFCE]">${pendingCheckoutMod.price}</span>
                </div>

                <button
                  onClick={handlePay}
                  className="w-full py-3 bg-gradient-to-r from-[#12CFCE] to-[#10B981] hover:from-[#10B981] hover:to-[#12CFCE] text-[#0B0F19] hover:text-[#FFFFFF] font-black text-sm uppercase rounded-xl tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_16px_rgba(18,207,206,0.3)] cursor-pointer"
                >
                  Authorize Payment & Unpack Mod
                </button>
              </div>

            </div>
          ) : (
            /* STANDARD PAYMENT SETTINGS */
            <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="font-sans font-black text-sm text-[#FFFFFF] tracking-tight">Active Payment profiles</h3>
              <p className="text-xs text-[#94A3B8]">
                Setup default accounts for seamless quick checkout features inside the launcher.
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 bg-[#151D30] border border-[#232F4C] rounded-xl text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#12CFCE]/10 rounded-lg">
                      <CreditCard className="w-4 h-4 text-[#12CFCE]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#FFFFFF]">Primary Visa Card</h4>
                      <span className="text-[10px] text-[#94A3B8] font-mono">**** **** **** 4444 (adspm)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded uppercase font-bold border border-[#10B981]/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#151D30] border border-[#232F4C] rounded-xl text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#10B981]/10 rounded-lg">
                      <QrCode className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#FFFFFF]">UPI Address</h4>
                      <span className="text-[10px] text-[#94A3B8] font-mono">adspm2323@okaxis</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] bg-[#151D30] px-2 py-0.5 rounded uppercase">
                    Configured
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#12CFCE]/5 border border-[#12CFCE]/20 rounded-xl text-[10px] text-[#94A3B8] leading-normal">
                <span className="font-bold text-[#FFFFFF] block mb-1">🔐 PCI-DSS Compliant Security:</span>
                ModMarket utilizes industry-grade AES-256 tokens. No actual card data or private UPI credentials are saved within the local cache profiles.
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Transaction Logs List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <History className="w-4 h-4 text-[#12CFCE]" />
              Historical Purchase Logs
            </span>

            <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
              {purchases.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#94A3B8]">
                  No historical payment records found
                </div>
              ) : (
                purchases.map((pur) => (
                  <div 
                    key={pur.id}
                    className="p-3 bg-[#151D30] border border-[#232F4C] hover:border-[#12CFCE]/30 rounded-xl text-xs space-y-2 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#FFFFFF] truncate pr-2 group-hover:text-[#12CFCE] transition-colors">{pur.modTitle}</h4>
                        <span className="text-[9px] font-mono text-[#94A3B8] mt-0.5 block uppercase">INV: {pur.invoiceNo}</span>
                      </div>
                      <span className="font-mono font-black text-sm text-[#FFFFFF] shrink-0">${pur.price}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-2 border-t border-[#232F4C]">
                      <span>{pur.date}</span>
                      <span className="text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                        {pur.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

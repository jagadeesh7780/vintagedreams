import React, { useState } from 'react';
import { FaTimes, FaRuler, FaCheckCircle } from 'react-icons/fa';

const SizeGuideModal = ({ isOpen, onClose, category }) => {
  const [activeTab, setActiveTab] = useState(
    (category || '').toLowerCase().includes('shoe') || (category || '').toLowerCase().includes('footwear')
      ? 'footwear'
      : (category || '').toLowerCase().includes('ring')
      ? 'rings'
      : 'apparel'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <FaRuler size={14} />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 font-serif-title">
                Official Size & Measurement Guide
              </h3>
              <p className="text-xs text-gray-500">Standard Indian & International Sizing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-gray-500 shadow-sm transition-colors cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 px-6 pt-3 bg-gray-50/40 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('apparel')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'apparel'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Apparel (Shirts, Dresses, Tops, Kurtis)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('footwear')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'footwear'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Footwear (Shoes, Sneakers, Heels)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rings')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'rings'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Rings & Bands
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 slim-scrollbar">
          
          {activeTab === 'apparel' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/80 text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest (in)</th>
                      <th className="p-3">Waist (in)</th>
                      <th className="p-3">Shoulder (in)</th>
                      <th className="p-3">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">XS</td>
                      <td className="p-3">36"</td>
                      <td className="p-3">28-30"</td>
                      <td className="p-3">16.5"</td>
                      <td className="p-3">27.0"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">S</td>
                      <td className="p-3">38"</td>
                      <td className="p-3">30-32"</td>
                      <td className="p-3">17.0"</td>
                      <td className="p-3">27.5"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors bg-rose-50/20 font-semibold">
                      <td className="p-3 font-bold text-rose-600">M (Standard)</td>
                      <td className="p-3">40"</td>
                      <td className="p-3">32-34"</td>
                      <td className="p-3">17.5"</td>
                      <td className="p-3">28.5"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">L</td>
                      <td className="p-3">42"</td>
                      <td className="p-3">34-36"</td>
                      <td className="p-3">18.0"</td>
                      <td className="p-3">29.0"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">XL</td>
                      <td className="p-3">44"</td>
                      <td className="p-3">36-38"</td>
                      <td className="p-3">18.5"</td>
                      <td className="p-3">30.0"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">XXL</td>
                      <td className="p-3">46"</td>
                      <td className="p-3">38-40"</td>
                      <td className="p-3">19.0"</td>
                      <td className="p-3">30.5"</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="p-3 font-bold text-rose-600">3XL</td>
                      <td className="p-3">48"</td>
                      <td className="p-3">40-42"</td>
                      <td className="p-3">19.5"</td>
                      <td className="p-3">31.0"</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <FaCheckCircle className="text-amber-600" />
                  How to Measure:
                </p>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Measure around the fullest part of your chest, keeping the tape horizontal under your arms. If in between sizes, we recommend ordering one size larger for regular fit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'footwear' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/80 text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3">UK / India Size</th>
                      <th className="p-3">US Men</th>
                      <th className="p-3">US Women</th>
                      <th className="p-3">EU Size</th>
                      <th className="p-3">Foot Length (CM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 4</td>
                      <td className="p-3">4.5</td>
                      <td className="p-3">6.0</td>
                      <td className="p-3">37</td>
                      <td className="p-3">22.8 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 5</td>
                      <td className="p-3">5.5</td>
                      <td className="p-3">7.0</td>
                      <td className="p-3">38</td>
                      <td className="p-3">23.7 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 6</td>
                      <td className="p-3">6.5</td>
                      <td className="p-3">8.0</td>
                      <td className="p-3">39</td>
                      <td className="p-3">24.5 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 font-semibold bg-rose-50/20">
                      <td className="p-3 font-bold text-rose-600">UK 7</td>
                      <td className="p-3">7.5</td>
                      <td className="p-3">9.0</td>
                      <td className="p-3">41</td>
                      <td className="p-3">25.4 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 8</td>
                      <td className="p-3">8.5</td>
                      <td className="p-3">10.0</td>
                      <td className="p-3">42</td>
                      <td className="p-3">26.2 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 9</td>
                      <td className="p-3">9.5</td>
                      <td className="p-3">11.0</td>
                      <td className="p-3">43</td>
                      <td className="p-3">27.1 cm</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">UK 10</td>
                      <td className="p-3">10.5</td>
                      <td className="p-3">12.0</td>
                      <td className="p-3">45</td>
                      <td className="p-3">27.9 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rings' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/80 text-gray-700 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3">Indian Ring Size</th>
                      <th className="p-3">Inner Diameter (mm)</th>
                      <th className="p-3">Circumference (mm)</th>
                      <th className="p-3">US Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">Size 6</td>
                      <td className="p-3">14.6 mm</td>
                      <td className="p-3">45.8 mm</td>
                      <td className="p-3">3.5</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">Size 8</td>
                      <td className="p-3">15.3 mm</td>
                      <td className="p-3">48.0 mm</td>
                      <td className="p-3">4.5</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">Size 10</td>
                      <td className="p-3">15.9 mm</td>
                      <td className="p-3">50.0 mm</td>
                      <td className="p-3">5.5</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40 font-semibold bg-rose-50/20">
                      <td className="p-3 font-bold text-rose-600">Size 12 (Standard)</td>
                      <td className="p-3">16.5 mm</td>
                      <td className="p-3">51.8 mm</td>
                      <td className="p-3">6.0</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">Size 14</td>
                      <td className="p-3">17.2 mm</td>
                      <td className="p-3">54.0 mm</td>
                      <td className="p-3">7.0</td>
                    </tr>
                    <tr className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-600">Size 16</td>
                      <td className="p-3">17.8 mm</td>
                      <td className="p-3">56.0 mm</td>
                      <td className="p-3">8.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

export default SizeGuideModal;

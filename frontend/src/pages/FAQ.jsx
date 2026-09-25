import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaQuestionCircle, 
  FaChevronDown, 
  FaSearch, 
  FaTruck, 
  FaUndoAlt, 
  FaShieldAlt, 
  FaGem, 
  FaHeadset 
} from 'react-icons/fa';

const faqData = [
  {
    category: 'Vintage & 1990s Garments',
    items: [
      {
        q: 'Are the 1990s & Vintage Collection items authentic?',
        a: 'Yes! Every item in our curated Vintage & 1990s Heritage Archive is individually inspected by our garment historians. We verify stitch density, heavy-gauge zippers, authentic vintage brass hardware, and original fabric grain to ensure genuine period accuracy and durability.'
      },
      {
        q: 'How should I care for vintage leather jackets and wool blazers?',
        a: 'We recommend professional suede/leather specialist dry cleaning for vintage jackets and heritage blazers. Store on wide wooden hangers in breathable cotton garment bags away from direct heat and dampness.'
      },
      {
        q: 'Do vintage clothes fit the same as modern sizes?',
        a: '1990s clothing features authentic relaxed, boxy silhouettes with dropped shoulders. Refer to our Size Guide on each product page for exact chest and sleeve measurements.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'What are the delivery charges and delivery times?',
        a: 'We offer Free Express Delivery across India on all orders of ₹499 and above. Standard metro orders (Hyderabad, Bangalore, Mumbai, Delhi NCR, Chennai) are delivered within 2-4 business days. Other regions take 3-6 business days.'
      },
      {
        q: 'How do I track my placed order?',
        a: 'You can track the live real-time status of your order anytime by visiting the "Track Orders" section in your account or entering your order ID.'
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'Yes! Cash on Delivery is available across 26,000+ pin codes in India without any hidden convenience surcharge.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We provide a 7-day hassle-free return and exchange window from the date of delivery. Items must have original tags intact and remain unworn and unwashed.'
      },
      {
        q: 'How quickly is the refund processed?',
        a: 'Once the returned item is received at our Hyderabad inspection facility, refunds are credited to your original payment method (or UPI account for COD orders) within 24–48 hours.'
      }
    ]
  },
  {
    category: 'Payments & Security',
    items: [
      {
        q: 'Which payment methods are accepted?',
        a: 'We accept Razorpay, UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking from 50+ banks, and Cash on Delivery.'
      },
      {
        q: 'Is my transaction secure?',
        a: 'Yes, 100%. All transactions are processed through 256-bit bank-grade SSL encrypted Razorpay payment gateways with full PCI-DSS Level 1 compliance.'
      }
    ]
  }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState('0-0');

  const toggleAccordion = (indexKey) => {
    setOpenIndex(openIndex === indexKey ? null : indexKey);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-amber-300">
            <FaQuestionCircle />
            <span>Help Center & FAQ</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Find immediate answers regarding orders, sizing, 1990s vintage archives, and delivery.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-6 relative">
            <input
              type="text"
              placeholder="Search questions (e.g. vintage, shipping, returns, sizing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 text-xs rounded-full pl-10 pr-4 py-3 border border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none shadow-sm transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" size={13} />
          </div>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-8">
          {faqData.map((group, groupIdx) => {
            const filteredItems = group.items.filter(
              item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      item.a.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-serif-title text-base sm:text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>{group.category}</span>
                </h2>

                <div className="space-y-3">
                  {filteredItems.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = openIndex === key;

                    return (
                      <div key={itemIdx} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(key)}
                          className="w-full text-left p-4 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                        >
                          <span className="text-xs sm:text-sm font-bold text-gray-800">{item.q}</span>
                          <FaChevronDown 
                            className={`text-gray-400 shrink-0 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} 
                          />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Contact Box */}
        <div className="mt-12 bg-gradient-to-r from-gray-950 to-rose-950 rounded-2xl p-6 sm:p-8 text-white text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <h3 className="font-serif-title text-lg sm:text-xl font-bold">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Our support specialists are ready to help you 24/7.</p>
          </div>
          <Link
            to="/contact"
            className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold text-xs uppercase px-6 py-3 rounded-xl transition-transform hover:scale-105 shrink-0"
          >
            Contact Support Desk →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FAQ;

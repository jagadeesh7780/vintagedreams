import React, { useState } from 'react';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaHeadset,
  FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Shipping Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      // Save contact inquiry locally
      try {
        const inquiries = JSON.parse(localStorage.getItem('vintage_inquiries') || '[]');
        inquiries.unshift({ ...formData, id: Date.now(), createdAt: new Date().toISOString() });
        localStorage.setItem('vintage_inquiries', JSON.stringify(inquiries));
      } catch (e) {}

      setSubmitting(false);
      setSubmitted(true);
      toast.success('🎉 Thank you! Your message has been received.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-rose-200">
            <FaHeadset />
            <span>24/7 Concierge Support</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Get in Touch With Vintage Dreams
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Have questions regarding our Vintage 1990s archives, delivery timeframes, or artisan craftsmanship? We are always here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Details Cards */}
          <div className="space-y-4">
            
            {/* WhatsApp */}
            <a 
              href="https://wa.me/917780597718?text=Hello%20Vintage%20Dreams%2C%20I%20have%20an%20inquiry%20regarding%20my%20order."
              target="_blank"
              rel="noreferrer"
              className="block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FaWhatsapp size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Fastest Response</span>
                  <h3 className="font-bold text-gray-900 text-sm">WhatsApp Concierge</h3>
                  <p className="text-xs text-gray-500 mt-0.5">+91 77805 97718</p>
                  <span className="text-[11px] text-emerald-700 font-semibold inline-block mt-2">Chat Live on WhatsApp →</span>
                </div>
              </div>
            </a>

            {/* Direct Phone */}
            <a 
              href="tel:7780597718"
              className="block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">Direct Hotline</span>
                  <h3 className="font-bold text-gray-900 text-sm">Customer Helpline</h3>
                  <p className="text-xs text-gray-500 mt-0.5">+91 77805 97718</p>
                  <span className="text-[11px] text-rose-600 font-semibold inline-block mt-2">Mon - Sun (9:00 AM - 9:00 PM) →</span>
                </div>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:info@vintagedreams.com"
              className="block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Official Email</span>
                  <h3 className="font-bold text-gray-900 text-sm">Support Desk</h3>
                  <p className="text-xs text-gray-500 mt-0.5">info@vintagedreams.com</p>
                  <span className="text-[11px] text-blue-600 font-semibold inline-block mt-2">Response within 2 hours →</span>
                </div>
              </div>
            </a>

            {/* Physical Headquarters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Heritage Flagship Studio</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    123 Vintage Dreams Boulevard, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle size={32} />
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-gray-900 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Thank you for contacting Vintage Dreams. Our senior concierge has logged your message and will reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'Order & Shipping Inquiry', message: '' });
                  }}
                  className="bg-gray-950 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif-title text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Send Us an Instant Inquiry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-rose-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. rahul@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-rose-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-rose-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-rose-500 outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Order & Shipping Inquiry">Order & Shipping Inquiry</option>
                      <option value="Vintage 1990s Collection Authenticity">Vintage 1990s Collection Authenticity</option>
                      <option value="Return & Exchange Request">Return & Exchange Request</option>
                      <option value="Custom Sizing & Tailoring Advice">Custom Sizing & Tailoring Advice</option>
                      <option value="Bulk / Wholesale Collaboration">Bulk / Wholesale Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    placeholder="Describe how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-rose-500 outline-none transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
                >
                  <FaPaperPlane size={12} />
                  <span>{submitting ? 'Transmitting Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;

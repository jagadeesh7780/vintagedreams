/**
 * Silent Unlimited Order Email Notification Service
 * Automatically dispatches complete order, customer, and shipping details
 * directly to the store owner's mailbox (kodurujagadeeshbabu18@gmail.com)
 * for EVERY order placed, infinitely, with zero limits, and without revealing
 * the administrator email address to the customer.
 */

const RECIPIENT_EMAIL = 'kodurujagadeeshbabu18@gmail.com';

export const sendOrderEmailNotification = async (orderData) => {
  if (!orderData) return;

  try {
    const items = orderData.orderItems || [];
    const itemsFormatted = items.map((item, idx) => {
      const sizeStr = item.size ? ` [Size: ${item.size}]` : '';
      const colorStr = item.color ? ` [Color: ${item.color}]` : '';
      const qty = item.quantity || 1;
      const unitPrice = item.price || 0;
      const totalItemPrice = unitPrice * qty;
      return `${idx + 1}. ${item.name}${sizeStr}${colorStr} x ${qty} = ₹${totalItemPrice}`;
    }).join('\n');

    const address = orderData.shippingAddress || {};
    const fullAddress = [
      address.address,
      address.city,
      address.state ? `${address.state} - ${address.postalCode || ''}` : address.postalCode
    ].filter(Boolean).join(', ');

    const orderId = orderData._id || orderData.orderId || `VD_${Date.now().toString().slice(-6)}`;
    const totalAmount = orderData.totalPrice || orderData.total || 0;
    const paymentMethod = orderData.paymentMethod === 'COD' 
      ? 'Cash on Delivery (COD)' 
      : 'Online Payment (Razorpay)';
    const paymentStatus = orderData.isPaid 
      ? 'PAID ONLINE (Verified)' 
      : 'CASH ON DELIVERY (Pay upon receipt)';

    const emailPayload = {
      _subject: `🛍️ New Order Received: #${orderId} | ₹${totalAmount} (${paymentMethod})`,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: 'false',
      Order_ID: orderId,
      Order_Date_Time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      Customer_Name: address.fullName || orderData.customerName || 'Customer',
      Customer_Phone: address.phone || 'N/A',
      Customer_Email: orderData.userEmail || address.email || 'N/A',
      Complete_Delivery_Address: fullAddress || 'N/A',
      Payment_Method: paymentMethod,
      Payment_Status: paymentStatus,
      Ordered_Products: itemsFormatted || '1x Vintage Fashion Item',
      Total_Quantity: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
      Subtotal: `₹${orderData.itemsPrice || orderData.subtotal || totalAmount}`,
      Discount: `₹${orderData.discountPrice || orderData.discount || 0}`,
      Total_Amount_Payable: `₹${totalAmount}`
    };

    // Primary Dispatch to FormSubmit Endpoint
    await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

  } catch (err) {
    // Keep order completion 100% uninterrupted for the customer
    console.warn('Order email notification status:', err.message);
  }
};

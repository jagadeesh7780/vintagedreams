/**
 * Silent Background Order Email Notification Service
 * Sends comprehensive order details directly to the store administrator's inbox
 * without displaying or leaking the admin email address in the customer UI.
 */

export const sendOrderEmailNotification = async (orderData) => {
  try {
    const items = orderData.orderItems || [];
    const itemsFormatted = items.map((item, idx) => {
      const sizeStr = item.size ? ` [Size: ${item.size}]` : '';
      const colorStr = item.color ? ` [Color: ${item.color}]` : '';
      const qtyStr = ` (Qty: ${item.quantity || 1})`;
      const priceStr = ` - ₹${item.price}`;
      return `${idx + 1}. ${item.name}${sizeStr}${colorStr}${qtyStr}${priceStr}`;
    }).join('\n');

    const address = orderData.shippingAddress || {};
    const fullAddress = [
      address.address,
      address.city,
      address.state ? `${address.state} - ${address.postalCode || ''}` : address.postalCode
    ].filter(Boolean).join(', ');

    const orderId = orderData._id || orderData.orderId || `VD_${Date.now().toString().slice(-6)}`;
    const totalAmount = orderData.totalPrice || orderData.total || 0;

    const emailPayload = {
      _subject: `🛍️ New Vintage Dreams Order: #${orderId} (₹${totalAmount})`,
      _template: 'table',
      _captcha: 'false',
      Order_ID: orderId,
      Order_Date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      Customer_Name: address.fullName || 'Valued Customer',
      Customer_Phone: address.phone || 'N/A',
      Customer_Email: orderData.userEmail || address.email || 'N/A',
      Delivery_Address: fullAddress || 'N/A',
      Payment_Method: orderData.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)',
      Payment_Status: orderData.isPaid ? 'PAID ONLINE (Verified)' : 'PAY ON DELIVERY (Pending)',
      Ordered_Products: itemsFormatted,
      Items_Count: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
      Subtotal: `₹${orderData.itemsPrice || orderData.subtotal || totalAmount}`,
      Discount: `₹${orderData.discountPrice || orderData.discount || 0}`,
      Total_Payable: `₹${totalAmount}`
    };

    // Silent HTTP POST dispatch to the store owner's mailbox
    await fetch('https://formsubmit.co/ajax/kodurujagadeeshbabu18@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });
  } catch (err) {
    // Keep order completion smooth and uninterrupted for customer
    console.warn('Silent order notification:', err.message);
  }
};

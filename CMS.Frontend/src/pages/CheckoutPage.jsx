import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/Checkout/CustomerForm';
import AddressForm from '../components/Checkout/AddressForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import PaymentMethod from '../components/Checkout/PaymentMethod';
import OrderButton from '../components/Checkout/OrderButton';
import { createOrder } from '../services/orderService';
import { useCart } from '../hooks/useCart';

function CheckoutPage() {
  const navigate = useNavigate();
  const { removeFromCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({ fullName: '', phone: '', email: '' });
  const [address, setAddress] = useState({ city: '', district: '', ward: '', address: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem('checkoutItems') || '[]');
    if (items.length === 0) {
      alert('Không có sản phẩm để thanh toán!');
      navigate('/cart');
      return;
    }
    setCheckoutItems(items);

    const cInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
    setCustomer(prev => ({ ...prev, fullName: cInfo.fullName || '', email: cInfo.email || '' }));

    const savedNote = sessionStorage.getItem('orderNotes');
    if (savedNote) setAddress(prev => ({ ...prev, note: savedNote }));
  }, [navigate]);

  const handleCustomerChange = e => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const handleAddressChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!customer.fullName || !customer.phone || !address.city || !address.district || !address.ward || !address.address) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    setLoading(true);
    const orderData = {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      shippingAddress: `${address.address}, ${address.ward}, ${address.district}, ${address.city}`,
      notes: address.note,
      paymentMethod,
      items: checkoutItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
    };

    try {
      const res = await createOrder(orderData);
      
      // Xoá sản phẩm đã thanh toán khỏi giỏ
      checkoutItems.forEach(i => removeFromCart(i.productId));
      
      sessionStorage.removeItem('checkoutItems');
      sessionStorage.removeItem('orderNotes');
      
      navigate('/order-success', { state: { orderId: res.id || Math.floor(Math.random() * 100000) } });
    } catch (error) {
      console.error(error);
      alert('Đặt hàng thất bại. Vui lòng thử lại!');
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '80vh', padding: '30px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px', color: '#222' }}>
          Thanh Toán
        </h1>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column - Forms */}
          <div style={{ flex: '1 1 60%', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <CustomerForm form={customer} onChange={handleCustomerChange} />
              <div style={{ margin: '32px 0', height: '1px', backgroundColor: '#eee' }} />
              <AddressForm form={address} onChange={handleAddressChange} />
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />
            </div>
          </div>

          {/* Right Column - Summary & Button */}
          <div style={{ flex: '1 1 35%', minWidth: '300px', position: 'sticky', top: '90px' }}>
            <OrderSummary items={checkoutItems} />
            <div style={{ marginTop: '20px' }}>
              <OrderButton onClick={handlePlaceOrder} loading={loading} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

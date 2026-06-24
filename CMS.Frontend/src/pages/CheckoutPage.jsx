import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm from '../components/Checkout/CustomerForm';
import AddressForm from '../components/Checkout/AddressForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import PaymentMethod from '../components/Checkout/PaymentMethod';
import OrderButton from '../components/Checkout/OrderButton';
import { createOrder } from '../services/orderService';
import { useCart } from '../hooks/useCart';
import { getAddresses } from '../services/userService';

function CheckoutPage() {
  const navigate = useNavigate();
  const { removeFromCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [customer, setCustomer] = useState({ fullName: '', phone: '', email: '' });
  const [address, setAddress] = useState({ city: '', district: '', ward: '', address: '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

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

    if (cInfo.id) {
      getAddresses().then(list => {
        setAddresses(list);
        const defaultAddr = list.find(a => a.isDefault) || list[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setCustomer(prev => ({ ...prev, fullName: defaultAddr.fullName || prev.fullName, phone: defaultAddr.phone || prev.phone }));
          setAddress(prev => ({ ...prev, city: defaultAddr.province || prev.city, district: defaultAddr.district || prev.district, ward: defaultAddr.ward || prev.ward, address: defaultAddr.streetAddress || prev.address }));
        }
      }).catch(err => console.error('Failed to load addresses', err));
    }
  }, [navigate]);

  const handleCustomerChange = e => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleAddressChange = e => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    if (e.target.name !== 'note') setSelectedAddressId('new');
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleAddressSelect = (addrId) => {
    if (addrId === 'new') {
      setSelectedAddressId('new');
      setAddress(prev => ({ ...prev, city: '', district: '', ward: '', address: '' }));
    } else {
      const addr = addresses.find(a => a.id === parseInt(addrId));
      if (addr) {
        setSelectedAddressId(addr.id);
        setAddress(prev => ({ ...prev, city: addr.province || '', district: addr.district || '', ward: addr.ward || '', address: addr.streetAddress || '' }));
        // Clear address errors when selecting from saved
        setErrors(prev => ({ ...prev, city: '', district: '', ward: '', address: '' }));
      }
    }
  };

  // =====================
  // Validate toàn bộ form
  // =====================
  const validate = () => {
    const newErrors = {};

    // --- Thông tin người nhận ---
    if (!customer.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên.';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!/^(0|\+84)[0-9]{8,10}$/.test(customer.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567).';
    }

    if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
    }

    // --- Địa chỉ giao hàng ---
    if (!address.city.trim()) {
      newErrors.city = 'Vui lòng nhập Tỉnh / Thành phố.';
    }
    if (!address.district.trim()) {
      newErrors.district = 'Vui lòng nhập Quận / Huyện.';
    }
    if (!address.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập Phường / Xã.';
    }
    if (!address.address.trim()) {
      newErrors.address = 'Vui lòng nhập số nhà, tên đường.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      // Cuộn trang lên vị trí lỗi đầu tiên
      setTimeout(() => {
        const firstError = document.querySelector('[data-has-error="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    setLoading(true);
    const cInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
    const orderData = {
      customerId: cInfo.id || 0,
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      shippingAddress: `${address.address}, ${address.ward}, ${address.district}, ${address.city}`,
      notes: address.note,
      paymentMethod,
      items: checkoutItems.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.price }))
    };

    try {
      const res = await createOrder(orderData);
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
              <CustomerForm form={customer} onChange={handleCustomerChange} errors={errors} />
              <div style={{ margin: '32px 0', height: '1px', backgroundColor: '#eee' }} />
              <AddressForm
                form={address}
                onChange={handleAddressChange}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onAddressSelect={handleAddressSelect}
                errors={errors}
              />
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

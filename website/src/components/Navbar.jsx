import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined, MenuOutlined, UserOutlined, HistoryOutlined,
  LogoutOutlined, LoginOutlined, FormOutlined, PlusOutlined, MinusOutlined,
  DeleteOutlined, HomeOutlined
} from '@ant-design/icons';
import { Modal, Dropdown, Menu, Button } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { user, logout } = useContext(AuthContext);
  const { cartItems, totalItems, totalPrice, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const goTo = (section) => {
    if (section === 'tracking') {
      navigate('/tracking');
      return;
    }

    if (isHome) {
      if (section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        if (section !== 'home') document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const changeQty = (id, qty) => qty < 1 ? removeFromCart(id) : updateQuantity(id, qty);

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', icon: <UserOutlined />, label: <span onClick={() => navigate('/profile')}>Profile</span> },
        { key: 'history', icon: <HistoryOutlined />, label: <span onClick={() => navigate('/orderhistory')}>History</span> },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined style={{ color: '#B34141' }} />, label: <span onClick={logout} style={{ color: '#B34141' }}>Logout</span> },
      ]}
    />
  );

  const authItems = user
    ? [
        { key: 'profile', icon: <UserOutlined />, label: <span onClick={() => navigate('/profile')}>Profile</span> },
        { key: 'history', icon: <HistoryOutlined />, label: <span onClick={() => navigate('/orderhistory')}>History</span> },
        { key: 'logout', icon: <LogoutOutlined style={{ color: '#B34141' }} />, label: <span style={{ color: '#B34141' }} onClick={logout}>Logout</span> },
      ]
    : [
        { key: 'login', icon: <LoginOutlined />, label: <span onClick={() => navigate('/login')}>Login</span> },
        { key: 'register', icon: <FormOutlined />, label: <span onClick={() => navigate('/Registration')}>Register</span> },
      ];

  const mobileMenu = (
    <Menu
      items={[
        { key: 'home', icon: <HomeOutlined />, label: <span onClick={() => goTo('home')}>Home</span> },
        { key: 'menu', label: <span onClick={() => goTo('menu')}>Menu</span> },
        { key: 'about', label: <span onClick={() => goTo('about')}>About</span> },
        { key: 'tracking', label: <span onClick={() => goTo('tracking')}>Tracking</span> },
        { key: 'contact', label: <span onClick={() => goTo('contact')}>Contact</span> },
        { type: 'divider' },
        ...authItems,
      ]}
    />
  );

  const desktopNav = ['home', 'menu', 'about', 'tracking', 'contact'];

  return (
    <>
      <nav className="p-4 sticky top-0 z-50 flex items-center justify-between text-black backdrop-blur bg-gradient-to-r from-[#CDB585CC] to-[#F5E8D1CC] shadow-md">
        <div className="text-2xl font-extrabold cursor-pointer hover:text-green-800" onClick={() => goTo('home')}>
          SpiceHub
        </div>

        <div className="hidden md:flex gap-6 font-bold">
          {desktopNav.map((id) => (
            <span key={id} onClick={() => goTo(id)} className="cursor-pointer hover:text-green-800 capitalize">
              {id}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div onClick={() => setCartVisible(true)} className="relative cursor-pointer">
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </div>

          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div className="hidden md:block cursor-pointer hover:bg-green-100 px-2 py-1 rounded">
                <UserOutlined style={{ fontSize: 20 }} />
              </div>
            </Dropdown>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button size="small" onClick={() => navigate('/login')}>Login</Button>
              <Button size="small" onClick={() => navigate('/Registration')}>Register</Button>
            </div>
          )}

          <div className="md:hidden">
            <Dropdown overlay={mobileMenu} trigger={['click']}>
              <MenuOutlined style={{ fontSize: 22, cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </div>
      </nav>

      <Modal
        visible={cartVisible}
        onCancel={() => setCartVisible(false)}
        footer={null}
        title={<><ShoppingCartOutlined /> Your Cart ({totalItems} items)</>}
        width={500}
        destroyOnClose
      >
        {cartItems.length > 0 ? (
          <>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {cartItems.map((item, i) => {
                const price = typeof item.price === 'string' ? parseFloat(item.price.replace('₹', '')) : item.price;
                return (
                  <div key={i} className="flex gap-3 border-b pb-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=No+Image')} />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">₹{price} each</div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex border rounded-md">
                          <Button type="text" icon={<MinusOutlined />} onClick={() => changeQty(item.itemId, item.quantity - 1)} />
                          <span className="px-2">{item.quantity}</span>
                          <Button type="text" icon={<PlusOutlined />} onClick={() => changeQty(item.itemId, item.quantity + 1)} />
                        </div>
                        <div className="font-semibold">₹{price * item.quantity}</div>
                      </div>
                    </div>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.itemId)} />
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 font-bold text-lg flex justify-between">
              <span>Total:</span>
              <span className="text-green-700">₹{totalPrice}</span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={clearCart} danger block icon={<DeleteOutlined />}>Clear Cart</Button>
              <Button onClick={() => { setCartVisible(false); navigate('/checkout'); }} type="primary" block>Checkout</Button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <ShoppingCartOutlined style={{ fontSize: 40, color: '#ddd' }} />
            <div className="text-gray-500 mt-3">Your cart is empty</div>
            <Button type="primary" className="mt-4" onClick={() => { setCartVisible(false); goTo('menu'); }}>
              Browse Menu
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Navbar;

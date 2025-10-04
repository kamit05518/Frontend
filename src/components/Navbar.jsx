import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined, MenuOutlined, UserOutlined, HistoryOutlined,
  LogoutOutlined, LoginOutlined, FormOutlined, PlusOutlined, MinusOutlined,
  DeleteOutlined, HomeOutlined
} from '@ant-design/icons';
import { Modal, Dropdown, Menu, Button, Avatar } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { user, logout } = useContext(AuthContext);
  const { cartItems, totalItems, totalPrice, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [cartVisible, setCartVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileImage, setProfileImage] = useState(null); 

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchProfileImage();
    }
  }, [user]);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile');
      const data = response.data;
      
      if (data.profileImage) {
        if (data.profileImage.startsWith('http')) {
          setProfileImage(data.profileImage);
        } else {
          setProfileImage(`http://localhost:5001${data.profileImage}`);
        }
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImage(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Simple User Menu
  const userMenu = (
    <Menu
      items={[
        { 
          key: 'profile', 
          icon: <UserOutlined />, 
          label: <span onClick={() => navigate('/profile')}>Profile</span> 
        },
        { 
          key: 'history', 
          icon: <HistoryOutlined />, 
          label: <span onClick={() => navigate('/orderhistory')}>Order History</span> 
        },
        { type: 'divider' },
        { 
          key: 'logout', 
          icon: <LogoutOutlined style={{ color: '#dc2626' }} />, 
          label: <span onClick={logout} style={{ color: '#dc2626' }}>Logout</span> 
        },
      ]}
    />
  );

  const authItems = user
    ? [
        { 
          key: 'profile', 
          icon: <UserOutlined />, 
          label: <span onClick={() => navigate('/profile')}>Profile</span>
        },
        { 
          key: 'history', 
          icon: <HistoryOutlined />, 
          label: <span onClick={() => navigate('/orderhistory')}>Order History</span>
        },
        { 
          key: 'logout', 
          icon: <LogoutOutlined style={{ color: '#dc2626' }} />, 
          label: <span style={{ color: '#dc2626' }} onClick={logout}>Logout</span>
        },
      ]
    : [
        { 
          key: 'login', 
          icon: <LoginOutlined />, 
          label: <span onClick={() => navigate('/login')}>Login</span>
        },
        { 
          key: 'register', 
          icon: <FormOutlined />, 
          label: <span onClick={() => navigate('/Registration')}>Register</span>
        },
      ];

  const mobileMenu = (
    <Menu
      items={[
        { 
          key: 'home', 
          icon: <HomeOutlined />, 
          label: <span onClick={() => goTo('home')}>Home</span>
        },
        { 
          key: 'menu', 
          label: <span onClick={() => goTo('menu')}>Menu</span>
        },
        { 
          key: 'about', 
          label: <span onClick={() => goTo('about')}>About</span>
        },
        { 
          key: 'tracking', 
          label: <span onClick={() => goTo('tracking')}>Tracking</span>
        },
        { 
          key: 'contact', 
          label: <span onClick={() => goTo('contact')}>Contact</span>
        },
        { type: 'divider' },
        ...authItems,
      ]}
    />
  );

  const desktopNav = ['home', 'menu', 'about', 'tracking', 'contact'];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`p-4 fixed top-0 w-full z-50 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "backdrop-blur bg-gradient-to-r from-purple-900 via-indigo-900 to-black shadow-md text-white"
            : "bg-transparent text-black"
        }`}
      >
        <div
          className="text-2xl font-extrabold cursor-pointer hover:text-purple-600"
          onClick={() => goTo('home')}
        >
          SpiceHub
        </div>

        <div className="hidden md:flex gap-6 font-bold">
          {desktopNav.map((id) => (
            <span
              key={id}
              onClick={() => goTo(id)}
              className={`cursor-pointer capitalize ${scrolled ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}
            >
              {id}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <div onClick={() => setCartVisible(true)} className="relative cursor-pointer">
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </div>

          {/* Menu with Profile Image */}
          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="hidden md:block cursor-pointer">
                {profileImage ? (
                  <Avatar 
                    src={profileImage} 
                    size={32} 
                  />
                ) : (
                  <Avatar 
                    icon={<UserOutlined />} 
                    size={32}
                  />
                )}
              </div>
            </Dropdown>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button size="small" onClick={() => navigate('/login')}>Login</Button>
              <Button size="small" onClick={() => navigate('/Registration')}>Register</Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Dropdown overlay={mobileMenu} trigger={['click']}>
              <MenuOutlined style={{ fontSize: 22, cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      <Modal
        open={cartVisible}
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
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=No+Image')}
                    />
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
              <span className="text-purple-700">₹{totalPrice}</span>
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
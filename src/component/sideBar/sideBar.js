"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Hospital, User, Church, ShieldCheck } from 'lucide-react';

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <Hospital className="w-6 h-6 mr-3" />,
      text: '医院',
      path: '/dashboard/hospital',
      subItems: [
        { href: '/dashboard/hospital/keys', text: '密钥和机构号' },
        { href: '/dashboard/hospital/digitalization', text: '数字化' },
      ]
    },
    {
      icon: <Church className="w-6 h-6 mr-3" />,
      text: '政府',
      path: '/dashboard/government',
      subItems: [
        { href: '/dashboard/government/keys', text: '密钥和机构号' },
        { href: '/dashboard/government/digitalization', text: '数字化' },
      ]
    },
    {
      icon: <ShieldCheck className="w-6 h-6 mr-3" />,
      text: '身份构建机构',
      path: '/dashboard/identity',
      subItems: [
        { href: '/dashboard/identity/keys', text: '密钥和机构号' },
        { href: '/dashboard/identity/management', text: '智能化身管理' },
        { href: '/dashboard/identity/tracking', text: '身份追踪' },
      ]
    },
    {
      icon: <User className="w-6 h-6 mr-3" />,
      text: '用户',
      path: '/dashboard/user',
      subItems: [
        { href: '/dashboard/user/hierarchical', text: '层级担保' },
        { href: '/dashboard/user/peer', text: '同级担保' },
        { href: '/dashboard/user/management', text: '智能化身管理' },
      ]
    }
  ];

  useEffect(() => {
    const activeIndex = menuItems.findIndex(item => pathname.startsWith(item.path));
    setActiveMenu(activeIndex !== -1 ? activeIndex : null);
  }, [pathname]);

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-lg">
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div 
                className={`flex items-center p-4 text-gray-700 hover:bg-gray-200 cursor-pointer ${activeMenu === index ? 'bg-gray-200 font-bold' : ''}`}
                onClick={() => toggleSubMenu(index)}
              >
                {item.icon}
                {item.text}
              </div>
              {activeMenu === index && (
                <ul className="ml-8 space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link 
                        href={subItem.href} 
                        className={`block p-2 text-gray-600 hover:bg-gray-200 ${pathname === subItem.href ? 'bg-gray-300 font-bold' : ''}`}
                      >
                        {subItem.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
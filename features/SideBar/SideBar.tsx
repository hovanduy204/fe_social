'use client';

import { useState } from 'react';
import { Drawer } from '@mui/material';
import CreatePost from '../CreatePost/CreatePost';
import NotificationComp from '../Notification/Notification';
import SideBarNav from './SideBarNav';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineExplore, MdOutlinePersonAdd, MdOutlineSettings } from 'react-icons/md';
import { PiTelegramLogo } from 'react-icons/pi';
import { FaRegHeart, FaRegSquarePlus, FaBars } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';

interface SideBarProps {
  children: React.ReactNode;
}

const SideBar = ({ children }: SideBarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const pathname = usePathname();

  const userId = 'YOUR_USER_ID';

  const isActive = (href: string) => pathname === href;
  const isMyProfile = pathname === `/profile/${userId}` && userId !== null;


  return (
    <>
      <div className="flex h-screen w-full max-h-full">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-purple-100 via-blue-100 to-orange-100 max-h-full p-6 w-72 border-r border-gray-200">
          <div className="flex flex-col space-y-2">
            <Link href={"/"} className="self-center">
              <Image
                src="/image/logoCasa.png"
                alt="CasaSocial"
                width={120}
                height={120}
                className="rounded-full"
                priority
              />
            </Link>
            <div>
              <SideBarNav
                setShowNotifications={setShowNotifications}
                setShowCreatePost={setShowCreatePost}
              />
            </div>
            <div className="px-3 py-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm rounded-lg">
              <p className="text-gray-700 text-sm font-medium">
                © 2025 CASA. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </div>

      {showNotifications && (
        <Drawer anchor="right" open={showNotifications} onClose={() => setShowNotifications(false)}>
          <NotificationComp setShowNotifications={setShowNotifications} />
        </Drawer>
      )}

      {showCreatePost && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
             <CreatePost setShowCreatePost={setShowCreatePost} />
         </div>
      )}

      {showMoreMenu && (
           <Drawer anchor="left" open={showMoreMenu} onClose={() => setShowMoreMenu(false)}>
               <div className="p-4 w-64 bg-gradient-to-b from-white to-purple-50">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Menu</h2>
                    <ul className="space-y-2">
                        <li>
                            <button onClick={() => { setShowNotifications(true); setShowMoreMenu(false); }}
                                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 w-full text-left">
                                <FaRegHeart size={25} className="mr-3" />
                                Thông báo
                            </button>
                        </li>
                        <li>
                            <Link href="/friends" onClick={() => setShowMoreMenu(false)}
                                className={`flex items-center transition-colors duration-200 ${isActive('/friends') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
                                <MdOutlinePersonAdd size={25} className="mr-3" />
                                Bạn bè
                            </Link>
                        </li>
                         <li>
                            <Link href="/more" onClick={() => setShowMoreMenu(false)}
                                className={`flex items-center transition-colors duration-200 ${isActive('/more') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
                                <MdOutlineSettings size={25} className="mr-3" />
                                Cài đặt
                            </Link>
                        </li>
                    </ul>
               </div>
           </Drawer>
       )}


      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-50 via-blue-50 to-orange-50 border-t border-gray-200 shadow-md md:hidden">
        <div className="flex justify-around py-2">

          <Link href="/" className={`flex flex-col items-center transition-colors duration-200 ${isActive('/') ? 'text-blue-600' : 'text-gray-700'}`}>
            <IoHomeOutline size={25} />
            <span className="text-xs">Trang chủ</span>
          </Link>

          <Link href="/explore" className={`flex flex-col items-center transition-colors duration-200 ${isActive('/explore') ? 'text-blue-600' : 'text-gray-700'}`}>
            <MdOutlineExplore size={25} />
            <span className="text-xs">Khám phá</span>
          </Link>

          <button onClick={() => setShowCreatePost(true)} className="flex flex-col items-center text-orange-600 transition-colors duration-200">
             <FaRegSquarePlus size={25} />
            <span className="text-xs">Đăng</span>
          </button>

          <Link href="/messages" className={`flex flex-col items-center transition-colors duration-200 ${isActive('/messages') ? 'text-blue-600' : 'text-gray-700'}`}>
            <PiTelegramLogo size={25} />
            <span className="text-xs">Nhắn tin</span>
          </Link>

           {userId && (
             <Link href={`/profile/${userId}`} className={`flex flex-col items-center transition-colors duration-200 ${isMyProfile ? 'text-blue-600' : 'text-gray-700'}`}>
               <CgProfile size={25} />
               <span className="text-xs">Hồ sơ</span>
             </Link>
           )}

            <button onClick={() => setShowMoreMenu(true)} className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <FaBars size={25} />
                <span className="text-xs">Menu</span>
            </button>

        </div>
      </div>
    </>
  );
};

export default SideBar;
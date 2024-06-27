import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
const Header = () => {
  const router = useRouter();
  return (
    <header className="border-b border-stone-50  bg-white fixed top-0 w-[393px] h-20 px-4 py-6 flex justify-between items-center z-[9999]">
      <div onClick={() => router.push('/')} className="w-[116px] cursor-pointer">
        <Image src="/OffispaceBlack.png" alt="logo" width={115} height={20} />
      </div>
      <div className="flex items-center justify-center gap-6">
        <div onClick={() => router.push('mypage/question')} className="cursor-pointer">
          <Image src="/Inquiry.svg" alt="inquiry" width={20} height={20} />
        </div>
        <Link href={'/notification'}>
          <div className="cursor-pointer">
            <Image src="/Notification.svg" alt="notification" width={20} height={20} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;

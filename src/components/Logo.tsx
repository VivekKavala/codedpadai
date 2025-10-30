import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '@/../public/logo.png';

export default function Logo() {
  return (
    <Link href="/" className="block">
      <Image
        src={LogoImage}
        width={286}
        height={80}
        alt="CodedPadAI"
        className="md:w-[286px] md:h-[80px] w-[220px] h-[60px]"
      />
    </Link>
  );
}

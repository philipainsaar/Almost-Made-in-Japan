import Image from 'next/image';
import { SITE_ASSETS } from '@/lib/site-assets';

export function FloatingMascot() {
  return (
    <div className="floating-mascot" aria-hidden="true">
      <Image src={SITE_ASSETS.mascot} alt="" width={150} height={150} />
    </div>
  );
}

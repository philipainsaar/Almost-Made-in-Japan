import { SHOP_COPY } from '@/lib/site-assets';

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <span>‹</span>
      <p>{SHOP_COPY.announcement}</p>
      <span>›</span>
    </div>
  );
}

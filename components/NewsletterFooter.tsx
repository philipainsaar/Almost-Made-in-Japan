import { SITE_ASSETS, SHOP_COPY } from '@/lib/site-assets';
import { MarqueeStrip } from './MarqueeStrip';

export function NewsletterFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-heart">
        <img src={SITE_ASSETS.footerHeart} alt="Sparkling heart" />
      </div>
      <MarqueeStrip tone="pink">{SHOP_COPY.footerMarquee}</MarqueeStrip>
      <section className="newsletter page-pad">
        <h2>{SHOP_COPY.newsletterTitle}</h2>
        <form className="email-box">
          <input type="email" placeholder="Email" aria-label="Email" />
          <button aria-label="Sign up">→</button>
        </form>
        <a href="https://shop.app/" className="shop-follow">♡ Follow on shop</a>
        <div className="social-icons">
          <a href="https://www.instagram.com/" aria-label="Instagram">◎</a>
          <a href="https://www.tiktok.com/" aria-label="TikTok">♪</a>
        </div>
      </section>
      <section className="footer-meta page-pad">
        <div className="selectors">
          <label>
            <span>Country/region</span>
            <select defaultValue="SEK">
              <option value="SEK">Sweden | SEK kr</option>
            </select>
          </label>
          <label>
            <span>Language</span>
            <select defaultValue="English">
              <option>English</option>
            </select>
          </label>
        </div>
        <div className="payments" aria-label="Payment methods">
          {['AMEX', 'Apple Pay', 'Bancontact', 'G Pay', 'JCB', 'Mastercard', 'PayPal', 'shop', 'VISA'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p>© 2026 Almost Made in Japan Powered by Shopify · Privacy policy · Cookie preferences</p>
      </section>
    </footer>
  );
}

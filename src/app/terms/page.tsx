import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LEGAL } from "@/app/components/LegalPage";
import { PLANS, formatPlanPrice } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Terms of Service · Saim",
  description: "The terms that apply when you use Saim, the AI sales agent for your website.",
};

export default function TermsPage() {
  const paid = [PLANS.starter, PLANS.pro, PLANS.scale];
  return (
    <LegalPage title="Terms of Service">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {LEGAL.business} (&ldquo;Saim&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;), an AI sales assistant that businesses add to their websites. Saim is operated by {LEGAL.operator},{" "}
        {LEGAL.location}. By creating an account or using Saim, you agree to these Terms.
      </p>

      <h2>1. What Saim does</h2>
      <p>
        Saim provides a chat widget you embed on your website. It answers visitor questions using information you provide
        (such as your website content and business description), asks qualifying questions, collects visitors&apos; contact
        details when they choose to share them, and shows conversations and leads in your dashboard.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must give accurate information and keep your login details secure.</li>
        <li>You are responsible for activity on your account.</li>
        <li>You must be at least 18 years old, or have the authority to act for the business you register.</li>
      </ul>

      <h2>3. Plans and payment</h2>
      <p>Saim offers a free plan and these paid monthly plans:</p>
      <ul>
        {paid.map((p) => (
          <li key={p.key}>
            <strong>{p.name}</strong>: {formatPlanPrice(p, "NGN")} per month ({formatPlanPrice(p, "USD")} where dollar billing is
            available), up to {p.monthlyLimit.toLocaleString("en-US")} conversations per month and{" "}
            {p.maxSites === null ? "unlimited websites" : p.maxSites === 1 ? "1 website" : `${p.maxSites} websites`}.
          </li>
        ))}
      </ul>
      <ul>
        <li>Payments are processed securely by Paystack. We never see or store your full card details.</li>
        <li>
          Paid plans renew automatically every month and your card is charged on each renewal date until you cancel.
        </li>
        <li>Prices are shown before you pay. If we change prices, we will tell you before the change applies to you.</li>
        <li>
          When you reach your plan&apos;s monthly conversation limit, the widget pauses until the next month or until you
          upgrade.
        </li>
      </ul>

      <h2>4. Cancelling</h2>
      <p>
        You can cancel anytime from the Billing page in your dashboard. Cancelling stops all future charges immediately and
        moves your account back to the Free plan straight away. See our <Link href="/refunds">Refund Policy</Link> for
        details.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to use Saim to:</p>
      <ul>
        <li>break any law, or promote fraud, scams or illegal goods and services;</li>
        <li>send spam or harass, deceive or harm anyone;</li>
        <li>collect visitor information without a lawful basis, or without telling visitors how you will use it;</li>
        <li>attempt to disrupt, overload, reverse-engineer or gain unauthorised access to Saim or other users&apos; data;</li>
        <li>impersonate another person or business.</li>
      </ul>
      <p>We may suspend accounts that break these rules.</p>

      <h2>6. Your content and your visitors</h2>
      <ul>
        <li>
          You keep ownership of the content you provide and the conversations and leads collected on your website. You give us
          permission to process that content only to provide Saim to you.
        </li>
        <li>
          You are responsible for having a privacy notice on your own website that tells visitors you use a chat assistant
          and how you use the details they share.
        </li>
      </ul>

      <h2>7. AI responses</h2>
      <p>
        Saim uses artificial intelligence. It is instructed to answer only from the information you provide, but AI can make
        mistakes. You are responsible for checking that your business information is accurate, and you should not rely on
        Saim for legal, medical or financial advice to your visitors.
      </p>

      <h2>8. Availability</h2>
      <p>
        We work to keep Saim available, but we do not guarantee uninterrupted service. Saim depends on third-party providers
        (hosting, database, AI and payment services) that may occasionally be unavailable.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent allowed by law, Saim is provided &ldquo;as is&rdquo;, and we are not liable for indirect or
        consequential losses, such as lost profits or lost sales. Our total liability to you for any claim is limited to the
        amount you paid us in the three months before the claim.
      </p>

      <h2>10. Ending your account</h2>
      <p>
        You can stop using Saim at any time and ask us to delete your account by emailing us. We may end or suspend your
        account if you seriously or repeatedly break these Terms.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms. If a change is significant, we will notify you by email or in your dashboard before it
        takes effect. Continuing to use Saim after that means you accept the updated Terms.
      </p>

      <h2>12. Governing law</h2>
      <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms? Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}

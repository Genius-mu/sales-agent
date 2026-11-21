import type { Metadata } from "next";
import LegalPage, { LEGAL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Saim",
  description: "How Saim collects, uses and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how {LEGAL.business} (&ldquo;Saim&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), operated by{" "}
        {LEGAL.operator}, {LEGAL.location}, collects and uses personal information. We process personal data in line with the
        Nigeria Data Protection Act 2023.
      </p>

      <h2>1. Who this applies to</h2>
      <ul>
        <li>
          <strong>Customers</strong>: businesses and people who create a Saim account.
        </li>
        <li>
          <strong>Visitors</strong>: people who chat with a Saim widget on a customer&apos;s website. For visitor
          conversations, the customer whose website you are on decides how your information is used, and Saim processes it on
          their behalf.
        </li>
      </ul>

      <h2>2. Information we collect</h2>
      <h3>From customers</h3>
      <ul>
        <li>Account details: your email address and login information (including Google sign-in, if you use it).</li>
        <li>
          Business information you provide: business name, website address, description, agent settings, and the public text
          of your website that Saim reads when you ask it to.
        </li>
        <li>
          Billing records: your plan, subscription status, and payment references from Paystack. Card details are handled by
          Paystack; we never receive your full card number.
        </li>
      </ul>
      <h3>From visitors</h3>
      <ul>
        <li>The messages you send in the chat and the assistant&apos;s replies.</li>
        <li>Your email address or other contact details, only if you choose to share them in the chat.</li>
        <li>The website the chat runs on.</li>
      </ul>
      <h3>Technical information</h3>
      <ul>
        <li>IP addresses, used briefly to limit abuse (rate limiting) and to show prices in your local currency.</li>
        <li>
          Cookies needed to keep you logged in and to remember your currency choice. We do not use advertising or tracking
          cookies.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <ul>
        <li>To provide the chat assistant and generate replies.</li>
        <li>To show customers their conversations, leads and analytics, and to email them new-lead alerts.</li>
        <li>To process subscriptions and payments.</li>
        <li>To keep Saim secure, prevent abuse and fix problems.</li>
        <li>To contact customers about their account or important changes.</li>
      </ul>
      <p>We do not sell personal information, and we do not use visitor conversations to advertise to anyone.</p>

      <h2>4. Service providers we use</h2>
      <p>We share information only with providers that help us run Saim, and only as needed:</p>
      <ul>
        <li>
          <strong>Supabase</strong>: database and account login.
        </li>
        <li>
          <strong>Vercel</strong>: website and server hosting.
        </li>
        <li>
          <strong>Google (Gemini API)</strong>: generating chat replies from the conversation and the customer&apos;s
          business information.
        </li>
        <li>
          <strong>Paystack</strong>: payment processing.
        </li>
        <li>
          <strong>Resend</strong>: sending account and lead-alert emails.
        </li>
      </ul>
      <p>
        Some of these providers store or process data outside Nigeria. Where that happens, we rely on providers that apply
        appropriate safeguards to protect personal data.
      </p>

      <h2>5. How long we keep information</h2>
      <p>
        We keep customer accounts, business information, conversations and leads for as long as the account is active.
        When a customer deletes their account, we delete this information within 30 days, except billing records we must keep
        for legal or tax reasons.
      </p>

      <h2>6. Security</h2>
      <p>
        We use encrypted connections (HTTPS), access controls that keep each customer&apos;s data separate, and secure
        payment processing through Paystack. No system is perfectly secure, but we work to protect your information.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can ask us to access, correct or delete your personal information, object to how we use it, or ask for a copy of
        it. Visitors who chatted on a customer&apos;s website can contact that business directly, or contact us and we will
        help. Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. You may also complain to the Nigeria Data Protection
        Commission.
      </p>

      <h2>8. Children</h2>
      <p>Saim is not intended for children, and customers must be at least 18 years old.</p>

      <h2>9. Changes</h2>
      <p>
        We may update this policy. We will change the &ldquo;Last updated&rdquo; date above and, for significant changes,
        tell customers by email or in the dashboard.
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions or requests: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}

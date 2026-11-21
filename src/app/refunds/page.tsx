import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LEGAL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy · Saim",
  description: "Cancellations and refunds for Saim subscriptions.",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy">
      <p>
        We want you to be confident before you pay, which is why Saim has a free plan you can use for as long as you like
        before upgrading.
      </p>

      <h2>1. Cancelling your subscription</h2>
      <ul>
        <li>You can cancel anytime from the Billing page in your dashboard.</li>
        <li>Cancelling stops all future charges immediately.</li>
        <li>Your account moves back to the Free plan straight away.</li>
      </ul>

      <h2>2. Refunds</h2>
      <ul>
        <li>
          Subscription payments are generally non-refundable, including for the unused part of a month after you cancel.
        </li>
        <li>
          <strong>We will refund you</strong> if you were charged in error, charged twice for the same period, or charged
          after you cancelled.
        </li>
        <li>
          If Saim was unavailable for a long period because of a fault on our side, contact us and we will review a full or
          partial refund.
        </li>
      </ul>

      <h2>3. How to request a refund</h2>
      <p>
        Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> within 14 days of the charge, with the email address on your
        account and the date and amount of the payment. We reply within 3 business days. Approved refunds go back to the
        original card through Paystack and usually arrive within 5 to 10 business days, depending on your bank.
      </p>

      <h2>4. Questions</h2>
      <p>
        See our <Link href="/terms">Terms of Service</Link> or email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}

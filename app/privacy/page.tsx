import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Atlas",
};

export default function PrivacyPage() {
  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="container max-w-3xl py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-8 text-center">
          Privacy policy
        </h1>

        <div className="h-px bg-border my-8" />

        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (email, name)</li>
              <li>Research queries and search history</li>
              <li>Papers you interact with and save</li>
              <li>Notes and annotations you create</li>
              <li>Research organization data stored in Notion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our research assistance services</li>
              <li>Process and store your research data and notes</li>
              <li>Generate AI-powered summaries and analyses</li>
              <li>Maintain and optimize your research organization</li>
              <li>Communicate important updates about the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. Data Sharing and Third-Party Services
            </h2>
            <p>We integrate with the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Semantic Scholar API - for paper search and metadata</li>
              <li>OpenAI API - for AI-powered analysis and summaries</li>
              <li>Notion API - for data organization and storage</li>
            </ul>
            <p>
              Each service processes your data according to their respective
              privacy policies. We only share necessary information required for
              these services to function.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, or destruction.
              However, no internet transmission is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your research data</li>
              <li>Opt-out of certain data processing activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide you services. You can request deletion of
              your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              7. Changes to Privacy Policy
            </h2>
            <p>
              We may update this privacy policy periodically. We will notify you
              of any material changes via email or through the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p>
              For any questions about this Privacy Policy or our data practices,
              please contact me at neal.28@dartmouth.edu
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

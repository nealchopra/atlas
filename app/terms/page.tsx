import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Enhanced Research Paper Assistant",
};

export default function TermsPage() {
  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="container max-w-3xl py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Terms of service
        </h1>

        <div className="h-px bg-border my-8" />

        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Enhanced Research Paper Assistant ("the
              Service"), you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p>
              Enhanced Research Paper Assistant provides research paper analysis
              and organization tools, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Paper search and retrieval via Semantic Scholar and ArXiv APIs
              </li>
              <li>AI-powered paper analysis and summarization</li>
              <li>Research organization and note-taking capabilities</li>
              <li>Literature review assistance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate information when using the Service</li>
              <li>
                Use the Service in compliance with applicable laws and
                regulations
              </li>
              <li>Not misuse or attempt to manipulate the Service</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by Enhanced Research Paper Assistant and are protected
              by international copyright, trademark, and other intellectual
              property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              5. Third-Party Services
            </h2>
            <p>The Service integrates with third-party services including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Semantic Scholar API</li>
              <li>ArXiv API</li>
              <li>OpenAI API</li>
              <li>Notion API</li>
            </ul>
            <p>
              Use of these services is subject to their respective terms of
              service and privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We
              are not responsible for any errors or omissions in the content or
              functionality of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes via email or through the
              Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p>
              For any questions about these Terms, please contact us at
              neal.28@dartmouth.edu
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

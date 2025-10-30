// app/legal/terms-of-service/page.tsx
import React from 'react';
import { FileText, AlertCircle, Shield, Ban, Scale } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  const lastUpdated: string = 'October 27, 2025';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-600 mb-2">
            <strong>CodedPadAI.com</strong> - Secure Pad Sharing Service
          </p>
          <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Welcome to CodedPadAI.com. By accessing or using our service, you
              agree to be bound by these Terms of Service and our Privacy
              Policy. If you do not agree to these terms, please do not use our
              service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              CodedPadAI.com is operated as an individual service based in
              India. These terms constitute a legally binding agreement between
              you and CodedPadAI.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-700 mb-3">
              CodedPadAI.com provides a secure platform for creating, storing,
              and sharing text-based pads with various security and privacy
              features including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Multi-tab text editing and storage</li>
              <li>Client-side encryption for sensitive content</li>
              <li>
                Customizable visibility settings (public, private, protected)
              </li>
              <li>Access controls and password protection</li>
              <li>Expiration and view limit settings</li>
              <li>Burn-after-reading functionality</li>
            </ul>
            <p className="text-gray-700 mt-3">
              User registration is optional. You may use the service without
              creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>3.1 Account Creation:</strong> You may create an account
                using your email and password, or through OAuth providers
                (Google, GitHub). You are responsible for maintaining the
                confidentiality of your account credentials.
              </p>

              <p>
                <strong>3.2 Account Security:</strong> You are responsible for
                all activities that occur under your account. Notify us
                immediately of any unauthorized use of your account.
              </p>

              <p>
                <strong>3.3 Email Verification:</strong> Email verification is
                not currently required but may be implemented in the future.
              </p>

              <p>
                <strong>3.4 Account Deletion:</strong> You may delete your pads
                and your entire account at any time through your account
                settings. Account deletion is permanent and will remove all your
                data including pads and audit logs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={24} className="text-blue-600" />
              4. Acceptable Use Policy
            </h2>
            <p className="text-gray-700 mb-3">
              You agree not to use CodedPadAI.com to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Store, share, or distribute illegal content or content that
                violates any applicable laws
              </li>
              <li>Distribute malware, viruses, or any malicious code</li>
              <li>Engage in phishing, fraud, or deceptive practices</li>
              <li>
                Share content that infringes on intellectual property rights
              </li>
              <li>Share content that is hateful, threatening, or harassing</li>
              <li>Share sexually explicit content involving minors</li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users' accounts
              </li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>
                Use automated systems (bots, scrapers) without explicit
                permission
              </li>
              <li>
                Abuse the service in a way that impacts other users or our
                infrastructure
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-amber-800 flex items-start gap-2">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> We do not actively monitor or
                  review pad content as part of our commitment to privacy and
                  security. However, we reserve the right to investigate and
                  take action if we become aware of violations through reports
                  or automated systems.
                </span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Content and Intellectual Property
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>5.1 Your Content:</strong> You retain all rights to the
                content you create and store on CodedPadAI.com. You grant us a
                limited license to store, display, and transmit your content
                solely for the purpose of providing the service.
              </p>

              <p>
                <strong>5.2 Content Only:</strong> Our service only accepts text
                content. File uploads are not supported.
              </p>

              <p>
                <strong>5.3 Responsibility:</strong> You are solely responsible
                for the content you create and share. Ensure you have the
                necessary rights to share any content you upload.
              </p>

              <p>
                <strong>5.4 Public Content:</strong> Content marked as "public"
                and "listed" may appear in our explore page and be indexed by
                search engines.
              </p>

              <p>
                <strong>5.5 Our Intellectual Property:</strong> The
                CodedPadAI.com service, including its design, features, and
                underlying technology, is protected by intellectual property
                laws. You may not copy, modify, or reverse engineer our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Privacy and Security
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>6.1 Encryption:</strong> Encrypted pads use client-side
                encryption. Your content is encrypted in your browser before
                being transmitted to our servers. We cannot access or read
                encrypted content without your passphrase.
              </p>

              <p>
                <strong>6.2 Security Measures:</strong> We implement
                industry-standard security measures to protect your data,
                including HTTPS/TLS encryption, hashed passwords, and secure
                database practices.
              </p>

              <p>
                <strong>6.3 No Guarantee:</strong> While we take security
                seriously, no system is completely secure. We cannot guarantee
                absolute security of your data.
              </p>

              <p>
                <strong>6.4 Privacy Policy:</strong> Our collection, use, and
                protection of your data is governed by our Privacy Policy, which
                is incorporated into these Terms by reference.
              </p>

              <p>
                <strong>6.5 Your Responsibility:</strong> You are responsible
                for keeping your passphrases and access keys secure. We cannot
                recover encrypted content if you lose your passphrase.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Copyright and DMCA
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>7.1 Respect Copyright:</strong> You must respect the
                intellectual property rights of others. Do not share copyrighted
                content without authorization.
              </p>

              <p>
                <strong>7.2 DMCA Compliance:</strong> While we do not currently
                have a formal DMCA takedown process, we respect copyright laws
                and will respond to valid copyright infringement notices.
              </p>

              <p>
                <strong>7.3 Copyright Complaints:</strong> If you believe your
                copyright has been infringed, contact us at
                <a
                  href="mailto:dmca@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  dmca@codedpadai.com
                </a>{' '}
                with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Description of the copyrighted work</li>
                <li>URL or identifier of the infringing content</li>
                <li>Your contact information</li>
                <li>Statement of good faith belief</li>
                <li>Statement that the information is accurate</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Service Availability and Modifications
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>8.1 Availability:</strong> We strive to maintain high
                availability but do not guarantee uninterrupted service. We may
                perform maintenance, updates, or experience downtime.
              </p>

              <p>
                <strong>8.2 Modifications:</strong> We reserve the right to
                modify, suspend, or discontinue any aspect of the service at any
                time with or without notice.
              </p>

              <p>
                <strong>8.3 Free Service:</strong> Our service is currently
                provided free of charge. We may introduce paid features or
                monetization (such as advertisements) in the future with notice
                to users.
              </p>

              <p>
                <strong>8.4 No Backup Obligation:</strong> While we maintain
                backups, you are responsible for maintaining your own backups of
                important content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ban size={24} className="text-red-600" />
              9. Termination
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>9.1 By You:</strong> You may stop using the service at
                any time and delete your pads.
              </p>

              <p>
                <strong>9.2 By Us:</strong> We reserve the right to suspend or
                terminate your access to the service at any time, with or
                without notice, for violations of these Terms or for any other
                reason.
              </p>

              <p>
                <strong>9.3 Effect of Termination:</strong> Upon termination,
                your right to use the service immediately ceases. We may delete
                your content in accordance with our data retention policies.
              </p>

              <p>
                <strong>9.4 Survival:</strong> Provisions regarding intellectual
                property, disclaimers, limitations of liability, and
                indemnification survive termination.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Disclaimers and Limitations of Liability
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>10.1 "AS IS" Service:</strong> The service is provided
                "as is" and "as available" without warranties of any kind,
                either express or implied, including but not limited to
                warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>

              <p>
                <strong>10.2 No Warranty:</strong> We do not warrant that the
                service will be uninterrupted, secure, or error-free, or that
                defects will be corrected.
              </p>

              <p>
                <strong>10.3 Limitation of Liability:</strong> To the maximum
                extent permitted by law, CodedPadAI.com and its operators shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data, use, goodwill, or other intangible losses resulting
                from:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your use or inability to use the service</li>
                <li>Unauthorized access to or alteration of your content</li>
                <li>Loss or corruption of data</li>
                <li>Any other matter relating to the service</li>
              </ul>

              <p>
                <strong>10.4 Maximum Liability:</strong> In no event shall our
                total liability exceed the amount you paid us in the past twelve
                months (currently zero for free service).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless CodedPadAI.com,
              its operators, and affiliates from any claims, liabilities,
              damages, losses, costs, expenses, or fees (including reasonable
              attorneys' fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
              <li>Your use or misuse of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you submit, post, or transmit through the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Scale size={24} className="text-blue-600" />
              12. Governing Law and Disputes
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>12.1 Governing Law:</strong> These Terms shall be
                governed by and construed in accordance with the laws of India,
                without regard to its conflict of law provisions.
              </p>

              <p>
                <strong>12.2 Jurisdiction:</strong> Any disputes arising from
                these Terms or your use of the service shall be subject to the
                exclusive jurisdiction of the courts located in India.
              </p>

              <p>
                <strong>12.3 Informal Resolution:</strong> Before filing a
                claim, please contact us at
                <a
                  href="mailto:legal@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  legal@codedpadai.com
                </a>{' '}
                to attempt to resolve the dispute informally.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-3">
              We reserve the right to modify these Terms at any time. We will
              notify users of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Updating the "Last Updated" date at the top of this page</li>
              <li>Posting a notice on our website</li>
              <li>Sending an email to registered users (if applicable)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Your continued use of the service after changes become effective
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 mb-3">
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">
                <strong>General Inquiries:</strong>{' '}
                <a
                  href="mailto:legal@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  legal@codedpadai.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Privacy Questions:</strong>{' '}
                <a
                  href="mailto:privacy@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@codedpadai.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Copyright/DMCA:</strong>{' '}
                <a
                  href="mailto:dmca@codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  dmca@codedpadai.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong>{' '}
                <a
                  href="https://codedpadai.com"
                  className="text-blue-600 hover:underline"
                >
                  https://codedpadai.com
                </a>
              </p>
            </div>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Acknowledgment
            </h2>
            <p className="text-gray-700">
              By using CodedPadAI.com, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service and
              our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;

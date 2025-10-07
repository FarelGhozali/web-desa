import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us for any questions about homestays, bookings, or visiting our village.',
};

export default function ContactPage() {
  return (
    <div className="py-12">
      <Container size="lg">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;re here to help! Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      type="email"
                      label="Email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What is this regarding?"
                    required
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />

                  <Button type="submit" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@villagestay.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+62 123 456 7890</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    Village Center<br />
                    District Name<br />
                    Regency, Province
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
          <div className="h-96 bg-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map will be displayed here</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

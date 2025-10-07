import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4">Village Stay</h3>
            <p className="text-sm mb-4">
              Experience authentic village life with our carefully selected homestays. 
              Discover local culture, cuisine, and natural beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/homestays" className="hover:text-white transition-colors">
                  Homestays
                </Link>
              </li>
              <li>
                <Link href="/attractions" className="hover:text-white transition-colors">
                  Attractions
                </Link>
              </li>
              <li>
                <Link href="/culinary" className="hover:text-white transition-colors">
                  Culinary
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: info@villagestay.com</li>
              <li>Phone: +62 123 456 7890</li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Village Stay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

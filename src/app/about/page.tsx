import type { Metadata } from 'next';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'About Our Village',
  description: 'Learn about the rich history, culture, and unique characteristics of our village.',
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <Container size="md">
        {/* Hero Image */}
        <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>

        <article className="prose prose-lg max-w-none">
          <h1>About Our Village</h1>
          
          <p className="lead">
            Welcome to our beautiful village, where tradition meets natural beauty and 
            authentic experiences await every visitor.
          </p>

          <h2>Our History</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Our village was founded 
            over 200 years ago and has maintained its cultural heritage while welcoming 
            visitors from around the world.
          </p>

          <h2>Culture & Traditions</h2>
          <p>
            The people of our village are known for their warm hospitality and rich 
            cultural traditions. From traditional dances to local crafts, we take pride 
            in preserving and sharing our heritage with visitors.
          </p>

          <h2>Natural Beauty</h2>
          <p>
            Surrounded by lush green landscapes, our village offers breathtaking views 
            of mountains, rice terraces, and pristine natural attractions. The environment 
            is clean, peaceful, and perfect for those seeking to escape the hustle and 
            bustle of city life.
          </p>

          <h2>Sustainable Tourism</h2>
          <p>
            We are committed to sustainable tourism practices that benefit both our 
            community and the environment. By staying in our homestays and supporting 
            local businesses, you contribute directly to the well-being of our village.
          </p>

          <h2>Visit Us</h2>
          <p>
            Whether you&apos;re looking for adventure, relaxation, or cultural immersion, 
            our village has something for everyone. We invite you to experience authentic 
            village life and create memories that will last a lifetime.
          </p>
        </article>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-4xl font-bold text-blue-600 mb-2">200+</p>
            <p className="text-gray-600">Years of History</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-4xl font-bold text-green-600 mb-2">50+</p>
            <p className="text-gray-600">Local Homestays</p>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <p className="text-4xl font-bold text-yellow-600 mb-2">10+</p>
            <p className="text-gray-600">Natural Attractions</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

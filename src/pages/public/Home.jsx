import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaRobot, FaChartLine, FaBell, FaPalette, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import { BsBuilding } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1F75C2]/95 backdrop-blur-sm shadow-md`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2">
              <BsBuilding className="text-white text-2xl" />
              <span className="text-2xl font-bold text-white">CitizenSys</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-white">Empowering Citizens</span>
              <button onClick={() => scrollToSection('features')} className="text-white/90 hover:text-white px-3 py-2">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-white/90 hover:text-white px-3 py-2">How It Works</button>
              <button onClick={() => scrollToSection('stats')} className="text-white/90 hover:text-white px-3 py-2">Statistics</button>
              <a href="/login" className="text-white/90 hover:text-white px-3 py-2">Login</a>
              <a href="/register" className="bg-white text-[#1F75C2] px-4 py-2 rounded-lg hover:bg-blue-50 transition">Get Started</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-6">
              Citizen Engagement System
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8">
              Empowering citizens and agencies to work together for a better community. Submit, track, and resolve complaints efficiently.
            </p>
            <div className="flex gap-4 justify-center mb-16">
              <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition transform hover:scale-105">
                Get Started
              </a>
              <a href="/login" className="bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition transform hover:scale-105">
                Login
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="scroll-mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<FaClipboardList className="w-8 h-8" />}
              title="Easy Submission"
              description="Submit and track complaints with our intuitive interface. Upload evidence and get real-time updates."
            />
            <FeatureCard
              icon={<FaRobot className="w-8 h-8" />}
              title="AI-Powered"
              description="Smart categorization ensures your complaint reaches the right department instantly."
            />
            <FeatureCard
              icon={<FaChartLine className="w-8 h-8" />}
              title="Analytics"
              description="Comprehensive dashboards for agencies to monitor and improve service delivery."
            />
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="scroll-mt-20 max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
              How It Works
            </h2>
            <div className="space-y-6">
              <Step number="1" title="Submit Your Complaint" description="Describe your issue and upload supporting evidence." />
              <Step number="2" title="AI Categorization" description="Our system automatically routes your complaint to the right agency." />
              <Step number="3" title="Track Progress" description="Get real-time updates as your complaint is processed and resolved." />
              <Step number="4" title="Resolution" description="Receive and review the resolution from the concerned agency." />
            </div>
          </div>

          {/* Statistics */}
          <div id="stats" className="scroll-mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <StatCard number="1000+" label="Citizens Served" />
            <StatCard number="95%" label="Resolution Rate" />
            <StatCard number="24/7" label="Support" />
            <StatCard number="10+" label="Agency Partners" />
          </div>

          {/* CTA Section */}
          <div id="cta" className="scroll-mt-20 text-center bg-blue-600 dark:bg-blue-700 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6">Join thousands of citizens making their community better.</p>
            <a href="/register" className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:scale-105">
              Register Now <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer id="footer" className="scroll-mt-20 bg-gray-50 dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">About</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('features')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">About Us</button></li>
                  <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">How It Works</button></li>
                  <li><button onClick={() => scrollToSection('stats')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Success Stories</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('features')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Help Center</button></li>
                  <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">FAQs</button></li>
                  <li><button onClick={() => scrollToSection('cta')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Contact Us</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><button className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Privacy Policy</button></li>
                  <li><button className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Terms of Service</button></li>
                  <li><button className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Cookie Policy</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Twitter</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Facebook</a></li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">&copy; 2024 Citizen Engagement System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

// Component for steps
function Step({ number, title, description }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

// Component for statistics
function StatCard({ number, label }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{number}</div>
      <div className="text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}

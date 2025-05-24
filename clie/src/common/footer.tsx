// Footer.jsx


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Chatly. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:underline text-sm">Privacy Policy</a>
          <a href="/terms" className="hover:underline text-sm">Terms of Service</a>
          <a href="/support" className="hover:underline text-sm">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

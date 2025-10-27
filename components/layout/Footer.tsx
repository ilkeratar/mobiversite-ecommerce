export default function Footer() {
    return (
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Ecomversite. All rights reserved.
              </p>
            </div>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              {/* İsteğe bağlı sosyal medya ikonları eklenebilir */}
              <a href="#" className="text-gray-500 hover:text-gray-700">
                {/* <Facebook className="h-5 w-5" /> */}
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                {/* <Twitter className="h-5 w-5" /> */}
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
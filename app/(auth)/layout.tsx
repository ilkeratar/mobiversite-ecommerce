import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid min-h-screen grid-cols-1 md:grid-cols-5">
      <div className="md:col-span-2 flex items-center justify-center px-6 py-12 sm:px-8 md:px-10 lg:px-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      <div className="relative hidden md:col-span-3 md:block">
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Auth background"
          fill
          priority
          sizes="(min-width: 768px) 60vw, 0vw"
          className="object-cover"
          style={{ objectPosition: '25% 75%' }}
        />
      </div>
    </section>
  );
}



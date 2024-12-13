import React from 'react';
import { useState } from 'react';

import { Link } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };
  return (
    <div className="flex items-center justify-center w-full h-[80vh] p-4">
    <Link
      to="/"
      className="absolute right-4 top-4 md:right-8 md:top-8 p-2 rounded-md text-[#fafafa] hover:bg-[#27272a]"
    >
      Back to home
    </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-white font-semibold tracking-tight">
              Inicia Sesión
            </h1>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none text-white"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="w-full rounded-md border-[0.5px] bg-[#09090b] border-[#27272a] p-2 focus:border-[#e5e7eb] focus:outline-none text-white"
                  />
                </div>
                <label className="sr-only" htmlFor="email">
                    Password
                  </label>
                  <input
                    id="password"
                    placeholder="password"
                    type="email"
                    autoCapitalize="none text-white"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="w-full rounded-md border-[0.5px] bg-[#09090b] border-[#27272a] p-2 focus:border-[#e5e7eb] focus:outline-none text-white"
                  />
                <button
                  disabled={isLoading}
                  className={`flex items-center justify-center rounded-md bg-[#fafafa] p-2 text-[#18181b] hover:bg-[#fafafae6] disabled:bg-gray-300`}
                >
                  {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin">🔄</span>
                  ) : null}
                  Continuar
                </button>
              </div>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#09090b] px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className={`flex items-center justify-center w-full rounded-md border border-[#27272a] p-2 text-[#fafafa] hover:bg-[#27272a] disabled:bg-gray-200`}
            >
              {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin">🔄</span>
              ) : (
                <>
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.482 22 2 17.518 2 12S6.482 2 12 2s10 4.482 10 10-4.482 10-10 10z" />
                        <path d="M10 10v4h4v2h-6V10zm6 0v4h2v-6h-4v2h2z" />
                      </svg>
                      Iniciar sesión con Google
                    </>
              )}
            </button>
          </div>
          <p className="px-8 text-white text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const billingInterval = 'month'; // Fijar el intervalo de facturación a mensual

  const plans = [
    { name: 'Starter', description: 'Perfect for starters', prices: { month: 9.99 }, url: 'https://buy.stripe.com/6oEcOk2MZcaG4qk147' },
    { name: 'Pro', description: 'For growing businesses', prices: { month: 19.99 }, url: 'https://buy.stripe.com/test_4gwbJlge01EJ2RO8ww' },
    { name: 'Premium', description: 'For large enterprises', prices: { month: 49.99 }, url: 'https://buy.stripe.com/14kdSo0ERdeK0a4bIK' },
  ];

  const handleChoosePlan = (url) => {
    window.location.href = url;
  };

  return (
    <section className="">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Precios
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Escoge un plan que funcione para ti
          </p>
        </div>

        <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => {
            const price = plan.prices.month;
            return (
              <div
                key={plan.name}
                className="flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900 flex-1 basis-1/3 max-w-xs"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold text-white">
                      ${price}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{billingInterval}
                    </span>
                  </p>
                  <button
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white bg-pink-500 rounded-md hover:bg-pink-600"
                    onClick={() => handleChoosePlan(plan.url)}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
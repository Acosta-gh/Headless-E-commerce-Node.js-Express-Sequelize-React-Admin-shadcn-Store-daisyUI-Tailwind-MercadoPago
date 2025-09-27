import React from 'react'
import { useCart } from "@/context/CartContext";
import CartListResumen from '@/components/checkout/CartListResumen'
import MercadoPagoButton from '@/components/MercadoPagoButton.jsx'

function Checkout() {
  const { cart } = useCart();

  return (
    <div className="max-w-3xl mx-auto p-8 mt-20 min-h-[80vh] ">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CartListResumen cart={cart} />
      <div className="mt-8 flex justify-center">
        <MercadoPagoButton />
      </div>
    </div>
  )
}

export default Checkout
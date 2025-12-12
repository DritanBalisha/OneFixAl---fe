export default function PaymentPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-3">💳 Proceed with Payment</h2>
      <p>Your technician has confirmed the booking. Please complete the payment to finalize.</p>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Pay Now</button>
    </div>
  );
}

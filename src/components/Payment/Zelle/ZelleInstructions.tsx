
export const ZelleInstructions = () => {
  return (
    <div className="bg-gaming-dark/80 rounded-lg p-4 text-sm space-y-2 border border-gaming-light-gray/10">
      <p className="text-gaming-blue font-medium">Instructions:</p>
      <ol className="list-decimal pl-5 space-y-2 text-gray-300">
        <li>Fill out your shipping information and click "Place Order" below</li>
        <li>Copy the Zelle email address shown above</li>
        <li>Open your banking app and select Zelle payment option</li>
        <li>Send the total amount to the copied email address</li>
        <li>Include your Order ID in the payment memo/notes</li>
      </ol>
      <p className="text-amber-400 text-xs mt-2">
        * Your order will be processed once Zelle payment is confirmed
      </p>
    </div>
  );
};

// Success Modal Component - Updated version
const SuccessModal = () => {
  if (!showSuccessModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setShowSuccessModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          
          <p className="text-gray-600 mb-6">
            Your laundry order has been received and is being processed.
            {formData.deliveryOption === 'pickup' 
              ? ' You will receive a notification when your order is ready for pickup.' 
              : ' We will deliver your order to the specified address.'}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Order Summary</h3>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <strong>Order ID:</strong> #{orderDetails?._id?.substring(18) || 'Processing...'}
              </p>
              <p className="text-gray-600">
                <strong>Total Amount:</strong> ₦{(orderDetails?.total || totalAmount).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Items:</strong> {(orderDetails?.items || formData.items).reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
              <p className="text-gray-600">
                <strong>Pickup Date:</strong> {new Date(orderDetails?.pickupDate || formData.pickupDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Pickup Address:</strong> {orderDetails?.pickupAddress || formData.pickupAddress}
              </p>
              {formData.deliveryOption === 'delivery' && (
                <>
                  <p className="text-gray-600">
                    <strong>Delivery Date:</strong> {new Date(orderDetails?.deliveryDate || formData.deliveryDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Delivery Address:</strong> {orderDetails?.deliveryAddress || formData.deliveryAddress}
                  </p>
                </>
              )}
              <p className="text-gray-600">
                <strong>Service Type:</strong> {formData.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleViewOrders}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={handleNewOrder}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

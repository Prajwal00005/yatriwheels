const axios = require('axios')

const payViaKhalti = async data => {
  const { returnUrl, websiteUrl, amount, orderId, orderName, customerInfo } =
    data

  // Validate required fields
  if (!returnUrl) throw new Error('Return URL is required')
  if (!websiteUrl) throw new Error('Website URL is required')
  if (!amount || typeof amount !== 'number' || amount <= 0)
    throw new Error('Valid amount is required')
  if (!orderId) throw new Error('Order ID is required')
  if (!orderName) throw new Error('Order name is required')
  if (!customerInfo || typeof customerInfo !== 'object')
    throw new Error('Valid customer info is required')

  const requestBody = {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount: amount,
    purchase_order_id: orderId,
    purchase_order_name: orderName,
    customer_info: customerInfo
  }

  try {
    const response = await axios.post(process.env.KHALTI_URL, requestBody, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    // Validate response
    if (!response.data || !response.data.pidx) {
      throw new Error('Invalid response from Khalti API')
    }

    return response.data
  } catch (error) {
    if (error.response) {
      // Handle Khalti API errors
      throw new Error(
        `Khalti API error: ${
          error.response.data?.error?.message || error.message
        }`
      )
    }
    throw new Error(`Failed to initiate Khalti payment: ${error.message}`)
  }
}

module.exports = payViaKhalti

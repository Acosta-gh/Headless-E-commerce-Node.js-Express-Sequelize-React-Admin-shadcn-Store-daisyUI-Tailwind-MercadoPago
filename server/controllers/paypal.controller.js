const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// Obtener token de acceso
async function getAccessToken() {
    const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error al obtener token: ${error}`);
    }
    console.debug('Token de acceso obtenido exitosamente');
    const data = await response.json();
    return data.access_token;
}

// Crear orden
exports.createOrder = async (req, res) => {
    const { amount, currency = 'USD' } = req.body;

    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount
                        }
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        console.log('Orden creada exitosamente:', data);
        res.json({ id: data.id });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({
            message: 'Error al crear la orden de PayPal',
            error: error.message
        });
    }
};

// Capturar orden
exports.captureOrder = async (req, res) => {
    const { orderID } = req.params;

    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        res.json(data);
    } catch (error) {
        console.error('Error al capturar la orden:', error);
        res.status(500).json({
            message: 'Error al capturar la orden de PayPal',
            error: error.message
        });
    }
};

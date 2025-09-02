// En tu controlador de MercadoPago del backend
const { MercadoPagoConfig, Preference } = require("mercadopago");
const { Item } = require("../models");

if (!process.env.MP_ACCESS_TOKEN) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("ERROR CRÍTICO: La variable de entorno MP_ACCESS_TOKEN no está definida.");
  console.error("Asegúrate de que exista en el archivo .env del backend.");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
}

console.log("MercadoPago Access Token:", process.env.MP_ACCESS_TOKEN);

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

exports.create_preference = async (req, res) => {
  // Recibimos solo el ID y la cantidad, ignoramos cualquier precio que venga.
  const { items } = req.body;

  console.log("==============================================");
  console.log("Recibida petición para crear preferencia MP.");
  console.log(
    "Datos recibidos en req.body:",
    JSON.stringify(req.body, null, 2)
  );
  console.log("==============================================");

  try {
    const preferenceItems = [];
    for (const cartItem of items) {
      const productoEnDB = await Item.findByPk(cartItem.itemId);
      if (!productoEnDB) {
        return res
          .status(404)
          .json({ message: `Producto no encontrado: ${cartItem.itemId}` });
      }

      // Usamos el precio de la base de datos
      preferenceItems.push({
        id: productoEnDB.id,
        title: productoEnDB.nombre,
        quantity: cartItem.cantidad,
        unit_price: parseFloat(productoEnDB.precio),
        currency_id: "ARS",
      });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: preferenceItems,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/carrito`,
          pending: `${process.env.FRONTEND_URL}/carrito`,
        },
        auto_return: "approved",
      },
    });

    res.json({ id: result.id }); // Devolvemos solo el ID de la preferencia
  } catch (error) {
    res.status(500).json({ message: "Error al crear la preferencia de pago." });
  }
};

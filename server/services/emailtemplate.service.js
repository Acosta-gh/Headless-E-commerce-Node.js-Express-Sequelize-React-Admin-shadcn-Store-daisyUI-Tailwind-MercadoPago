const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

/**
 * Renderiza una plantilla de correo usando Handlebars.
 * @param {string} templateName - Nombre del archivo de plantilla (sin .hbs)
 * @param {object} data - Objeto con datos para la plantilla
 * @returns {string} HTML renderizado
 */
function renderTemplate(templateName, data) {
  const templatePath = path.join(__dirname, "../templates/email", templateName + ".hbs");
  const source = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(source);
  return template(data);
}

module.exports = { renderTemplate };
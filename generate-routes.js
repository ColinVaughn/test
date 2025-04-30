const fs = require('fs');
const path = require('path');

const routes = [
  'customize',
  'prebuilt',
  'gaming-pcs',
  'workstations',
  'about',
  'support'
];

function generateRouteFiles() {
  const templatePath = path.join(__dirname, 'dist', 'index.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  routes.forEach(route => {
    const dirPath = path.join(__dirname, 'dist', route);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, 'index.html'), template);
  });
}

generateRouteFiles(); 
-- Migration number: 0001 	 2025-04-20
-- Esquema de base de datos para la aplicación de presupuestos de reformas

-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS plan_annotations;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS budget_items;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS legal_entities;
DROP TABLE IF EXISTS users;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'user')),
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('email', 'google', 'apple', 'facebook')),
  auth_provider_id TEXT,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('physical', 'legal')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de entidades legales (personas jurídicas)
CREATE TABLE IF NOT EXISTS legal_entities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  province TEXT,
  country TEXT,
  logo_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de subcategorías
CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla de items (partidas)
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  subcategory_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  material_price REAL NOT NULL DEFAULT 0,
  labor_price REAL NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  province TEXT,
  country TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de presupuestos
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subtotal REAL NOT NULL DEFAULT 0,
  discount_percentage REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  tax_percentage REAL NOT NULL DEFAULT 21, -- IVA por defecto en España
  tax_amount REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('draft', 'final')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tabla de items de presupuesto
CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  budget_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit_material_price REAL NOT NULL DEFAULT 0,
  unit_labor_price REAL NOT NULL DEFAULT 0,
  total_material_price REAL NOT NULL DEFAULT 0,
  total_labor_price REAL NOT NULL DEFAULT 0,
  total_price REAL NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Tabla de planos
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'cad', 'generated')),
  floor_number INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tabla de anotaciones de planos
CREATE TABLE IF NOT EXISTS plan_annotations (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  x_position REAL NOT NULL,
  y_position REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL,
  annotation_type TEXT NOT NULL CHECK (annotation_type IN ('text', 'measurement', 'area')),
  content TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de plantillas
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  html_content TEXT,
  css_content TEXT,
  is_default BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);
CREATE INDEX idx_legal_entities_user_id ON legal_entities(user_id);
CREATE INDEX idx_categories_is_default ON categories(is_default);
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_items_subcategory_id ON items(subcategory_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_budgets_project_id ON budgets(project_id);
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_item_id ON budget_items(item_id);
CREATE INDEX idx_plans_project_id ON plans(project_id);
CREATE INDEX idx_plan_annotations_plan_id ON plan_annotations(plan_id);

-- Datos iniciales para categorías predefinidas
INSERT INTO categories (id, name, description, is_default) VALUES 
('cat_1', 'Albañilería', 'Trabajos de construcción y reforma estructural', 1),
('cat_2', 'Fontanería', 'Instalaciones y reparaciones de agua y desagües', 1),
('cat_3', 'Electricidad', 'Instalaciones y reparaciones eléctricas', 1),
('cat_4', 'Carpintería', 'Trabajos en madera y derivados', 1),
('cat_5', 'Pintura', 'Trabajos de pintura y acabados', 1);

-- Datos iniciales para subcategorías predefinidas
INSERT INTO subcategories (id, category_id, name, description, is_default) VALUES 
-- Albañilería
('subcat_1_1', 'cat_1', 'Demoliciones', 'Derribos y eliminación de elementos', 1),
('subcat_1_2', 'cat_1', 'Tabiquería', 'Construcción de tabiques y paredes', 1),
('subcat_1_3', 'cat_1', 'Solados', 'Instalación de suelos y pavimentos', 1),
('subcat_1_4', 'cat_1', 'Alicatados', 'Revestimientos cerámicos en paredes', 1),
-- Fontanería
('subcat_2_1', 'cat_2', 'Instalación de tuberías', 'Colocación de tuberías de agua', 1),
('subcat_2_2', 'cat_2', 'Sanitarios', 'Instalación de elementos sanitarios', 1),
('subcat_2_3', 'cat_2', 'Grifería', 'Instalación de grifos y accesorios', 1),
-- Electricidad
('subcat_3_1', 'cat_3', 'Cableado', 'Instalación de cableado eléctrico', 1),
('subcat_3_2', 'cat_3', 'Cuadros eléctricos', 'Instalación de cuadros y protecciones', 1),
('subcat_3_3', 'cat_3', 'Iluminación', 'Instalación de puntos de luz', 1),
-- Carpintería
('subcat_4_1', 'cat_4', 'Puertas', 'Instalación de puertas', 1),
('subcat_4_2', 'cat_4', 'Ventanas', 'Instalación de ventanas', 1),
('subcat_4_3', 'cat_4', 'Armarios', 'Montaje de armarios y muebles', 1),
-- Pintura
('subcat_5_1', 'cat_5', 'Pintura interior', 'Pintado de paredes interiores', 1),
('subcat_5_2', 'cat_5', 'Pintura exterior', 'Pintado de fachadas y exteriores', 1);

-- Datos iniciales para items predefinidos
INSERT INTO items (id, subcategory_id, name, description, unit, material_price, labor_price, is_default) VALUES 
-- Albañilería - Demoliciones
('item_1_1_1', 'subcat_1_1', 'Demolición tabique', 'Demolición de tabique de ladrillo', 'm²', 0, 25, 1),
('item_1_1_2', 'subcat_1_1', 'Demolición solado', 'Demolición de solado cerámico', 'm²', 0, 18, 1),
-- Albañilería - Tabiquería
('item_1_2_1', 'subcat_1_2', 'Tabique ladrillo', 'Tabique de ladrillo hueco doble', 'm²', 12, 28, 1),
('item_1_2_2', 'subcat_1_2', 'Tabique pladur', 'Tabique de pladur con estructura', 'm²', 18, 25, 1),
-- Albañilería - Solados
('item_1_3_1', 'subcat_1_3', 'Solado cerámico', 'Solado con baldosa cerámica', 'm²', 22, 30, 1),
('item_1_3_2', 'subcat_1_3', 'Solado porcelánico', 'Solado con gres porcelánico', 'm²', 35, 32, 1),
-- Fontanería - Tuberías
('item_2_1_1', 'subcat_2_1', 'Tubería PEX 16mm', 'Tubería multicapa PEX-AL-PEX 16mm', 'm', 3.5, 12, 1),
('item_2_1_2', 'subcat_2_1', 'Tubería PVC 110mm', 'Tubería PVC evacuación 110mm', 'm', 8, 15, 1),
-- Electricidad - Cableado
('item_3_1_1', 'subcat_3_1', 'Cable 2.5mm²', 'Cable H07V-K 2.5mm² flexible', 'm', 0.8, 3, 1),
('item_3_1_2', 'subcat_3_1', 'Cable 6mm²', 'Cable H07V-K 6mm² flexible', 'm', 1.5, 4, 1);

-- Plantilla predeterminada para presupuestos
INSERT INTO templates (id, name, description, html_content, css_content, is_default) VALUES 
('template_1', 'Plantilla Estándar', 'Plantilla predeterminada para presupuestos', 
'<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Presupuesto de Reforma</title>
  <style>{{css_content}}</style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <img src="{{logo_url}}" alt="Logo">
    </div>
    <div class="company-info">
      <h1>{{company_name}}</h1>
      <p>{{company_address}}</p>
      <p>{{company_contact}}</p>
    </div>
  </div>
  
  <div class="customer-info">
    <h2>Cliente</h2>
    <p><strong>Nombre:</strong> {{customer_name}}</p>
    <p><strong>Dirección:</strong> {{customer_address}}</p>
    <p><strong>Teléfono:</strong> {{customer_phone}}</p>
    <p><strong>Email:</strong> {{customer_email}}</p>
  </div>
  
  <div class="project-info">
    <h2>Proyecto</h2>
    <p><strong>Nombre:</strong> {{project_name}}</p>
    <p><strong>Descripción:</strong> {{project_description}}</p>
    <p><strong>Dirección:</strong> {{project_address}}</p>
  </div>
  
  <div class="budget-items">
    <h2>Partidas</h2>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Unidad</th>
          <th>Cantidad</th>
          <th>Precio Material</th>
          <th>Precio Mano de Obra</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr>
          <td>{{this.name}}</td>
          <td>{{this.unit}}</td>
          <td>{{this.quantity}}</td>
          <td>{{this.unit_material_price}} €</td>
          <td>{{this.unit_labor_price}} €</td>
          <td>{{this.total_price}} €</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  
  <div class="summary">
    <h2>Resumen</h2>
    <table>
      <tr>
        <td>Subtotal</td>
        <td>{{subtotal}} €</td>
      </tr>
      <tr>
        <td>Descuento ({{discount_percentage}}%)</td>
        <td>{{discount_amount}} €</td>
      </tr>
      <tr>
        <td>Base Imponible</td>
        <td>{{base_amount}} €</td>
      </tr>
      <tr>
        <td>IVA ({{tax_percentage}}%)</td>
        <td>{{tax_amount}} €</td>
      </tr>
      <tr class="total">
        <td>Total</td>
        <td>{{total}} €</td>
      </tr>
    </table>
  </div>
  
  <div class="notes">
    <h2>Notas</h2>
    <p>{{notes}}</p>
  </div>
  
  <div class="footer">
    <p>Presupuesto generado el {{date}} | Válido por 30 días</p>
  </div>
</body>
</html>', 
'body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 20px;
}

.logo img {
  max-height: 80px;
}

h1, h2 {
  color: #2c3e50;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f5f5f5;
}

.summary table {
  width: 300px;
  margin-left: auto;
}

.total {
  font-weight: bold;
  font-size: 1.2em;
}

.notes {
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.footer {
  margin-top: 50px;
  text-align: center;
  font-size: 0.9em;
  color: #777;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}', 
1);

-- Configuración inicial
INSERT INTO settings (id, key, value, description) VALUES 
('setting_1', 'company_name', 'Reformas App', 'Nombre de la empresa'),
('setting_2', 'company_logo', '/images/logo.png', 'Ruta del logo de la empresa'),
('setting_3', 'default_tax_rate', '21', 'Tasa de IVA predeterminada (%)'),
('setting_4', 'default_currency', 'EUR', 'Moneda predeterminada');

import React, { useState } from 'react';
import AdminDoctorsContent from './adminDoctorsContent';
import AdminPharmaciesContent from './adminPharmaciesContent';
import AdminProductsContent from './adminProductsContent';
import AdminCBDShopsContent from './adminCBDShopsContent';
import AdminGrowEquipmentsContent from './adminGrowEquipmentsContent';
import AdminHeadShopsContent from './adminHeadShopsContent';
import AdminArticlesContent from './adminArticlesContent';
import AdminCarouselContent from './adminCarouselContent';
import AdminPartnerLogosContent from './adminPartnerLogosContent';
import AdminGalleryContent from './adminGalleryContent';
import AdminShopDescriptionsContent from './adminShopDescriptionsContent';
import AdminUsersContent from './adminUsersContent';
import AdminOriginsContent from './adminOriginsContent';
import AdminManufacturersContent from './adminManufacturersContent';
import AdminSaleProductsContent from './adminSaleProductsContent';

type Section =
\| 'products'
\| 'doctors'
\| 'pharmacies'
\| 'cbdshops'
\| 'headshops'
\| 'growequipments'
\| 'articles'
\| 'carousel'
\| 'partnerlogos'
\| 'gallery'
\| 'shopdescriptions'
\| 'users'
\| 'origins'
\| 'manufacturers'
\| 'saleproducts';

const AdminDashboard: React.FC = () => {
const stored = localStorage.getItem('user');
const user = stored ? JSON.parse(stored) : null;

if (!user || !user.isAdmin) {
return ( <div className="flex items-center justify-center min-h-screen bg-gray-50"> <div className="bg-white p-6 rounded shadow text-center"> <h2 className="text-2xl font-semibold mb-4">Zugriff verweigert</h2> <p className="mb-6">Sie haben keine Berechtigung, diese Seite anzuzeigen.</p>
\<button
onClick={() => (window\.location.href = '/')}
className="px-4 py-2 bg-blue-600 text-white rounded hover\:bg-blue-700"
\>
Zurück zur Startseite </button> </div> </div>
);
}

const \[selectedSection, setSelectedSection] = useState<Section>('doctors');

const renderContent = () => {
switch (selectedSection) {
case 'products':            return <AdminProductsContent />;
case 'doctors':             return <AdminDoctorsContent />;
case 'pharmacies':          return <AdminPharmaciesContent />;
case 'cbdshops':            return <AdminCBDShopsContent />;
case 'headshops':           return <AdminHeadShopsContent />;
case 'growequipments':      return <AdminGrowEquipmentsContent />;
case 'articles':            return <AdminArticlesContent />;
case 'carousel':            return <AdminCarouselContent />;
case 'partnerlogos':        return <AdminPartnerLogosContent />;
case 'gallery':             return <AdminGalleryContent />;
case 'shopdescriptions':    return <AdminShopDescriptionsContent />;
case 'users':               return <AdminUsersContent />;
case 'origins':             return <AdminOriginsContent />;
case 'manufacturers':       return <AdminManufacturersContent />;
case 'saleproducts':        return <AdminSaleProductsContent />;
default:                    return null;
}
};

const navItem = (key: Section, label: string) => (
\<li
key={key}
onClick={() => setSelectedSection(key)}
className={`cursor-pointer px-4 py-2 rounded ${
        selectedSection === key ? 'bg-blue-100 font-medium' : 'hover:bg-blue-50'
      }`}
\>
{label} </li>
);

return ( <div className="flex min-h-screen bg-gray-50"> <aside className="w-64 bg-white p-4 border-r shadow-sm"> <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2> <nav> <ul className="space-y-2">
{navItem('products', 'Cannabisblüten')}
{navItem('doctors', 'Ärzte')}
{navItem('pharmacies', 'Apotheken')}
{navItem('cbdshops', 'CBD Shops')}
{navItem('headshops', 'Head Shops')}
{navItem('growequipments', 'Grow Equipments')}
{navItem('articles', 'Articles')}
{navItem('carousel', 'Carousel')}
{navItem('partnerlogos', 'Partner Logos')}
{navItem('gallery', 'Gallery')}
{navItem('shopdescriptions', 'Shop Descriptions')}
{navItem('users', 'Users')}
{navItem('origins', 'Origins')}
{navItem('manufacturers', 'Manufacturers')}
{navItem('saleproducts', 'Sale Products')} </ul> </nav> </aside>

```
  <main className="flex-1 p-6 overflow-auto">
    {renderContent()}
  </main>
</div>
```

);
};

export default AdminDashboard;

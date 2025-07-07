
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const Breadcrumbs = () => {
  const breadcrumbItems = [
    {
      label: 'Página Inicial',
      href: '#'
    },
    {
      label: 'Jaquetas',
      href: '#'
    },
    {
      label: 'Jaqueta de Couro Masculina - Jones Carter + Brinde KIT FRIO',
      href: '#',
      current: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-4 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbPage className="text-gray-600">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={item.href}
                    className="text-bergstrom-primary hover:text-bergstrom-primary/80"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;

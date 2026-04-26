import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TabPanel({ tabs }) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              classNames(
                'px-4 py-2 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, idx) => (
          <Tab.Panel key={idx}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

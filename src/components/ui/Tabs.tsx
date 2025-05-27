import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

interface TabsProps {
  defaultTab?: number;
  children: ReactNode;
}

const TabsBase: React.FC<TabsProps> = ({ defaultTab = 0, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ children }) => {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
      {children}
    </div>
  );
};

interface TabProps {
  children: ReactNode;
  index?: number;
}

const TabBase: React.FC<TabProps> = ({ children, index }) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === index;
  
  return (
    <button
      className={`px-4 py-3 font-medium text-sm focus:outline-none whitespace-nowrap ${
        isActive
          ? 'text-teal-600 border-b-2 border-teal-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(index as number)}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  children: ReactNode;
  index?: number;
}

const TabPanelBase: React.FC<TabPanelProps> = ({ children, index }) => {
  const { activeTab } = useTabs();
  
  if (activeTab !== index) {
    return null;
  }
  
  return <div>{children}</div>;
};

// Auto-assign indices to tabs and panels
let tabIndex = 0;
let panelIndex = 0;

const TabsWithIndices = (props: TabsProps) => {
  // Reset indices when a new Tabs component is rendered
  tabIndex = 0;
  panelIndex = 0;
  return <TabsBase {...props} />;
};

const TabWithIndex = (props: TabProps) => {
  const indexedProps = { ...props, index: tabIndex };
  tabIndex++;
  return <TabBase {...indexedProps} />;
};

const TabPanelWithIndex = (props: TabPanelProps) => {
  const indexedProps = { ...props, index: panelIndex };
  panelIndex++;
  return <TabPanelBase {...indexedProps} />;
};

export { TabsWithIndices as Tabs, TabWithIndex as Tab, TabPanelWithIndex as TabPanel };
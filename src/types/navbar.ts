export interface NavItem {
   id: string;
   icon: React.ReactNode;
   path: string;
   badge?: number;
}

export interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}


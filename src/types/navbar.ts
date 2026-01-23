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

export interface NavItemsListProps {
  isMobile?: boolean;
}

export interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export interface BadgeProps {
  count?: number;
  isMobile?: boolean;
}

export interface NavIconProps {
  item: NavItem;
  isMobile?: boolean;
}
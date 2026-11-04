import { IoSearch } from "react-icons/io5";
import { FaCartShopping, FaCartPlus } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdErrorOutline } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegStar,
  FaApple,
  FaPaypal,
} from "react-icons/fa";
import {
  FiTrash2,
  FiGift,
  FiShoppingCart,
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRotateCcw,
  FiHeadphones,
  FiArrowRight,
  FiCheckCircle,
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiHome,
  FiSun,
  FiActivity,
  FiFeather,
  FiGrid,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAtSign,
  FiUser,
  FiClock,
  FiSettings,
  FiLogOut,
  FiStar,
  FiInfo,
  FiCreditCard,
  FiCheck,
  FiPackage,
  FiHelpCircle,
  FiUsers,
  FiEdit2,
  FiFilter,
  FiDownload,
  FiPlus,
  FiTrendingUp,
  FiCamera,
  FiSave,
  FiUploadCloud,
  FiAlertTriangle,
  FiMoreVertical,
  FiBell,
  FiUserPlus,
  FiUserX,
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";


// AppLayout icons
export const appLayoutIcons = {
  Search: IoSearch,
  Cart: FaCartShopping,
  Profile: CgProfile,
};

// ProductCard icons
export const productCardIcons = {
  Star: FaStar,
  CartPlus: FaCartPlus,
  errorOutline: MdErrorOutline,
};

// Products page icons
export const productsPageIcons = {
  prev: FaChevronLeft,
  next: FaChevronRight,
};

// ProductDetails page icons
export const productDetailsIcons = {
  heartOutline: FiHeart,
  heartFilled: FaHeart,
  shoppingBag: FiShoppingBag,
  warranty: FiCheckCircle,
  delivery: FiTruck,
  returns: FiRotateCcw,
  support: FiHeadphones,
  arrowRight: FiArrowRight,
  starEmpty: FaRegStar,
};

// Categories page icons
export const categoriesPageIcons = {
  all: FiGrid,
  tech: FiMonitor,
  mobile: FiSmartphone,
  watches: FiWatch,
  fashion: FiShoppingBag,
  beauty: FiFeather,
  home: FiHome,
  groceries: FiShoppingCart,
  sports: FiActivity,
  sunglasses: FiSun,
};

// Cart page icons
export const cartPageIcons = {
  trash: FiTrash2,
  gift: FiGift,
  cartMain: FiShoppingCart,
};

// Login & Register page icons
export const loginIcons = {
  mail: FiMail,
  lock: FiLock,
  openedEye: FiEye,
  closedEye: FiEyeOff,
  arrowRight: FiArrowRight,
  google: FcGoogle,
  apple: FaApple,
  atSign: FiAtSign,
};

// Profile page icons
export const profilePageIcons = {
  user: FiUser,
  history: FiClock,
  settings: FiSettings,
  signOut: FiLogOut,
  wallet: FiCreditCard,
  star: FiStar,
  info: FiInfo,
};

// Checkout page icons
export const checkoutPageIcons = {
  card: FiCreditCard,
  paypal: FaPaypal,
  check: FiCheck,
  package: FiPackage,
  help: FiHelpCircle,
};

// Dashboard page icons
export const dashboardIcons = {
  inventory: FiPackage,
  orders: FiShoppingBag,
  users: FiUsers,
};

// Inventory page icons
export const inventoryIcons = {
  edit: FiEdit2,
  delete: FiTrash2,
  filter: FiFilter,
  export: FiDownload,
  plus: FiPlus,
  trend: FiTrendingUp,
  camera: FiCamera,
  save: FiSave,
  upload: FiUploadCloud,
  warning: FiAlertTriangle,
};

// Orders page icons
export const ordersPageIcons = {
  more: FiMoreVertical,
  bell: FiBell,
};

// Users page icons
export const usersPageIcons = {
  userPlus: FiUserPlus,
  userInactive: FiUserX,
  shield: FiShield,
  arrowLeft: FiArrowLeft,
};

export function SetIcon({
  Icon,
  size = 28,
  color = "currentColor",
  className = "",
}) {
  return <Icon size={size} color={color} className={className} />;
}

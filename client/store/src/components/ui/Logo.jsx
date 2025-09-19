import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="btn btn-ghost text-xl font-bold">
      {import.meta.env.VITE_NOMBRE_ECOMMERCE}
    </Link>
  );
}
export default Logo;
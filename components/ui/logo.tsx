import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2 w-fit">
      <Image
        src={"/logo.png"}
        width={150}
        height={50}
        alt="Hudermaonline"
        className="w-32"
      />
    </Link>
  );
};
export default Logo;

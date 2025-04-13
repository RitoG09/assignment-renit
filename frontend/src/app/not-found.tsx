import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <img src="/404.jpg" width={500} height={500} alt="404" />
      <Link href="/">
        <Button className="cursor-pointer">Return Home</Button>
      </Link>
    </div>
  );
}

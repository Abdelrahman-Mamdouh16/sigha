import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-(--color-ink)">الصفحة غير موجودة</h1>
      <p className="mt-3 text-(--color-ink-muted)">الرابط الذي فتحته غير صحيح أو لم يعد متاحاً.</p>
      <Button asChild className="mt-6">
        <Link href="/">العودة للرئيسية</Link>
      </Button>
    </Container>
  );
}

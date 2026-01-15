import { redirect } from "next/navigation";

export default function PaymentLinksDefaultPage() {
    redirect("/admin/finance/payment-links/generator");
}

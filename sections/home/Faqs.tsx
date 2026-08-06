import FaqAccordion from "@/components/FaqAccordion";
import { fetchFaqs } from "@/lib/appwrite/queries";

export default async function Faqs() {
  let faqs: any[] = [];
  try {
    faqs = await fetchFaqs();
  } catch (error) {
    console.error("Error fetching faqs:", error);
  }
  return <FaqAccordion faqs={faqs} />;
}

import FaqAccordion from "@/components/FaqAccordion";
import { createClient } from "@/utils/supabase/client";

async function getFaqs() {
  const supabase = createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("position", { ascending: true });
  return data ?? [];
}

export default async function Faqs() {
  const faqs = await getFaqs();
  return <FaqAccordion faqs={faqs} />;
}

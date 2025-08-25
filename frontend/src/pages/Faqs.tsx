import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqsData = [
  {
    question: "How do I create an account?",
    answer:
      "Click on the Signup button on the top right corner and fill in your details to create an account.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Go to your profile, click on 'Orders', and you can see the status of your purchases.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept online payments through credit/debit cards and Cash on Delivery (COD) for select areas.",
  },
  {
    question: "Can I request a refund?",
    answer:
      "Yes, you can request a refund for eligible orders within 7 days of delivery through your order details page.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the Philippines.",
  },
  {
    question: "How do I cancel an order?",
    answer:
      "Orders can be canceled before they are processed or shipped. Go to your order details and click 'Cancel Order'.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3-7 business days depending on your location and the chosen shipping method.",
  },
  {
    question: "Can I edit my delivery address?",
    answer:
      "Yes, you can edit your delivery address in your profile before placing an order.",
  },
];

const Faqs = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-center text-3xl font-bold">
        Frequently Asked Questions
      </h1>

      <Accordion type="multiple" className="space-y-4">
        {faqsData.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;

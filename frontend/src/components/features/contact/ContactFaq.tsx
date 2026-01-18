export const ContactFaq = ({
    faqs,
    title
}: {
    faqs: Array<{ question: string; answer: string }>;
    title: string;
}) => (
    <div className="mt-12 bg-white p-6 rounded-2xl border border-primaryBorder">
        <h3 className="text-xl font-bold text-primaryText mb-4">{title}</h3>
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="border-b border-primaryBorder pb-4 last:border-b-0 last:pb-0">
                    <div className="font-medium text-primaryText mb-1">{faq.question}</div>
                    <div className="text-secondary text-sm">{faq.answer}</div>
                </div>
            ))}
        </div>
    </div>
);
import { Card } from "./ui/card";

export default function SectionLead({ children }: { children: React.ReactNode }) {
  return (
    <Card className="py-4 px-8">{children}</Card>
  );
}



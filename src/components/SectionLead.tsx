import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

export default function SectionLead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className="py-4 px-8">  
          {children}
    </Card>
  );
}



import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Homework } from "@/lib/types"
import { formatDate } from "@/lib/utils2"

interface HomeworkListProps {
  homeworks: Homework[]
}

export function HomeworkList({ homeworks }: HomeworkListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {homeworks.map((homework) => (
        <Link href={`/homework/${homework.id}`} key={homework.id}>
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Homework #{homework.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This homework contains {homework.fill_in_blanks.length} fill-in-blank exercises and{" "}
                {homework.vocab_matches.length} vocabulary matching exercises.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Due date: <span className="font-medium">{formatDate(homework.due_date)}</span>
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

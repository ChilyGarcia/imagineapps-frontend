import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to events page
  redirect("/dashboard/events")
}
